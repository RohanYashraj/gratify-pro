from datetime import date
from decimal import Decimal, ROUND_HALF_UP
from dateutil.relativedelta import relativedelta
from typing import List, Dict
from ..schemas.calculator import EmployeeType, TerminationReason, IndividualCalculatorInput, GratuityResult

# Constants
MAX_GRATUITY_LIMIT = Decimal('2000000.00')  # ₹20 lakh maximum gratuity limit

def calculate_years_of_service(joining_date: date, leaving_date: date) -> float:
    """
    Calculate years of service based on joining and leaving dates.
    Returns a float representing the years of service.
    
    If service period is less than 6 months, it's ignored.
    If service period is 6 months or more, it's rounded to the next year.
    """
    delta = relativedelta(leaving_date, joining_date)
    years = delta.years
    
    # Check if months are 6 or more, round up to next year
    if delta.months >= 6 or (delta.months == 5 and delta.days >= 30):
        years += 1
        
    return years

def is_eligible_for_gratuity(years_of_service: float, termination_reason: TerminationReason) -> bool:
    """
    Check if an employee is eligible for gratuity based on years of service and termination reason.
    
    According to the Payment of Gratuity Act:
    - Minimum 5 years of service is required for eligibility
    - Exception: In case of death or disability, there's no minimum service requirement
    """
    if termination_reason in [TerminationReason.DEATH, TerminationReason.DISABILITY]:
        return True
    return years_of_service >= 5

def calculate_gratuity_amount(
    last_drawn_salary: Decimal, 
    years_of_service: float, 
    employee_type: EmployeeType,
    termination_reason: TerminationReason
) -> Decimal:
    """
    Calculate gratuity amount according to Payment of Gratuity Act, 1972.
    
    Formulas:
    - Standard employees: (Last Drawn Salary × Period of Service × 15) / 26
    - Non-covered employees: (Last Drawn Salary × Period of Service × 15) / 30
    
    Also handles special cases like death and disability.
    """
    # Check eligibility
    if not is_eligible_for_gratuity(years_of_service, termination_reason):
        return Decimal('0.00')
    
    # Different formulas for different employee types
    denominator = Decimal('26') if employee_type == EmployeeType.STANDARD else Decimal('30')
    
    # Calculate gratuity 
    gratuity = (last_drawn_salary * Decimal(years_of_service) * Decimal('15')) / denominator
    
    # Apply maximum limit
    gratuity = min(gratuity, MAX_GRATUITY_LIMIT)
    
    # Round to 2 decimal places
    return gratuity.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

def calculate_individual_gratuity(
    employee_name: str,
    joining_date: date,
    leaving_date: date,
    last_drawn_salary: Decimal,
    employee_type: EmployeeType = EmployeeType.STANDARD,
    termination_reason: TerminationReason = TerminationReason.RESIGNATION
) -> Dict:
    """
    Calculate gratuity for an individual employee.
    
    Returns a dictionary with calculation results and metadata.
    """
    years_of_service = calculate_years_of_service(joining_date, leaving_date)
    is_eligible = is_eligible_for_gratuity(years_of_service, termination_reason)
    gratuity_amount = calculate_gratuity_amount(
        last_drawn_salary, 
        years_of_service, 
        employee_type, 
        termination_reason
    )
    
    message = None
    if not is_eligible:
        if termination_reason not in [TerminationReason.DEATH, TerminationReason.DISABILITY]:
            message = "No gratuity is payable as the service period is less than 5 years."
    elif gratuity_amount >= MAX_GRATUITY_LIMIT:
        message = f"Gratuity amount exceeds the maximum limit of ₹{MAX_GRATUITY_LIMIT:,} and has been capped."
    
    return {
        "employee_name": employee_name,
        "joining_date": joining_date,
        "leaving_date": leaving_date,
        "last_drawn_salary": last_drawn_salary,
        "years_of_service": years_of_service,
        "gratuity_amount": gratuity_amount,
        "employee_type": employee_type,
        "termination_reason": termination_reason,
        "is_eligible": is_eligible,
        "message": message
    }

def calculate_bulk_gratuity(employees: List[IndividualCalculatorInput]) -> Dict:
    """
    Calculate gratuity for multiple employees.
    
    Returns aggregated results including individual calculations, total amount, and statistics.
    """
    results = []
    total_gratuity = Decimal('0.00')
    eligible_count = 0
    ineligible_count = 0
    
    for employee in employees:
        result = calculate_individual_gratuity(
            employee_name=employee.employee_name,
            joining_date=employee.joining_date,
            leaving_date=employee.leaving_date,
            last_drawn_salary=employee.last_drawn_salary,
            employee_type=employee.employee_type,
            termination_reason=employee.termination_reason
        )
        
        results.append(result)
        total_gratuity += result["gratuity_amount"]
        
        if result["is_eligible"]:
            eligible_count += 1
        else:
            ineligible_count += 1
    
    return {
        "results": results,
        "total_gratuity_amount": total_gratuity,
        "eligible_count": eligible_count,
        "ineligible_count": ineligible_count
    } 