import React, { HTMLAttributes } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export default function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'medium',
  ...rest
}: CardProps) {
  const cardClasses = [
    styles.card,
    styles[variant],
    styles[`padding${padding.charAt(0).toUpperCase()}${padding.slice(1)}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...rest}>
      {children}
    </div>
  );
}

interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className = '',
  ...rest
}: CardHeaderProps) {
  return (
    <div className={`${styles.cardHeader} ${className}`} {...rest}>
      <div className={styles.cardHeaderContent}>
        {title && <h3 className={styles.cardTitle}>{title}</h3>}
        {subtitle && <div className={styles.cardSubtitle}>{subtitle}</div>}
      </div>
      {action && <div className={styles.cardHeaderAction}>{action}</div>}
    </div>
  );
}

export function CardContent({
  children,
  className = '',
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${styles.cardContent} ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = '',
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${styles.cardFooter} ${className}`} {...rest}>
      {children}
    </div>
  );
} 