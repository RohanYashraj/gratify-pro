"""
Logging configuration for the application.
"""

import logging
import sys
from typing import Any, Dict, List, Optional
import uuid
from loguru import logger
from pydantic import BaseModel

from app.config.settings import settings

# Define logger models
class LogConfig(BaseModel):
    """
    Logging configuration model.
    """
    # Loguru logger config
    LOG_LEVEL: str = settings.LOG_LEVEL
    LOGGERS: Dict[str, Dict[str, Any]] = {
        "uvicorn": {"level": "INFO"},
        "uvicorn.error": {"level": "INFO"},
        "uvicorn.access": {"level": "INFO"},
        "fastapi": {"level": "INFO"},
        "app": {"level": settings.LOG_LEVEL},
    }


# Configure loggers
def setup_logging() -> None:
    """
    Configure logging for the application.
    """
    # Clear existing handlers
    logger.remove()
    
    # Add handler for stderr with formatting
    logger.add(
        sys.stderr,
        format="<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        level=settings.LOG_LEVEL,
        colorize=True,
    )
    
    # Add handler for file with rotation
    logger.add(
        "logs/gratuity_pro.log",
        rotation="10 MB",
        retention="7 days",
        compression="zip",
        format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} - {message}",
        level=settings.LOG_LEVEL,
    )
    
    # Make logging use the same logger as Loguru
    class InterceptHandler(logging.Handler):
        def emit(self, record):
            # Get corresponding Loguru level if it exists
            try:
                level = logger.level(record.levelname).name
            except ValueError:
                level = record.levelno

            # Find caller from where the record originated
            frame, depth = logging.currentframe(), 2
            while frame.f_code.co_filename == logging.__file__:
                frame = frame.f_back
                depth += 1

            logger.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())

    # Configure standard library loggers to use our handler
    log_config = LogConfig()
    
    logging.basicConfig(handlers=[InterceptHandler()], level=0)
    
    # Update settings for uvicorn and other loggers
    for logger_name, logger_conf in log_config.LOGGERS.items():
        logging_logger = logging.getLogger(logger_name)
        logging_logger.handlers = [InterceptHandler()]
        logging_logger.setLevel(logger_conf["level"])
        logging_logger.propagate = False


# Create a correlation ID middleware for request tracking
def get_request_id() -> str:
    """
    Generate a unique request ID for tracking requests through logs.
    """
    return str(uuid.uuid4()) 