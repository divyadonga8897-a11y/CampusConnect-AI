from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.schemas.chat import ChatRequest, ChatResponse, ConversationResponse, StatsResponse
from app.services.chat_service import ChatService
from app.models.chat_history import Conversation, ChatMessage, RAGMetric
from app.models.document import DocumentMetadata

router = APIRouter(prefix="/api/v1/chat", tags=["RAG Chat Assistant"])
chat_service = ChatService()

@router.post("/", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question field cannot be empty.")

    if request.stream:
        # Yield progressive event stream chunk stream
        generator = chat_service.process_chat(
            question=request.question,
            conversation_id=request.conversation_id,
            db=db,
            stream=True
        )
        return StreamingResponse(generator, media_type="text/event-stream")
    else:
        response = chat_service.process_chat(
            question=request.question,
            conversation_id=request.conversation_id,
            db=db,
            stream=False
        )
        return response

@router.get("/history/{conversation_id}", response_model=ConversationResponse)
def get_conversation_history(
    conversation_id: str,
    db: Session = Depends(get_db)
):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation ID not found.")
    return conv

@router.delete("/history/{conversation_id}", response_model=dict)
def delete_conversation_history(
    conversation_id: str,
    db: Session = Depends(get_db)
):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation ID not found.")
    
    db.delete(conv)
    db.commit()
    return {
        "success": True,
        "message": f"Conversation history for '{conversation_id}' wiped successfully."
    }

@router.get("/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    total_queries = db.query(RAGMetric).count()
    
    avg_resp = db.query(func.avg(RAGMetric.total_response_time)).scalar() or 0.0
    avg_retr = db.query(func.avg(RAGMetric.retrieval_time)).scalar() or 0.0
    
    total_docs = db.query(DocumentMetadata).count()
    total_chunks = db.query(func.sum(DocumentMetadata.chunk_count)).scalar() or 0
    total_tokens = db.query(func.sum(RAGMetric.tokens_used)).scalar() or 0
    
    return StatsResponse(
        total_queries=total_queries,
        avg_response_time=round(avg_resp, 3),
        avg_retrieval_time=round(avg_retr, 3),
        total_documents=total_docs,
        total_chunks=int(total_chunks),
        total_tokens=int(total_tokens)
    )
