/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Proteger brand blue (#0B498D) — replaces Tailwind's default blue, used by the admin console
        blue: {
          50: '#f0f6fc',
          100: '#d9e7f8',
          200: '#b2cff1',
          300: '#8db8e7',
          400: '#5995d6',
          500: '#1d62b1',
          600: '#0b498d',
          700: '#084075',
          800: '#063464',
          900: '#03274c',
          950: '#021a33',
        },
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#b9dffe',
          300: '#7cc4fd',
          400: '#36a5fa',
          500: '#0c87eb',
          600: '#026bc9',
          700: '#0355a2',
          800: '#074885',
          900: '#0b3d6f',
          950: '#07264a',
        },
        slate: {
          850: '#151e2e',
          950: '#080d1a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
