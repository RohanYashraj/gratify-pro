import React from 'react';
import styles from './page.module.css';
import { Card, CardHeader, CardContent } from '../../../components/ui';

export default function BulkCalculatorPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bulk Gratuity Calculator</h1>
      <p className={styles.description}>
        Calculate gratuity for multiple employees at once by uploading a CSV or Excel file.
      </p>
      
      <Card className={styles.card}>
        <CardHeader 
          title="File Upload" 
          subtitle="Upload a file containing employee data for bulk gratuity calculation" 
        />
        <CardContent>
          <p>File upload components will be implemented in a future task.</p>
        </CardContent>
      </Card>
    </div>
  );
} 