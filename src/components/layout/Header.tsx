'use client';

import { useUserStore } from '@/stores/userStore';
import Image from 'next/image';
import './Header.css';

export function Header() {
  const user = useUserStore((s) => s.user);

  const handleProfileClick = () => {
    // TODO: Abrir modal de perfil
    console.log('Profile clicked');
  };

  return (
    <header className="header">
      {/* Perfil — Esquerda */}
      <div className="header-profile" onClick={handleProfileClick}>
        {user?.avatar ? (
          <Image
            src={user.avatar}
            alt={user.name || 'User'}
            width={40}
            height={40}
            className="header-avatar"
          />
        ) : (
          <div className="header-avatar-placeholder">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
        )}
        <div className="header-profile-text">
          <span className="header-profile-name">{user?.name || 'Usuário'}</span>
        </div>
      </div>

      {/* Logo/Título — Centro */}
      <div className="header-title">
        <h1>Jornada com Deus</h1>
      </div>

      {/* Actions — Direita */}
      <div className="header-actions">
        <button className="header-action-btn" title="Configurações">
          ⚙️
        </button>
        <button className="header-action-btn" title="Notificações">
          🔔
        </button>
        <button className="header-action-btn" title="Menu">
          ⋯
        </button>
      </div>
    </header>
  );
}
