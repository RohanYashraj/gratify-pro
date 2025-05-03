import React from 'react';
import IndividualCalculator from '../../../components/calculators/IndividualCalculator';
import { H1, Lead } from '@/components/ui-shadcn/typography';

export default function IndividualCalculatorPage() {
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="space-y-4 mb-8 text-center">
        <H1>Individual Gratuity Calculator</H1>
        <Lead>
          Calculate gratuity for individual employees based on their service period and last drawn salary.
        </Lead>
      </div>
      
      <IndividualCalculator />
    </div>
  );
} 