import React, { ReactNode } from 'react';
import Link from 'next/link';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="font-bold text-2xl">
            <Link href="/" className="no-underline text-foreground hover:text-primary">
              Gratuity Pro
            </Link>
          </div>
          <nav>
            <ul className="flex gap-6">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/calculator/individual" className="text-muted-foreground hover:text-primary transition-colors">Individual Calculator</Link></li>
              <li><Link href="/calculator/bulk" className="text-muted-foreground hover:text-primary transition-colors">Bulk Calculator</Link></li>
              <li><Link href="/info" className="text-muted-foreground hover:text-primary transition-colors">Learn More</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-8">
        {children}
      </main>
      
      <footer className="border-t py-6 bg-muted/40">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Gratuity Pro - All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
} 