"""
Tests for gratuity utility functions.
"""

import pytest
from decimal import Decimal

from app.utils.gratuity import calculate_gratuity_amount, calculate_maximum_gratuity


def test_calculate_gratuity_amount_covered_under_act():
    """Test gratuity calculation for employees covered under the act."""
    years_of_service = Decimal('5.7')
    last_drawn_salary = Decimal('50000')
    is_covered_under_act = True
    
    gratuity_amount, formula, breakdown = calculate_gratuity_amount(
        years_of_service, 
        last_drawn_salary, 
        is_covered_under_act
    )
    
    # Check that years are rounded to nearest half year (5.7 -> 5.5)
    assert breakdown["years_of_service_considered"] == Decimal('5.5')
    
    # Check the factor is 15/26
    assert breakdown["factor"] == Decimal('15') / Decimal('26')
    
    # Calculate expected amount
    expected_amount = Decimal('50000') * Decimal('5.5') * (Decimal('15') / Decimal('26'))
    assert gratuity_amount == expected_amount
    
    # Check formula
    assert "15/26" in formula


def test_calculate_gratuity_amount_not_covered_under_act():
    """Test gratuity calculation for employees not covered under the act."""
    years_of_service = Decimal('10.2')
    last_drawn_salary = Decimal('75000')
    is_covered_under_act = False
    
    gratuity_amount, formula, breakdown = calculate_gratuity_amount(
        years_of_service, 
        last_drawn_salary, 
        is_covered_under_act
    )
    
    # Check that years are rounded to nearest half year (10.2 -> 10.0)
    assert breakdown["years_of_service_considered"] == Decimal('10.0')
    
    # Check the factor is 15/30
    assert breakdown["factor"] == Decimal('15') / Decimal('30')
    
    # Calculate expected amount
    expected_amount = Decimal('75000') * Decimal('10.0') * (Decimal('15') / Decimal('30'))
    assert gratuity_amount == expected_amount
    
    # Check formula
    assert "15/30" in formula


def test_calculate_gratuity_amount_zero_years():
    """Test gratuity calculation when years of service is zero."""
    years_of_service = Decimal('0')
    last_drawn_salary = Decimal('60000')
    
    gratuity_amount, formula, breakdown = calculate_gratuity_amount(
        years_of_service, 
        last_drawn_salary
    )
    
    assert gratuity_amount == Decimal('0')


def test_calculate_maximum_gratuity():
    """Test the maximum gratuity amount calculation."""
    salary = Decimal('100000')
    max_amount = calculate_maximum_gratuity(salary)
    
    # Current ceiling is 20 Lakhs
    assert max_amount == Decimal('2000000') 