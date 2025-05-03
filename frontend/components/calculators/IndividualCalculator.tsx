'use client';

import React, { useState } from 'react';
import { Form, FormGroup } from '../../components/ui/Form';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardFooter } from '../../components/ui';
import styles from './IndividualCalculator.module.css';

interface FormData {
  employee_name: string;
  joining_date: string;
  leaving_date: string;
  last_drawn_salary: string;
  employee_type: string;
  termination_reason: string;
}

interface FormErrors {
  employee_name?: string;
  joining_date?: string;
  leaving_date?: string;
  last_drawn_salary?: string;
}

interface CalculationResult {
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
}

export default function IndividualCalculator() {
  const [formData, setFormData] = useState<FormData>({
    employee_name: '',
    joining_date: '',
    leaving_date: '',
    last_drawn_salary: '',
    employee_type: 'standard',
    termination_reason: 'resignation'
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.employee_name.trim()) {
      newErrors.employee_name = 'Employee name is required';
      isValid = false;
    }

    if (!formData.joining_date) {
      newErrors.joining_date = 'Joining date is required';
      isValid = false;
    }

    if (!formData.leaving_date) {
      newErrors.leaving_date = 'Leaving date is required';
      isValid = false;
    } else if (formData.joining_date && new Date(formData.leaving_date) <= new Date(formData.joining_date)) {
      newErrors.leaving_date = 'Leaving date must be after joining date';
      isValid = false;
    }

    if (!formData.last_drawn_salary) {
      newErrors.last_drawn_salary = 'Last drawn salary is required';
      isValid = false;
    } else if (isNaN(Number(formData.last_drawn_salary)) || Number(formData.last_drawn_salary) <= 0) {
      newErrors.last_drawn_salary = 'Please enter a valid positive amount';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/calculator/individual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_name: formData.employee_name,
          joining_date: formData.joining_date,
          leaving_date: formData.leaving_date,
          last_drawn_salary: Number(formData.last_drawn_salary),
          employee_type: formData.employee_type,
          termination_reason: formData.termination_reason
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to calculate gratuity');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      employee_name: '',
      joining_date: '',
      leaving_date: '',
      last_drawn_salary: '',
      employee_type: 'standard',
      termination_reason: 'resignation'
    });
    setErrors({});
    setApiError(null);
    setResult(null);
  };

  return (
    <div className={styles.container}>
      {!result ? (
        <Card className={styles.formCard}>
          <CardHeader
            title="Employee Details"
            subtitle="Enter employee information to calculate gratuity amount"
          />
          <CardContent>
            {apiError && (
              <div className={styles.errorMessage}>
                {apiError}
              </div>
            )}
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Input
                  label="Employee Name"
                  name="employee_name"
                  value={formData.employee_name}
                  onChange={handleChange}
                  placeholder="Enter employee's full name"
                  error={errors.employee_name}
                  fullWidth
                  required
                />
              </FormGroup>

              <FormGroup direction="row">
                <Input
                  label="Joining Date"
                  name="joining_date"
                  type="date"
                  value={formData.joining_date}
                  onChange={handleChange}
                  error={errors.joining_date}
                  fullWidth
                  required
                />
                <Input
                  label="Leaving Date"
                  name="leaving_date"
                  type="date"
                  value={formData.leaving_date}
                  onChange={handleChange}
                  error={errors.leaving_date}
                  fullWidth
                  required
                />
              </FormGroup>

              <FormGroup>
                <Input
                  label="Last Drawn Salary (₹)"
                  name="last_drawn_salary"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.last_drawn_salary}
                  onChange={handleChange}
                  placeholder="Enter basic salary + dearness allowance"
                  error={errors.last_drawn_salary}
                  fullWidth
                  required
                />
              </FormGroup>

              <FormGroup direction="row">
                <div className={styles.selectGroup}>
                  <label htmlFor="employee_type" className={styles.label}>Employee Type</label>
                  <select
                    id="employee_type"
                    name="employee_type"
                    value={formData.employee_type}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="standard">Standard (Covered under Act)</option>
                    <option value="non-covered">Non-Covered</option>
                  </select>
                </div>

                <div className={styles.selectGroup}>
                  <label htmlFor="termination_reason" className={styles.label}>Termination Reason</label>
                  <select
                    id="termination_reason"
                    name="termination_reason"
                    value={formData.termination_reason}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="resignation">Resignation</option>
                    <option value="retirement">Retirement</option>
                    <option value="death">Death</option>
                    <option value="disability">Disability</option>
                  </select>
                </div>
              </FormGroup>

              <div className={styles.buttonGroup}>
                <Button type="submit" variant="primary" isLoading={isLoading}>
                  Calculate Gratuity
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card className={styles.resultCard}>
          <CardHeader
            title="Gratuity Calculation Result"
            subtitle={`For ${result.employee_name}`}
          />
          <CardContent>
            <div className={styles.resultContent}>
              {!result.is_eligible ? (
                <div className={styles.notEligible}>
                  <h3>Not Eligible for Gratuity</h3>
                  {result.message && <p>{result.message}</p>}
                </div>
              ) : (
                <>
                  <div className={styles.resultAmount}>
                    <h3>Gratuity Amount</h3>
                    <div className={styles.amount}>₹{result.gratuity_amount}</div>
                  </div>
                
                  <div className={styles.resultDetails}>
                    <div className={styles.resultRow}>
                      <span>Service Period:</span>
                      <span>{result.years_of_service} years</span>
                    </div>
                    <div className={styles.resultRow}>
                      <span>Last Drawn Salary:</span>
                      <span>₹{result.last_drawn_salary}</span>
                    </div>
                    <div className={styles.resultRow}>
                      <span>Joining Date:</span>
                      <span>{new Date(result.joining_date).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.resultRow}>
                      <span>Leaving Date:</span>
                      <span>{new Date(result.leaving_date).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.resultRow}>
                      <span>Employee Type:</span>
                      <span>{result.employee_type === 'standard' ? 'Standard' : 'Non-Covered'}</span>
                    </div>
                    <div className={styles.resultRow}>
                      <span>Termination Reason:</span>
                      <span>{result.termination_reason.charAt(0).toUpperCase() + result.termination_reason.slice(1)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="primary" onClick={handleReset}>
              Calculate Another
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
} 