'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

const APP_URL = 'https://app.minhajornadadiaria.com.br';

const navLinks = [
  { label: 'Início',      href: '#hero' },
  { label: 'Missão',      href: '#missao' },
  { label: 'Recursos',    href: '#recursos' },
  { label: 'Depoimentos', href: '#depoimentos' },
];

export function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/92 backdrop-blur-md shadow-sm border-b border-[#E5E7EB]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-18 flex items-center justify-between gap-8">

        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2.5 group shrink-0">
          <LogoIcon />
          <div className="hidden sm:block leading-tight">
            <p className="font-bold text-[#1F2937] text-sm">Minha Jornada</p>
            <p className="text-[#FB923C] text-xs font-semibold">Diária</p>
          </div>
        </a>

        {/* Links desktop */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F3F4F6] transition-all duration-150 font-medium"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTAs desktop */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#6B7280] hover:text-[#1F2937] font-medium transition-colors"
          >
            Entrar
          </a>
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FB923C] hover:bg-[#F97316] text-white text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            Começar agora
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Hamburguer mobile */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-[#F3F4F6] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          {menuOpen ? <X size={20} className="text-[#1F2937]" /> : <Menu size={20} className="text-[#1F2937]" />}
        </button>
      </nav>

      {/* Menu mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/97 backdrop-blur-md border-b border-[#E5E7EB] overflow-hidden"
          >
            <div className="px-4 py-5 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-3 py-3 rounded-xl text-[#1F2937] font-medium hover:bg-[#F9FAFB] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="h-px bg-[#F3F4F6] my-2" />
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 mt-1 px-4 py-3.5 rounded-2xl bg-[#FB923C] text-white font-semibold text-sm"
              >
                Começar agora
                <ArrowRight size={15} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function LogoIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect x="3" y="10" width="13" height="18" rx="2" fill="#FEF3E2" stroke="#FB923C" strokeWidth="1.5"/>
      <rect x="20" y="10" width="13" height="18" rx="2" fill="#FEF3E2" stroke="#FB923C" strokeWidth="1.5"/>
      <path d="M16 11 Q18 9 20 11 L20 28 Q18 26 16 28 Z" fill="#FB923C" opacity="0.3"/>
      <line x1="18" y1="11" x2="18" y2="28" stroke="#FB923C" strokeWidth="1.5"/>
      <path d="M18 10 C18 7 14 4 14 4 C14 4 14 8 18 10Z" fill="#10B981"/>
      <path d="M18 10 C18 7 22 4 22 4 C22 4 22 8 18 10Z" fill="#3FDFB8"/>
      <line x1="18" y1="4" x2="18" y2="10" stroke="#10B981" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}
