import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import unusedImports from 'eslint-plugin-unused-imports'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
})

const config = [
  {
    ignores: ['next-env.d.ts', 'graphql/**/*.ts', '.next/**', 'node_modules/**']
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'plugin:@next/next/recommended',
    'prettier'
  ),
  {
    plugins: {
      react,
      '@typescript-eslint': typescriptEslint,
      prettier,
      'unused-imports': unusedImports
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        requireConfigFile: false,
        ecmaFeatures: {
          jsx: true,
          tsx: true
        }
      }
    },

    rules: {
      'import/no-unresolved': 'off',
      'jsx-a11y/accessible-emoji': 'off',
      'jsx-a11y/iframe-has-title': 'off',
      'no-const-assign': 'warn',
      'no-extra-boolean-cast': 'warn',
      'no-irregular-whitespace': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'prefer-const': 'warn',
      'prettier/prettier': 'warn',
      quotes: 'off',
      'spaced-comment': ['warn', 'always'],

      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['hrefLeft', 'hrefRight'],
          aspects: ['invalidHref', 'preferButton']
        }
      ],

      'max-len': [
        'warn',
        {
          code: 100,
          tabWidth: 2,
          ignoreComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true
        }
      ],

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-require-imports': 'off'
    }
  }
]

export default config
