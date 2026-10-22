/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f6f6f4',
          100: '#e9e9e4',
          200: '#d3d2ca',
          300: '#b3b1a4',
          400: '#8e8c7d',
          500: '#72706a',
          600: '#5b5a54',
          700: '#484743',
          800: '#2e2d2a',
          900: '#1a1917',
          950: '#0d0d0c',
        },
        ivory: {
          50: '#fdfdfb',
          100: '#faf8f1',
          200: '#f3eede',
          300: '#e9e0c8',
          400: '#dccda8',
          500: '#ccba88',
        },
        beige: {
          50: '#faf7f2',
          100: '#f0e9dd',
          200: '#e4d7c3',
          300: '#d4bf9f',
          400: '#c2a578',
          500: '#a88860',
        },
        gold: {
          50: '#fbf8ee',
          100: '#f3ead0',
          200: '#e6d39b',
          300: '#d4b96b',
          400: '#c6a047',
          500: '#b18a36',
          600: '#946f28',
          700: '#755520',
          800: '#5e441d',
          900: '#4d381a',
        },
        sage: {
          400: '#7a9a7a',
          500: '#5e8160',
          600: '#4a684c',
        },
        rust: {
          400: '#c8704a',
          500: '#a85a36',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.75rem, 6vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'hero': ['clamp(2.25rem, 4.5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      },
      letterSpacing: {
        widest: '0.25em',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.6s ease-out both',
        'slide-in': 'slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};
