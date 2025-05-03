"""
Request middleware for tracking and logging requests.
"""

import time
from typing import Callable, Dict
import uuid
from fastapi import FastAPI, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from loguru import logger


class RequestMiddleware(BaseHTTPMiddleware):
    """
    Middleware for adding request ID and logging requests/responses.
    """
    
    def __init__(self, app: ASGIApp):
        super().__init__(app)
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process the request, add request ID, and log timing information.
        
        Args:
            request: The incoming request
            call_next: The next middleware or route handler
            
        Returns:
            Response from the next handler
        """
        # Generate request ID
        request_id = str(uuid.uuid4())
        
        # Add request ID to request state
        request.state.request_id = request_id
        
        # Start timer
        start_time = time.time()
        
        # Log the request
        logger.info(
            f"Request started: {request.method} {request.url.path} - ID: {request_id}"
        )
        
        # Process the request and get the response
        try:
            response = await call_next(request)
            
            # Calculate processing time
            process_time = time.time() - start_time
            
            # Add request ID and timing headers to response
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = str(process_time)
            
            # Log the response
            logger.info(
                f"Request completed: {request.method} {request.url.path} - "
                f"Status: {response.status_code} - "
                f"Duration: {process_time:.4f}s - "
                f"ID: {request_id}"
            )
            
            return response
            
        except Exception as e:
            # Log the error
            process_time = time.time() - start_time
            logger.error(
                f"Request failed: {request.method} {request.url.path} - "
                f"Error: {str(e)} - "
                f"Duration: {process_time:.4f}s - "
                f"ID: {request_id}"
            )
            raise


def add_middleware(app: FastAPI) -> None:
    """
    Add the request middleware to the FastAPI app.
    
    Args:
        app: FastAPI application instance
    """
    app.add_middleware(RequestMiddleware) 