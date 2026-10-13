// packages/eslint-config/base.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import turboConfig from 'eslint-plugin-turbo';
import globals from 'globals';

export const config = tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { turbo: turboConfig },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', '.next/**'],
  },
);