import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    // Extend recommended ESLint, React, and TypeScript configs
    extends: [
      js.configs.recommended,
      'plugin:react/recommended', // Add React specific linting rules
      'plugin:@typescript-eslint/recommended', // Add TypeScript specific linting rules
    ],
    files: ['**/*.{ts,tsx,js,jsx}'], // Ensure both TS/TSX and JS/JSX are included
    parser: '@typescript-eslint/parser', // Use TypeScript parser for TS/TSX files
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true, // Enable JSX parsing
      },
    },
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': tseslint,
    },
    rules: {
      'no-unused-vars': 'warn', // Relax to warnings
      'no-console': 'off', // Allow console logs
      'react/react-in-jsx-scope': 'off', // No need to import React for JSX in modern React
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Disable explicit return types
      '@typescript-eslint/no-explicit-any': 'off', // Allow `any` type for faster development
      '@typescript-eslint/ban-ts-comment': 'off', // Allow @ts-ignore comments
      'react/jsx-uses-react': 'off', // Disable unnecessary React usage rule
      'react/jsx-uses-vars': 'warn', // Warn on JSX variables not used
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
);
