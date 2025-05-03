import React from 'react';
import styles from './page.module.css';
import IndividualCalculator from '../../../components/calculators/IndividualCalculator';

export default function IndividualCalculatorPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Individual Gratuity Calculator</h1>
      <p className={styles.description}>
        Calculate gratuity for individual employees based on their service period and last drawn salary.
      </p>
      
      <IndividualCalculator />
    </div>
  );
} 