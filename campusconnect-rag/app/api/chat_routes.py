from fastapi import APIRouter, HTTPException
from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.rag.rag_service import RagService

router = APIRouter(prefix="/api/v1/rag", tags=["AI Chat Advisor"])
rag_service = RagService()

@router.post("/query", response_model=ChatResponse)
def post_rag_query(payload: ChatRequest):
    try:
        res = rag_service.query(payload.question, payload.conversation_id)
        # Note: res already matches the shape of ChatResponse (having success, answer, sources, etc.)
        return ChatResponse(**res)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
