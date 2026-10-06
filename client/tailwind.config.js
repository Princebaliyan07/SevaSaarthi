/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#2DD4BF',
          DEFAULT: '#0D9488',
          dark: '#115E59',
          darker: '#042F2E',
          soft: '#CCFBF1',
          softDark: '#134E4A',
        },
        sos: {
          light: '#F87171',
          DEFAULT: '#EF4444',
          dark: '#DC2626',
          soft: '#FEE2E2',
        },
        alert: {
          light: '#FBBF24',
          DEFAULT: '#F59E0B',
          dark: '#D97706',
          soft: '#FEF3C7',
        },
        civic: {
          light: '#818CF8',
          DEFAULT: '#6366F1',
          dark: '#4F46E5',
          soft: '#EEF2FF',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          dark: '#0B0F19',
          card: '#FFFFFF',
          cardDark: '#111827',
          elevated: '#F1F5F9',
          elevatedDark: '#1F2937',
        },
        ink: {
          DEFAULT: '#0F172A',
          soft: '#64748B',
          muted: '#94A3B8',
          dark: '#F8FAFC',
          darkSoft: '#94A3B8',
          darkMuted: '#64748B',
        },
        line: {
          DEFAULT: '#E2E8F0',
          dark: '#1E293B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        cardDark: '0 4px 25px -2px rgba(0, 0, 0, 0.4)',
        glowBrand: '0 0 25px -3px rgba(13, 148, 136, 0.35)',
        glowSos: '0 0 30px -3px rgba(239, 68, 68, 0.5)',
        glowIndigo: '0 0 25px -3px rgba(99, 102, 241, 0.35)',
      },
      keyframes: {
        sosPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.6)' },
          '50%': { boxShadow: '0 0 0 12px rgba(239, 68, 68, 0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
      },
      animation: {
        sosPulse: 'sosPulse 2s ease-in-out infinite',
        floatSlow: 'floatSlow 4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
