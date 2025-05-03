import React, { ReactNode } from 'react';
import Link from 'next/link';
import styles from './Layout.module.css';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>Gratuity Pro</h1>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/calculator/individual">Individual Calculator</Link></li>
            <li><Link href="/calculator/bulk">Bulk Calculator</Link></li>
            <li><Link href="/info">Learn More</Link></li>
          </ul>
        </nav>
      </header>
      
      <main className={styles.main}>
        {children}
      </main>
      
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Gratuity Pro - All Rights Reserved</p>
      </footer>
    </div>
  );
} 