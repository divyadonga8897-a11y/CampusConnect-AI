import os
import hashlib
from app.config import settings
from app.embeddings.embedding_service import EmbeddingService
from app.vector_store.pinecone_service import PineconeService
from app.ingestion.document_loader import DocumentLoader
from app.ingestion.text_splitter import RecursiveCharacterTextSplitter

class IngestionService:
    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.pinecone_service = PineconeService()
        self.loader = DocumentLoader()
        self.splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

    def _generate_deterministic_id(self, doc_name: str, chunk_idx: int) -> str:
        # Create unique deterministic SHA256 string for duplicate prevention
        raw_key = f"{doc_name}_{chunk_idx}"
        return hashlib.sha256(raw_key.encode("utf-8")).hexdigest()

    def ingest_directory(self, kb_path: str = "knowledge_base") -> dict:
        """
        Scans all files inside the knowledge_base directory and upserts vectors.
        """
        if not os.path.exists(kb_path):
            os.makedirs(kb_path)
            # Create subdirectories for validation
            for sub in ["college", "admission", "courses", "fees", "hostel", "scholarships", "placements"]:
                os.makedirs(os.path.join(kb_path, sub), exist_ok=True)
            print(f"Created empty knowledge base structure at '{kb_path}'")
            return {"discovered": 0, "processed": 0, "chunks": 0, "upserted": 0, "status": "EMPTY"}

        # Connect to index
        self.pinecone_service.ensure_index(self.embedding_service.get_dimension())

        categories = ["college", "admission", "courses", "fees", "hostel", "scholarships", "placements"]
        total_discovered = 0
        total_processed = 0
        total_chunks = 0
        total_upserted = 0

        for cat in categories:
            cat_dir = os.path.join(kb_path, cat)
            if not os.path.exists(cat_dir):
                os.makedirs(cat_dir, exist_ok=True)
                continue

            for file_name in os.listdir(cat_dir):
                file_path = os.path.join(cat_dir, file_name)
                if not os.path.isfile(file_path):
                    continue

                _, ext = os.path.splitext(file_name.lower())
                if ext not in [".txt", ".pdf", ".docx"]:
                    continue

                total_discovered += 1
                try:
                    print(f"Ingesting: [{cat.upper()}] {file_name}...")
                    
                    # 1. Clean previous vectors of the same document to prevent duplicate accretion
                    self.pinecone_service.delete_document_vectors(file_name)

                    # 2. Extract text
                    text = self.loader.load_document(file_path)
                    if not text.strip():
                        print(f"  Empty text extracted from {file_name}. Skipping.")
                        continue

                    # 3. Create chunks
                    chunks = self.splitter.split_text(text)
                    if not chunks:
                        continue

                    # 4. Generate embeddings and upload to Pinecone
                    vectors_batch = []
                    for idx, chunk in enumerate(chunks):
                        v_id = self._generate_deterministic_id(file_name, idx)
                        embedding = self.embedding_service.embed_text(chunk)
                        
                        metadata = {
                            "source": file_name,
                            "category": cat,
                            "college": "Sri Satya Institute of Engineering and Technology",
                            "document_type": "official_information",
                            "chunk_index": idx,
                            "text": chunk # Original content is saved here
                        }
                        
                        vectors_batch.append((v_id, embedding, metadata))
                        total_chunks += 1

                    if vectors_batch:
                        # Pinecone upsert batch
                        res = self.pinecone_service.upsert_vectors(vectors_batch)
                        total_upserted += res.get("upserted_count", 0)

                    total_processed += 1
                except Exception as e:
                    print(f"[Error] Failed to ingest {file_name}: {str(e)}")

        return {
            "discovered": total_discovered,
            "processed": total_processed,
            "chunks": total_chunks,
            "upserted": total_upserted,
            "pinecone_index": self.pinecone_service.index_name,
            "status": "SUCCESS"
        }

if __name__ == "__main__":
    # Allow running python -m app.ingestion.ingestion_service directly
    service = IngestionService()
    summary = service.ingest_directory()
    print("\n=== INGESTION SUMMARY ===")
    print(f"Documents discovered: {summary['discovered']}")
    print(f"Documents processed: {summary['processed']}")
    print(f"Chunks created: {summary['chunks']}")
    print(f"Vectors upserted: {summary['upserted']}")
    print(f"Pinecone index: {summary.get('pinecone_index', settings.PINECONE_INDEX_NAME)}")
    print(f"Status: {summary['status']}")
    print("=========================")
