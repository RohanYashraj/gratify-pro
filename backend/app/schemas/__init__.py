"""
Schemas package for Pydantic models.
"""

from app.schemas.base import (
    BaseSchema, 
    ResponseBase, 
    DataResponse, 
    ListResponse, 
    PaginatedResponse, 
    ErrorResponse
)

from app.schemas.gratuity import (
    GratuityBaseSchema,
    IndividualGratuityRequest,
    GratuityResponse,
    GratuityCalculationResponse,
    BulkGratuityRequestItem,
    BulkGratuityRequest,
    BulkGratuityResponseItem,
    BulkGratuityCalculationResponse
)

__all__ = [
    # Base schemas
    "BaseSchema",
    "ResponseBase",
    "DataResponse",
    "ListResponse",
    "PaginatedResponse",
    "ErrorResponse",
    
    # Gratuity schemas
    "GratuityBaseSchema",
    "IndividualGratuityRequest",
    "GratuityResponse",
    "GratuityCalculationResponse",
    "BulkGratuityRequestItem",
    "BulkGratuityRequest",
    "BulkGratuityResponseItem",
    "BulkGratuityCalculationResponse"
] 