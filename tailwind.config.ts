import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 12px 40px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
