import os
import time
import hashlib
from sqlalchemy.orm import Session
from app.models.document import DocumentMetadata
from app.embeddings.embedding_service import EmbeddingService
from app.vectorstore.pinecone_service import PineconeService
from app.ingestion.document_loader import DocumentLoader
from app.ingestion.text_splitter import RecursiveCharacterTextSplitter

class IngestionService:
    def __init__(self):
        self.loader = DocumentLoader()
        self.splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        self.embeddings = EmbeddingService()
        self.pinecone = PineconeService()

    def _generate_deterministic_id(self, doc_name: str, chunk_idx: int) -> str:
        # Create deterministic unique SHA256 string for Pinecone mapping
        raw_key = f"{doc_name}_{chunk_idx}"
        return hashlib.sha256(raw_key.encode("utf-8")).hexdigest()

    def ingest_document(self, db_doc_id: str, db: Session) -> dict:
        """
        Runs ingestion on a specific file registered in database metadata log.
        """
        doc_record = db.query(DocumentMetadata).filter(DocumentMetadata.id == db_doc_id).first()
        if not doc_record:
            raise ValueError(f"Document record not found: {db_doc_id}")

        doc_record.status = "PROCESSING"
        db.commit()

        start_time = time.time()
        
        # Resolve file path inside uploads folder
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        file_path = os.path.join(base_dir, "uploads", doc_record.document_name)
        
        try:
            # 1. Clear previous vectors if they exist to prevent accretion
            self.pinecone.delete_document_vectors(doc_record.document_name)

            # 2. Extract text (Load)
            load_start = time.time()
            text = self.loader.load_document(file_path)
            load_time = time.time() - load_start
            
            # 3. Create Chunks (Split)
            chunks = self.splitter.split_text(text)
            chunk_count = len(chunks)
            if chunk_count == 0:
                raise ValueError("No readable text content extracted from document.")

            # 4. Generate Embeddings & Index (Load vectors to Pinecone)
            embed_start = time.time()
            batch_size = 32
            vectors_batch = []
            
            for i in range(0, chunk_count, batch_size):
                sub_chunks = chunks[i:i + batch_size]
                embeddings_list = self.embeddings.embed_batch(sub_chunks)
                
                for j, (chunk, emb) in enumerate(zip(sub_chunks, embeddings_list)):
                    chunk_idx = i + j
                    v_id = self._generate_deterministic_id(doc_record.document_name, chunk_idx)
                    
                    metadata = {
                        "source": doc_record.document_name,
                        "title": doc_record.title or doc_record.document_name,
                        "category": doc_record.category or "general",
                        "document_id": doc_record.id,
                        "chunk_id": v_id,
                        "chunk_index": chunk_idx,
                        "text": chunk
                    }
                    
                    vectors_batch.append((v_id, emb, metadata))
            
            embed_time = time.time() - embed_start

            # 5. Upsert to Pinecone
            index_start = time.time()
            self.pinecone.ensure_index(self.embeddings.get_dimension())
            res = self.pinecone.upsert_vectors(vectors_batch)
            upsert_count = res.get("upserted_count", len(vectors_batch))
            index_time = time.time() - index_start

            # Save statistics
            processing_time = time.time() - start_time
            doc_record.status = "INGESTED"
            doc_record.chunk_count = chunk_count
            doc_record.error_log = None
            db.commit()

            print(f"[Ingestion Log] Ingested '{doc_record.document_name}': "
                  f"chunks={chunk_count}, "
                  f"load_time={load_time:.2f}s, "
                  f"embedding_time={embed_time:.2f}s, "
                  f"indexing_time={index_time:.2f}s, "
                  f"total_time={processing_time:.2f}s")

            return {
                "success": True,
                "document_id": doc_record.id,
                "document_name": doc_record.document_name,
                "chunks_count": chunk_count,
                "upserted_vectors": upsert_count,
                "processing_time_seconds": processing_time,
                "message": "Ingestion process completed and indexed successfully."
            }

        except Exception as e:
            # Handle ingestion failures
            processing_time = time.time() - start_time
            doc_record.status = "FAILED"
            doc_record.error_log = str(e)
            db.commit()
            print(f"[Error Ingestion] Failed to ingest '{doc_record.document_name}': {str(e)}")
            raise e
