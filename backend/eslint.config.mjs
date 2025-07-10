import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: './tsconfig.json', ecmaVersion: 'latest' },
    },
    plugins: { '@typescript-eslint': eslintPluginTs },
    rules: {
      ...eslintPluginTs.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '.prisma/', 'prisma/', 'src/generated/prisma/**'],
  },
  prettierConfig,
];
