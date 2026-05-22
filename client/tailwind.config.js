/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0E8',
        'warm-white': '#FDFAF5',
        charcoal: '#1C1916',
        'deep-brown': '#2D2420',
        rust: {
          DEFAULT: '#C4622D',
          light: '#F0D4C4',
          dark: '#A8501F',
        },
        moss: {
          DEFAULT: '#4A5D3C',
          light: '#D6E4CE',
        },
        sand: {
          DEFAULT: '#D4C4A0',
          dark: '#A89470',
        },
        muted: '#7A6F63',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-up': 'slideUp 0.3s ease forwards',
        'scale-in': 'scaleIn 0.25s ease forwards',
        'bounce-dot': 'bounceDot 1.2s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.94)' }, to: { opacity: 1, transform: 'scale(1)' } },
        bounceDot: { '0%,60%,100%': { transform: 'translateY(0)' }, '30%': { transform: 'translateY(-6px)' } },
      },
      boxShadow: {
        card: '0 4px 20px rgba(28,25,22,0.08)',
        'card-hover': '0 12px 32px rgba(28,25,22,0.12)',
        modal: '0 24px 64px rgba(28,25,22,0.2)',
      },
    },
  },
  plugins: [],
};
