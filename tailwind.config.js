/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Brand Tokens (PRD specification)
        cream: '#FFF8EE',
        wheat: '#C98A2B',
        brown: '#3B2A1A',
        olive: '#5E7B3A',
        burgundy: '#7A2E2E',
        
        // Stitch Surface and Design System Tokens
        surface: '#FFF8EE',
        'surface-dim': '#F2D5BD',
        'surface-bright': '#FFF8F5',
        'surface-lowest': '#FFFFFF',
        'surface-low': '#FFF1E8',
        'surface-container': '#FFEADA',
        'surface-container-high': '#FFE3CD',
        'surface-highest': '#FBDDC5',
        'on-surface': '#3B2A1A',
        'on-surface-variant': '#514536',
        
        primary: {
          DEFAULT: '#845400',
          container: '#C98A2B',
          fixed: '#FFDDB5',
          'fixed-dim': '#FFB958',
          dark: '#643F00',
        },
        secondary: {
          DEFAULT: '#7A2E2E',
          container: '#FE9693',
          fixed: '#FFDAD8',
          'fixed-dim': '#FFB3B0',
        },
        tertiary: {
          DEFAULT: '#5E7B3A',
          container: '#81A05B',
          fixed: '#CCEEA0',
          'fixed-dim': '#B0D186',
        },
        outline: {
          DEFAULT: '#837564',
          variant: '#D6C4B1',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(59, 42, 26, 0.06)',
        'warm-md': '0 8px 24px -4px rgba(59, 42, 26, 0.08)',
        'warm-lg': '0 16px 36px -6px rgba(59, 42, 26, 0.12)',
        'wheat-glow': '0 8px 24px -4px rgba(201, 138, 43, 0.35)',
      },
    },
  },
  plugins: [],
};

