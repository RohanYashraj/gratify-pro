import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui';
import { H1, H3, Paragraph, Lead, List, ListItem, Formula } from '@/components/ui-shadcn/typography';

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
            <Paragraph>
              Gratuity is a financial component of the salary that is the monetary benefit
              given by the employer to their employee for the services rendered by them during
              the period of employment. It is a token of gratitude by the employer. Gratuity 
              is paid when an employee leaves the organization after completing at least 5 years 
              of continuous service.
            </Paragraph>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <H3>Payment of Gratuity Act, 1972</H3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Paragraph>
              The Payment of Gratuity Act, 1972 is an Act to provide for a scheme for the payment
              of gratuity to employees engaged in factories, mines, oilfields, plantations, ports,
              railway companies, shops, or other establishments and for matters connected therewith.
            </Paragraph>
            <Paragraph>
              According to the Act, gratuity is payable to an employee on the termination of their
              employment after they have rendered continuous service for not less than five years:
            </Paragraph>
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
            <Paragraph>
              The formula for calculating gratuity is:
            </Paragraph>
            <Formula>
              Gratuity = (Last Drawn Salary × Period of Service × 15) / 26
            </Formula>
            <Paragraph>
              Where:
            </Paragraph>
            <List>
              <ListItem><strong>Last Drawn Salary:</strong> Basic salary + Dearness Allowance</ListItem>
              <ListItem><strong>Period of Service:</strong> Number of years of continuous service (rounded to the nearest full year)</ListItem>
            </List>
            <Paragraph>
              For employees not covered under the Act, the calculation is typically:
            </Paragraph>
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
              <Paragraph>
                Gratuity received by employees is tax-free up to a government-specified limit. Amounts above this are taxable as per the Income Tax Act.
              </Paragraph>
            </div>
            
            <div className="space-y-2">
              <div className="font-medium">Q: Can gratuity be paid before 5 years?</div>
              <Paragraph>
                Generally, gratuity is payable only after 5 years of continuous service, except in case of death or disablement.
              </Paragraph>
            </div>
            
            <div className="space-y-2">
              <div className="font-medium">Q: How is the period of service calculated?</div>
              <Paragraph>
                The period of service is rounded to the nearest full year. For example, 6 years and 7 months is considered as 7 years.
              </Paragraph>
            </div>
            
            <div className="space-y-2">
              <div className="font-medium">Q: Who pays gratuity?</div>
              <Paragraph>
                The employer is responsible for paying gratuity to eligible employees.
              </Paragraph>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 