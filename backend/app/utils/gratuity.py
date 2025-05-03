"""
Utility functions for gratuity calculations.
"""

from decimal import Decimal
from typing import Dict, Tuple


def calculate_gratuity_amount(
    years_of_service: Decimal,
    last_drawn_salary: Decimal,
    is_covered_under_act: bool = True
) -> Tuple[Decimal, str, Dict[str, Decimal]]:
    """
    Calculate gratuity amount based on years of service and last drawn salary.
    
    Args:
        years_of_service: Number of years the employee has worked
        last_drawn_salary: Last drawn monthly salary of the employee
        is_covered_under_act: Whether the employee is covered under the Payment of Gratuity Act
        
    Returns:
        Tuple containing:
        - Calculated gratuity amount
        - Formula used
        - Calculation breakdown
    """
    # Round down years of service to half year precision as per Act
    # For example, 5.7 years becomes 5.5 years, 5.2 years becomes 5.0 years
    years_considered = Decimal(int(years_of_service * 2)) / 2
    
    # Floor to 0 if less than 0
    years_considered = max(years_considered, Decimal('0'))
    
    # Apply gratuity formula based on coverage
    if is_covered_under_act:
        # 15 days salary for each year of completed service
        # 15/26 is the factor (assuming 26 working days in a month)
        factor = Decimal('15') / Decimal('26')
        formula = "15/26 * Last Drawn Salary * Years of Service"
    else:
        # For non-covered employees, typically 15 days salary per year
        # 15/30 is the factor (assuming 30 days in a month)
        factor = Decimal('15') / Decimal('30')
        formula = "15/30 * Last Drawn Salary * Years of Service"
    
    # Calculate gratuity amount
    gratuity_amount = last_drawn_salary * years_considered * factor
    
    # Create breakdown for transparency
    breakdown = {
        "last_drawn_salary": last_drawn_salary,
        "years_of_service_raw": years_of_service,
        "years_of_service_considered": years_considered,
        "factor": factor,
        "gratuity_amount": gratuity_amount
    }
    
    return gratuity_amount, formula, breakdown


def calculate_maximum_gratuity(salary: Decimal) -> Decimal:
    """
    Calculate the maximum gratuity amount allowed under the Act.
    
    Args:
        salary: Monthly salary of the employee
        
    Returns:
        Maximum gratuity amount as per current regulations
    """
    # Current ceiling for gratuity is 20 Lakhs (2,000,000)
    # This can be updated if the limit changes
    max_gratuity = Decimal('2000000')
    
    return max_gratuity 