"""
Base Pydantic models for the application.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional, Generic, TypeVar
from pydantic import BaseModel, Field, ConfigDict, validator


# Define base request and response models
class BaseSchema(BaseModel):
    """Base schema for all API models"""
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={
            datetime: lambda dt: dt.isoformat(),
        },
    )


class ResponseBase(BaseSchema):
    """Base schema for API responses"""
    success: bool = True
    message: Optional[str] = None


# Type variable for generic models
T = TypeVar('T')


class PaginatedResponse(ResponseBase, Generic[T]):
    """
    Schema for paginated responses with data and metadata.
    """
    data: List[T]
    meta: Dict[str, Any] = Field(
        default_factory=lambda: {
            "page": 1,
            "per_page": 10,
            "total": 0,
            "total_pages": 1,
        }
    )


class DataResponse(ResponseBase, Generic[T]):
    """
    Schema for responses containing a single data item.
    """
    data: T


class ListResponse(ResponseBase, Generic[T]):
    """
    Schema for responses containing a list of items without pagination.
    """
    data: List[T]


class ErrorResponse(BaseSchema):
    """
    Schema for error responses.
    """
    success: bool = False
    error: Dict[str, Any] 