"""
Pydantic models for gratuity calculations.
"""

from decimal import Decimal
from typing import Dict, List, Optional
from pydantic import BaseModel, Field, validator

from app.schemas.base import BaseSchema, DataResponse


class GratuityBaseSchema(BaseSchema):
    """
    Base schema for gratuity calculations with common fields.
    """
    years_of_service: Decimal = Field(..., description="Years of service of the employee", ge=0)
    last_drawn_salary: Decimal = Field(..., description="Last drawn monthly salary", ge=0)
    
    @validator("years_of_service")
    def validate_years_of_service(cls, v):
        """Validate years of service is a positive decimal."""
        if v < 0:
            raise ValueError("Years of service must be a positive number")
        return v
    
    @validator("last_drawn_salary")
    def validate_salary(cls, v):
        """Validate last drawn salary is a positive decimal."""
        if v < 0:
            raise ValueError("Last drawn salary must be a positive number")
        return v


class IndividualGratuityRequest(GratuityBaseSchema):
    """
    Schema for individual gratuity calculation requests.
    """
    is_covered_under_act: bool = Field(
        True, 
        description="Whether the employee is covered under the Payment of Gratuity Act"
    )
    basic_salary: Optional[Decimal] = Field(
        None, 
        description="Basic salary component of the last drawn salary"
    )
    dearness_allowance: Optional[Decimal] = Field(
        None, 
        description="Dearness allowance component of the last drawn salary"
    )
    additional_components: Optional[Dict[str, Decimal]] = Field(
        None, 
        description="Additional salary components to consider for gratuity calculation"
    )


class GratuityResponse(BaseSchema):
    """
    Schema for gratuity calculation results.
    """
    gratuity_amount: Decimal = Field(..., description="Calculated gratuity amount")
    years_of_service_considered: Decimal = Field(..., description="Years of service considered for calculation")
    salary_considered: Decimal = Field(..., description="Salary amount considered for calculation")
    formula_used: str = Field(..., description="Gratuity formula used for calculation")
    calculation_breakdown: Dict[str, Decimal] = Field(
        ..., 
        description="Breakdown of the calculation steps"
    )


class GratuityCalculationResponse(DataResponse[GratuityResponse]):
    """
    Response schema for gratuity calculation API.
    """
    pass


class BulkGratuityRequestItem(GratuityBaseSchema):
    """
    Schema for a single item in a bulk gratuity calculation request.
    """
    employee_id: str = Field(..., description="Unique identifier for the employee")
    employee_name: Optional[str] = Field(None, description="Name of the employee")
    is_covered_under_act: bool = Field(
        True, 
        description="Whether the employee is covered under the Payment of Gratuity Act"
    )


class BulkGratuityRequest(BaseSchema):
    """
    Schema for bulk gratuity calculation requests.
    """
    employees: List[BulkGratuityRequestItem] = Field(
        ..., 
        description="List of employees for gratuity calculation"
    )


class BulkGratuityResponseItem(GratuityResponse):
    """
    Schema for a single item in a bulk gratuity calculation response.
    """
    employee_id: str = Field(..., description="Unique identifier for the employee")
    employee_name: Optional[str] = Field(None, description="Name of the employee")


class BulkGratuityCalculationResponse(DataResponse[List[BulkGratuityResponseItem]]):
    """
    Response schema for bulk gratuity calculation API.
    """
    pass 