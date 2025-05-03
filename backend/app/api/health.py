"""
API routes for health checking.
"""

from fastapi import APIRouter, Depends
from typing import Dict

from app.schemas.base import ResponseBase

# Create router with prefix and tags
router = APIRouter(
    prefix="/health",
    tags=["health"],
)


@router.get(
    "",
    response_model=ResponseBase,
    summary="Health check endpoint",
    description="Check if the API is up and running.",
)
async def health_check() -> ResponseBase:
    """
    Health check endpoint.
    
    Returns a success message if the API is up and running.
    """
    return ResponseBase(
        success=True,
        message="API is healthy",
    )


@router.get(
    "/version",
    response_model=Dict,
    summary="Version information",
    description="Get API version information.",
)
async def version() -> Dict:
    """
    Get API version information.
    
    Returns the current API version and environment information.
    """
    return {
        "name": "Gratuity Pro API",
        "version": "1.0.0",
        "description": "API for calculating gratuity using the Payment of Gratuity Act, 1972",
    } 