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
        // MD3 Surface hierarchy — tonal layers replace 1px borders
        surface: {
          DEFAULT: '#F6F6F6',
          bright: '#F6F6F6',
          dim: '#D3D5D5',
          low: '#F0F1F1',
          container: '#E7E8E8',
          high: '#E1E3E3',
          highest: '#DBDDDD',
        },
        bg: {
          primary: '#F6F6F6',
          secondary: '#FFFFFF',
          tertiary: '#F0F1F1',
          inverse: '#0C0F0F',
        },
        text: {
          primary: '#2D2F2F',
          secondary: '#5A5C5C',
          tertiary: '#767777',
          inverse: '#FFFFFF',
        },
        border: {
          subtle: '#ACADAD',
          normal: '#767777',
          strong: '#5A5C5C',
        },
        // Primary — Emerald Green (Action & Growth)
        primary: {
          DEFAULT: '#006947',
          dim: '#005C3D',
          container: '#69F6B8',
          fixed: '#69F6B8',
          'fixed-dim': '#58E7AB',
        },
        // Secondary — Soft Orange (Warmth & Streaks)
        secondary: {
          DEFAULT: '#815100',
          dim: '#714600',
          container: '#FFC885',
          fixed: '#FFC885',
          'fixed-dim': '#FFB554',
        },
        // Tertiary — Soft Purple (Meditation & Reflection)
        tertiary: {
          DEFAULT: '#6C4D8F',
          dim: '#604182',
          container: '#D6B2FC',
          fixed: '#D6B2FC',
          'fixed-dim': '#C8A5ED',
        },
        orange: {
          400: '#FFB554',
          500: '#FFC885',
          600: '#815100',
        },
        // Keep purple/violet for backward compat
        purple: {
          100: '#FAEFFF',
          200: '#D6B2FC',
          300: '#C8A5ED',
          400: '#6C4D8F',
          500: '#604182',
          600: '#6C4D8F',
          700: '#553777',
          900: '#361757',
        },
        violet: {
          100: '#FAEFFF',
          200: '#D6B2FC',
          400: '#C8A5ED',
          600: '#6C4D8F',
          900: '#4C2E6D',
        },
        // Brand — Emerald Green
        brand: {
          DEFAULT: '#006947',
          light: '#69F6B8',
          dark: '#005C3D',
          muted: 'rgba(0, 105, 71, 0.10)',
        },
        // Gold — Soft Orange (energy accent)
        gold: {
          DEFAULT: '#815100',
          light: '#FFB554',
          pale: '#FFC885',
          muted: 'rgba(129, 81, 0, 0.12)',
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
        // Body — Inter (utilitarian sans, maximum legibility)
        sans: [
          'var(--font-inter)',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif',
        ],
        // Headings — Newsreader (editorial serif, authoritative yet gentle)
        heading: [
          'var(--font-newsreader)',
          'Newsreader',
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
