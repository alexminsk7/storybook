const preset = require('./tailwind.preset.cjs');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}', './.storybook/**/*.{ts,tsx}'],
  theme: {
    ...preset,
    extend: {
      ...preset.extend,
      colors: {
        ...preset.extend.colors,
        // shadcn's bare `destructive` (bg-destructive on Button/Badge, text-destructive on Alert)
        // is one solid red; the generated preset only has the -foreground/-background pair, and
        // -background is a 10% tint — the solid one is -foreground (red-600 light / red-400 dark).
        destructive: 'var(--destructive-foreground)',
      },
    },
    fontFamily: {
      ...preset.fontFamily,
      // tokens.css defines --font-family-sans with no fallback list; without one, an
      // unloaded/unavailable family falls through to the browser's own default font.
      sans: ['var(--font-family-sans)', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
    },
  },
  plugins: [],
}

