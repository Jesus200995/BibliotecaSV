import os
from typing import List, Optional

class Settings:
    # Database
    database_host: str = "31.97.8.51"
    database_port: int = 5432
    database_user: str = "jesus"
    database_password: str = "2025"
    database_name: str = "app_registros"
    
    # Server
    host: str = "127.0.0.1"
    port: int = 8000
    debug: bool = True
    
    # CORS
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000", 
        "http://localhost:8080",
        "http://127.0.0.1:8080"
    ]
    
    @property
    def database_url(self) -> str:
        return f"postgresql://{self.database_user}:{self.database_password}@{self.database_host}:{self.database_port}/{self.database_name}"

settings = Settings()
