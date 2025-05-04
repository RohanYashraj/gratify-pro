import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui';
import { H1, H3, P, Lead, List, ListItem, Formula } from '@/components/ui';

export default function InfoPage() {
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="space-y-4 mb-8 text-center">
        <H1>About Gratify Pro</H1>
        <Lead>
          Learn about gratuity calculation according to the Payment of Gratuity Act, 1972.
        </Lead>
      </div>
      
      <div className="space-y-8">
        <Card className="shadow-sm">
          <CardHeader>
            <H3>What is Gratuity?</H3>
          </CardHeader>
          <CardContent>
            <P>
              Gratuity is a defined benefit plan and a form of monetary benefit paid by an employer to an employee for the services rendered to the organization. It's a token of appreciation for the dedication and service provided by the employee over the years.
            </P>

            <H3>Eligibility Criteria</H3>
            <P>
              To be eligible for gratuity under the Payment of Gratuity Act, 1972, an employee must have completed at least 5 years of continuous service with the employer.
            </P>

            <List>
              <ListItem>Completion of 5 years of continuous service</ListItem>
              <ListItem>Applicable on superannuation, retirement, resignation, death, or disablement</ListItem>
              <ListItem>Forfeited in case of dismissal due to misconduct</ListItem>
            </List>

            <H3>Calculation Formula</H3>
            <P>
              The gratuity amount is calculated based on the following formula:
            </P>

            <Formula>
              Gratuity Amount = (15 × Last Drawn Salary × Years of Service) / 26
            </Formula>

            <P>
              Where:
            </P>
            <List>
              <ListItem>Last Drawn Salary = Basic Salary + Dearness Allowance</ListItem>
              <ListItem>Years of Service = Completed years (fraction over 6 months is counted as 1 year)</ListItem>
            </List>

            <H3>Tax Implications</H3>
            <P>
              Gratuity received by Government employees is fully exempt from income tax. For non-government employees covered under the Payment of Gratuity Act, the minimum of the following is exempt:
            </P>

            <List>
              <ListItem>Actual gratuity received</ListItem>
              <ListItem>₹20,00,000 (twenty lakh rupees)</ListItem>
              <ListItem>15 days' salary based on the last drawn salary for each completed year of service</ListItem>
            </List>

            <H3>Legal Framework</H3>
            <P>
              The Payment of Gratuity Act, 1972 is applicable to establishments employing 10 or more persons. It extends to the whole of India.
            </P>
            <P>
              The Act provides for a scheme of compulsory gratuity payment to employees engaged in factories, mines, oilfields, plantations, ports, railway companies, shops, or other establishments.
            </P>

            <H3>Disclaimer</H3>
            <P>
              The information provided on this page is for general informational purposes only. It should not be considered as legal or financial advice. Please consult with a qualified professional for specific advice concerning your situation.
            </P>
            <P>
              While we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information contained on this page.
            </P>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <H3>Payment of Gratuity Act, 1972</H3>
          </CardHeader>
          <CardContent className="space-y-4">
            <P>
              The Payment of Gratuity Act, 1972 is an Act to provide for a scheme for the payment
              of gratuity to employees engaged in factories, mines, oilfields, plantations, ports,
              railway companies, shops, or other establishments and for matters connected therewith.
            </P>
            <P>
              According to the Act, gratuity is payable to an employee on the termination of their
              employment after they have rendered continuous service for not less than five years:
            </P>
            <List>
              <ListItem>On their superannuation</ListItem>
              <ListItem>On their retirement or resignation</ListItem>
              <ListItem>On their death or disablement due to accident or disease</ListItem>
            </List>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <H3>How is Gratuity Calculated?</H3>
          </CardHeader>
          <CardContent className="space-y-4">
            <P>
              The formula for calculating gratuity is:
            </P>
            <Formula>
              Gratuity = (Last Drawn Salary × Period of Service × 15) / 26
            </Formula>
            <P>
              Where:
            </P>
            <List>
              <ListItem><strong>Last Drawn Salary:</strong> Basic salary + Dearness Allowance</ListItem>
              <ListItem><strong>Period of Service:</strong> Number of years of continuous service (rounded to the nearest full year)</ListItem>
            </List>
            <P>
              For employees not covered under the Act, the calculation is typically:
            </P>
            <Formula>
              Gratuity = (Last Drawn Salary × Period of Service × 15) / 30
            </Formula>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <H3>Quick Tips & Summary</H3>
          </CardHeader>
          <CardContent>
            <List>
              <ListItem>Gratuity is paid after 5+ years of continuous service.</ListItem>
              <ListItem>It is a statutory right under the Payment of Gratuity Act, 1972.</ListItem>
              <ListItem>Tax exemption is available up to a certain limit as per Income Tax rules.</ListItem>
              <ListItem>Gratuity is paid on retirement, resignation, superannuation, or in case of death/disablement.</ListItem>
            </List>
          </CardContent>
        </Card>

        <Card className="shadow-sm" id="faq">
          <CardHeader>
            <H3>Frequently Asked Questions (FAQ)</H3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="font-medium">Q: Is gratuity taxable?</div>
              <P>
                Gratuity received by employees is tax-free up to a government-specified limit. Amounts above this are taxable as per the Income Tax Act.
              </P>
            </div>
            
            <div className="space-y-2">
              <div className="font-medium">Q: Can gratuity be paid before 5 years?</div>
              <P>
                Generally, gratuity is payable only after 5 years of continuous service, except in case of death or disablement.
              </P>
            </div>
            
            <div className="space-y-2">
              <div className="font-medium">Q: How is the period of service calculated?</div>
              <P>
                The period of service is rounded to the nearest full year. For example, 6 years and 7 months is considered as 7 years.
              </P>
            </div>
            
            <div className="space-y-2">
              <div className="font-medium">Q: Who pays gratuity?</div>
              <P>
                The employer is responsible for paying gratuity to eligible employees.
              </P>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 