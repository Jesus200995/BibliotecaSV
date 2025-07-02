from typing import List
from pydantic import BaseSettings, PostgresDsn

class Settings(BaseSettings):
    PROJECT_NAME: str = "Biblioteca de Datos Web"
    API_V1_STR: str = "/api/v1"
    
    # PostgreSQL
    POSTGRES_SERVER: str = "31.97.8.51"
    POSTGRES_USER: str = "jesus"
    POSTGRES_PASSWORD: str = "2025"
    POSTGRES_DB: str = "app_registros"
    SQLALCHEMY_DATABASE_URI: PostgresDsn = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}/{POSTGRES_DB}"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:8080",  # Vue dev server
        "http://localhost",
        "https://biblioteca.sembrandodatos.com"
    ]
    
    class Config:
        case_sensitive = True

settings = Settings()
