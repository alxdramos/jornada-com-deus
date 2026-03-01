/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#F8F7F4',
          secondary: '#FFFFFF',
          tertiary: '#F3F4F6',
          inverse: '#1F2937',
        },
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
          tertiary: '#9CA3AF',
          inverse: '#FFFFFF',
        },
        border: {
          subtle: '#E5E7EB',
          normal: '#D1D5DB',
          strong: '#9CA3AF',
        },
        orange: {
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
        },
        // Purple espiritual — identidade visual (Etapa 2)
        purple: {
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          900: '#4C1D95',
        },
        violet: {
          100: '#EDE9FE',
          200: '#DDD6FE',
          400: '#A78BFA',
          600: '#7C3AED',
          900: '#4C1D95',
        },
        // Marca principal (Etapa 2)
        brand: {
          DEFAULT: '#7C3AED',
          light: '#A78BFA',
          dark: '#6D28D9',
          muted: 'rgba(124, 58, 237, 0.12)',
        },
        // Gold sagrado (Etapa 2)
        gold: {
          DEFAULT: '#CA8A04',
          light: '#FCD34D',
          pale: '#FDE68A',
          muted: 'rgba(202, 138, 4, 0.15)',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      spacing: {
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 1px 3px rgba(0, 0, 0, 0.1)',
        lg: '0 4px 12px rgba(0, 0, 0, 0.15)',
        xl: '0 8px 24px rgba(0, 0, 0, 0.2)',
      },
      fontFamily: {
        // Body — Raleway (moderno, clean, espiritual)
        sans: [
          'var(--font-raleway)',
          'Raleway',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif',
        ],
        // Headings — Lora (serifa elegante, evoca livro sagrado)
        heading: [
          'var(--font-lora)',
          'Lora',
          'Georgia',
          '"Times New Roman"',
          'serif',
        ],
        // Mono — fallback
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'monospace',
        ],
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '28px',
        '4xl': '32px',
      },
    },
  },
  plugins: [],
};
