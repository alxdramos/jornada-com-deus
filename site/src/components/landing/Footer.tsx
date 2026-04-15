'use client';

import { Heart, Instagram, Twitter } from 'lucide-react';

const APP_URL = 'https://app.minhajornadadiaria.com.br';
const BRAND   = '#2D6A4F';

const navLinks = [
  { label: 'Recursos',      href: '#recursos' },
  { label: 'Como Funciona', href: '#como-funciona' },
  { label: 'Depoimentos',   href: '#depoimentos' },
  { label: 'Começar',       href: '#comecar' },
];

const resourceLinks = [
  'Devocional Diário',
  'Meditação Guiada',
  'Bíblia Offline',
  'Diário de Oração',
  'Árvore da Vida',
];

const legalLinks = [
  { label: 'Política de Privacidade', href: '/privacidade' },
  { label: 'Termos de Uso',           href: '/termos' },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com/senier451', icon: Instagram },
  { label: 'X (Twitter)', href: 'https://x.com/senier451', icon: Twitter },
];

const linkHoverStyle = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.color = 'white';
};
const linkLeaveStyle = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.color = 'rgba(255,255,255,0.50)';
};

export function Footer() {
  return (
    <footer style={{ background: '#0e0c0a', color: 'white' }}>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Col 1: Logo + Tagline */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#hero" className="flex items-center gap-2.5 mb-4 w-fit">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(45,106,79,0.25)', border: '1px solid rgba(45,106,79,0.4)' }}
              >
                <span style={{ fontSize: 16 }}>🌿</span>
              </div>
              <div>
                <p
                  className="font-semibold text-sm text-white"
                  style={{ fontFamily: 'var(--font-lora)' }}
                >
                  Minha Jornada
                </p>
                <p
                  className="text-xs font-semibold"
                  style={{ color: '#74C69D', fontFamily: 'var(--font-raleway)' }}
                >
                  Diária
                </p>
              </div>
            </a>
            <p
              className="text-sm leading-relaxed max-w-xs mb-6"
              style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-raleway)' }}
            >
              Transformando dias com a Palavra, oração e meditação.
              Uma jornada que floresce dia a dia.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.10)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(45,106,79,0.35)';
                    e.currentTarget.style.borderColor = 'rgba(45,106,79,0.50)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
                  }}
                >
                  <Icon size={16} style={{ color: 'rgba(255,255,255,0.55)' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navegação */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: 'rgba(255,255,255,0.30)', fontFamily: 'var(--font-raleway)' }}
            >
              Navegação
            </p>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors duration-150"
                    style={{ color: 'rgba(255,255,255,0.50)', fontFamily: 'var(--font-raleway)' }}
                    onMouseEnter={linkHoverStyle}
                    onMouseLeave={linkLeaveStyle}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Recursos */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: 'rgba(255,255,255,0.30)', fontFamily: 'var(--font-raleway)' }}
            >
              Recursos
            </p>
            <ul className="space-y-3">
              {resourceLinks.map((item) => (
                <li key={item}>
                  <a
                    href={APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors duration-150"
                    style={{ color: 'rgba(255,255,255,0.50)', fontFamily: 'var(--font-raleway)' }}
                    onMouseEnter={linkHoverStyle}
                    onMouseLeave={linkLeaveStyle}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Legal + CTA */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: 'rgba(255,255,255,0.30)', fontFamily: 'var(--font-raleway)' }}
            >
              Legal & Contato
            </p>
            <ul className="space-y-3 mb-7">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors duration-150"
                    style={{ color: 'rgba(255,255,255,0.50)', fontFamily: 'var(--font-raleway)' }}
                    onMouseEnter={linkHoverStyle}
                    onMouseLeave={linkLeaveStyle}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mini CTA */}
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: BRAND,
                boxShadow: '0 4px 16px rgba(45,106,79,0.35)',
                fontFamily: 'var(--font-raleway)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1B4332';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(45,106,79,0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = BRAND;
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(45,106,79,0.35)';
              }}
            >
              Acessar o App ↗
            </a>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-xs"
            style={{ color: 'rgba(255,255,255,0.30)', fontFamily: 'var(--font-raleway)' }}
          >
            © {new Date().getFullYear()} · app.minhajornadadiaria.com.br
          </p>
          <div
            className="flex items-center gap-1.5 text-xs"
            style={{ color: 'rgba(255,255,255,0.30)', fontFamily: 'var(--font-raleway)' }}
          >
            <span>Feito com</span>
            <Heart size={12} className="fill-[#C98989] text-[#C98989]" aria-hidden="true" />
            <span>e muita oração 🌿</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
