from pydantic import BaseModel
from typing import Optional

class IngestionResponse(BaseModel):
    success: bool
    discovered: int
    processed: int
    chunks: int
    upserted: int
    status: str
    message: Optional[str] = None
