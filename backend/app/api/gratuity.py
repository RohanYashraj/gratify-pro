"""
API routes for gratuity calculations.
"""

from fastapi import APIRouter, HTTPException, status, UploadFile, File, Depends
from typing import Dict, List, Optional

from app.schemas.gratuity import (
    IndividualGratuityRequest,
    GratuityCalculationResponse,
    BulkGratuityRequest,
    BulkGratuityCalculationResponse
)

# Create router with prefix and tags
router = APIRouter(
    prefix="/gratuity",
    tags=["gratuity"],
)


@router.post(
    "/calculate/individual",
    response_model=GratuityCalculationResponse,
    summary="Calculate gratuity for an individual employee",
    description="Calculate gratuity amount based on years of service and last drawn salary according to the Payment of Gratuity Act, 1972."
)
async def calculate_individual_gratuity(
    request: IndividualGratuityRequest
) -> GratuityCalculationResponse:
    """
    Calculate gratuity for an individual employee.
    
    This endpoint calculates the gratuity amount based on the years of service
    and last drawn salary according to the Payment of Gratuity Act, 1972.
    """
    # This will be implemented in a future task with actual calculation logic
    # For now, return a mock response
    
    # Placeholder for the actual logic
    formula_used = "15/26 * Last Drawn Salary * Years of Service" if request.is_covered_under_act else "15/30 * Last Drawn Salary * Years of Service"
    
    # Mock calculation
    factor = 15/26 if request.is_covered_under_act else 15/30
    gratuity_amount = float(request.last_drawn_salary) * float(request.years_of_service) * factor
    
    return GratuityCalculationResponse(
        success=True,
        message="Gratuity calculated successfully",
        data={
            "gratuity_amount": gratuity_amount,
            "years_of_service_considered": request.years_of_service,
            "salary_considered": request.last_drawn_salary,
            "formula_used": formula_used,
            "calculation_breakdown": {
                "last_drawn_salary": float(request.last_drawn_salary),
                "years_of_service": float(request.years_of_service),
                "factor": factor,
                "gratuity_amount": gratuity_amount
            }
        }
    )


@router.post(
    "/calculate/bulk",
    response_model=BulkGratuityCalculationResponse,
    summary="Calculate gratuity for multiple employees",
    description="Calculate gratuity amounts for multiple employees based on their years of service and last drawn salary."
)
async def calculate_bulk_gratuity(
    request: BulkGratuityRequest
) -> BulkGratuityCalculationResponse:
    """
    Calculate gratuity for multiple employees.
    
    This endpoint calculates gratuity for a list of employees 
    based on their years of service and last drawn salary.
    """
    # This will be implemented in a future task with actual calculation logic
    # For now, return a mock response
    
    results = []
    
    for employee in request.employees:
        # Placeholder calculations
        formula_used = "15/26 * Last Drawn Salary * Years of Service" if employee.is_covered_under_act else "15/30 * Last Drawn Salary * Years of Service"
        factor = 15/26 if employee.is_covered_under_act else 15/30
        gratuity_amount = float(employee.last_drawn_salary) * float(employee.years_of_service) * factor
        
        results.append({
            "employee_id": employee.employee_id,
            "employee_name": employee.employee_name,
            "gratuity_amount": gratuity_amount,
            "years_of_service_considered": employee.years_of_service,
            "salary_considered": employee.last_drawn_salary,
            "formula_used": formula_used,
            "calculation_breakdown": {
                "last_drawn_salary": float(employee.last_drawn_salary),
                "years_of_service": float(employee.years_of_service),
                "factor": factor,
                "gratuity_amount": gratuity_amount
            }
        })
    
    return BulkGratuityCalculationResponse(
        success=True,
        message=f"Gratuity calculated successfully for {len(results)} employees",
        data=results
    )


@router.post(
    "/upload",
    response_model=BulkGratuityCalculationResponse,
    summary="Calculate gratuity from uploaded file",
    description="Upload a CSV or Excel file with employee data and calculate gratuity for each employee."
)
async def calculate_from_file(
    file: UploadFile = File(...),
) -> BulkGratuityCalculationResponse:
    """
    Calculate gratuity from an uploaded file.
    
    This endpoint accepts a CSV or Excel file containing employee data 
    and calculates gratuity for each employee in the file.
    """
    # This will be implemented in a future task
    # For now, return a mock response with error
    
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="File upload functionality is not yet implemented"
    ) 