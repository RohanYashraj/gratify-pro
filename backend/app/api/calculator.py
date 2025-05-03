from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import List
import pandas as pd
import io
from ..schemas import IndividualCalculatorInput, GratuityResult, BulkCalculatorInput, BulkCalculationResult
from ..services.calculator import calculate_individual_gratuity, calculate_bulk_gratuity

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
    - **employee_type**: Type of employee (standard or non-covered)
    - **termination_reason**: Reason for employment termination
    
    Returns the calculated gratuity amount and related information.
    """
    try:
        result = calculate_individual_gratuity(
            employee_name=calculator_input.employee_name,
            joining_date=calculator_input.joining_date,
            leaving_date=calculator_input.leaving_date,
            last_drawn_salary=calculator_input.last_drawn_salary,
            employee_type=calculator_input.employee_type,
            termination_reason=calculator_input.termination_reason
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/bulk", response_model=BulkCalculationResult)
async def calculate_bulk(bulk_input: BulkCalculatorInput):
    """
    Calculate gratuity for multiple employees.
    
    Accepts a list of employee records and calculates gratuity for each one.
    Returns the individual results as well as aggregated statistics.
    """
    try:
        result = calculate_bulk_gratuity(bulk_input.employees)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/upload")
async def calculate_from_file(file: UploadFile = File(...)):
    """
    Calculate gratuity from uploaded Excel or CSV file.
    
    File should have columns:
    - employee_name
    - joining_date (YYYY-MM-DD)
    - leaving_date (YYYY-MM-DD)
    - last_drawn_salary
    - employee_type (optional)
    - termination_reason (optional)
    """
    try:
        # Read the file content
        contents = await file.read()
        
        # Determine file type and parse accordingly
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Only CSV and Excel files are supported")
        
        # Validate required columns
        required_columns = ['employee_name', 'joining_date', 'leaving_date', 'last_drawn_salary']
        for col in required_columns:
            if col not in df.columns:
                raise HTTPException(status_code=400, detail=f"Missing required column: {col}")
                
        # Convert to list of inputs
        employees = []
        for _, row in df.iterrows():
            try:
                employee_data = {
                    'employee_name': row['employee_name'],
                    'joining_date': pd.to_datetime(row['joining_date']).date(),
                    'leaving_date': pd.to_datetime(row['leaving_date']).date(),
                    'last_drawn_salary': row['last_drawn_salary'],
                }
                
                # Add optional fields if present
                if 'employee_type' in df.columns:
                    employee_data['employee_type'] = row['employee_type']
                if 'termination_reason' in df.columns:
                    employee_data['termination_reason'] = row['termination_reason']
                    
                employees.append(IndividualCalculatorInput(**employee_data))
            except Exception as e:
                # Skip invalid rows but continue processing
                continue
                
        # Calculate results
        result = calculate_bulk_gratuity(employees)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 