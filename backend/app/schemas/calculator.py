from datetime import date
from typing import Optional
from pydantic import BaseModel, Field, validator
from decimal import Decimal

class IndividualCalculatorInput(BaseModel):
    """
    Schema for individual gratuity calculator input data.
    """
    employee_name: str = Field(..., description="Name of the employee")
    joining_date: date = Field(..., description="Date when employee joined the organization")
    leaving_date: date = Field(..., description="Date when employee left or will leave the organization")
    last_drawn_salary: Decimal = Field(..., description="Last drawn basic salary + dearness allowance", ge=0)
    
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
    message: Optional[str] = None 