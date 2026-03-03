'use client';

import { motion } from 'framer-motion';
import { Heart, Instagram, Twitter } from 'lucide-react';

const APP_URL = 'https://app.minhajornadadiaria.com.br';

const navLinks = [
  { label: 'Início',       href: '#hero' },
  { label: 'Missão',       href: '#missao' },
  { label: 'Recursos',     href: '#recursos' },
  { label: 'Depoimentos',  href: '#depoimentos' },
  { label: 'Começar',      href: '#comecar' },
];

const legalLinks = [
  { label: 'Política de Privacidade', href: '/privacidade' },
  { label: 'Termos de Uso',           href: '/termos' },
];

const socialLinks = [
  {
    label: 'Instagram',
    href:  'https://instagram.com/senier451',
    icon:  Instagram,
  },
  {
    label: 'X (Twitter)',
    href:  'https://x.com/senier451',
    icon:  Twitter,
  },
];

export function Footer() {
  return (
    <footer className="bg-[#1F2937] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* ── Col 1: Logo + Tagline ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#hero" className="flex items-center gap-2.5 mb-4 group w-fit">
              <FooterLogo />
              <div>
                <p className="font-bold text-white text-sm">Minha Jornada</p>
                <p className="text-[#FB923C] text-xs font-semibold">Diária</p>
              </div>
            </a>
            <p className="text-[#9CA3AF] text-sm leading-relaxed max-w-xs mb-6">
              Transformando dias com a Palavra, oração e meditação.
              Uma jornada que floresce dia a dia.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-[#374151] hover:bg-[#4B5563] flex items-center justify-center transition-colors duration-200"
                >
                  <Icon size={16} className="text-[#9CA3AF] hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Col 2: Navegação ── */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-5">
              Navegação
            </p>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#9CA3AF] hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Recursos ── */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-5">
              Recursos
            </p>
            <ul className="space-y-3">
              {[
                'Devocional Diário',
                'Meditação Guiada',
                'Bíblia Offline',
                'Diário de Oração',
                'Árvore da Vida',
              ].map((item) => (
                <li key={item}>
                  <a
                    href={APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#9CA3AF] hover:text-white transition-colors duration-150"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4: Legal + CTA ── */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-5">
              Legal & Contato
            </p>
            <ul className="space-y-3 mb-7">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#9CA3AF] hover:text-white transition-colors duration-150"
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FB923C] hover:bg-[#F97316] text-white text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Acessar o App ↗
            </a>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#374151]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#6B7280] text-sm">
            © {new Date().getFullYear()} Minha Jornada Diária. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-1.5 text-[#6B7280] text-sm">
            <span>Feito com</span>
            <Heart size={13} className="fill-[#C98989] text-[#C98989]" aria-hidden="true" />
            <span>e muita oração 🌱</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect x="3" y="10" width="13" height="18" rx="2" fill="#374151" stroke="#FB923C" strokeWidth="1.5"/>
      <rect x="20" y="10" width="13" height="18" rx="2" fill="#374151" stroke="#FB923C" strokeWidth="1.5"/>
      <path d="M16 11 Q18 9 20 11 L20 28 Q18 26 16 28 Z" fill="#FB923C" opacity="0.3"/>
      <line x1="18" y1="11" x2="18" y2="28" stroke="#FB923C" strokeWidth="1.5"/>
      <path d="M18 10 C18 7 14 4 14 4 C14 4 14 8 18 10Z" fill="#10B981"/>
      <path d="M18 10 C18 7 22 4 22 4 C22 4 22 8 18 10Z" fill="#3FDFB8"/>
    </svg>
  );
}
