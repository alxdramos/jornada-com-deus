'use client';

import { Input, type InputProps } from '@/components/atoms/Input';
import './FormField.css';

export interface FormFieldProps extends Omit<InputProps, 'label'> {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
}

export const FormField = ({
  label,
  required = false,
  hint,
  error,
  helperText,
  ...inputProps
}: FormFieldProps) => {
  const displayHelper = error || helperText || hint;

  return (
    <div className="form-field">
      <div className="form-field-header">
        <label className="form-field-label">
          {label}
          {required && <span className="form-field-required">*</span>}
        </label>
        {hint && !error && <span className="form-field-hint">{hint}</span>}
      </div>
      <Input
        label={undefined}
        error={error}
        helperText={displayHelper}
        required={required}
        {...inputProps}
      />
    </div>
  );
};
