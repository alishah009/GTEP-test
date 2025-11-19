import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Make unused variables an error
      '@typescript-eslint/no-unused-vars': 'error'

      // Make console.log an error
      //  'no-console': ['error', { allow: ['warn', 'error'] }]

      // Optional: Customize other rules
      // 'semi': ['error', 'always'],
      // 'quotes': ['error', 'single']
    }
  },
  // Override default ignores of eslint-config-next
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts'])
])
