"use client"

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="font-bold text-2xl">
            <Link href="/" className="no-underline text-foreground hover:text-primary">
              Gratify Pro
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex gap-6">
              <li><Link href="/calculator/individual" className="text-muted-foreground hover:text-primary transition-colors">Individual Calculator</Link></li>
              <li><Link href="/calculator/bulk" className="text-muted-foreground hover:text-primary transition-colors">Bulk Calculator</Link></li>
              <li><Link href="/info" className="text-muted-foreground hover:text-primary transition-colors">Learn More</Link></li>
            </ul>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-muted-foreground hover:text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <nav className="container mx-auto py-4">
              <ul className="flex flex-col space-y-4">
                <li>
                  <Link 
                    href="/calculator/individual" 
                    className="text-muted-foreground hover:text-primary transition-colors block py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Individual Calculator
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/calculator/bulk" 
                    className="text-muted-foreground hover:text-primary transition-colors block py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Bulk Calculator
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/info" 
                    className="text-muted-foreground hover:text-primary transition-colors block py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Learn More
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>
      
      <main className="flex-1 container mx-auto py-8">
        {children}
      </main>
      
      <footer className="border-t py-6 bg-muted/40">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Gratify Pro - All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
} 