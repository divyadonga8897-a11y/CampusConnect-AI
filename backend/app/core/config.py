import sys
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import ValidationError
from typing import List, Union

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./college.db"
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "ssiet_jwt_secret_key_999_super_secured"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    CORS_ORIGINS: Union[str, List[str]] = ["*"]
    
    # Upload configuration
    UPLOAD_DIR: str = "public/uploads"
    MAX_UPLOAD_SIZE: int = 5242880  # 5MB
    
    # AI API Keys
    OPENAI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    PINECONE_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

try:
    settings = Settings()
except ValidationError as e:
    print(f"WARNING: Configuration validation failed. Error: {e}")
    print("Falling back to safe default settings.")
    class DefaultSettings:
        DATABASE_URL = "sqlite:///./college.db"
        ENVIRONMENT = "development"
        SECRET_KEY = "ssiet_jwt_secret_key_999_super_secured"
        ALGORITHM = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES = 1440
        CORS_ORIGINS = ["*"]
        UPLOAD_DIR = "public/uploads"
        MAX_UPLOAD_SIZE = 5242880
        OPENAI_API_KEY = ""
        GROQ_API_KEY = ""
        PINECONE_API_KEY = ""
    settings = DefaultSettings()

