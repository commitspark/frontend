import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import typeScriptLint from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...typeScriptLint,
  globalIgnores([
    'node_modules/**',
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    files: ['./**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prefer-const': 'warn',

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
])
