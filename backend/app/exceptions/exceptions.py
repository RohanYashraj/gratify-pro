"""
Custom exceptions for the application.
"""

from typing import Any, Dict, Optional
from fastapi import HTTPException, status


class BaseAPIException(HTTPException):
    """
    Base API exception with additional metadata.
    """
    
    def __init__(
        self,
        status_code: int,
        detail: Any = None,
        headers: Optional[Dict[str, Any]] = None,
        code: str = None,
    ) -> None:
        super().__init__(status_code=status_code, detail=detail, headers=headers)
        self.code = code


class BadRequestException(BaseAPIException):
    """
    Exception for 400 Bad Request errors.
    """
    
    def __init__(
        self,
        detail: Any = "Bad request",
        headers: Optional[Dict[str, Any]] = None,
        code: str = "BAD_REQUEST",
    ) -> None:
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
            headers=headers,
            code=code,
        )


class UnauthorizedException(BaseAPIException):
    """
    Exception for 401 Unauthorized errors.
    """
    
    def __init__(
        self,
        detail: Any = "Not authenticated",
        headers: Optional[Dict[str, Any]] = None,
        code: str = "UNAUTHORIZED",
    ) -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers=headers,
            code=code,
        )


class ForbiddenException(BaseAPIException):
    """
    Exception for 403 Forbidden errors.
    """
    
    def __init__(
        self,
        detail: Any = "Forbidden",
        headers: Optional[Dict[str, Any]] = None,
        code: str = "FORBIDDEN",
    ) -> None:
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
            headers=headers,
            code=code,
        )


class NotFoundException(BaseAPIException):
    """
    Exception for 404 Not Found errors.
    """
    
    def __init__(
        self,
        detail: Any = "Not found",
        headers: Optional[Dict[str, Any]] = None,
        code: str = "NOT_FOUND",
    ) -> None:
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
            headers=headers,
            code=code,
        )


class ValidationException(BaseAPIException):
    """
    Exception for 422 Validation errors.
    """
    
    def __init__(
        self,
        detail: Any = "Validation error",
        headers: Optional[Dict[str, Any]] = None,
        code: str = "VALIDATION_ERROR",
    ) -> None:
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail,
            headers=headers,
            code=code,
        )


class ServerException(BaseAPIException):
    """
    Exception for 500 Internal Server Error.
    """
    
    def __init__(
        self,
        detail: Any = "Internal server error",
        headers: Optional[Dict[str, Any]] = None,
        code: str = "INTERNAL_SERVER_ERROR",
    ) -> None:
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail,
            headers=headers,
            code=code,
        ) 