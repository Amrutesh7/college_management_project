/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#080810',
          surface: '#0e0e1a',
          card: '#13131f',
          elevated: '#191929',
          border: '#1f1f32',
          hover: '#20203a',
        },
        txt: {
          primary: '#eeeef5',
          secondary: '#8888a8',
          muted: '#55556a',
          inverse: '#080810',
        },
        accent: {
          DEFAULT: '#22d3ee',
          dim: '#164e63',
          glow: 'rgba(34,211,238,0.15)',
          hover: '#06b6d4',
        },
        success: {
          DEFAULT: '#22c55e',
          dim: '#14532d',
          glow: 'rgba(34,197,94,0.12)',
        },
        danger: {
          DEFAULT: '#ef4444',
          dim: '#7f1d1d',
          glow: 'rgba(239,68,68,0.12)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          dim: '#78350f',
          glow: 'rgba(245,158,11,0.12)',
        },
        violet: {
          DEFAULT: '#a78bfa',
          dim: '#4c1d95',
          glow: 'rgba(167,139,250,0.12)',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.65rem',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07)',
        accent: '0 0 20px rgba(34,211,238,0.2)',
        glow: '0 0 30px rgba(34,211,238,0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.97)' }, to: { opacity: 1, transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}
