import io
import pandas as pd
from fastapi.testclient import TestClient
from fastapi import UploadFile
from unittest.mock import patch, MagicMock
from decimal import Decimal

from app.main import app
from app.schemas.calculator import IndividualCalculatorInput, EmployeeType, TerminationReason
from app.services.calculator import calculate_bulk_gratuity

client = TestClient(app)

def create_test_csv():
    """Create a test CSV file for upload testing"""
    data = {
        'employee_name': ['John Doe', 'Jane Smith'],
        'joining_date': ['2015-01-01', '2010-06-15'],
        'leaving_date': ['2023-01-01', '2023-01-01'],
        'last_drawn_salary': [25000, 35000],
        'employee_type': ['standard', 'non-covered'],
        'termination_reason': ['resignation', 'retirement']
    }
    
    df = pd.DataFrame(data)
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False)
    csv_buffer.seek(0)
    
    return csv_buffer.getvalue().encode('utf-8')

def create_test_excel():
    """Create a test Excel file for upload testing"""
    data = {
        'employee_name': ['John Doe', 'Jane Smith'],
        'joining_date': ['2015-01-01', '2010-06-15'],
        'leaving_date': ['2023-01-01', '2023-01-01'],
        'last_drawn_salary': [25000, 35000],
        'employee_type': ['standard', 'non-covered'],
        'termination_reason': ['resignation', 'retirement']
    }
    
    df = pd.DataFrame(data)
    excel_buffer = io.BytesIO()
    df.to_excel(excel_buffer, index=False)
    excel_buffer.seek(0)
    
    return excel_buffer.getvalue()

def test_bulk_calculation_service():
    """Test the bulk calculation service function"""
    employees = [
        IndividualCalculatorInput(
            employee_name="John Doe",
            joining_date="2015-01-01",
            leaving_date="2023-01-01",
            last_drawn_salary=Decimal("25000"),
            employee_type=EmployeeType.STANDARD,
            termination_reason=TerminationReason.RESIGNATION
        ),
        IndividualCalculatorInput(
            employee_name="Jane Smith",
            joining_date="2010-06-15",
            leaving_date="2023-01-01",
            last_drawn_salary=Decimal("35000"),
            employee_type=EmployeeType.NON_COVERED,
            termination_reason=TerminationReason.RETIREMENT
        )
    ]
    
    result = calculate_bulk_gratuity(employees)
    
    # Verify the result structure
    assert len(result["results"]) == 2
    assert result["eligible_count"] + result["ineligible_count"] == 2
    assert "total_gratuity_amount" in result
    
    # Check specific employee results
    assert result["results"][0]["employee_name"] == "John Doe"
    assert result["results"][1]["employee_name"] == "Jane Smith"
    
    # Check calculations
    assert result["results"][0]["years_of_service"] == 8
    assert result["results"][0]["is_eligible"] == True

@patch('app.api.calculator.calculate_bulk_gratuity')
def test_calculate_bulk_api_csv(mock_calculate):
    """Test the /calculator/bulk endpoint with CSV upload"""
    # Mock the calculation service 
    mock_calculate.return_value = {
        "results": [
            {
                "employee_name": "John Doe",
                "joining_date": "2015-01-01",
                "leaving_date": "2023-01-01",
                "last_drawn_salary": "25000",
                "years_of_service": 8,
                "gratuity_amount": "115384.62",
                "employee_type": "standard",
                "termination_reason": "resignation",
                "is_eligible": True,
                "message": None
            },
            {
                "employee_name": "Jane Smith",
                "joining_date": "2010-06-15",
                "leaving_date": "2023-01-01",
                "last_drawn_salary": "35000",
                "years_of_service": 12.5,
                "gratuity_amount": "218750.00",
                "employee_type": "non-covered",
                "termination_reason": "retirement",
                "is_eligible": True,
                "message": None
            }
        ],
        "total_gratuity_amount": "334134.62",
        "eligible_count": 2,
        "ineligible_count": 0
    }
    
    # Create test CSV content
    test_csv = create_test_csv()
    
    # Make request to endpoint
    response = client.post(
        "/calculator/bulk",
        files={"file": ("test.csv", test_csv, "text/csv")}
    )
    
    # Assertions
    assert response.status_code == 200
    result = response.json()
    
    assert len(result["results"]) == 2
    assert result["total_gratuity_amount"] == "334134.62"
    assert result["eligible_count"] == 2
    assert result["ineligible_count"] == 0

@patch('app.api.calculator.calculate_bulk_gratuity')
def test_calculate_bulk_api_excel(mock_calculate):
    """Test the /calculator/bulk endpoint with Excel upload"""
    # Mock the calculation service 
    mock_calculate.return_value = {
        "results": [
            {
                "employee_name": "John Doe",
                "joining_date": "2015-01-01",
                "leaving_date": "2023-01-01",
                "last_drawn_salary": "25000",
                "years_of_service": 8,
                "gratuity_amount": "115384.62",
                "employee_type": "standard",
                "termination_reason": "resignation",
                "is_eligible": True,
                "message": None
            },
            {
                "employee_name": "Jane Smith",
                "joining_date": "2010-06-15",
                "leaving_date": "2023-01-01",
                "last_drawn_salary": "35000",
                "years_of_service": 12.5,
                "gratuity_amount": "218750.00",
                "employee_type": "non-covered",
                "termination_reason": "retirement",
                "is_eligible": True,
                "message": None
            }
        ],
        "total_gratuity_amount": "334134.62",
        "eligible_count": 2,
        "ineligible_count": 0
    }
    
    # Create test Excel content
    test_excel = create_test_excel()
    
    # Make request to endpoint
    response = client.post(
        "/calculator/bulk",
        files={"file": ("test.xlsx", test_excel, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
    )
    
    # Assertions
    assert response.status_code == 200
    result = response.json()
    
    assert len(result["results"]) == 2
    assert result["total_gratuity_amount"] == "334134.62"
    assert result["eligible_count"] == 2
    assert result["ineligible_count"] == 0

def test_calculate_bulk_invalid_file_type():
    """Test the /calculator/bulk endpoint with an invalid file type"""
    # Create test content for invalid file
    test_content = b"This is not a CSV or Excel file"
    
    # Make request to endpoint with invalid file
    response = client.post(
        "/calculator/bulk",
        files={"file": ("test.txt", test_content, "text/plain")}
    )
    
    # Assertions
    assert response.status_code == 400
    assert "CSV or Excel" in response.json()["detail"]

def test_calculate_bulk_missing_columns():
    """Test the /calculator/bulk endpoint with a file missing required columns"""
    # Create a DataFrame with missing columns
    data = {
        'employee_name': ['John Doe', 'Jane Smith'],
        # Missing joining_date
        'leaving_date': ['2023-01-01', '2023-01-01'],
        'last_drawn_salary': [25000, 35000]
    }
    
    df = pd.DataFrame(data)
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False)
    csv_buffer.seek(0)
    test_csv = csv_buffer.getvalue().encode('utf-8')
    
    # Make request to endpoint
    response = client.post(
        "/calculator/bulk",
        files={"file": ("test.csv", test_csv, "text/csv")}
    )
    
    # Assertions
    assert response.status_code == 400
    assert "missing required columns" in response.json()["detail"] 