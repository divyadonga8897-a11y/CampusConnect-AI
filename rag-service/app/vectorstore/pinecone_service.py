import time
from pinecone import Pinecone, ServerlessSpec
from app.core.config import settings

class PineconeService:
    def __init__(self):
        self.api_key = settings.PINECONE_API_KEY
        self.index_name = settings.PINECONE_INDEX_NAME
        self.pc = None
        self.index = None
        self.local_mode = True

        if self.api_key:
            try:
                self.pc = Pinecone(api_key=self.api_key)
                self.local_mode = False
            except Exception as e:
                print(f"[Warning] Failed to initialize Pinecone Client: {str(e)}. Operating in mock mode.")

    def ensure_index(self, dimension: int = 1024):
        if self.local_mode or not self.pc:
            return
        
        try:
            # Retrieve list of indexes
            active_indexes = [idx.name for idx in self.pc.list_indexes()]
            if self.index_name not in active_indexes:
                print(f"Creating Pinecone index: '{self.index_name}'...")
                self.pc.create_index(
                    name=self.index_name,
                    dimension=dimension,
                    metric="cosine",
                    spec=ServerlessSpec(
                        cloud="aws",
                        region="us-east-1"
                    )
                )
                # Wait for index ready
                while not self.pc.describe_index(self.index_name).status['ready']:
                    time.sleep(1)
            
            self.index = self.pc.Index(self.index_name)
        except Exception as e:
            print(f"[Warning] Pinecone index retrieval failed: {str(e)}.")

    def upsert_vectors(self, vectors: list) -> dict:
        """
        vectors: list of tuple (id, embedding, metadata)
        """
        if self.local_mode or not self.pc:
            print(f"[Mock] Upserted {len(vectors)} vectors locally.")
            return {"upserted_count": len(vectors)}
        
        try:
            if not self.index:
                self.ensure_index()
            
            # Upsert vectors
            res = self.index.upsert(vectors=vectors)
            return {"upserted_count": res.get("upserted_count", len(vectors))}
        except Exception as e:
            print(f"[Error] Pinecone upsert failed: {str(e)}.")
            raise e

    def delete_document_vectors(self, document_name: str) -> bool:
        if self.local_mode or not self.pc:
            print(f"[Mock] Deleted vectors for document '{document_name}'.")
            return True
        
        try:
            if not self.index:
                self.ensure_index()
            
            # Delete by metadata filter
            self.index.delete(filter={"source": {"$eq": document_name}})
            return True
        except Exception as e:
            print(f"[Warning] Pinecone delete vectors failed: {str(e)}.")
            return False

    def clear_index(self) -> bool:
        if self.local_mode or not self.pc:
            print("[Mock] Cleared all vectors in index.")
            return True
        
        try:
            if not self.index:
                self.ensure_index()
            
            self.index.delete(delete_all=True)
            return True
        except Exception as e:
            print(f"[Warning] Pinecone clear index failed: {str(e)}.")
            return False

    def get_index_stats(self) -> dict:
        if self.local_mode or not self.pc:
            return {"total_vector_count": 0, "status": "MOCK_ACTIVE"}
        
        try:
            if not self.index:
                self.ensure_index()
            return self.index.describe_index_stats().to_dict()
        except Exception as e:
            print(f"[Warning] Pinecone stats check failed: {str(e)}.")
            return {"total_vector_count": 0, "status": "OFFLINE"}

    def search_vectors(self, query_vector: list, top_k: int = 5) -> dict:
        if self.local_mode or not self.pc:
            # Mock return value
            print("[Mock] Vector search triggered.")
            return {"matches": []}
        
        try:
            if not self.index:
                self.ensure_index()
            
            res = self.index.query(
                vector=query_vector,
                top_k=top_k,
                include_metadata=True
            )
            return res.to_dict()
        except Exception as e:
            print(f"[Error] Pinecone query failed: {str(e)}.")
            raise e
