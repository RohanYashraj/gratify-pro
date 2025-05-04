'use client';

import React, { useState, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  Button,
  Input
} from '@/components/ui';
import { cn } from '@/lib/utils';

// API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Define types for our component
type FileErrorType = {
  message: string;
  type: 'error' | 'warning';
};

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'preview' | 'complete' | 'error';

type BulkResult = {
  results: Array<{
    employee_name: string;
    joining_date: string;
    leaving_date: string;
    last_drawn_salary: string;
    years_of_service: number;
    gratuity_amount: string;
    employee_type: string;
    termination_reason: string;
    is_eligible: boolean;
    message?: string;
  }>;
  total_gratuity_amount: string;
  eligible_count: number;
  ineligible_count: number;
};

const BulkCalculator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<FileErrorType | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [results, setResults] = useState<BulkResult | null>(null);
  const [sortField, setSortField] = useState<string>('employee_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterValue, setFilterValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFileError(null);
    setResults(null);
    setPreviewData([]);
    
    if (!selectedFile) {
      return;
    }

    // Validate file type
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      setFileError({
        message: 'Please upload a valid CSV or Excel file.',
        type: 'error'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFileError({
        message: 'File size exceeds 5MB limit.',
        type: 'error'
      });
      return;
    }

    setFile(selectedFile);
    setUploadStatus('preview');
    generatePreview(selectedFile);
  };

  // Download template file
  const handleTemplateDownload = (fileType: 'csv' | 'xlsx') => {
    // Construct the API URL with the file type
    const url = `${API_URL}/calculator/bulk/template?file_type=${fileType}`;
    
    // Create a hidden anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = `gratify_calculation_template.${fileType}`;
    document.body.appendChild(link);
    
    // Click the link to trigger the download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
  };

  // Generate preview of file content
  const generatePreview = async (file: File) => {
    // For CSV files, we can show a preview
    if (file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        // Process first 5 rows for preview
        const previewRows = [];
        for (let i = 1; i < Math.min(lines.length, 6); i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',');
          const row: any = {};
          
          headers.forEach((header, index) => {
            row[header.trim()] = values[index]?.trim() || '';
          });
          
          previewRows.push(row);
        }
        
        setPreviewData(previewRows);
      };
      reader.readAsText(file);
    } else {
      // For Excel files, we'll just show file info
      setPreviewData([{ note: 'Preview not available for Excel files. File will be processed on submission.' }]);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      // Simulate the file input change
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(droppedFile);
      
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        
        // Manually trigger the onChange event
        const event = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(event);
      }
    }
  };

  // Process file submission
  const handleSubmit = async () => {
    if (!file) return;
    
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    // Create a FormData object
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Simulated upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Send file to server
      const response = await fetch(`${API_URL}/calculator/bulk`, {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to process file');
      }
      
      setUploadStatus('processing');
      
      // Process the response
      const result = await response.json();
      setResults(result);
      setUploadStatus('complete');
    } catch (error) {
      setFileError({
        message: error instanceof Error ? error.message : 'An error occurred during file processing',
        type: 'error'
      });
      setUploadStatus('error');
    }
  };

  // Download results as CSV
  const handleDownload = () => {
    if (!results) return;
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    const headers = [
      "Employee Name",
      "Joining Date",
      "Leaving Date",
      "Last Drawn Salary",
      "Years of Service",
      "Gratify Amount",
      "Employee Type",
      "Termination Reason",
      "Eligible",
      "Message"
    ];
    csvContent += headers.join(",") + "\n";
    
    // Add rows
    results.results.forEach(row => {
      const rowData = [
        `"${row.employee_name}"`,
        row.joining_date,
        row.leaving_date,
        row.last_drawn_salary,
        row.years_of_service,
        row.gratuity_amount,
        row.employee_type,
        row.termination_reason,
        row.is_eligible ? "Yes" : "No",
        `"${row.message || ""}"`
      ];
      csvContent += rowData.join(",") + "\n";
    });
    
    // Create and trigger download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "gratify_calculations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sorted and filtered results
  const getSortedAndFilteredResults = () => {
    if (!results) return [];
    
    let filteredResults = [...results.results];
    
    // Apply filter
    if (filterValue) {
      const lowerFilter = filterValue.toLowerCase();
      filteredResults = filteredResults.filter(result => 
        result.employee_name.toLowerCase().includes(lowerFilter) ||
        result.employee_type.toLowerCase().includes(lowerFilter) ||
        result.termination_reason.toLowerCase().includes(lowerFilter)
      );
    }
    
    // Apply sorting
    return filteredResults.sort((a, b) => {
      // Handle different data types
      if (sortField === 'years_of_service' || sortField === 'gratuity_amount') {
        const aValue = sortField === 'gratuity_amount' 
          ? parseFloat(a[sortField]) 
          : a[sortField];
        const bValue = sortField === 'gratuity_amount' 
          ? parseFloat(b[sortField]) 
          : b[sortField];
        
        return sortDirection === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      } else {
        const aValue = String(a[sortField as keyof typeof a] || '').toLowerCase();
        const bValue = String(b[sortField as keyof typeof b] || '').toLowerCase();
        
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
    });
  };

  // Reset the form
  const handleReset = () => {
    setFile(null);
    setFileError(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    setPreviewData([]);
    setResults(null);
    setSortField('employee_name');
    setSortDirection('asc');
    setFilterValue('');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Render upload section
  const renderUploadSection = () => (
    <Card className="w-full mb-8 shadow-sm">
      <CardHeader>
        <CardTitle>Bulk Gratify Calculator</CardTitle>
        <CardDescription>
          Upload a file with employee data to calculate gratuity for multiple employees
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {fileError && (
          <div className={`mb-4 p-3 rounded ${fileError.type === 'error' ? 'bg-destructive/10 text-destructive border-l-4 border-destructive' : 'bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500'}`}>
            {fileError.message}
          </div>
        )}
        
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-12 text-center bg-gray-50 hover:border-primary hover:bg-gray-100 cursor-pointer flex flex-col items-center justify-center gap-6 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-gray-500">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
              <path d="M12 4V16M12 4L8 8M12 4L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L2.621 19.485C2.72915 19.9177 2.97882 20.3018 3.33033 20.5763C3.68184 20.8508 4.11501 21.0002 4.561 21H19.439C19.885 21.0002 20.3182 20.8508 20.6697 20.5763C21.0212 20.3018 21.2708 19.9177 21.379 19.485L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-medium text-gray-700">Drag and drop your file here</p>
            <p className="text-gray-500">- OR -</p>
            <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md font-medium transition-colors">
              Browse Files
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".csv,.xls,.xlsx"
          />
          
          <div className="text-sm text-gray-500 mt-4 max-w-md">
            <p>Accepted formats: CSV, Excel (.xls, .xlsx)</p>
            <p className="text-destructive mt-1">
              Required columns: employee_name, joining_date, leaving_date, last_drawn_salary
            </p>
            <p className="text-gray-500 mt-1">
              Optional columns: employee_type, termination_reason (empty or missing values will be treated as "unknown")
            </p>
          </div>
        </div>
        
        {file && (
          <div className="flex items-center mt-4 p-3 bg-gray-100 rounded-md gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium ml-1">{file.name}</span>
            <span className="text-gray-500 ml-1">({Math.round(file.size / 1024)} KB)</span>
            <button
              className="ml-auto text-2xl text-gray-500 hover:bg-gray-200 p-1 rounded-md transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              &times;
            </button>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <div className="mt-4">
          <p>Not sure about the format? Download a template:</p>
          <div className="flex gap-3 mt-2">
            <button
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
              onClick={() => handleTemplateDownload('csv')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              CSV Template
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
              onClick={() => handleTemplateDownload('xlsx')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Excel Template
            </button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );

  // Render progress indicator
  const renderProgress = () => (
    <div className="my-8 text-center">
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${uploadProgress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        {uploadStatus === 'uploading' 
          ? `Uploading: ${uploadProgress}%` 
          : 'Processing data...'}
      </p>
    </div>
  );

  // Render preview table
  const renderPreview = () => {
    if (previewData.length === 0) return null;
    
    return (
      <Card className="w-full mb-8 shadow-sm">
        <CardHeader>
          <CardTitle>File Preview</CardTitle>
          <CardDescription>
            {file?.name} ({Math.round(file?.size as number / 1024)} KB)
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Special case for Excel files */}
          {previewData[0]?.note ? (
            <div className="p-4 bg-gray-50 rounded-md text-gray-700">
              <p>{previewData[0].note}</p>
            </div>
          ) : (
            // Render CSV preview
            <div className="w-full">
              <h3 className="text-lg font-medium text-gray-800 mb-4">File Preview (First 5 rows)</h3>
              <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      {Object.keys(previewData[0]).map(header => (
                        <th key={header} className="bg-gray-100 p-3 text-left font-semibold text-gray-700 border-b border-gray-200">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((cell, cellIndex) => (
                          <td key={cellIndex} className="p-3 border-b border-gray-200 text-gray-700">
                            {String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between flex-col sm:flex-row gap-4">
          <Button 
            variant="outline" 
            onClick={handleReset}
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={uploadStatus === 'uploading' || uploadStatus === 'processing'}
          >
            Calculate Gratify
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Render results table
  const renderResults = () => {
    if (!results) return null;
    
    const sortedAndFilteredResults = getSortedAndFilteredResults();
    
    return (
      <Card className="w-full mb-8 shadow-sm">
        <CardHeader>
          <CardTitle>Bulk Calculation Results</CardTitle>
          <CardDescription>{`${results.results.length} employee records processed`}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="w-full">
            <div className="flex flex-wrap gap-6 p-4 mb-6 bg-gray-50 rounded-md">
              <div className="flex-1 min-w-[200px]">
                <span className="block font-medium text-gray-600 mb-1">Total Gratify Amount:</span>
                <span className="text-xl font-semibold text-primary">₹{Number(results.total_gratuity_amount).toLocaleString()}</span>
              </div>
              <div className="flex-1 min-w-[200px]">
                <span className="block font-medium text-gray-600 mb-1">Eligible Employees:</span>
                <span className="text-xl font-semibold text-primary">{results.eligible_count}</span>
              </div>
              <div className="flex-1 min-w-[200px]">
                <span className="block font-medium text-gray-600 mb-1">Ineligible Employees:</span>
                <span className="text-xl font-semibold text-primary">{results.ineligible_count}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder="Filter by name, type or reason..."
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary/25 focus:border-primary"
              />
            </div>
            
            <div className="w-full overflow-x-auto mb-4">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('employee_name')} className="bg-gray-100 p-3 text-left font-semibold text-gray-700 border-b border-gray-200 cursor-pointer relative pr-8">
                      Employee Name
                      {sortField === 'employee_name' && 
                        <span className="absolute right-2 top-1/2 -translate-y-1/2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      }
                    </th>
                    <th onClick={() => handleSort('joining_date')} className="bg-gray-100 p-3 text-left font-semibold text-gray-700 border-b border-gray-200 cursor-pointer relative pr-8">
                      Joining Date
                      {sortField === 'joining_date' && 
                        <span className="absolute right-2 top-1/2 -translate-y-1/2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      }
                    </th>
                    <th onClick={() => handleSort('leaving_date')} className="bg-gray-100 p-3 text-left font-semibold text-gray-700 border-b border-gray-200 cursor-pointer relative pr-8">
                      Leaving Date
                      {sortField === 'leaving_date' && 
                        <span className="absolute right-2 top-1/2 -translate-y-1/2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      }
                    </th>
                    <th onClick={() => handleSort('last_drawn_salary')} className="bg-gray-100 p-3 text-left font-semibold text-gray-700 border-b border-gray-200 cursor-pointer relative pr-8">
                      Salary
                      {sortField === 'last_drawn_salary' && 
                        <span className="absolute right-2 top-1/2 -translate-y-1/2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      }
                    </th>
                    <th onClick={() => handleSort('years_of_service')} className="bg-gray-100 p-3 text-left font-semibold text-gray-700 border-b border-gray-200 cursor-pointer relative pr-8">
                      Service Years
                      {sortField === 'years_of_service' && 
                        <span className="absolute right-2 top-1/2 -translate-y-1/2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      }
                    </th>
                    <th onClick={() => handleSort('gratuity_amount')} className="bg-gray-100 p-3 text-left font-semibold text-gray-700 border-b border-gray-200 cursor-pointer relative pr-8">
                      Gratify Amount
                      {sortField === 'gratuity_amount' && 
                        <span className="absolute right-2 top-1/2 -translate-y-1/2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      }
                    </th>
                    <th onClick={() => handleSort('employee_type')} className="bg-gray-100 p-3 text-left font-semibold text-gray-700 border-b border-gray-200 cursor-pointer relative pr-8">
                      Type
                      {sortField === 'employee_type' && 
                        <span className="absolute right-2 top-1/2 -translate-y-1/2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      }
                    </th>
                    <th onClick={() => handleSort('termination_reason')} className="bg-gray-100 p-3 text-left font-semibold text-gray-700 border-b border-gray-200 cursor-pointer relative pr-8">
                      Reason
                      {sortField === 'termination_reason' && 
                        <span className="absolute right-2 top-1/2 -translate-y-1/2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      }
                    </th>
                    <th onClick={() => handleSort('is_eligible')} className="bg-gray-100 p-3 text-left font-semibold text-gray-700 border-b border-gray-200 cursor-pointer relative pr-8">
                      Eligible
                      {sortField === 'is_eligible' && 
                        <span className="absolute right-2 top-1/2 -translate-y-1/2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      }
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAndFilteredResults.map((result, index) => (
                    <tr key={index} className={!result.is_eligible ? 'bg-amber-50' : ''}>
                      <td className="p-3 border-b border-gray-200">{result.employee_name}</td>
                      <td className="p-3 border-b border-gray-200">{new Date(result.joining_date).toLocaleDateString()}</td>
                      <td className="p-3 border-b border-gray-200">{new Date(result.leaving_date).toLocaleDateString()}</td>
                      <td className="p-3 border-b border-gray-200">₹{Number(result.last_drawn_salary).toLocaleString()}</td>
                      <td className="p-3 border-b border-gray-200">{result.years_of_service}</td>
                      <td className="p-3 border-b border-gray-200">₹{Number(result.gratuity_amount).toLocaleString()}</td>
                      <td className="p-3 border-b border-gray-200">{result.employee_type === 'standard' ? 'Standard' : 'Non-Covered'}</td>
                      <td className="p-3 border-b border-gray-200">{result.termination_reason.charAt(0).toUpperCase() + result.termination_reason.slice(1)}</td>
                      <td className="p-3 border-b border-gray-200">{result.is_eligible ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {sortedAndFilteredResults.length === 0 && (
              <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-md">
                No results match your filter criteria.
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between flex-col sm:flex-row gap-4">
          <Button 
            variant="outline" 
            onClick={handleReset}
          >
            Upload Another File
          </Button>
          
          <Button
            onClick={handleDownload}
          >
            Download Results (CSV)
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {uploadStatus === 'idle' && renderUploadSection()}
      {(uploadStatus === 'uploading' || uploadStatus === 'processing') && (
        <>
          {renderUploadSection()}
          {renderProgress()}
        </>
      )}
      {uploadStatus === 'preview' && renderPreview()}
      {uploadStatus === 'complete' && results && renderResults()}
      {uploadStatus === 'error' && renderUploadSection()}
    </div>
  );
};

export default BulkCalculator; 