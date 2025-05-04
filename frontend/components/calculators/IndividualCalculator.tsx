'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardFooter,
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui';
import {
  Select,
  SelectContent, 
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const formSchema = z.object({
  employee_name: z.string().min(1, { message: 'Employee name is required' }),
  joining_date: z.string().min(1, { message: 'Joining date is required' }),
  leaving_date: z.string().min(1, { message: 'Leaving date is required' }),
  last_drawn_salary: z.string().min(1, { message: 'Salary is required' }).refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: 'Please enter a valid positive amount' }
  ),
  employee_type: z.enum(['standard', 'non-covered']),
  termination_reason: z.enum(['resignation', 'retirement', 'death', 'disability']),
});

type FormValues = z.infer<typeof formSchema>;

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
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee_name: '',
      joining_date: '',
      leaving_date: '',
      last_drawn_salary: '',
      employee_type: 'standard',
      termination_reason: 'resignation',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setApiError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/calculator/individual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_name: data.employee_name,
          joining_date: data.joining_date,
          leaving_date: data.leaving_date,
          last_drawn_salary: Number(data.last_drawn_salary),
          employee_type: data.employee_type,
          termination_reason: data.termination_reason
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to calculate gratuity');
      }

      const resultData = await response.json();
      setResult(resultData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setApiError(null);
    setResult(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full">
      {!result ? (
        <Card className="shadow-sm">
          <CardHeader>
            <h3 className="text-2xl font-semibold tracking-tight">Employee Details</h3>
            <p className="text-sm text-muted-foreground">
              Enter employee information to calculate gratuity amount
            </p>
          </CardHeader>
          <CardContent>
            {apiError && (
              <div className="p-3 mb-4 text-destructive-foreground bg-destructive/10 rounded border border-destructive">
                {apiError}
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="employee_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter employee's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="joining_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Joining Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="leaving_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Leaving Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="last_drawn_salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Drawn Salary (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter basic salary + dearness allowance" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="employee_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employee type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">Standard (Covered under Act)</SelectItem>
                            <SelectItem value="non-covered">Non-Covered</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="termination_reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Termination Reason</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select termination reason" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="resignation">Resignation</SelectItem>
                            <SelectItem value="retirement">Retirement</SelectItem>
                            <SelectItem value="death">Death</SelectItem>
                            <SelectItem value="disability">Disability</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4 justify-end pt-2">
                  <Button type="button" variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Calculating...' : 'Calculate Gratuity'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardHeader>
            <h3 className="text-2xl font-semibold tracking-tight">Gratuity Calculation Result</h3>
            <p className="text-sm text-muted-foreground">
              Calculated based on the provided employee details
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {!result.is_eligible && (
                <div className="p-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
                  <strong>Note:</strong> {result.message || 'Employee is not eligible for gratuity.'}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Employee Name</h4>
                  <p className="text-lg">{result.employee_name}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Employment Period</h4>
                  <p className="text-lg">{formatDate(result.joining_date)} to {formatDate(result.leaving_date)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Last Drawn Salary</h4>
                  <p className="text-lg">₹{Number(result.last_drawn_salary).toLocaleString('en-IN')}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Years of Service</h4>
                  <p className="text-lg">{result.years_of_service} years</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Employee Type</h4>
                  <p className="text-lg capitalize">{result.employee_type.replace('-', ' ')}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Termination Reason</h4>
                  <p className="text-lg capitalize">{result.termination_reason}</p>
                </div>
              </div>
              
              <div className="mt-6 p-6 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-center">
                  <h4 className="text-xl font-medium mb-2">Gratuity Amount</h4>
                  <p className="text-3xl font-bold text-primary">
                    ₹{Number(result.gratuity_amount).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleReset}>
              Calculate Another
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
} 