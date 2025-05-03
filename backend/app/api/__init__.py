"""
API routes package.
"""

from fastapi import APIRouter

from app.api.health import router as health_router
from app.api.gratuity import router as gratuity_router

# Create the main router
api_router = APIRouter()

# Include the sub-routers
api_router.include_router(health_router)
api_router.include_router(gratuity_router)

__all__ = ["api_router"] 