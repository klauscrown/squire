import expo from 'eslint-config-expo/flat.js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...expo,
  eslintConfigPrettier,
  eslintPluginPrettier,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*'],
  },
  {
    rules: {
      'prettier/prettier': 'warn',
    },
  },
]);
