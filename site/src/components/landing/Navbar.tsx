'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const APP_URL = 'https://app.minhajornadadiaria.com.br';

const BRAND = '#2D6A4F';

const navLinks = [
  { label: 'Recursos',      href: '#recursos' },
  { label: 'Como Funciona', href: '#como-funciona' },
  { label: 'Depoimentos',   href: '#depoimentos' },
];

export function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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
          ? 'shadow-sm'
          : ''
      }`}
      style={{
        background: scrolled ? 'rgba(248,247,244,0.95)' : 'rgba(248,247,244,0.92)',
        backdropFilter: 'blur(18px)',
        borderBottom: scrolled ? '1px solid rgba(45,106,79,0.12)' : '1px solid rgba(45,106,79,0.07)',
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-[72px] flex items-center justify-between gap-4 lg:gap-8">

        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2.5 shrink-0">
          <div
            className="w-9 h-9 rounded-[9px] flex items-center justify-center shadow-sm"
            style={{ background: '#fff', border: '1px solid rgba(45,106,79,0.12)' }}
            aria-hidden="true"
          >
            <span style={{ fontSize: 18 }}>🌿</span>
          </div>
          <div className="hidden sm:block leading-tight">
            <p
              className="font-semibold text-sm"
              style={{ fontFamily: 'var(--font-lora)', color: '#1F2937' }}
            >
              Minha Jornada Diária
            </p>
            <p
              className="text-[10px] tracking-wide"
              style={{ color: '#6B7280', fontFamily: 'var(--font-raleway)' }}
            >
              App Devocional Cristão
            </p>
          </div>
        </a>

        {/* Nav links — desktop */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  color: '#6B7280',
                  fontFamily: 'var(--font-raleway)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = BRAND;
                  e.currentTarget.style.background = 'rgba(45,106,79,0.07)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#6B7280';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA — desktop */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: BRAND,
              boxShadow: '0 4px 18px rgba(45,106,79,0.28)',
              fontFamily: 'var(--font-raleway)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 28px rgba(45,106,79,0.40)';
              e.currentTarget.style.background = '#245741';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 18px rgba(45,106,79,0.28)';
              e.currentTarget.style.background = BRAND;
            }}
          >
            Abrir grátis
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        {/* Hamburger — mobile/tablet */}
        <button
          className="lg:hidden p-2 rounded-xl transition-colors"
          style={{ color: '#1F2937' }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Menu mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden"
            style={{
              background: 'rgba(248,247,244,0.98)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(45,106,79,0.10)',
            }}
          >
            <div className="px-4 py-5 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-3 py-3 rounded-xl font-medium transition-colors text-sm"
                  style={{
                    color: '#1F2937',
                    fontFamily: 'var(--font-raleway)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(45,106,79,0.07)';
                    e.currentTarget.style.color = BRAND;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#1F2937';
                  }}
                >
                  {link.label}
                </a>
              ))}
              <div className="h-px my-2" style={{ background: 'rgba(45,106,79,0.10)' }} />
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-3.5 rounded-2xl text-white font-bold text-sm"
                style={{
                  background: BRAND,
                  boxShadow: '0 6px 20px rgba(45,106,79,0.25)',
                  fontFamily: 'var(--font-raleway)',
                }}
              >
                Abrir grátis ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
