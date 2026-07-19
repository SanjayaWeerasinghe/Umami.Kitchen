/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfaf3',
          100: '#faf5ee',
          200: '#f2ead9',
          300: '#e6d8bd',
        },
        espresso: {
          900: '#1c1815',
          800: '#2d2620',
          700: '#4a3f34',
          500: '#8a7d6a',
          400: '#b0a591',
        },
        tomato: '#d94a3d',
        leaf: '#86ab4b',
        leafDark: '#4d7a35',
        shrimp: '#f4a893',
        cucumber: '#9dc785',
        soy: '#2d1b0f',
        sesame: '#e8d091',
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
