// tailwind.theme.snippet.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Green Palette
        primary: {
          50:  '#E8FBF0',
          100: '#CFF7E0',
          200: '#9FF0BF',
          300: '#66E69A',
          400: '#33D97A',
          500: '#0EA55E', // Primary brand color
          600: '#0B8B4E',
          700: '#0A6D3D',
          800: '#074F2D',
          900: '#03361E',
        },
        
        // Accent Colors for Charts and Highlights
        accent: {
          teal: '#06B6D4',
          amber: '#F59E0B',
          violet: '#8B5CF6',
          cyan: '#06B6D4',
          rose: '#F43F5E',
          emerald: '#10B981',
        },
        
        // Status Colors
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
          pending: '#F59E0B',
          active: '#10B981',
          inactive: '#6B7280',
        },
        
        // Background Colors
        background: {
          light: '#FFFFFF',
          dark: '#0B0F0C',
          surface: {
            light: '#F9FAFB',
            dark: '#1F2937',
          }
        },
        
        // Glass Effect Colors
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.2)',
        }
      },
      
      // Typography Scale
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
      },
      
      // Spacing Scale (8px grid system)
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '2.5': '10px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '32': '128px',
      },
      
      // Border Radius
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      
      // Box Shadows for Ultramodern Look
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(14, 165, 94, 0.2)',
        'glow-lg': '0 0 40px rgba(14, 165, 94, 0.3)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'large': '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      
      // Animation & Transitions
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
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
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      
      // Backdrop Blur
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      }
    }
  },
  
  // CSS Variables for Theme Switching
  plugins: [
    function({ addBase }) {
      addBase({
        ':root': {
          '--color-primary': '14 165 94',
          '--color-primary-foreground': '255 255 255',
          '--color-secondary': '255 255 255',
          '--color-secondary-foreground': '15 23 42',
          '--color-background': '255 255 255',
          '--color-foreground': '15 23 42',
          '--color-surface': '249 250 251',
          '--color-border': '226 232 240',
          '--color-input': '226 232 240',
          '--color-ring': '14 165 94',
          '--color-success': '16 185 129',
          '--color-warning': '245 158 11',
          '--color-error': '239 68 68',
          '--color-info': '59 130 246',
        },
        '.dark': {
          '--color-primary': '14 165 94',
          '--color-primary-foreground': '255 255 255',
          '--color-secondary': '0 0 0',
          '--color-secondary-foreground': '248 250 252',
          '--color-background': '11 15 12',
          '--color-foreground': '248 250 252',
          '--color-surface': '31 41 55',
          '--color-border': '55 65 81',
          '--color-input': '55 65 81',
          '--color-ring': '14 165 94',
          '--color-success': '16 185 129',
          '--color-warning': '245 158 11',
          '--color-error': '239 68 68',
          '--color-info': '59 130 246',
        }
      })
    }
  ]
}