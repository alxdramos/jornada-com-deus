'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const APP_URL = 'https://app.minhajornadadiaria.com.br';

const footerLinks = [
  { label: 'Início',      href: '#hero' },
  { label: 'Missão',      href: '#missao' },
  { label: 'Recursos',    href: '#recursos' },
  { label: 'Depoimentos', href: '#depoimentos' },
  { label: 'Acessar o App', href: APP_URL, external: true },
];

export function Footer() {
  return (
    <footer className="bg-[#1F2937] text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Logo + tagline */}
          <div className="sm:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <FooterLogo />
              <div>
                <p className="font-semibold text-white text-sm">Minha Jornada</p>
                <p className="text-[#FB923C] text-sm font-semibold">Diária</p>
              </div>
            </div>
            <p className="text-[#9CA3AF] text-sm leading-relaxed max-w-xs">
              Transformando dias com a Palavra, oração e meditação.
              Uma jornada que floresce dia a dia.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-4">
              Navegação
            </p>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-sm text-[#9CA3AF] hover:text-white transition-colors"
                  >
                    {link.label}
                    {link.external && ' ↗'}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-4">
              Legal & Contato
            </p>
            <ul className="space-y-2.5">
              <li>
                <a href="/privacidade" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="/termos" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/senier451"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#9CA3AF] hover:text-white transition-colors"
                >
                  Instagram @senier451 ↗
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/senier451"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#9CA3AF] hover:text-white transition-colors"
                >
                  X (Twitter) @senier451 ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#374151] mb-6" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#6B7280] text-sm">
            © {new Date().getFullYear()} Minha Jornada Diária. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-1.5 text-[#6B7280] text-sm">
            <span>Feito com</span>
            <Heart size={13} className="fill-[#C98989] text-[#C98989]" aria-hidden="true" />
            <span>e muita oração</span>
            <span className="ml-1">🌱</span>
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
