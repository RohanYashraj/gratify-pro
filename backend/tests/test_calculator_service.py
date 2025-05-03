from datetime import date
from decimal import Decimal
import pytest
from app.services.calculator import (
    calculate_years_of_service, 
    calculate_gratuity_amount,
    calculate_individual_gratuity,
    calculate_bulk_gratuity,
    is_eligible_for_gratuity,
    MAX_GRATUITY_LIMIT
)
from app.schemas.calculator import EmployeeType, TerminationReason, IndividualCalculatorInput

def test_calculate_years_of_service():
    # Exactly 5 years
    assert calculate_years_of_service(date(2018, 1, 1), date(2023, 1, 1)) == 5
    
    # 5 years and 5 months (less than 6 months, so stays 5 years)
    assert calculate_years_of_service(date(2018, 1, 1), date(2023, 6, 1)) == 5
    
    # 5 years and 6 months (rounds up to 6 years)
    assert calculate_years_of_service(date(2018, 1, 1), date(2023, 7, 1)) == 6
    
    # 5 years and almost 6 months (rounds up if 5 months and 30 days)
    assert calculate_years_of_service(date(2018, 1, 1), date(2023, 6, 30)) == 6

def test_is_eligible_for_gratuity():
    # Standard termination reasons
    assert is_eligible_for_gratuity(5, TerminationReason.RESIGNATION) == True
    assert is_eligible_for_gratuity(4.9, TerminationReason.RESIGNATION) == False
    assert is_eligible_for_gratuity(5, TerminationReason.RETIREMENT) == True
    
    # Special termination reasons (no minimum service period)
    assert is_eligible_for_gratuity(2, TerminationReason.DEATH) == True
    assert is_eligible_for_gratuity(1, TerminationReason.DISABILITY) == True
    assert is_eligible_for_gratuity(0, TerminationReason.DISABILITY) == True

def test_calculate_gratuity_amount():
    # No gratuity for less than 5 years (standard termination)
    assert calculate_gratuity_amount(
        Decimal('20000'), 4, EmployeeType.STANDARD, TerminationReason.RESIGNATION
    ) == Decimal('0.00')
    
    # Basic calculation with 5 years for standard employee
    expected = (Decimal('20000') * Decimal('5') * Decimal('15')) / Decimal('26')
    expected = expected.quantize(Decimal('0.01'))
    assert calculate_gratuity_amount(
        Decimal('20000'), 5, EmployeeType.STANDARD, TerminationReason.RESIGNATION
    ) == expected
    
    # Verify specific value for standard employee
    assert calculate_gratuity_amount(
        Decimal('20000'), 5, EmployeeType.STANDARD, TerminationReason.RESIGNATION
    ) == Decimal('57692.31')
    
    # Non-covered employee calculation (using 15/30 formula)
    expected_non_covered = (Decimal('20000') * Decimal('5') * Decimal('15')) / Decimal('30')
    expected_non_covered = expected_non_covered.quantize(Decimal('0.01'))
    assert calculate_gratuity_amount(
        Decimal('20000'), 5, EmployeeType.NON_COVERED, TerminationReason.RESIGNATION
    ) == expected_non_covered
    
    # Verify specific value for non-covered employee
    assert calculate_gratuity_amount(
        Decimal('20000'), 5, EmployeeType.NON_COVERED, TerminationReason.RESIGNATION
    ) == Decimal('50000.00')
    
    # Death/disability case with less than 5 years of service
    assert calculate_gratuity_amount(
        Decimal('20000'), 2, EmployeeType.STANDARD, TerminationReason.DEATH
    ) != Decimal('0.00')
    
    # Maximum gratuity limit test
    high_salary = Decimal('1000000')  # A very high salary to exceed the max limit
    high_years = 30  # Many years of service
    result = calculate_gratuity_amount(
        high_salary, high_years, EmployeeType.STANDARD, TerminationReason.RETIREMENT
    )
    assert result == MAX_GRATUITY_LIMIT  # Should be capped at the maximum limit

def test_calculate_individual_gratuity():
    # Test with less than 5 years (should return 0 gratuity and a message)
    result = calculate_individual_gratuity(
        employee_name="John Doe",
        joining_date=date(2020, 1, 1),
        leaving_date=date(2023, 12, 31),
        last_drawn_salary=Decimal('30000')
    )
    assert result["gratuity_amount"] == Decimal('0.00')
    assert result["is_eligible"] == False
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
    assert result["is_eligible"] == True
    assert result["message"] is None
    
    # Test with death termination reason (eligible regardless of service period)
    result = calculate_individual_gratuity(
        employee_name="Alex Johnson",
        joining_date=date(2022, 1, 1),
        leaving_date=date(2023, 1, 1),
        last_drawn_salary=Decimal('25000'),
        termination_reason=TerminationReason.DEATH
    )
    assert result["years_of_service"] == 1
    assert result["is_eligible"] == True
    assert result["gratuity_amount"] > Decimal('0.00')
    
    # Test with non-covered employee type
    result = calculate_individual_gratuity(
        employee_name="Sarah Lee",
        joining_date=date(2018, 1, 1),
        leaving_date=date(2023, 1, 1),
        last_drawn_salary=Decimal('25000'),
        employee_type=EmployeeType.NON_COVERED
    )
    assert result["gratuity_amount"] == Decimal('62500.00')  # Using 15/30 formula

def test_calculate_bulk_gratuity():
    # Create a list of employees
    employees = [
        IndividualCalculatorInput(
            employee_name="John Doe",
            joining_date=date(2018, 1, 1),
            leaving_date=date(2023, 1, 1),
            last_drawn_salary=Decimal('30000')
        ),
        IndividualCalculatorInput(
            employee_name="Jane Smith",
            joining_date=date(2020, 1, 1),
            leaving_date=date(2023, 1, 1),
            last_drawn_salary=Decimal('25000')
        ),
        IndividualCalculatorInput(
            employee_name="Alex Johnson",
            joining_date=date(2015, 1, 1),
            leaving_date=date(2023, 1, 1),
            last_drawn_salary=Decimal('40000'),
            termination_reason=TerminationReason.DEATH
        )
    ]
    
    # Calculate bulk gratuity
    result = calculate_bulk_gratuity(employees)
    
    # Verify results
    assert len(result["results"]) == 3
    assert result["eligible_count"] == 2  # John and Alex are eligible, Jane is not
    assert result["ineligible_count"] == 1
    
    # Check total gratuity amount
    total = sum(r["gratuity_amount"] for r in result["results"])
    assert result["total_gratuity_amount"] == total 