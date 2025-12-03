/**
 * Environment Configuration
 *
 * This file validates and exports typed environment variables.
 * It ensures all required environment variables are present at build time.
 *
 * Note: NODE_ENV in Next.js can only be "development", "production", or "test".
 * Use APP_ENV to distinguish between staging and production.
 */

const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
} as const

const optionalEnvVars = {
  TINYMCE_APIKEY: process.env.TINYMCE_APIKEY,
  APP_ENV: process.env.APP_ENV // Custom env: 'local' | 'staging' | 'production'
} as const

// Validate required environment variables
const missingVars: string[] = []
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    missingVars.push(key)
  }
}

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}\n` +
      `Please check your .env file and ensure all required variables are set.`
  )
}

// Determine environment
const nodeEnv = process.env.NODE_ENV || 'development'
const appEnv = (optionalEnvVars.APP_ENV || nodeEnv) as 'local' | 'staging' | 'production'

/**
 * Environment configuration object
 * All required variables are guaranteed to be defined
 */
export const env = {
  // Supabase
  supabase: {
    url: requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: requiredEnvVars.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  },

  // TinyMCE
  tinymce: {
    apiKey: optionalEnvVars.TINYMCE_APIKEY || ''
  },

  // Environment
  nodeEnv,
  appEnv,
  isDevelopment: nodeEnv === 'development',
  isStaging: appEnv === 'staging',
  isProduction: appEnv === 'production' || (nodeEnv === 'production' && appEnv !== 'staging'),
  isLocal: appEnv === 'local' || nodeEnv === 'development'
} as const

// Type exports for use in other files
export type Env = typeof env
