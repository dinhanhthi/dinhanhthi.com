import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/lib/config.ts',
    './src/app/lib/helpers.ts',
    './src/data/*.{ts,tsx}',
    './notion-x/**/*.{js,ts,jsx,tsx,mdx,css,scss}'
  ],
  // important: true,
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#444'
          }
        }
      },
      backgroundImage: {
        'repeating-dots':
          '-webkit-repeating-radial-gradient(center center,#777,#777 1px,transparent 0,transparent 100%)',
        // eslint-disable-next-line quotes
        wave: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 70 500 60' preserveAspectRatio='none'%3E%3Crect x='0' y='0' width='500' height='500' style='stroke: none; fill: %23ffffff;' /%3E%3Cpath d='M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z' style='stroke: none; fill: %23323541;'%3E%3C/path%3E%3C/svg%3E\")",
        'wave-stone':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 70 500 60' preserveAspectRatio='none'%3E%3Crect x='0' y='0' width='500' height='500' style='stroke: none; fill: %23f6f6f6;' /%3E%3Cpath d='M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z' style='stroke: none; fill: %23323541;'%3E%3C/path%3E%3C/svg%3E\")",
        'wave-footer':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 70 500 60' preserveAspectRatio='none'%3E%3Crect x='0' y='0' width='500' height='500' style='stroke: none; fill: %23323541;' /%3E%3Cpath d='M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z' style='stroke: none; fill: %23ffffff;'%3E%3C/path%3E%3C/svg%3E\")",
        'wave-footer-stone':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 70 500 60' preserveAspectRatio='none'%3E%3Crect x='0' y='0' width='500' height='500' style='stroke: none; fill: %23323541;' /%3E%3Cpath d='M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z' style='stroke: none; fill: %23f6f6f6;'%3E%3C/path%3E%3C/svg%3E\")"
      },
      colors: {
        main: '#1e293b',
        'main-dark': '#f8fafc',
        'main-dark-bg': '#282a36',
        'nav-dark-bg': '#323541',
        'code-dark-bg': '#343e4c',
        'dark-border': '#3b3e54',
        link: '#2563eb', // blue-600
        // 'link-dark': '#fcd34d', // amber-300
        'link-dark': '#ffd479'
      },
      animation: {
        fadeIn: 'fadeIn 500ms;',
        wave: 'wave 2s linear infinite',
        toTop: 'toTop 0.3s alternate ease infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(14deg)' },
          '20%': { transform: 'rotate(-8deg)' },
          '30%': { transform: 'rotate(14deg)' },
          '40%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(10deg)' },
          '60%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(0deg)' }
        },
        toTop: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(0, -3px)' }
        }
      },
      spacing: {
        28: '7rem'
      },
      letterSpacing: {
        tighter: '-.04em'
      },
      lineHeight: {
        tight: '1.2'
      },
      fontSize: {
        '5xl': '2.5rem',
        '6xl': '2.75rem',
        '7xl': '4.5rem',
        '8xl': '6.25rem'
      },
      fontWeight: {
        inherit: 'inherit'
      },
      fontFamily: {
        heading: ['Recoleta', 'Arial', 'Helvetica', 'sans-serif']
      },
      boxShadow: {
        small: '0 5px 10px rgba(0, 0, 0, 0.12)',
        medium: '0 8px 30px rgba(0, 0, 0, 0.12)'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
} satisfies Config
