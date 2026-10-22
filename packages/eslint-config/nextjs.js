// packages/eslint-config/nextjs.js
import next from '@next/eslint-plugin-next';
import globals from 'globals';
import { config as reactInternal } from './react-internal.js';

export const config = [
  ...reactInternal,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: { '@next/next': next },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
];