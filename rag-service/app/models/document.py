import uuid
from sqlalchemy import Column, String, Integer, DateTime, Text
from datetime import datetime
from app.core.database import Base

class DocumentMetadata(Base):
    __tablename__ = "document_metadata"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    document_name = Column(String(255), nullable=False, unique=True)
    title = Column(String(255), nullable=True)
    source = Column(String(255), nullable=True)
    category = Column(String(100), nullable=True, default="general")
    file_size = Column(Integer, nullable=True)
    mime_type = Column(String(100), nullable=True)
    chunk_count = Column(Integer, default=0)
    status = Column(String(50), default="PENDING") # PENDING, PROCESSING, INGESTED, FAILED
    error_log = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
