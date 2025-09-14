/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#16A34A', // primary green
          50: '#ECFDF1',
          100: '#D1FADF',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D'
        },
        accent: {
          teal: '#00BFA6',
          cyan: '#00C6FF',
          violet: '#8A5FFF'
        },
        bgDark: '#071428', // very dark blue for dark theme
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.2)'
        }
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem'
      },
      boxShadow: {
        'glow': '0 0 20px rgba(22, 163, 74, 0.2)',
        'glow-lg': '0 0 40px rgba(22, 163, 74, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.3)'
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.2s ease-out',
        'scale-hover': 'scale-hover 0.15s ease-out'
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'scale-hover': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' }
        }
      }
    }
  },
  plugins: []
};