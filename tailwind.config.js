/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A1628',
        'bg-deep': '#0F1A36',
        'bg-card': 'rgba(255,255,255,0.03)',
        navy: {
          DEFAULT: '#0A1628',
          light: '#0F1A36',
          dark: '#050D1A',
        },
        primary: {
          DEFAULT: '#06B6D4', // cyan
          light: '#22D3EE',
          dark: '#0891B2',
        },
        gold: {
          DEFAULT: '#FBBF24',
          light: '#FCD34D',
          dark: '#F59E0B',
        },
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderColor: {
        glass: 'rgba(255,255,255,0.06)',
        'glass-md': 'rgba(255,255,255,0.1)',
      },
    },
  },
  plugins: [],
};