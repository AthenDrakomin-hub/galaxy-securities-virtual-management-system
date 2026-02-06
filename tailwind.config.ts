
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Aluminum Industrial Style Palette
        industrial: {
          50: '#f8f8f8',
          100: '#e8e8e8',
          200: '#d1d1d1',
          300: '#a8a8a8',
          400: '#7f7f7f',
          500: '#595959', // Brushed Steel
          600: '#404040',
          700: '#2e2e2e',
          800: '#1f1f1f',
          900: '#121212',
          950: '#0a0a0a', // Deep Cavity
        },
        accent: {
          orange: '#ff4500', // Neon Highlight
          darkOrange: '#cc3700',
          cyan: '#00f2ff',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 5px rgba(255, 69, 0, 0.5))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 20px rgba(255, 69, 0, 0.8))' },
        }
      },
      boxShadow: {
        'industrial-inner': 'inset 2px 2px 5px rgba(0,0,0,0.5), inset -1px -1px 2px rgba(255,255,255,0.05)',
        'industrial-outer': '5px 5px 15px rgba(0,0,0,0.4), -2px -2px 10px rgba(255,255,255,0.02)',
      }
    },
  },
  plugins: [],
};

export default config;
