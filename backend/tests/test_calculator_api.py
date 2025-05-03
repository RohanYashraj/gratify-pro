from fastapi.testclient import TestClient
from datetime import date
from decimal import Decimal

from app.main import app

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
    assert "less than 5 years" in data["message"]

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