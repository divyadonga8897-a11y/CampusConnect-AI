import time
from pinecone import Pinecone, ServerlessSpec
from app.config import settings

class PineconeService:
    def __init__(self):
        self.api_key = settings.PINECONE_API_KEY
        self.index_name = settings.PINECONE_INDEX_NAME
        
        self.pc = None
        self.index = None
        self.local_mode = False

        if not self.api_key:
            print("[Warning] PINECONE_API_KEY is missing. Operating in in-memory Mock Pinecone mode.")
            self.local_mode = True
            self.mock_store = {} # {id: {"values": [...], "metadata": {...}}}
        else:
            try:
                self.pc = Pinecone(api_key=self.api_key)
            except Exception as e:
                print(f"[Error] Failed to initialize Pinecone: {str(e)}. Operating in in-memory Mock Pinecone mode.")
                self.local_mode = True
                self.mock_store = {}

    def ensure_index(self, dimension: int):
        if self.local_mode:
            print(f"[Mock Pinecone] Virtual Index '{self.index_name}' active (Dimension: {dimension}).")
            return

        try:
            # Check if index exists
            existing_indexes = [idx.name for idx in self.pc.list_indexes()]
            if self.index_name not in existing_indexes:
                print(f"Creating Pinecone index '{self.index_name}'...")
                self.pc.create_index(
                    name=self.index_name,
                    dimension=dimension,
                    metric="cosine",
                    spec=ServerlessSpec(cloud="aws", region="us-east-1")
                )
                # Wait for index to become ready
                while not self.pc.describe_index(self.index_name).status.ready:
                    time.sleep(1)
                print(f"Pinecone index '{self.index_name}' created successfully.")
            
            self.index = self.pc.Index(self.index_name)
            print(f"Successfully connected to Pinecone index '{self.index_name}'.")
        except Exception as e:
            print(f"[Error] Pinecone ensure_index failed: {str(e)}. Switching to virtual Local Mock Pinecone mode.")
            self.local_mode = True
            self.mock_store = {}

    def upsert_vectors(self, vectors: list[tuple[str, list[float], dict]]) -> dict:
        """
        vectors: list of tuple (id, values, metadata)
        """
        if self.local_mode:
            for vector_id, values, metadata in vectors:
                self.mock_store[vector_id] = {
                    "values": values,
                    "metadata": metadata
                }
            return {"upserted_count": len(vectors)}

        try:
            upsert_data = [(v_id, vals, meta) for v_id, vals, meta in vectors]
            # Batch upserts
            res = self.index.upsert(vectors=upsert_data)
            return {"upserted_count": res.upserted_count}
        except Exception as e:
            print(f"Pinecone upsert error: {str(e)}")
            raise e

    def query_vectors(self, vector: list[float], top_k: int = 5, category_filter: str = None) -> list[dict]:
        if self.local_mode:
            # Perform simple Cosine Similarity simulation locally over mock_store
            import math
            def dot_product(v1, v2):
                return sum(x * y for x, y in zip(v1, v2))
            def magnitude(v):
                return math.sqrt(sum(x * x for x in v))
            def cosine_similarity(v1, v2):
                m1, m2 = magnitude(v1), magnitude(v2)
                if not m1 or not m2: return 0.0
                return dot_product(v1, v2) / (m1 * m2)

            results = []
            for v_id, v_data in self.mock_store.items():
                meta = v_data["metadata"]
                if category_filter and meta.get("category") != category_filter:
                    continue
                sim = cosine_similarity(vector, v_data["values"])
                results.append({
                    "id": v_id,
                    "score": sim,
                    "metadata": meta
                })
            results.sort(key=lambda x: x["score"], reverse=True)
            return results[:top_k]

        try:
            filter_dict = {}
            if category_filter:
                filter_dict["category"] = category_filter
            
            res = self.index.query(
                vector=vector,
                top_k=top_k,
                include_metadata=True,
                filter=filter_dict if filter_dict else None
            )
            
            matches = []
            for match in res.matches:
                matches.append({
                    "id": match.id,
                    "score": match.score,
                    "metadata": match.metadata
                })
            return matches
        except Exception as e:
            print(f"Pinecone query error: {str(e)}")
            raise e

    def delete_document_vectors(self, document_name: str) -> dict:
        if self.local_mode:
            ids_to_del = [v_id for v_id, data in self.mock_store.items() if data["metadata"].get("source") == document_name]
            for v_id in ids_to_del:
                del self.mock_store[v_id]
            return {"deleted_count": len(ids_to_del)}

        try:
            # Delete by metadata filter
            self.index.delete(filter={"source": {"$eq": document_name}})
            return {"success": True}
        except Exception as e:
            print(f"Pinecone delete error: {str(e)}")
            raise e

    def get_index_stats(self) -> dict:
        if self.local_mode:
            categories = {}
            for v in self.mock_store.values():
                cat = v["metadata"].get("category", "unknown")
                categories[cat] = categories.get(cat, 0) + 1
            return {
                "index_name": self.index_name,
                "total_vector_count": len(self.mock_store),
                "namespaces": {},
                "categories": categories,
                "connection": "mocked_local"
            }

        try:
            stats = self.index.describe_index_stats()
            return {
                "index_name": self.index_name,
                "total_vector_count": stats.total_vector_count,
                "namespaces": {k: v.vector_count for k, v in stats.namespaces.items()},
                "connection": "pinecone_cloud"
            }
        except Exception as e:
            print(f"Pinecone stats error: {str(e)}")
            return {
                "index_name": self.index_name,
                "total_vector_count": 0,
                "namespaces": {},
                "connection": "offline_error",
                "error": str(e)
            }
