const config = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'react-app',
    'next/core-web-vitals',
    'plugin:@next/next/recommended',
    'plugin:tailwindcss/recommended',
    'next',
    'plugin:unicorn/recommended',
    'prettier' // make sure it's the last one,
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      tsx: true
    }
  },
  plugins: ['react', '@typescript-eslint', 'prettier', 'tailwindcss', 'unused-imports'],
  /*
  More: https://eslint.org/docs/rules/
  "rules" always win over "extends"
  */
  rules: {
    'import/no-unresolved': 'off',
    'jsx-a11y/accessible-emoji': 'off',
    'jsx-a11y/iframe-has-title': 'off',
    'no-const-assign': 'warn',
    'no-extra-boolean-cast': 'warn',
    'no-irregular-whitespace': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-unused-vars': 'warn',
    'prefer-const': 'warn',
    'prettier/prettier': 'warn',
    quotes: 'off',
    'spaced-comment': ['warn', 'always'],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'] // Because it takes a lot of time!!!
      }
    ],
    'tailwindcss/no-custom-classname': 'off',
    'tailwindcss/enforces-negative-arbitrary-values': 'off',
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
    'tailwindcss/classnames-order': 'off'
  },
  ignorePatterns: ['next-env.d.ts', 'graphql/**/*.ts']
}

export default config
