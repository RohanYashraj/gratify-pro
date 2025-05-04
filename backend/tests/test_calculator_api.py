from fastapi.testclient import TestClient
from datetime import date
from decimal import Decimal
import json

from app.main import app
from app.schemas.calculator import EmployeeType, TerminationReason

client = TestClient(app)

def test_calculate_individual_gratuity():
    # Test valid calculation with more than 5 years
    response = client.post(
        "/calculator/individual",
        json={
            "employee_name": "Jane Smith",
            "joining_date": "2018-01-01",
            "leaving_date": "2023-01-01",
            "last_drawn_salary": 25000
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["employee_name"] == "Jane Smith"
    assert data["years_of_service"] == 5
    assert data["gratuity_amount"] == "72115.38"
    assert data["is_eligible"] == True
    assert data["message"] is None

    # Test case where service period is less than 5 years
    response = client.post(
        "/calculator/individual",
        json={
            "employee_name": "John Doe",
            "joining_date": "2020-01-01",
            "leaving_date": "2023-12-31",
            "last_drawn_salary": 30000
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["gratuity_amount"] == "0.00"
    assert data["is_eligible"] == False
    assert "less than 5 years" in data["message"]
    
    # Test death case with less than 5 years (should still be eligible)
    response = client.post(
        "/calculator/individual",
        json={
            "employee_name": "Alex Johnson",
            "joining_date": "2022-01-01",
            "leaving_date": "2023-01-01",
            "last_drawn_salary": 35000,
            "termination_reason": "death"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_eligible"] == True
    assert float(data["gratuity_amount"]) > 0
    assert data["message"] is None
    
    # Test non-covered employee type
    response = client.post(
        "/calculator/individual",
        json={
            "employee_name": "Sarah Lee",
            "joining_date": "2018-01-01",
            "leaving_date": "2023-01-01",
            "last_drawn_salary": 25000,
            "employee_type": "non-covered"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["gratuity_amount"] == "62500.00"  # Using 15/30 formula

def test_invalid_inputs():
    # Test invalid dates (leaving date before joining date)
    response = client.post(
        "/calculator/individual",
        json={
            "employee_name": "Invalid User",
            "joining_date": "2023-01-01",
            "leaving_date": "2022-01-01",  # Before joining date
            "last_drawn_salary": 20000
        }
    )
    assert response.status_code == 400
    assert "Leaving date must be after joining date" in response.json()["detail"]
    
    # Test with negative salary
    response = client.post(
        "/calculator/individual",
        json={
            "employee_name": "Negative Salary",
            "joining_date": "2018-01-01",
            "leaving_date": "2023-01-01",
            "last_drawn_salary": -5000  # Negative salary
        }
    )
    assert response.status_code == 422  # Validation error
    
    # Test with invalid employee type
    response = client.post(
        "/calculator/individual",
        json={
            "employee_name": "Invalid Type",
            "joining_date": "2018-01-01",
            "leaving_date": "2023-01-01",
            "last_drawn_salary": 20000,
            "employee_type": "invalid-type"  # Not a valid enum value
        }
    )
    assert response.status_code == 422  # Validation error

def test_bulk_calculation():
    # Test bulk calculation endpoint
    response = client.post(
        "/calculator/bulk",
        json={
            "employees": [
                {
                    "employee_name": "Eligible Employee",
                    "joining_date": "2018-01-01",
                    "leaving_date": "2023-01-01",
                    "last_drawn_salary": 30000
                },
                {
                    "employee_name": "Ineligible Employee",
                    "joining_date": "2020-01-01",
                    "leaving_date": "2023-01-01",
                    "last_drawn_salary": 25000
                },
                {
                    "employee_name": "Special Case",
                    "joining_date": "2022-01-01",
                    "leaving_date": "2023-01-01",
                    "last_drawn_salary": 35000,
                    "termination_reason": "death"
                }
            ]
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["results"]) == 3
    assert data["eligible_count"] == 2  # First and third employee
    assert data["ineligible_count"] == 1  # Second employee 