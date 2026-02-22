'use client';

import { ReactNode } from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) => {
  const baseClass = 'button';
  const variantClass = `button--${variant}`;
  const sizeClass = `button--${size}`;
  const fullWidthClass = fullWidth ? 'button--full-width' : '';
  const disabledClass = disabled || isLoading ? 'button--disabled' : '';

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${fullWidthClass} ${disabledClass} ${className || ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {leftIcon && <span className="button-icon button-icon--left">{leftIcon}</span>}
      {isLoading ? (
        <span className="button-spinner" />
      ) : (
        children
      )}
      {rightIcon && <span className="button-icon button-icon--right">{rightIcon}</span>}
    </button>
  );
};
