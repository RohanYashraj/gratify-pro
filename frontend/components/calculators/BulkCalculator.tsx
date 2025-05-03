'use client';

import React, { useState, useRef } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  Button,
  CardTitle,
  CardDescription 
} from '../../components/ui';
import styles from './BulkCalculator.module.css';

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
    const url = `http://localhost:8000/calculator/bulk/template?file_type=${fileType}`;
    
    // Create a hidden anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = `gratuity_calculation_template.${fileType}`;
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
      const response = await fetch('http://localhost:8000/calculator/bulk', {
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
      "Gratuity Amount",
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
    link.setAttribute("download", "gratuity_calculations.csv");
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
    <>
      <div 
        className={styles.uploadArea}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className={styles.uploadIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div className={styles.uploadText}>
          <p>Drag and drop your file here</p>
          <p className={styles.uploadOr}>- OR -</p>
          <input
            ref={fileInputRef}
            type="file"
            id="file-upload"
            className={styles.fileInput}
            accept=".csv,.xls,.xlsx"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload" className={styles.fileButton}>
            Browse Files
          </label>
          <p className={styles.uploadHint}>
            Accepted formats: CSV, Excel (.xls, .xlsx)
          </p>
          <p className={styles.requiredFields}>
            Required columns: employee_name, joining_date, leaving_date, last_drawn_salary
          </p>
          <p className={styles.optionalFields}>
            Optional columns: employee_type, termination_reason (empty or missing values will be treated as "unknown")
          </p>
        </div>
      </div>
      
      <div className={styles.templateDownloadSection}>
        <p>Not sure about the format? Download a template:</p>
        <div className={styles.templateButtons}>
          <button 
            onClick={() => handleTemplateDownload('csv')}
            className={styles.templateButton}
          >
            CSV Template
          </button>
          <button 
            onClick={() => handleTemplateDownload('xlsx')}
            className={styles.templateButton}
          >
            Excel Template
          </button>
        </div>
      </div>
    </>
  );

  // Render progress indicator
  const renderProgress = () => (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${uploadProgress}%` }}
        ></div>
      </div>
      <p className={styles.progressText}>
        {uploadStatus === 'uploading' 
          ? `Uploading: ${uploadProgress}%` 
          : 'Processing data...'}
      </p>
    </div>
  );

  // Render preview table
  const renderPreview = () => {
    if (previewData.length === 0) return null;
    
    // Special case for Excel files
    if (previewData[0]?.note) {
      return (
        <div className={styles.previewInfo}>
          <p>{previewData[0].note}</p>
          <p>File: {file?.name} ({Math.round(file?.size as number / 1024)} KB)</p>
        </div>
      );
    }
    
    // Render CSV preview
    return (
      <div className={styles.previewContainer}>
        <h3 className={styles.previewTitle}>File Preview (First 5 rows)</h3>
        <div className={styles.tableContainer}>
          <table className={styles.previewTable}>
            <thead>
              <tr>
                {Object.keys(previewData[0]).map(header => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((cell, cellIndex) => (
                    <td key={cellIndex}>{String(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render results table
  const renderResults = () => {
    if (!results) return null;
    
    const sortedAndFilteredResults = getSortedAndFilteredResults();
    
    return (
      <div className={styles.resultsContainer}>
        <div className={styles.resultsSummary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total Gratuity Amount:</span>
            <span className={styles.summaryValue}>₹{Number(results.total_gratuity_amount).toLocaleString()}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Eligible Employees:</span>
            <span className={styles.summaryValue}>{results.eligible_count}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Ineligible Employees:</span>
            <span className={styles.summaryValue}>{results.ineligible_count}</span>
          </div>
        </div>
        
        <div className={styles.filterContainer}>
          <input
            type="text"
            placeholder="Filter by name, type or reason..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className={styles.filterInput}
          />
        </div>
        
        <div className={styles.tableContainer}>
          <table className={styles.resultsTable}>
            <thead>
              <tr>
                <th onClick={() => handleSort('employee_name')} className={styles.sortableHeader}>
                  Employee Name
                  {sortField === 'employee_name' && 
                    <span className={styles.sortIcon}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  }
                </th>
                <th onClick={() => handleSort('joining_date')} className={styles.sortableHeader}>
                  Joining Date
                  {sortField === 'joining_date' && 
                    <span className={styles.sortIcon}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  }
                </th>
                <th onClick={() => handleSort('leaving_date')} className={styles.sortableHeader}>
                  Leaving Date
                  {sortField === 'leaving_date' && 
                    <span className={styles.sortIcon}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  }
                </th>
                <th onClick={() => handleSort('last_drawn_salary')} className={styles.sortableHeader}>
                  Salary
                  {sortField === 'last_drawn_salary' && 
                    <span className={styles.sortIcon}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  }
                </th>
                <th onClick={() => handleSort('years_of_service')} className={styles.sortableHeader}>
                  Service Years
                  {sortField === 'years_of_service' && 
                    <span className={styles.sortIcon}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  }
                </th>
                <th onClick={() => handleSort('gratuity_amount')} className={styles.sortableHeader}>
                  Gratuity Amount
                  {sortField === 'gratuity_amount' && 
                    <span className={styles.sortIcon}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  }
                </th>
                <th onClick={() => handleSort('employee_type')} className={styles.sortableHeader}>
                  Type
                  {sortField === 'employee_type' && 
                    <span className={styles.sortIcon}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  }
                </th>
                <th onClick={() => handleSort('termination_reason')} className={styles.sortableHeader}>
                  Reason
                  {sortField === 'termination_reason' && 
                    <span className={styles.sortIcon}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  }
                </th>
                <th onClick={() => handleSort('is_eligible')} className={styles.sortableHeader}>
                  Eligible
                  {sortField === 'is_eligible' && 
                    <span className={styles.sortIcon}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  }
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredResults.map((result, index) => (
                <tr key={index} className={!result.is_eligible ? styles.ineligibleRow : ''}>
                  <td>{result.employee_name}</td>
                  <td>{new Date(result.joining_date).toLocaleDateString()}</td>
                  <td>{new Date(result.leaving_date).toLocaleDateString()}</td>
                  <td>₹{Number(result.last_drawn_salary).toLocaleString()}</td>
                  <td>{result.years_of_service}</td>
                  <td>₹{Number(result.gratuity_amount).toLocaleString()}</td>
                  <td>{result.employee_type === 'standard' ? 'Standard' : 'Non-Covered'}</td>
                  <td>{result.termination_reason.charAt(0).toUpperCase() + result.termination_reason.slice(1)}</td>
                  <td>{result.is_eligible ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedAndFilteredResults.length === 0 && (
          <div className={styles.noResults}>
            No results match your filter criteria.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* File Upload Card */}
      {uploadStatus !== 'complete' && (
        <Card className={styles.card}>
          <CardHeader>
            <CardTitle>Bulk Gratuity Calculator</CardTitle>
            <CardDescription>Upload a file with employee data to calculate gratuity for multiple employees</CardDescription>
          </CardHeader>
          <CardContent>
            {fileError && (
              <div className={`${styles.fileError} ${styles[fileError.type]}`}>
                {fileError.message}
              </div>
            )}
            
            {uploadStatus === 'idle' ? (
              renderUploadSection()
            ) : uploadStatus === 'uploading' || uploadStatus === 'processing' ? (
              renderProgress()
            ) : (
              <>
                <div className={styles.fileInfo}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className={styles.fileName}>{file?.name}</span>
                  <span className={styles.fileSize}>({Math.round(file?.size as number / 1024)} KB)</span>
                  <button 
                    className={styles.fileRemove}
                    onClick={handleReset}
                    title="Remove file"
                  >
                    ×
                  </button>
                </div>
                
                {renderPreview()}
              </>
            )}
          </CardContent>
          
          {file && uploadStatus === 'preview' && (
            <CardFooter>
              <div className={styles.actionButtons}>
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                >
                  Cancel
                </Button>
                <Button 
                  variant="default"
                  onClick={handleSubmit}
                >
                  Calculate Gratuity
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      )}
      
      {/* Results Card */}
      {uploadStatus === 'complete' && results && (
        <Card className={styles.resultCard}>
          <CardHeader>
            <CardTitle>Bulk Calculation Results</CardTitle>
            <CardDescription>{`${results.results.length} employee records processed`}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderResults()}
          </CardContent>
          <CardFooter>
            <div className={styles.actionButtons}>
              <Button 
                variant="outline" 
                onClick={handleReset}
              >
                Upload Another File
              </Button>
              <Button 
                variant="default"
                onClick={handleDownload}
              >
                Download Results (CSV)
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default BulkCalculator; 