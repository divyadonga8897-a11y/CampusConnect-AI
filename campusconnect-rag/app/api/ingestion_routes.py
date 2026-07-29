from fastapi import APIRouter, Header, HTTPException
from app.schemas.ingestion_schema import IngestionResponse
from app.ingestion.ingestion_service import IngestionService
from app.config import settings

router = APIRouter(prefix="/api/v1/rag", tags=["Ingestion Pipeline"])
ingest_service = IngestionService()

@router.post("/ingest", response_model=IngestionResponse)
def trigger_ingest(x_admin_key: str = Header(None)):
    # Basic Security Check
    expected_key = settings.PINECONE_API_KEY or "dev_admin_key"
    if settings.ENVIRONMENT == "production" or settings.PINECONE_API_KEY:
        if x_admin_key != expected_key:
            raise HTTPException(status_code=403, detail="Unauthorized admin token key")

    try:
        summary = ingest_service.ingest_directory()
        return IngestionResponse(
            success=True,
            discovered=summary["discovered"],
            processed=summary["processed"],
            chunks=summary["chunks"],
            upserted=summary["upserted"],
            status=summary["status"],
            message="Directory ingestion completed successfully."
        )
    except Exception as e:
        return IngestionResponse(
            success=False,
            discovered=0,
            processed=0,
            chunks=0,
            upserted=0,
            status="FAILED",
            message=str(e)
        )
