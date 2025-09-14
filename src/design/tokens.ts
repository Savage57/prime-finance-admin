export const colors = {
  brand: {
    primary: '#16A34A',
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
  background: {
    light: '#FFFFFF',
    dark: '#071428'
  }
} as const;

export const spacing = {
  xs: '0.5rem',    // 8px
  sm: '1rem',      // 16px
  md: '1.5rem',    // 24px
  lg: '2rem',      // 32px
  xl: '3rem',      // 48px
  '2xl': '4rem',   // 64px
} as const;

export const borderRadius = {
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
} as const;

export const typography = {
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  lineHeights: {
    body: '150%',
    heading: '120%'
  }
} as const;