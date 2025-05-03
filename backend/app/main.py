"""
Main FastAPI application.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.api import api_router
from app.config.settings import settings
from app.config.logging import setup_logging
from app.exceptions.handlers import register_exception_handlers
from app.middleware.request_middleware import add_middleware as add_request_middleware
from app.middleware.security_middleware import add_middleware as add_security_middleware

# Set up logging
setup_logging()

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_CREDENTIALS,
    allow_methods=settings.CORS_METHODS,
    allow_headers=settings.CORS_HEADERS,
)

# Add custom middlewares
add_security_middleware(app)
add_request_middleware(app)

# Register exception handlers
register_exception_handlers(app)

# Create logs directory if it doesn't exist
os.makedirs("logs", exist_ok=True)

# Root redirect to docs
@app.get("/", include_in_schema=False)
async def root_redirect_to_docs():
    """
    Root endpoint that redirects to the API documentation.
    """
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/docs")

# Include API router with prefix
app.include_router(api_router, prefix=settings.API_PREFIX)

# For direct execution
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 