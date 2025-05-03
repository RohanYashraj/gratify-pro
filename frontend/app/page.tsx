import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>
        Welcome to <span className={styles.highlight}>Gratuity Pro</span>
      </h1>
      
      <p className={styles.description}>
        Calculate gratuity amounts according to the Payment of Gratuity Act, 1972
      </p>
      
      <div className={styles.grid}>
        <a href="/calculator/individual" className={styles.card}>
          <h2>Individual Calculator &rarr;</h2>
          <p>Calculate gratuity for individual employees.</p>
        </a>

        <a href="/calculator/bulk" className={styles.card}>
          <h2>Bulk Calculator &rarr;</h2>
          <p>Process multiple employees via CSV or Excel upload.</p>
        </a>
        
        <a href="/info" className={styles.card}>
          <h2>Learn More &rarr;</h2>
          <p>Read about the Gratuity Act and calculation rules.</p>
        </a>

        <a href="/info#faq" className={styles.card}>
          <h2>FAQ &rarr;</h2>
          <p>Find answers to frequently asked questions.</p>
        </a>
      </div>
    </div>
  );
} 