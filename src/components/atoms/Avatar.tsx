'use client';

import Image from 'next/image';
import './Avatar.css';

export interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away';
  bgColor?: 'orange' | 'purple' | 'green' | 'blue' | 'red' | 'yellow';
}

export const Avatar = ({
  src,
  alt = 'Avatar',
  initials,
  size = 'md',
  status,
  bgColor = 'orange',
}: AvatarProps) => {
  const sizeClass = `avatar--${size}`;
  const statusClass = status ? `avatar--${status}` : '';
  const bgClass = `avatar-initials--${bgColor}`;

  return (
    <div className={`avatar ${sizeClass} ${statusClass}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="avatar-image"
          sizes="(max-width: 640px) 32px, 48px"
        />
      ) : (
        <div className={`avatar-initials ${bgClass}`}>
          {initials || '?'}
        </div>
      )}
      {status && <div className="avatar-status-indicator" />}
    </div>
  );
};
