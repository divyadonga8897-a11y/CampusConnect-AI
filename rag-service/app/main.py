from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api.document_routes import router as document_router
from app.api.chat_routes import router as chat_router

# Import all SQLAlchemy models to register them on Base
from app.models.document import DocumentMetadata
from app.models.chat_history import Conversation, ChatMessage, RAGMetric

# Create SQLAlchemy database tables automatically on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CampusConnect AI RAG Service API",
    description="Centralized document ingestion, processing, chunking, and Pinecone indexing engine.",
    version="1.0.0"
)

# CORS configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(document_router)
app.include_router(chat_router)

@app.get("/")
def read_root():
    return {
        "service": "CampusConnect AI RAG Service",
        "description": "Production-ready Retrieval-Augmented Generation ingestion microservice.",
        "status": "online",
        "version": "1.0.0"
    }
