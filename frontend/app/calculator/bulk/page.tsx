import React from 'react';
import BulkCalculator from '../../../components/calculators/BulkCalculator';
import { H1, Lead } from '@/components/ui-shadcn/typography';

export default function BulkCalculatorPage() {
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="space-y-4 mb-8 text-center">
        <H1>Bulk Gratuity Calculator</H1>
        <Lead>
          Calculate gratuity for multiple employees at once by uploading a CSV or Excel file.
        </Lead>
      </div>
      
      <BulkCalculator />
    </div>
  );
} 