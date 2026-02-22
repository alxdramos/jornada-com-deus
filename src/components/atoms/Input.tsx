'use client';

import { ReactNode } from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  type = 'text',
  disabled,
  className,
  ...props
}: InputProps) => {
  const containerClass = fullWidth ? 'input-container--full-width' : '';
  const inputClass = `${error ? 'input--error' : ''} ${disabled ? 'input--disabled' : ''} ${className || ''}`;
  const hasIcon = leftIcon || rightIcon;

  return (
    <div className={`input-container ${containerClass}`}>
      {label && (
        <label className="input-label">
          {label}
          {props.required && <span className="input-required">*</span>}
        </label>
      )}
      <div className={`input-wrapper ${hasIcon ? 'input-wrapper--has-icon' : ''}`}>
        {leftIcon && <span className="input-icon input-icon--left">{leftIcon}</span>}
        <input
          type={type}
          className={`input ${inputClass}`}
          disabled={disabled}
          {...props}
        />
        {rightIcon && <span className="input-icon input-icon--right">{rightIcon}</span>}
      </div>
      {error && <p className="input-error">{error}</p>}
      {helperText && !error && <p className="input-helper">{helperText}</p>}
    </div>
  );
};
