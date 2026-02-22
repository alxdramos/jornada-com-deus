'use client';

import { ReactNode } from 'react';
import './Card.css';

export interface CardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  onClick?: () => void;
  interactive?: boolean;
  className?: string;
}

export const Card = ({
  children,
  title,
  description,
  image,
  imageAlt = 'Card image',
  onClick,
  interactive = false,
  className,
}: CardProps) => {
  const interactiveClass = interactive ? 'card--interactive' : '';

  return (
    <div
      className={`card ${interactiveClass} ${className || ''}`}
      onClick={interactive ? onClick : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : -1}
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {image && (
        <div className="card-image">
          <img src={image} alt={imageAlt} />
        </div>
      )}
      <div className="card-content">
        {title && <h3 className="card-title">{title}</h3>}
        {description && <p className="card-description">{description}</p>}
        {children}
      </div>
    </div>
  );
};
