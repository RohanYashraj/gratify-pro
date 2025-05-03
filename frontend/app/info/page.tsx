import React from 'react';
import styles from './page.module.css';
import { Card, CardHeader, CardContent } from '../../components/ui';

export default function InfoPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About Gratuity</h1>
      <p className={styles.description}>
        Learn about gratuity calculation according to the Payment of Gratuity Act, 1972.
      </p>
      
      <Card className={styles.card}>
        <CardHeader title="What is Gratuity?" />
        <CardContent>
          <p>
            Gratuity is a financial component of the salary that is the monetary benefit
            given by the employer to their employee for the services rendered by them during
            the period of employment. It is a token of gratitude by the employer. Gratuity 
            is paid when an employee leaves the organization after completing at least 5 years 
            of continuous service.
          </p>
        </CardContent>
      </Card>
      
      <Card className={styles.card}>
        <CardHeader title="Payment of Gratuity Act, 1972" />
        <CardContent>
          <p>
            The Payment of Gratuity Act, 1972 is an Act to provide for a scheme for the payment
            of gratuity to employees engaged in factories, mines, oilfields, plantations, ports,
            railway companies, shops, or other establishments and for matters connected therewith.
          </p>
          <p>
            According to the Act, gratuity is payable to an employee on the termination of their
            employment after they have rendered continuous service for not less than five years:
          </p>
          <ul className={styles.list}>
            <li>On their superannuation</li>
            <li>On their retirement or resignation</li>
            <li>On their death or disablement due to accident or disease</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card className={styles.card}>
        <CardHeader title="How is Gratuity Calculated?" />
        <CardContent>
          <p>
            The formula for calculating gratuity is:
          </p>
          <div className={styles.formulaBox}>
            <p className={styles.formula}>
              Gratuity = (Last Drawn Salary × Period of Service × 15) / 26
            </p>
          </div>
          <p>
            Where:
          </p>
          <ul className={styles.list}>
            <li><strong>Last Drawn Salary:</strong> Basic salary + Dearness Allowance</li>
            <li><strong>Period of Service:</strong> Number of years of continuous service (rounded to the nearest full year)</li>
          </ul>
          <p>
            For employees not covered under the Act, the calculation is typically:
          </p>
          <div className={styles.formulaBox}>
            <p className={styles.formula}>
              Gratuity = (Last Drawn Salary × Period of Service × 15) / 30
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 