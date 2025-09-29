// eslint.config.js
import js from '@eslint/js';
import hydrogen from 'eslint-plugin-hydrogen';
import remix from '@remix-run/eslint-config';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  remix, // Remix defaults
  hydrogen.configs.recommended,
  hydrogen.configs.typescript,

  {
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      'import/no-unresolved': [
        'error',
        {ignore: ['^@tailwindcss/vite$']}, // silence Tailwind plugin false alarm
      ],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/naming-convention': 'off',
      'hydrogen/prefer-image-component': 'off',
      'no-useless-escape': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      'no-case-declarations': 'off',
      'jest/no-deprecated-functions': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
          'newlines-between': 'always',
        },
      ],
    },
  },
];
