from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class ChatRequest(BaseModel):
    question: str
    conversation_id: Optional[str] = None
    stream: Optional[bool] = False

class SourceCitation(BaseModel):
    document_name: str
    page_number: Optional[int] = None
    similarity_score: float

class ChatResponse(BaseModel):
    answer: str
    conversation_id: str
    sources: List[SourceCitation]
    confidence: float

class ChatMessageResponse(BaseModel):
    id: str
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationResponse(BaseModel):
    id: str
    title: Optional[str] = None
    created_at: datetime
    messages: List[ChatMessageResponse] = []

    class Config:
        from_attributes = True

class StatsResponse(BaseModel):
    total_queries: int
    avg_response_time: float
    avg_retrieval_time: float
    total_documents: int
    total_chunks: int
    total_tokens: int
