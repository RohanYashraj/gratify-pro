"""
Application settings and configuration management.
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

class Settings(BaseSettings):
    """
    Application settings class using Pydantic BaseSettings.
    
    All settings can be overridden by environment variables.
    """
    # Basic app configs
    APP_NAME: str = "Gratuity Pro API"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "API for calculating gratuity using the Payment of Gratuity Act, 1972"
    
    # CORS configuration
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    CORS_METHODS: List[str] = ["*"]
    CORS_HEADERS: List[str] = ["*"]
    CORS_CREDENTIALS: bool = True
    
    # API configurations
    API_PREFIX: str = "/api/v1"
    
    # Security settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "placeholder_secret_key_for_development")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Max upload file size (in MB)
    MAX_UPLOAD_FILE_SIZE: int = 10
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create a global settings object to be imported throughout the app
settings = Settings() 