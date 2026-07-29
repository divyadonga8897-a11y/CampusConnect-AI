from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ChatRequest(BaseModel):
    question: str
    conversation_id: Optional[str] = None

class SourceItem(BaseModel):
    document: str
    category: str

class ErrorDetail(BaseModel):
    code: str
    message: str

class ChatResponse(BaseModel):
    success: bool
    answer: Optional[str] = None
    sources: Optional[List[SourceItem]] = None
    error: Optional[ErrorDetail] = None
    metadata: Optional[Dict[str, Any]] = None
