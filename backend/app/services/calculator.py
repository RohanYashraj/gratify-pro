from datetime import date
from decimal import Decimal, ROUND_HALF_UP
from dateutil.relativedelta import relativedelta

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

def calculate_gratuity_amount(last_drawn_salary: Decimal, years_of_service: float) -> Decimal:
    """
    Calculate gratuity amount according to Payment of Gratuity Act, 1972.
    
    Formula: (Last Drawn Salary × Period of Service × 15) / 26
    """
    # If service is less than 5 years, no gratuity is payable
    if years_of_service < 5:
        return Decimal('0.00')
    
    # Calculate gratuity 
    gratuity = (last_drawn_salary * Decimal(years_of_service) * Decimal('15')) / Decimal('26')
    
    # Round to 2 decimal places
    return gratuity.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

def calculate_individual_gratuity(
    employee_name: str,
    joining_date: date,
    leaving_date: date,
    last_drawn_salary: Decimal
) -> dict:
    """
    Calculate gratuity for an individual employee.
    
    Returns a dictionary with calculation results and metadata.
    """
    years_of_service = calculate_years_of_service(joining_date, leaving_date)
    gratuity_amount = calculate_gratuity_amount(last_drawn_salary, years_of_service)
    
    message = None
    if years_of_service < 5:
        message = "No gratuity is payable as the service period is less than 5 years."
    
    return {
        "employee_name": employee_name,
        "joining_date": joining_date,
        "leaving_date": leaving_date,
        "last_drawn_salary": last_drawn_salary,
        "years_of_service": years_of_service,
        "gratuity_amount": gratuity_amount,
        "message": message
    } 