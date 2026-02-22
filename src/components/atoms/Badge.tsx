'use client';

import './Badge.css';

export interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge = ({
  label,
  variant = 'primary',
  size = 'md',
  icon,
}: BadgeProps) => {
  const variantClass = `badge--${variant}`;
  const sizeClass = `badge--${size}`;

  return (
    <span className={`badge ${variantClass} ${sizeClass}`}>
      {icon && <span className="badge-icon">{icon}</span>}
      {label}
    </span>
  );
};
