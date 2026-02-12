import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prefer-const': 'warn',

      // Disallow deep imports like `graphql/type` or `graphql/type/definition`.
      // Always import from the top-level `graphql` entrypoint instead.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['graphql/*'],
              message:
                'Do not use deep imports from "graphql/*" (can cause multiple realms at runtime when bundled). Import from "graphql" instead.',
            },
          ],
        },
      ],
    },
  },
]

export default eslintConfig
