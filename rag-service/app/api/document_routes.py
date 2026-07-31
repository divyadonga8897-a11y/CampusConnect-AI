import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Header
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.document import DocumentMetadata
from app.schemas.document import DocumentMetadataResponse, IngestionSummary, HealthResponse
from app.ingestion.ingestion_service import IngestionService
from app.core.config import settings
from typing import List

router = APIRouter(prefix="/api/v1/documents", tags=["RAG Document Management"])
ingest_service = IngestionService()

def verify_admin_key(x_admin_key: str = Header(None)):
    # Admin security validation
    expected_key = settings.PINECONE_API_KEY or "dev_admin_key"
    if settings.ENVIRONMENT == "production" or settings.PINECONE_API_KEY:
        if x_admin_key != expected_key:
            raise HTTPException(status_code=403, detail="Unauthorized admin token key")
    return x_admin_key

@router.post("/upload", response_model=DocumentMetadataResponse, status_code=201)
def upload_document(
    file: UploadFile = File(...),
    title: str = Form(None),
    source: str = Form(None),
    category: str = Form("general"),
    db: Session = Depends(get_db)
):
    # Validate extension
    filename = file.filename
    _, ext = os.path.splitext(filename.lower())
    supported_exts = [".txt", ".pdf", ".docx", ".csv", ".xlsx", ".xls", ".md", ".markdown"]
    if ext not in supported_exts:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file format: {ext}. Supported types: PDF, DOCX, TXT, MD, CSV, Excel."
        )

    # Prevent duplicating document record
    existing = db.query(DocumentMetadata).filter(DocumentMetadata.document_name == filename).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Document with name '{filename}' already exists. Use DELETE first to replace it."
        )

    # Save raw uploaded file to uploads directory
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # Register PENDING row in database
    file_size = os.path.getsize(file_path)
    mime_type = file.content_type
    
    doc_record = DocumentMetadata(
        document_name=filename,
        title=title or filename,
        source=source or "Upload API",
        category=category or "general",
        file_size=file_size,
        mime_type=mime_type,
        status="PENDING"
    )
    
    db.add(doc_record)
    db.commit()
    db.refresh(doc_record)
    return doc_record

@router.post("/ingest/{document_id}", response_model=IngestionSummary)
def ingest_document(
    document_id: str,
    db: Session = Depends(get_db),
    _ = Depends(verify_admin_key)
):
    try:
        summary = ingest_service.ingest_document(document_id, db)
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")

@router.post("/reindex", response_model=dict)
def reindex_all_documents(
    db: Session = Depends(get_db),
    _ = Depends(verify_admin_key)
):
    """
    Clears vector store and re-ingests all documents registered in database.
    """
    try:
        # 1. Clear Pinecone Index
        ingest_service.pinecone.clear_index()

        # 2. Re-ingest all uploaded documents
        docs = db.query(DocumentMetadata).all()
        results = []
        for doc in docs:
            try:
                summary = ingest_service.ingest_document(doc.id, db)
                results.append(summary)
            except Exception as ex:
                results.append({"document_id": doc.id, "success": False, "error": str(ex)})
        
        return {
            "success": True,
            "message": "Reindexing completed.",
            "processed_documents": len(results),
            "details": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reindexing pipeline failed: {str(e)}")

@router.get("/", response_model=List[DocumentMetadataResponse])
def list_documents(db: Session = Depends(get_db)):
    return db.query(DocumentMetadata).all()

@router.delete("/{document_id}", response_model=dict)
def delete_document(
    document_id: str,
    db: Session = Depends(get_db),
    _ = Depends(verify_admin_key)
):
    doc_record = db.query(DocumentMetadata).filter(DocumentMetadata.id == document_id).first()
    if not doc_record:
        raise HTTPException(status_code=404, detail="Document record not found")

    try:
        # 1. Remove vectors from Pinecone
        ingest_service.pinecone.delete_document_vectors(doc_record.document_name)

        # 2. Delete raw file from disk
        file_path = os.path.join(settings.UPLOAD_DIR, doc_record.document_name)
        if os.path.exists(file_path):
            os.remove(file_path)

        # 3. Delete DB record
        db.delete(doc_record)
        db.commit()

        return {
            "success": True,
            "message": f"Document '{doc_record.document_name}' deleted successfully."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deletion failed: {str(e)}")

@router.get("/health", response_model=HealthResponse)
def check_health(db: Session = Depends(get_db)):
    # 1. Pinecone status
    try:
        stats = ingest_service.pinecone.get_index_stats()
        pinecone_status = "connected" if stats.get("status") != "OFFLINE" else "disconnected"
    except Exception:
        pinecone_status = "disconnected"

    # 2. Database status
    try:
        db.execute("SELECT 1")
        db_status = "connected"
    except Exception:
        db_status = "disconnected"

    # 3. LLM status
    groq_status = "configured" if settings.GROQ_API_KEY else "unconfigured"

    success = pinecone_status == "connected" and db_status == "connected"

    return {
        "success": success,
        "service": "rag-service",
        "pinecone": pinecone_status,
        "database": db_status,
        "groq": groq_status
    }
