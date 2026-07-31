import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Explicitly load .env file from the current module directory
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
dotenv_path = os.path.join(base_dir, ".env")
load_dotenv(dotenv_path)

class Settings(BaseSettings):
    PINECONE_API_KEY: str = os.getenv("PINECONE_API_KEY", "")
    PINECONE_INDEX_NAME: str = os.getenv("PINECONE_INDEX_NAME", "campusconnect-knowledge")
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./rag_metadata.db")
    
    RAG_API_PORT: int = int(os.getenv("RAG_API_PORT", 8003))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    
    # Ingestion Folders
    UPLOAD_DIR: str = os.path.join(base_dir, "uploads")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
