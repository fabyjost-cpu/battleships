import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'blue-500',
        secondary: 'gray-500',
        success: 'green-500',
        danger: 'red-500',
        background: 'slate-900',
        surface: 'slate-800',
      },
    },
  },
  plugins: [],
};

export default config;
