from fastapi import APIRouter
from app.vector_store.pinecone_service import PineconeService
from app.config import settings

router = APIRouter(prefix="/api/v1/rag", tags=["System Metrics"])
pinecone_service = PineconeService()

@router.get("/health")
def get_health():
    # Evaluate Pinecone and LLM connectivity status
    pinecone_status = "connected" if (settings.PINECONE_API_KEY or pinecone_service.local_mode) else "disconnected"
    llm_status = "configured" if settings.GROQ_API_KEY else "local_fallback"
    
    return {
        "success": True,
        "service": "campusconnect-rag",
        "pinecone": pinecone_status,
        "llm": llm_status
    }

@router.get("/stats")
def get_stats():
    # Fetch indexes stats
    stats = pinecone_service.get_index_stats()
    return stats
