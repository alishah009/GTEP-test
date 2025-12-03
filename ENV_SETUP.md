# Environment Configuration Guide

This project uses environment-specific configuration files for different deployment environments.

## Environment Files

The project supports three environments:

- **Local** (`.env.local`) - For local development
- **Staging** (`.env.staging`) - For staging/testing environment
- **Production** (`.env.production`) - For production environment

## Setup Instructions

### 1. Create Environment Files

Copy the example files and fill in your actual values:

```bash
# For local development
cp .env.local.example .env.local

# For staging (if deploying to staging)
cp .env.staging.example .env.staging

# For production (if deploying to production)
cp .env.production.example .env.production
```

### 2. Fill in Environment Variables

Edit each `.env` file with your actual values:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `TINYMCE_APIKEY` - Your TinyMCE API key
- `APP_ENV` - Set to `local`, `staging`, or `production`

### 3. Environment File Priority

Next.js loads environment files in the following order (later files override earlier ones):

1. `.env` - Default values for all environments
2. `.env.local` - Local overrides (ignored by git)
3. `.env.development`, `.env.production`, `.env.staging` - Environment-specific
4. `.env.local` - Highest priority (ignored by git)

## Running the Application

### Local Development

```bash
yarn dev
# or
yarn dev:local
```

### Staging

```bash
# Build for staging
yarn build:staging

# Start staging server
yarn start:staging
```

### Production

```bash
# Build for production
yarn build:production

# Start production server
yarn start:production
```

## Environment Variables Reference

### Required Variables

| Variable                        | Description            | Example                                   |
| ------------------------------- | ---------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL   | `https://xxx.supabase.co`                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Optional Variables

| Variable         | Description             | Example                          |
| ---------------- | ----------------------- | -------------------------------- |
| `TINYMCE_APIKEY` | TinyMCE API key         | `your-api-key`                   |
| `APP_ENV`        | Application environment | `local`, `staging`, `production` |

## Using Environment Variables in Code

### Option 1: Direct Access (Current)

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
```

### Option 2: Using the Config Helper (Recommended)

```typescript
import { env } from '@/config/env'

const supabaseUrl = env.supabase.url
const isProduction = env.isProduction
```

## Important Notes

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Never commit actual `.env.staging` or `.env.production`** - Only commit the `.example` files
3. **`NEXT_PUBLIC_*` variables** are exposed to the browser - don't put secrets here
4. **Server-only variables** (without `NEXT_PUBLIC_`) are only available on the server

## Deployment

### Vercel

Set environment variables in the Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable for the appropriate environment (Production, Preview, Development)

### Other Platforms

Set environment variables according to your platform's documentation. Make sure to set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `TINYMCE_APIKEY` (if needed)
- `APP_ENV` (optional, defaults based on NODE_ENV)
