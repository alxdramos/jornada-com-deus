'use client';

import { Avatar, type AvatarProps } from '@/components/atoms/Avatar';
import './UserProfile.css';

export interface UserProfileProps {
  avatarProps: AvatarProps;
  name: string;
  email?: string;
  onProfileClick?: () => void;
  interactive?: boolean;
}

export const UserProfile = ({
  avatarProps,
  name,
  email,
  onProfileClick,
  interactive = false,
}: UserProfileProps) => {
  const interactiveClass = interactive ? 'user-profile--interactive' : '';

  return (
    <div
      className={`user-profile ${interactiveClass}`}
      onClick={interactive ? onProfileClick : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : -1}
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onProfileClick?.();
        }
      }}
    >
      <Avatar {...avatarProps} />
      <div className="user-profile-info">
        <div className="user-profile-name">{name}</div>
        {email && <div className="user-profile-email">{email}</div>}
      </div>
    </div>
  );
};
