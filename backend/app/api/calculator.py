from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import List
import pandas as pd
import io
from ..schemas import IndividualCalculatorInput, GratuityResult, BulkCalculatorInput, BulkCalculationResult
from ..services.calculator import calculate_individual_gratuity, calculate_bulk_gratuity
from fastapi.responses import StreamingResponse

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
    - **employee_type**: Type of employee (standard, non-covered)
    - **termination_reason**: Reason for termination (resignation, retirement, death, disability)
    
    Returns the calculated gratuity amount and related information.
    """
    result = calculate_individual_gratuity(
        employee_name=calculator_input.employee_name,
        joining_date=calculator_input.joining_date,
        leaving_date=calculator_input.leaving_date,
        last_drawn_salary=calculator_input.last_drawn_salary,
        employee_type=calculator_input.employee_type,
        termination_reason=calculator_input.termination_reason
    )
    
    return result

@router.post("/bulk", response_model=BulkCalculationResult)
async def calculate_bulk(file: UploadFile = File(...)):
    """
    Calculate gratuity for multiple employees from a CSV or Excel file.
    
    The file should contain columns for:
    - employee_name
    - joining_date (YYYY-MM-DD)
    - leaving_date (YYYY-MM-DD)
    - last_drawn_salary
    - employee_type (optional, default: standard)
    - termination_reason (optional, default: resignation)
    
    Returns results for all employees and summary statistics.
    """
    # Check file extension
    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in ["csv", "xlsx", "xls"]:
        raise HTTPException(
            status_code=400, 
            detail="File must be a CSV or Excel file (.csv, .xlsx, .xls)"
        )
    
    # Read the file content
    contents = await file.read()
    
    try:
        # Parse the file based on its format
        if file_extension == "csv":
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        else:  # Excel
            df = pd.read_excel(io.BytesIO(contents))
        
        # Check if the required columns exist
        required_columns = ["employee_name", "joining_date", "leaving_date", "last_drawn_salary"]
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            raise HTTPException(
                status_code=400, 
                detail=f"File is missing required columns: {', '.join(missing_columns)}"
            )
        
        # Convert the dataframe to a list of IndividualCalculatorInput objects
        employees = []
        
        for _, row in df.iterrows():
            employee_data = {
                "employee_name": row["employee_name"],
                "joining_date": pd.to_datetime(row["joining_date"]).date(),
                "leaving_date": pd.to_datetime(row["leaving_date"]).date(),
                "last_drawn_salary": float(row["last_drawn_salary"]),
                # Use defaults if optional columns are missing
                "employee_type": row.get("employee_type", "standard"),
                "termination_reason": row.get("termination_reason", "resignation")
            }
            
            # Create model object
            employee = IndividualCalculatorInput(**employee_data)
            employees.append(employee)
        
        # Calculate bulk results
        result = calculate_bulk_gratuity(employees)
        
        return result
    
    except pd.errors.ParserError:
        raise HTTPException(
            status_code=400, 
            detail="Error parsing file. Please ensure the file is properly formatted."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred while processing the file: {str(e)}"
        )

@router.get("/bulk/template", response_class=StreamingResponse)
async def download_template(file_type: str = "csv"):
    """
    Download a template file for bulk gratuity calculations.
    
    - **file_type**: Type of file to download (csv or excel)
    
    Returns a template file with the required columns for bulk calculations.
    """
    # Create sample data with headers and one example row
    data = {
        "employee_name": ["John Doe"],
        "joining_date": ["2015-01-01"],
        "leaving_date": ["2023-01-01"],
        "last_drawn_salary": [25000],
        "employee_type": ["standard"],  # Options: standard, non-covered
        "termination_reason": ["resignation"]  # Options: resignation, retirement, death, disability
    }
    
    df = pd.DataFrame(data)
    
    if file_type.lower() == "excel" or file_type.lower() == "xlsx":
        # Create an Excel file
        output = io.BytesIO()
        df.to_excel(output, index=False)
        output.seek(0)
        
        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=gratuity_calculation_template.xlsx"}
        )
    else:
        # Default to CSV
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)
        
        return StreamingResponse(
            output,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=gratuity_calculation_template.csv"}
        )

@router.post("/bulk/download")
async def download_bulk_results():
    """
    Generate a downloadable file with calculation results.
    This endpoint will be implemented in a future task.
    """
    # This will be implemented later
    raise HTTPException(status_code=501, detail="Endpoint not implemented yet") 