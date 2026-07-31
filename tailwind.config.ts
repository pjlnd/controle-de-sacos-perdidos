import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        kraft: '#EDE6D6',
        kraftdark: '#DCD2B8',
        ink: '#1F2A38',
        inkfaded: '#4B5A6B',
        amber: '#F2A93B',
        alert: '#C1442D',
        found: '#3F7F5C',
      },
      fontFamily: {
        stencil: ['var(--font-stencil)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
};

export default config;
