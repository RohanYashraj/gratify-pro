from datetime import date
from typing import Optional, List
from pydantic import BaseModel, Field, validator
from decimal import Decimal
from enum import Enum

class EmployeeType(str, Enum):
    """Enum for different types of employees with different calculation rules"""
    STANDARD = "standard"  # Standard employee under the Payment of Gratuity Act
    NON_COVERED = "non-covered"  # Employees not covered under the Act
    UNKNOWN = "unknown"  # For cases where employee type is not specified

class TerminationReason(str, Enum):
    """Reason for employment termination that may affect gratuity calculation"""
    RETIREMENT = "retirement"
    RESIGNATION = "resignation"
    DEATH = "death"
    DISABILITY = "disability"
    UNKNOWN = "unknown"  # For cases where termination reason is not specified

class IndividualCalculatorInput(BaseModel):
    """
    Schema for individual gratuity calculator input data.
    """
    employee_name: str = Field(..., description="Name of the employee")
    joining_date: date = Field(..., description="Date when employee joined the organization")
    leaving_date: date = Field(..., description="Date when employee left or will leave the organization")
    last_drawn_salary: Decimal = Field(..., description="Last drawn basic salary + dearness allowance", ge=0)
    employee_type: EmployeeType = Field(default=EmployeeType.STANDARD, description="Type of employee for calculation rules")
    termination_reason: TerminationReason = Field(default=TerminationReason.RESIGNATION, description="Reason for termination")
    
    @validator('leaving_date')
    def validate_dates(cls, leaving_date, values):
        """Validate that leaving date is after joining date"""
        if 'joining_date' in values and leaving_date < values['joining_date']:
            raise ValueError("Leaving date must be after joining date")
        return leaving_date

class GratuityResult(BaseModel):
    """
    Schema for gratuity calculation result.
    """
    employee_name: str
    joining_date: date
    leaving_date: date
    last_drawn_salary: Decimal
    years_of_service: float
    gratuity_amount: Decimal
    employee_type: EmployeeType
    termination_reason: TerminationReason
    is_eligible: bool
    message: Optional[str] = None

class BulkCalculatorInput(BaseModel):
    """
    Schema for bulk gratuity calculations.
    """
    employees: List[IndividualCalculatorInput]

class BulkCalculationResult(BaseModel):
    """
    Schema for bulk calculation results.
    """
    results: List[GratuityResult]
    total_gratuity_amount: Decimal
    eligible_count: int
    ineligible_count: int 