'use client';

import './Chip.css';

export interface ChipProps {
  label: string;
  selected?: boolean;
  removable?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  onRemove?: () => void;
  variant?: 'default' | 'filled';
}

export const Chip = ({
  label,
  selected = false,
  removable = false,
  disabled = false,
  icon,
  onClick,
  onRemove,
  variant = 'default',
}: ChipProps) => {
  const selectedClass = selected ? 'chip--selected' : '';
  const disabledClass = disabled ? 'chip--disabled' : '';
  const variantClass = `chip--${variant}`;

  return (
    <div
      className={`chip ${variantClass} ${selectedClass} ${disabledClass}`}
      onClick={!disabled ? onClick : undefined}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!disabled) onClick?.();
        }
      }}
    >
      {icon && <span className="chip-icon">{icon}</span>}
      <span className="chip-label">{label}</span>
      {removable && (
        <button
          className="chip-remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          aria-label={`Remove ${label}`}
          type="button"
        >
          ✕
        </button>
      )}
    </div>
  );
};
