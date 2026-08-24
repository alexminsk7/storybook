const preset = require('./tailwind.preset.cjs');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}', './.storybook/**/*.{ts,tsx}'],
  theme: {
    ...preset,
    fontFamily: {
      ...preset.fontFamily,
      // tokens.css defines --font-family-sans with no fallback list; without one, an
      // unloaded/unavailable family falls through to the browser's own default font.
      sans: ['var(--font-family-sans)', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
    },
  },
  plugins: [],
}

