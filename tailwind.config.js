const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './hooks/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', ...fontFamily.sans],
        montserrat: ['var(--font-montserrat)', ...fontFamily.sans],
        sans: ['var(--font-inter)', ...fontFamily.sans],
      },
      colors: {
        // ── Neon Noir (Dark Mode) Palette ──
        'neon-red': {
          DEFAULT: '#FF0033',
          50: '#FFF0F3',
          100: '#FFD6DE',
          200: '#FFADBD',
          300: '#FF859D',
          400: '#FF5C7D',
          500: '#FF0033',
          600: '#D6002B',
          700: '#AD0023',
          800: '#85001B',
          900: '#5C0013',
          950: '#3D000D',
        },
        'amber-glow': {
          DEFAULT: '#FF9900',
          400: '#FFB84D',
          500: '#FF9900',
          600: '#E68A00',
        },
        'obsidian': {
          DEFAULT: '#0A0508',
          50: '#F5F0F3',
          100: '#E8DDE3',
          200: '#D1BBC8',
          300: '#BA99AD',
          400: '#A37792',
          500: '#8A5D78',
          600: '#6E4A60',
          700: '#523748',
          800: '#362430',
          900: '#1A1118',
          950: '#0A0508',
        },

        // ── Ivory Speakeasy (Light Mode) Palette ──
        'wine-burgundy': {
          DEFAULT: '#800020',
          50: '#FDF2F5',
          100: '#FBD8E2',
          200: '#F5B0C5',
          300: '#ED88A8',
          400: '#E3608C',
          500: '#CC386E',
          600: '#A30018',
          700: '#800020',
          800: '#5C0017',
          900: '#38000E',
          950: '#1C0007',
        },
        'ivory': {
          DEFAULT: '#F6F2EC',
          50: '#FCFAF8',
          100: '#F9F6F2',
          200: '#F6F2EC',
          300: '#EBE4D9',
          400: '#DDD1BF',
          500: '#CCBDA5',
          600: '#B8A78B',
          700: '#9E8D72',
          800: '#7D6E58',
          900: '#5C5040',
          950: '#3D352A',
        },
        'aged-brass': {
          DEFAULT: '#C5A059',
          400: '#D9BF8A',
          500: '#C5A059',
          600: '#A8853E',
        },
      },
      boxShadow: {
        // Dark mode neon glows
        'neon-red-sm': '0 0 8px rgba(255,0,51,0.5), 0 0 16px rgba(255,0,51,0.2)',
        'neon-red': '0 0 12px rgba(255,0,51,0.6), 0 0 30px rgba(255,0,51,0.25), 0 0 50px rgba(255,0,51,0.1)',
        'neon-red-lg': '0 0 20px rgba(255,0,51,0.7), 0 0 45px rgba(255,0,51,0.3), 0 0 80px rgba(255,0,51,0.15)',
        'neon-red-inner': 'inset 0 0 12px rgba(255,0,51,0.5), inset 0 0 30px rgba(255,0,51,0.15)',
        'neon-amber': '0 0 10px rgba(255,153,0,0.5), 0 0 25px rgba(255,153,0,0.2)',
        'neon-amber-lg': '0 0 20px rgba(255,153,0,0.6), 0 0 40px rgba(255,153,0,0.25)',

        // Light mode soft warm glows
        'wine-glow': '0 2px 16px rgba(128,0,32,0.15), 0 0 2px rgba(128,0,32,0.2)',
        'wine-glow-lg': '0 4px 24px rgba(128,0,32,0.2), 0 0 6px rgba(128,0,32,0.15)',
        'brass-glow': '0 1px 8px rgba(197,160,89,0.25), 0 0 2px rgba(197,160,89,0.15)',
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.85', filter: 'brightness(1.15)' },
        },
        'neon-flicker': {
          '0%, 100%': { opacity: '1' },
          '3%': { opacity: '0.8' },
          '4%': { opacity: '1' },
          '7%': { opacity: '0.6' },
          '8%': { opacity: '1' },
          '47%': { opacity: '1' },
          '50%': { opacity: '0.75' },
          '51%': { opacity: '1' },
        },
        'keyhole-glow': {
          '0%, 100%': {
            boxShadow: '0 0 12px rgba(255,0,51,0.6), 0 0 30px rgba(255,0,51,0.3)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(255,0,51,0.85), 0 0 50px rgba(255,0,51,0.45), 0 0 70px rgba(255,0,51,0.15)',
          },
        },
        'laser-sweep': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'glass-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-3px)' },
        },
      },
      animation: {
        'neon-pulse': 'neon-pulse 2.5s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 6s linear infinite',
        'keyhole-glow': 'keyhole-glow 3s ease-in-out infinite',
        'laser-sweep': 'laser-sweep 4s ease-in-out infinite',
        'glass-float': 'glass-float 4s ease-in-out infinite',
      },
      backgroundImage: {
        'neon-gradient': 'linear-gradient(135deg, #FF0033 0%, #FF1A3C 50%, #FF0033 100%)',
        'neon-gradient-horizontal': 'linear-gradient(90deg, transparent 0%, #FF0033 50%, transparent 100%)',
        'wine-gradient': 'linear-gradient(135deg, #800020 0%, #A30018 50%, #800020 100%)',
        'obsidian-radial': 'radial-gradient(ellipse at 50% 50%, #1A1118 0%, #0A0508 60%, #070305 100%)',
        'ivory-radial': 'radial-gradient(ellipse at 50% 50%, #FCFAF8 0%, #F6F2EC 40%, #EBE4D9 100%)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
