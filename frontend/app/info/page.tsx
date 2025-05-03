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

      <Card className={styles.card}>
        <CardHeader title="Quick Tips & Summary" />
        <CardContent>
          <ul className={styles.list}>
            <li>Gratuity is paid after 5+ years of continuous service.</li>
            <li>It is a statutory right under the Payment of Gratuity Act, 1972.</li>
            <li>Tax exemption is available up to a certain limit as per Income Tax rules.</li>
            <li>Gratuity is paid on retirement, resignation, superannuation, or in case of death/disablement.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className={styles.card} id="faq">
        <CardHeader title="Frequently Asked Questions (FAQ)" />
        <CardContent>
          <ul className={styles.list}>
            <li><strong>Q: Is gratuity taxable?</strong><br />
              A: Gratuity received by employees is tax-free up to a government-specified limit. Amounts above this are taxable as per the Income Tax Act.
            </li>
            <li><strong>Q: Can gratuity be paid before 5 years?</strong><br />
              A: Generally, gratuity is payable only after 5 years of continuous service, except in case of death or disablement.
            </li>
            <li><strong>Q: How is the period of service calculated?</strong><br />
              A: The period of service is rounded to the nearest full year. For example, 6 years and 7 months is considered as 7 years.
            </li>
            <li><strong>Q: Who pays gratuity?</strong><br />
              A: The employer is responsible for paying gratuity to eligible employees.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
} 