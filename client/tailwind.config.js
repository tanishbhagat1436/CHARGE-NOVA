/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Primary Brand ──────────────────────────────
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          DEFAULT: '#2563eb',
        },
        // ── Semantic ───────────────────────────────────
        success: {
          DEFAULT: '#16a34a',
          light: '#dcfce7',
          dark:  '#15803d',
        },
        warning: {
          DEFAULT: '#d97706',
          light: '#fef3c7',
          dark:  '#b45309',
        },
        danger: {
          DEFAULT: '#dc2626',
          light: '#fee2e2',
          dark:  '#b91c1c',
        },
        // ── Neutral Surface (light) ────────────────────
        surface: {
          DEFAULT: '#ffffff',
          muted:   '#f8fafc',
          subtle:  '#f1f5f9',
          border:  '#e2e8f0',
          borderMd:'#cbd5e1',
        },
        // ── Text (light) ───────────────────────────────
        ink: {
          DEFAULT:   '#0f172a',
          secondary: '#475569',
          tertiary:  '#94a3b8',
        },
        // ── Night HUD (dark mode) ──────────────────────
        night: {
          base:    '#0b0f19',
          surface: '#111827',
          card:    '#1a2035',
          border:  'rgba(0, 229, 255, 0.12)',
          text:    '#e2e8f0',
          muted:   '#94a3b8',
          accent:  '#22d3ee',
        },
        // ── HUD accent ────────────────────────────────
        hud: '#22d3ee',
        // Legacy Google colors (kept for existing component refs)
        brand: {
          50:   '#ecfdf5',
          100:  '#d1fae5',
          500:  '#10b981',
          600:  '#059669',
          700:  '#047857',
          900:  '#064e3b',
          dark: '#0b132b',
          card: '#1c2541',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'hud-xl': ['2rem',    { lineHeight: '1.1', fontWeight: '800' }],
        'hud-lg': ['1.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'hud-md': ['0.875rem',{ lineHeight: '1.3', fontWeight: '600' }],
        'hud-sm': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        'hud-xs': ['0.625rem',{ lineHeight: '1.5', fontWeight: '600' }],
      },
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.25rem',
      },
      boxShadow: {
        'card':   '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)',
        'card-md':'0 4px 12px 0 rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.06)',
        'card-lg':'0 10px 30px 0 rgba(0,0,0,0.1),  0 4px 10px -4px rgba(0,0,0,0.08)',
        'hud':    '0 0 20px rgba(34,211,238,0.25)',
      },
      animation: {
        'shimmer':    'shimmer 1.8s ease-in-out infinite',
        'fade-up':    'fade-up 0.25s ease-out',
        'slide-down': 'slide-down 0.2s ease-out',
        'pulse-ring': 'pulse-ring 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(1.15)' },
        },
      },
    },
  },
  plugins: [],
}
