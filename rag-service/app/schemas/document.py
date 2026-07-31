from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocumentMetadataBase(BaseModel):
    document_name: str
    title: Optional[str] = None
    source: Optional[str] = None
    category: Optional[str] = "general"
    file_size: Optional[int] = None
    mime_type: Optional[str] = None

class DocumentMetadataCreate(DocumentMetadataBase):
    pass

class DocumentMetadataResponse(DocumentMetadataBase):
    id: str
    chunk_count: int
    status: str
    error_log: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class IngestionSummary(BaseModel):
    success: bool
    document_id: str
    document_name: str
    chunks_count: int
    upserted_vectors: int
    processing_time_seconds: float
    message: str

class HealthResponse(BaseModel):
    success: bool
    service: str
    pinecone: str
    database: str
    groq: str
