"""
Exception handlers for the application.
"""

from typing import Any, Dict, Union
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from loguru import logger
from app.exceptions.exceptions import BaseAPIException


def create_error_response(
    status_code: int,
    message: str,
    code: str = None,
    errors: Any = None,
) -> Dict[str, Any]:
    """
    Create a standardized error response.
    
    Args:
        status_code: HTTP status code
        message: Error message
        code: Error code for the client
        errors: Additional error details
        
    Returns:
        Dict with structured error information
    """
    response = {
        "error": {
            "status_code": status_code,
            "message": message,
        }
    }
    
    if code:
        response["error"]["code"] = code
        
    if errors:
        response["error"]["details"] = errors
        
    return response


async def base_api_exception_handler(request: Request, exc: BaseAPIException) -> JSONResponse:
    """
    Handle custom BaseAPIException errors.
    
    Args:
        request: FastAPI request
        exc: Exception instance
        
    Returns:
        JSONResponse with error details
    """
    logger.error(f"API exception: {exc.detail} ({exc.status_code})")
    
    return JSONResponse(
        status_code=exc.status_code,
        content=create_error_response(
            status_code=exc.status_code,
            message=exc.detail,
            code=exc.code,
        ),
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """
    Handle StarletteHTTPException errors.
    
    Args:
        request: FastAPI request
        exc: Exception instance
        
    Returns:
        JSONResponse with error details
    """
    logger.error(f"HTTP exception: {exc.detail} ({exc.status_code})")
    
    return JSONResponse(
        status_code=exc.status_code,
        content=create_error_response(
            status_code=exc.status_code,
            message=exc.detail,
        ),
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """
    Handle validation errors from pydantic models.
    
    Args:
        request: FastAPI request
        exc: Exception instance
        
    Returns:
        JSONResponse with validation error details
    """
    errors = exc.errors()
    error_messages = []
    
    for error in errors:
        error_messages.append({
            "loc": error["loc"],
            "msg": error["msg"],
            "type": error["type"],
        })
    
    logger.error(f"Validation error: {error_messages}")
    
    return JSONResponse(
        status_code=422,
        content=create_error_response(
            status_code=422,
            message="Validation error",
            code="VALIDATION_ERROR",
            errors=error_messages,
        ),
    )


def register_exception_handlers(app: FastAPI) -> None:
    """
    Register all exception handlers with the FastAPI app.
    
    Args:
        app: FastAPI application instance
    """
    app.add_exception_handler(BaseAPIException, base_api_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler) 