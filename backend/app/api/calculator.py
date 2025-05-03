from fastapi import APIRouter, HTTPException
from ..schemas import IndividualCalculatorInput, GratuityResult
from ..services.calculator import calculate_individual_gratuity

router = APIRouter(
    prefix="/calculator",
    tags=["calculator"],
    responses={404: {"description": "Not found"}},
)

@router.post("/individual", response_model=GratuityResult)
async def calculate_individual(calculator_input: IndividualCalculatorInput):
    """
    Calculate gratuity for an individual employee.
    
    - **employee_name**: Name of the employee
    - **joining_date**: Date when employee joined the organization (YYYY-MM-DD)
    - **leaving_date**: Date when employee left or will leave the organization (YYYY-MM-DD)
    - **last_drawn_salary**: Last drawn basic salary + dearness allowance
    
    Returns the calculated gratuity amount and related information.
    """
    try:
        result = calculate_individual_gratuity(
            employee_name=calculator_input.employee_name,
            joining_date=calculator_input.joining_date,
            leaving_date=calculator_input.leaving_date,
            last_drawn_salary=calculator_input.last_drawn_salary
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 