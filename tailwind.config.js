const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', ...fontFamily.sans],
        sans: ['var(--font-inter)', ...fontFamily.sans],
        serif: ['var(--font-cormorant)', ...fontFamily.serif],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        theme: {
          bg: 'hsl(var(--background) / <alpha-value>)',
          surface: 'hsl(var(--card) / <alpha-value>)',
          text: 'hsl(var(--foreground) / <alpha-value>)',
          muted: 'hsl(var(--muted-foreground) / <alpha-value>)',
          accent: 'hsl(var(--primary) / <alpha-value>)',
          border: 'hsl(var(--border) / <alpha-value>)',
        },
      },
      boxShadow: {
        'neon-red-sm': '0 0 8px rgba(255,0,51,0.5), 0 0 16px rgba(255,0,51,0.2)',
        'neon-red': '0 0 12px rgba(255,0,51,0.6), 0 0 30px rgba(255,0,51,0.25), 0 0 50px rgba(255,0,51,0.1)',
        'neon-red-lg': '0 0 20px rgba(255,0,51,0.7), 0 0 45px rgba(255,0,51,0.3), 0 0 80px rgba(255,0,51,0.15)',
        'neon-red-inner': 'inset 0 0 12px rgba(255,0,51,0.5), inset 0 0 30px rgba(255,0,51,0.15)',
        'neon-amber': '0 0 10px rgba(255,153,0,0.5), 0 0 25px rgba(255,153,0,0.2)',
        'neon-amber-lg': '0 0 20px rgba(255,153,0,0.6), 0 0 40px rgba(255,153,0,0.25)',
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
