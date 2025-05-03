import React from 'react';
import styles from './page.module.css';
import { Card, CardHeader, CardContent } from '../../../components/ui';

export default function IndividualCalculatorPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Individual Gratuity Calculator</h1>
      <p className={styles.description}>
        Calculate gratuity for individual employees based on their service period and last drawn salary.
      </p>
      
      <Card className={styles.card}>
        <CardHeader 
          title="Employee Details" 
          subtitle="Enter employee information to calculate gratuity amount" 
        />
        <CardContent>
          <p>Form components will be implemented in the next task.</p>
        </CardContent>
      </Card>
    </div>
  );
} 