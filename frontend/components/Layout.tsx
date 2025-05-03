import React, { ReactNode } from 'react';
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
            <li><a href="/">Home</a></li>
            <li><a href="/calculator/individual">Individual Calculator</a></li>
            <li><a href="/calculator/bulk">Bulk Calculator</a></li>
            <li><a href="/info">Learn More</a></li>
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