import os
import shutil
from app.core.database import SessionLocal, engine, Base
from app.models.document import DocumentMetadata
from app.models.chat_history import Conversation, ChatMessage, RAGMetric
from app.ingestion.ingestion_service import IngestionService

# Ensure database tables exist
Base.metadata.create_all(bind=engine)

def seed_and_ingest():
    db = SessionLocal()
    ingest_service = IngestionService()
    
    # Resolve source knowledge base path and destination uploads folder
    current_dir = os.path.dirname(os.path.abspath(__file__))
    src_kb = os.path.abspath(os.path.join(current_dir, "..", "campusconnect-rag", "knowledge_base"))
    dest_uploads = os.path.join(current_dir, "uploads")
    
    if not os.path.exists(src_kb):
        print(f"[Error] Source knowledge base directory not found at: {src_kb}")
        db.close()
        return
        
    os.makedirs(dest_uploads, exist_ok=True)
    
    categories = ["college", "admission", "courses", "fees", "hostel", "scholarships", "placements"]
    print("=== STARTING KNOWLEDGE BASE SEED & INGESTION ===")
    
    for cat in categories:
        cat_dir = os.path.join(src_kb, cat)
        if not os.path.exists(cat_dir):
            continue
            
        for file_name in os.listdir(cat_dir):
            src_file = os.path.join(cat_dir, file_name)
            if not os.path.isfile(src_file):
                continue
                
            _, ext = os.path.splitext(file_name.lower())
            supported_exts = [".txt", ".pdf", ".docx", ".csv", ".xlsx", ".xls", ".md", ".markdown"]
            if ext not in supported_exts:
                continue
                
            dest_file = os.path.join(dest_uploads, file_name)
            
            # Copy file to uploads folder
            shutil.copy2(src_file, dest_file)
            print(f"Copied: {file_name} (Category: {cat.upper()}) to uploads/")
            
            # Register document in database metadata table
            existing = db.query(DocumentMetadata).filter(DocumentMetadata.document_name == file_name).first()
            if not existing:
                doc_record = DocumentMetadata(
                    document_name=file_name,
                    title=file_name.replace("_", " ").split(".")[0].title(),
                    source=f"Seed: {cat}",
                    category=cat,
                    file_size=os.path.getsize(dest_file),
                    mime_type="text/plain" if ext == ".txt" else f"application/{ext[1:]}",
                    status="PENDING"
                )
                db.add(doc_record)
                db.commit()
                db.refresh(doc_record)
            else:
                doc_record = existing
                doc_record.status = "PENDING"
                db.commit()
                
            # Trigger embedding and indexing ingestion pipeline
            try:
                print(f"  Ingesting: {file_name}...")
                result = ingest_service.ingest_document(doc_record.id, db)
                if result.get("success"):
                    print(f"  ✓ Indexed in Pinecone: {file_name} (Chunks: {result.get('chunks_count')})")
            except Exception as e:
                print(f"  ✗ Ingestion failed for {file_name}: {str(e)}")
                
    db.close()
    print("=== SEED & INGESTION COMPLETED ===")

if __name__ == "__main__":
    seed_and_ingest()
