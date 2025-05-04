import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui"
import { H1 } from '@/components/ui'

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-start pb-16">
      <div className="text-center space-y-4 mb-12">
        <H1>
          Welcome to <span className="text-primary font-bold">Gratify Pro</span>
        </H1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Calculate gratuity amounts according to the Payment of Gratuity Act, 1972
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link href="/calculator/individual" className="no-underline">
          <Card className="h-full transition-all hover:border-primary hover:-translate-y-1">
            <CardHeader>
              <h3 className="font-semibold leading-none tracking-tight">Individual Calculator</h3>
              <p className="text-sm text-muted-foreground">Calculate gratuity for individual employees.</p>
            </CardHeader>
            <CardContent>
              <p>Process calculations for single employees with specific details and service records.</p>
            </CardContent>
            <CardFooter className="text-right text-primary font-medium">
              Get started →
            </CardFooter>
          </Card>
        </Link>

        <Link href="/calculator/bulk" className="no-underline">
          <Card className="h-full transition-all hover:border-primary hover:-translate-y-1">
            <CardHeader>
              <h3 className="font-semibold leading-none tracking-tight">Bulk Calculator</h3>
              <p className="text-sm text-muted-foreground">Process multiple employees via CSV or Excel upload.</p>
            </CardHeader>
            <CardContent>
              <p>Upload spreadsheets with employee data to calculate gratuity for your entire workforce.</p>
            </CardContent>
            <CardFooter className="text-right text-primary font-medium">
              Upload now →
            </CardFooter>
          </Card>
        </Link>
        
        <Link href="/info" className="no-underline">
          <Card className="h-full transition-all hover:border-primary hover:-translate-y-1">
            <CardHeader>
              <h3 className="font-semibold leading-none tracking-tight">Learn More</h3>
              <p className="text-sm text-muted-foreground">Read about the Gratuity Act and calculation rules.</p>
            </CardHeader>
            <CardContent>
              <p>Understand the legal framework, eligibility criteria, and calculation formulas.</p>
            </CardContent>
            <CardFooter className="text-right text-primary font-medium">
              Learn more →
            </CardFooter>
          </Card>
        </Link>

        <Link href="/info#faq" className="no-underline">
          <Card className="h-full transition-all hover:border-primary hover:-translate-y-1">
            <CardHeader>
              <h3 className="font-semibold leading-none tracking-tight">FAQ</h3>
              <p className="text-sm text-muted-foreground">Find answers to frequently asked questions.</p>
            </CardHeader>
            <CardContent>
              <p>Get clarification on common questions about gratuity calculations and regulations.</p>
            </CardContent>
            <CardFooter className="text-right text-primary font-medium">
              View FAQs →
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  );
} 