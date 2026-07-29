import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    
    PINECONE_API_KEY: str = os.getenv("PINECONE_API_KEY", "")
    PINECONE_INDEX_NAME: str = os.getenv("PINECONE_INDEX_NAME", "campusconnect-knowledge")
    
    EMBEDDING_PROVIDER: str = os.getenv("EMBEDDING_PROVIDER", "local")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    RAG_API_PORT: int = int(os.getenv("RAG_API_PORT", 8003))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
