'use client';

import React, { HTMLAttributes, FormHTMLAttributes } from 'react';
import styles from './Form.module.css';

// Form component
interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function Form({
  children,
  className = '',
  onSubmit,
  ...rest
}: FormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form 
      className={`${styles.form} ${className}`} 
      onSubmit={handleSubmit}
      {...rest}
    >
      {children}
    </form>
  );
}

// FormGroup component
interface FormGroupProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  spacing?: 'tight' | 'normal' | 'loose';
}

export function FormGroup({
  children,
  className = '',
  direction = 'column',
  spacing = 'normal',
  ...rest
}: FormGroupProps) {
  const groupClasses = [
    styles.formGroup,
    styles[direction],
    styles[`spacing${spacing.charAt(0).toUpperCase()}${spacing.slice(1)}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClasses} {...rest}>
      {children}
    </div>
  );
} 