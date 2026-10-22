// packages/eslint-config/base.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import turbo from 'eslint-plugin-turbo';
import globals from 'globals';

export const config = tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { turbo },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', '.next/**', 'coverage/**'],
  },
);