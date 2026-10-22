// packages/eslint-config/nestjs.js
import { config as base } from './base.js';

export const config = [
  ...base,
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];