from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import routes, chat_routes, ingestion_routes
from app.vector_store.pinecone_service import PineconeService
from app.embeddings.embedding_service import EmbeddingService

app = FastAPI(
    title="CampusConnect AI RAG API",
    description="Centralized AI RAG Knowledge Engine for Sri Satya Institute of Engineering and Technology",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(routes.router)
app.include_router(chat_routes.router)
app.include_router(ingestion_routes.router)

@app.on_event("startup")
def on_startup():
    print("=== STARTING CAMPUSCONNECT RAG ENGINE ===")
    
    # 1. Connect to Pinecone Index
    try:
        embedding_service = EmbeddingService()
        pinecone_service = PineconeService()
        
        # Verify index exists and dimensions match
        dimension = embedding_service.get_dimension()
        pinecone_service.ensure_index(dimension)
    except Exception as e:
        print(f"[Warning] Index check during startup failed: {str(e)}.")
    
    print("=== CAMPUSCONNECT RAG ENGINE RUNNING ===")

@app.get("/")
def read_root():
    return {
        "app": "CampusConnect AI RAG API",
        "description": "Centralized Knowledge retrieval engine for Sri Satya Institute of Engineering and Technology admissions info.",
        "version": "1.0.0"
    }
