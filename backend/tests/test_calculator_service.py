from datetime import date
from decimal import Decimal
import pytest
from app.services.calculator import (
    calculate_years_of_service, 
    calculate_gratuity_amount,
    calculate_individual_gratuity
)

def test_calculate_years_of_service():
    # Exactly 5 years
    assert calculate_years_of_service(date(2018, 1, 1), date(2023, 1, 1)) == 5
    
    # 5 years and 5 months (less than 6 months, so stays 5 years)
    assert calculate_years_of_service(date(2018, 1, 1), date(2023, 6, 1)) == 5
    
    # 5 years and 6 months (rounds up to 6 years)
    assert calculate_years_of_service(date(2018, 1, 1), date(2023, 7, 1)) == 6
    
    # 5 years and almost 6 months (rounds up if 5 months and 30 days)
    assert calculate_years_of_service(date(2018, 1, 1), date(2023, 6, 30)) == 6

def test_calculate_gratuity_amount():
    # No gratuity for less than 5 years
    assert calculate_gratuity_amount(Decimal('20000'), 4) == Decimal('0.00')
    
    # Basic calculation with 5 years
    expected = (Decimal('20000') * Decimal('5') * Decimal('15')) / Decimal('26')
    expected = expected.quantize(Decimal('0.01'))
    assert calculate_gratuity_amount(Decimal('20000'), 5) == expected
    
    # Verify specific value
    assert calculate_gratuity_amount(Decimal('20000'), 5) == Decimal('57692.31')

def test_calculate_individual_gratuity():
    # Test with less than 5 years (should return 0 gratuity and a message)
    result = calculate_individual_gratuity(
        employee_name="John Doe",
        joining_date=date(2020, 1, 1),
        leaving_date=date(2023, 12, 31),
        last_drawn_salary=Decimal('30000')
    )
    assert result["gratuity_amount"] == Decimal('0.00')
    assert "less than 5 years" in result["message"]
    
    # Test with exactly 5 years
    result = calculate_individual_gratuity(
        employee_name="Jane Smith",
        joining_date=date(2018, 1, 1),
        leaving_date=date(2023, 1, 1),
        last_drawn_salary=Decimal('25000')
    )
    assert result["years_of_service"] == 5
    assert result["gratuity_amount"] == Decimal('72115.38')
    assert result["message"] is None 