import React from 'react';
import styles from './page.module.css';
import BulkCalculator from '../../../components/calculators/BulkCalculator';

export default function BulkCalculatorPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bulk Gratuity Calculator</h1>
      <p className={styles.description}>
        Calculate gratuity for multiple employees at once by uploading a CSV or Excel file.
      </p>
      
      <BulkCalculator />
    </div>
  );
} 