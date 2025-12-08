# GTEP Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Folder Structure Details](#folder-structure-details)
5. [Key Configuration Files](#key-configuration-files)
6. [Architecture Patterns](#architecture-patterns)
7. [Development Workflow](#development-workflow)
8. [Environment Setup](#environment-setup)

---

## Project Overview

GTEP is a Next.js-based web application that provides a platform for training courses, achievements, leaderboards, and resource management. The application features:

- **Multi-language support** (English and Spanish)
- **Role-based access control** (Customer, Manager, Admin)
- **Authentication** via Supabase
- **Internationalization (i18n)** with locale-based routing
- **Responsive UI** built with Tailwind CSS and Ant Design

---

## Technology Stack

### Core Framework

- **Next.js 16.0.2** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type safety

### Backend & Database

- **Supabase** - Backend-as-a-Service (Authentication, Database)
- **@supabase/ssr** - Server-side rendering support for Supabase

### State Management & Data Fetching

- **@tanstack/react-query** - Server state management and data fetching
- **React Context API** - Client-side state management (Auth, Theme, Spinner)

### UI & Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **Ant Design 5.29.0** - UI component library
- **clsx & tailwind-merge** - Conditional class name utilities

### Forms

- **react-hook-form** - Form state management and validation

### Rich Text Editing

- **@tinymce/tinymce-react** - Rich text editor

### Charts

- **chart.js & react-chartjs-2** - Data visualization

### Internationalization

- **@formatjs/intl-localematcher** - Locale matching
- **negotiator** - Content negotiation for language detection

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting
- **Commitlint** - Commit message linting

---

## Project Structure

```
GTEP/
├── migrations/              # Database migration files
├── public/                  # Static assets
├── src/                     # Source code
│   ├── app/                 # Next.js App Router pages
│   ├── config/              # Configuration files
│   ├── context/             # React Context providers
│   ├── entity/              # TypeScript entity types
│   ├── enum/                # TypeScript enums
│   ├── hooks/               # Custom React hooks
│   ├── layout/              # Layout components
│   ├── lib/                 # Utility libraries
│   ├── providers/           # React providers
│   ├── types/               # TypeScript type definitions
│   └── ui/                  # UI components and atoms
├── commitlint.config.js     # Commitlint configuration
├── eslint.config.mjs        # ESLint configuration
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and scripts
├── postcss.config.mjs       # PostCSS configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

---

## Folder Structure Details

### `/migrations`

Contains SQL migration files for database schema setup.

**Files:**

- `001_create_users_table.sql` - Initial users table creation

**Purpose:** Database schema versioning and migrations.

---

### `/public`

Static assets served directly by Next.js.

**Structure:**

- `/assets/` - Images and graphics (elipse_bottom.png, elipse_top.png, pryze_main.png)
- SVG icons (file.svg, globe.svg, next.svg, vercel.svg, window.svg)
- `gtep.png` - Application logo/favicon

**Purpose:** Publicly accessible static files.

---

### `/src/app`

Next.js App Router directory. Contains all routes and pages.

#### `/src/app/layout.tsx`

Root layout component that wraps the entire application. Sets up:

- Font configuration (Geist Sans & Geist Mono)
- Global providers (QueryProvider, AuthProvider, ThemeProvider, SpinnerProvider)
- Metadata configuration
- LocaleSetter component

#### `/src/app/[lang]`

Locale-based routing directory. All routes are prefixed with a language code (e.g., `/en-US/`, `/es-ES/`).

**Pages:**

- `page.tsx` - Home page
- `layout.tsx` - Language-specific layout wrapper
- `/login/page.tsx` - Login page
- `/signup/page.tsx` - Signup page
- `/achievements/page.tsx` - Achievements page
- `/leader_board/page.tsx` - Leaderboard page
- `/notifications/page.tsx` - Notifications page
- `/profile/page.tsx` - User profile page
- `/resources/page.tsx` - Resources page
- `/training_courses/page.tsx` - Training courses page

**Purpose:** Implements internationalized routing with locale prefixes.

#### `/src/app/globals.css`

Global CSS styles and Tailwind CSS directives.

---

### `/src/config`

Application configuration files.

#### `/src/config/env.ts`

Environment variable validation and configuration. Exports:

- Supabase configuration (URL, anon key)
- TinyMCE API key
- Environment flags (isDevelopment, isStaging, isProduction, isLocal)
- Validates required environment variables at build time

#### `/src/config/i18n.ts`

Internationalization configuration:

- Supported locales: `['en-US', 'es-ES']`
- Default locale: `'en-US'`
- Locale names mapping

#### `/src/config/accessControl.ts`

Role-based access control configuration:

- `NAV_ITEMS` - Navigation menu items with role restrictions
- `ROUTE_RULES` - Route access rules based on user roles
- Helper functions for filtering navigation and checking route access
- Role-based navigation filtering

---

### `/src/context`

React Context providers for global state management.

#### `/src/context/AuthContext.tsx`

Authentication context provider:

- Manages user session and authentication state
- Provides `user`, `session`, `loading`, and `logout` function
- Integrates with Supabase auth
- Handles session persistence and cleanup

#### `/src/context/ThemeContext.tsx`

Theme management context (dark/light mode).

#### `/src/context/SpinnerContext.tsx`

Global loading spinner state management.

---

### `/src/entity`

TypeScript type definitions for domain entities.

#### `/src/entity/User.ts`

User entity type definition:

```typescript
type User = {
  id: string
  email?: string
  full_name?: string
  role?: Role
  created_at?: string
  password?: string
  photo_url?: string
}
```

---

### `/src/enum`

TypeScript enum definitions.

#### `/src/enum/User.ts`

User role enum:

```typescript
enum Role {
  CUSTOMER = 'customer',
  MANAGER = 'manager',
  ADMIN = 'admin'
}
```

---

### `/src/hooks`

Custom React hooks for reusable logic.

#### `/src/hooks/`

Hook to access Get requests

#### `/src/hooks/mutation/`

Hook to access POST, PUT, DELETE requests

#### `/src/hooks/i18n/`

Internationalization hooks:

- `useDictionary.ts` - Access translation dictionary
- `useLocale.ts` - Get current locale
- `index.ts` - Barrel export

---

### `/src/layout`

Layout components for different page types.

---

### `/src/lib`

Utility libraries and helper functions.

#### `/src/lib/supabase/`

Supabase client configuration:

- `supabaseBrowser.ts` - Browser-side Supabase client
- `supabaseServer.ts` - Server-side Supabase client factory

#### `/src/lib/i18n/`

Internationalization utilities:

- `dictionaries/` - Translation files (en.json, es.json)
- `dictionaries.ts` - Server-side dictionary loader
- `dictionaries.client.ts` - Client-side dictionary utilities
- `LocaleSetter.tsx` - Component for setting locale in HTML

---

### `/src/middleware.ts`

Next.js middleware for:

- Locale detection and routing (redirects to `/locale/path` if locale missing)
- Authentication protection (redirects unauthenticated users to login)
- Role-based access control (checks user role against route rules)
- Session management with Supabase

**Key Features:**

- Automatic locale injection into URLs
- Protected routes (all except `/login` and `/signup`)
- Role-based route access validation

---

### `/src/providers`

React provider components.

#### `/src/providers/QueryProvider.tsx`

React Query provider wrapper for data fetching and caching.

---

### `/src/types`

TypeScript type definitions.

#### `/src/types/supabase.ts`

Auto-generated Supabase database types.

---

### `/src/ui`

UI component library organized by atomic design principles.

#### `/src/ui/Atoms/`

Atomic UI components (smallest reusable components):

- `Badge/` - Badge component
- `Button/` - Button component with variants
- `Chart/` - Chart wrapper component
- `Collapse/` - Collapsible content component
- `Grid/` - Grid layout components (Grid.tsx, Responsive.tsx)
- `Input/` - Form input components:
  - `Checkbox/` - Checkbox input
  - `Input.tsx` - Text input
  - `InputField.tsx` - Form field wrapper
  - `MultiCheckBox/` - Multi-select checkbox
  - `RadioButton/` - Radio button input
  - `RadioButtonAction/` - Action-based radio buttons
  - `Ranking/` - Ranking input component
  - `RichTextEditorField.tsx` - Rich text editor field
  - `Select/` - Select dropdown
  - `TextArea/` - Textarea input
  - `utils/` - Input utilities (Error, FieldWrapper, etc.)
- `Label/` - Form label component
- `Wrapper/` - Conditional rendering wrapper
- `index.ts` - Barrel export for all atoms

#### `/src/ui/components/`

Composite components:

- `home/HomePage.tsx` - Home page component
- `LanguageSwitcher/` - Language switching component

#### `/src/ui/utils/`

UI utility functions:

- `cn.ts` - Class name utility (combines clsx and tailwind-merge)
- `icons/` - Custom icon components

#### `/src/ui/assets/`

UI assets:

- `icons/` - Custom icon components (CloseModalIcon, ContinueArrow, Delete, etc.)
- `images/` - Image assets (KDukaan-logo.svg)

---

## Key Configuration Files

### `package.json`

- **Scripts:**
  - `dev` - Development server
  - `dev:local` - Local development with NODE_ENV=development
  - `dev:staging` - Staging development server
  - `build` - Production build
  - `build:staging` - Staging build
  - `build:production` - Production build
  - `start` - Start production server
  - `lint` - Run ESLint
  - `lint:fix` - Fix ESLint errors
  - `type-check` - TypeScript type checking
  - `validate` - Run lint and type check

### `tsconfig.json`

TypeScript configuration:

- Base URL: `.` (project root)
- Path alias: `@/*` maps to `src/*`
- Target: ES2017
- Module: ESNext
- JSX: react-jsx

### `next.config.ts`

Next.js configuration (currently minimal, can be extended).

### `tailwind.config.ts`

Tailwind CSS configuration for styling.

### `eslint.config.mjs`

ESLint configuration for code quality.

### `commitlint.config.js`

Commit message linting configuration (conventional commits).

### `postcss.config.mjs`

PostCSS configuration for CSS processing.

---

## Architecture Patterns

### 1. **Internationalization (i18n)**

- Locale-based routing: All routes prefixed with locale (`/en-US/`, `/es-ES/`)
- Middleware handles locale detection and injection
- Dictionary-based translations stored in JSON files
- Client and server-side dictionary loading

### 2. **Authentication Flow**

- Supabase handles authentication
- Middleware protects routes (except `/login` and `/signup`)
- AuthContext provides global authentication state
- Session managed via cookies (SSR-compatible)

### 3. **Role-Based Access Control (RBAC)**

- Three roles: Customer, Manager, Admin
- Route-level access control via middleware
- Navigation filtering based on user role
- Configurable in `accessControl.ts`

### 4. **Component Architecture**

- Atomic Design: Atoms → Components → Pages
- Reusable form components with react-hook-form integration
- Consistent styling with Tailwind CSS and Ant Design

### 5. **State Management**

- **Server State:** React Query for API data
- **Client State:** React Context (Auth, Theme, Spinner)
- **Form State:** react-hook-form

### 6. **Type Safety**

- TypeScript throughout
- Supabase types auto-generated
- Entity types for domain models
- Enum types for constants

---

## Development Workflow

### Getting Started

1. **Install Dependencies:**

   ```bash
   yarn install
   ```

2. **Set Up Environment Variables:**
   Create a `.env.local` file with:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   TINYMCE_APIKEY=your_tinymce_key (optional)
   APP_ENV=local (optional)
   ```

3. **Run Development Server:**

   ```bash
   yarn dev
   ```

4. **Access Application:**
   Open [http://localhost:3000](http://localhost:3000)
   The middleware will automatically redirect to `/en-US/` or `/es-ES/` based on browser language.

### Code Quality

- **Linting:** `yarn lint` or `yarn lint:fix`
- **Type Checking:** `yarn type-check`
- **Full Validation:** `yarn validate` (lint + type check)

### Git Hooks

- **Pre-commit:** Runs lint-staged (ESLint + Prettier)
- **Commit Message:** Validated with Commitlint (conventional commits)

### Building for Production

```bash
# Staging
yarn build:staging
yarn start:staging

# Production
yarn build:production
yarn start:production
```

---

## Environment Setup

### Required Environment Variables

| Variable                        | Description                                        | Required            |
| ------------------------------- | -------------------------------------------------- | ------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                               | Yes                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key                             | Yes                 |
| `TINYMCE_APIKEY`                | TinyMCE API key for rich text editor               | No                  |
| `APP_ENV`                       | Application environment (local/staging/production) | No                  |
| `NODE_ENV`                      | Node environment (development/production)          | Auto-set by Next.js |

### Environment Detection

The application uses `NODE_ENV` and `APP_ENV` to determine the environment:

- **Development:** `NODE_ENV=development` or `APP_ENV=local`
- **Staging:** `APP_ENV=staging`
- **Production:** `NODE_ENV=production` and `APP_ENV=production`

---

## Additional Notes

### Routing Structure

All routes are locale-prefixed:

- `/en-US/login` - English login
- `/es-ES/login` - Spanish login
- `/en-US/achievements` - English achievements page

The middleware automatically:

1. Detects missing locale and redirects
2. Protects authenticated routes
3. Validates role-based access

### Adding New Routes

1. Create page in `/src/app/[lang]/your-route/page.tsx`
2. Add route to `NAV_ITEMS` in `accessControl.ts` if needed
3. Add route rules in `ROUTE_RULES` if role-based access is required

### Adding New Translations

1. Add keys to `/src/lib/i18n/dictionaries/en.json`
2. Add translations to `/src/lib/i18n/dictionaries/es.json`
3. Use `useDictionary()` hook in components

### Adding New Roles

1. Add role to `Role` enum in `/src/enum/User.ts`
2. Update database schema if needed
3. Update `accessControl.ts` route rules

---

## Support

For questions or issues, please refer to:

- Next.js Documentation: https://nextjs.org/docs
- Supabase Documentation: https://supabase.com/docs
- React Query Documentation: https://tanstack.com/query/latest
