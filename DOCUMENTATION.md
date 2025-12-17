# GTEP Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [GitHub Repository](#github-repository)
4. [Branching Strategy](#branching-strategy)
5. [Development Workflows](#development-workflows)
6. [Project Structure](#project-structure)
7. [Folder Purposes](#folder-purposes)
8. [Key Configuration Files](#key-configuration-files)
9. [Architecture Patterns](#architecture-patterns)
10. [Technical Structure](#technical-structure)
11. [Backend-Frontend Communication](#backend-frontend-communication)
12. [API Documentation](#api-documentation)
13. [Database Schemas](#database-schemas)
14. [Integration Points](#integration-points)
15. [Engineering Standards](#engineering-standards)

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

## GitHub Repository

### Repository List

| Repository | Purpose          | Description                                                                                                              |
| ---------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `gtep`     | Main Application | Primary Next.js web application repository containing the full-stack application code, UI components, and business logic |

**Note:** Currently, the project consists of a single monorepo. Additional repositories may be added as the project scales (e.g., separate repositories for mobile apps, microservices, or shared libraries).

---

## Branching Strategy

### Branch Types

The project follows a **Feature Branch** workflow with the following branch types:

1. **`main`**
   - Production-ready code
   - Protected branch (requires pull request approval)
   - Only updated via merge from `dev` or hotfix branches
   - Automatically deployed to production

2. **`dev`**
   - Integration branch for features
   - All feature branches merge here first
   - Used for staging environment

3. **`feature/*`**
   - Feature development branches
   - Naming convention: `feature/description-of-feature`
   - Examples: `feature/user-authentication`, `feature/leaderboard-page`
   - Merged into `develop` or `main` via pull request

4. **`bugfix/*`** or **`fix/*`**
   - Bug fix branches
   - Naming convention: `bugfix/description-of-fix` or `fix/issue-number`
   - Examples: `fix/login-redirect-issue`, `bugfix/memory-leak`

5. **`hotfix/*`**
   - Critical production fixes
   - Branched from `main`
   - Merged back to both `main` and `develop`
   - Naming convention: `hotfix/critical-issue-description`

### Branch Naming Conventions

- Use lowercase letters
- Separate words with hyphens (`-`)
- Be descriptive but concise
- Include issue/ticket numbers if applicable

**Examples:**

- `feature/add-achievements-page`
- `fix/123-auth-session-expiry`
- `hotfix/security-patch`

### Workflow

1. Create a feature branch from `dev`
2. Develop and commit changes
3. Push branch to remote
4. Create a Pull Request (PR)
5. Code review and approval
6. Merge after CI/CD checks pass
7. Delete feature branch after merge

---

## Development Workflows

### Feature Development: From BRD to Production

#### 1. **Business Requirements Document (BRD) Review**

- Product team creates/updates BRD
- Technical team reviews for feasibility
- Estimation and planning session
- Task breakdown and assignment

#### 2. **Development Phase**

**a. Branch Creation**

```bash
git checkout dev
git pull origin dev
git checkout -b feature/feature-name
```

**b. Local Development**

- Set up local environment (see [Environment Setup](#environment-setup))
- Write code following [Engineering Standards](#engineering-standards)
- Write tests (unit, integration, component tests)
- Test locally: `yarn dev`

**c. Code Quality Checks**

```bash
yarn validate  # Runs lint and type-check
yarn test      # Runs test suite
```

**d. Commit Changes**

- Follow conventional commit format (enforced by Commitlint)
- Commit message format: `type(scope): description`
- Examples:
  - `feat(auth): add remember me functionality`
  - `fix(ui): resolve button alignment issue`
  - `refactor(hooks): simplify useAuth hook`

#### 3. **Pre-Commit Phase**

- Git hooks (Husky) automatically run:
  - Empty file check
  - Linting (`yarn validate`)
  - Tests (`yarn test`)
  - Prettier formatting
- All checks must pass before commit succeeds

#### 4. **Pull Request Creation**

- Push branch to remote: `git push origin feature/feature-name`
- Create PR on GitHub/GitLab
- PR description should include:
  - Feature description
  - Changes made
  - Testing instructions
  - Screenshots (if UI changes)
  - Related issue/ticket numbers

#### 5. **Code Review Process**

- At least one approval required
- Reviewers check:
  - Code quality and standards
  - Test coverage
  - Performance considerations
  - Security implications
  - Documentation updates
- Address review comments
- Re-request review after changes

#### 6. **CI/CD Pipeline** (if configured)

- Automated checks on PR:
  - Linting
  - Type checking
  - Test execution
  - Build verification
- All checks must pass before merge

#### 7. **Merge to Main**

- Squash and merge (recommended) or merge commit
- Delete feature branch after merge
- PR automatically closes

#### 8. **Deployment**

- **Staging:** Automatic deployment on merge to `dev` (if using Git Flow)
- **Production:** Manual or automatic deployment from `main`
- Deployment process (see [Build and Deployment Process](#build-and-deployment-process))

#### 9. **Post-Deployment**

- Monitor application logs
- Verify feature in production
- Update documentation if needed
- Close related tickets/issues

### Hotfix Workflow

For critical production issues:

1. Create hotfix branch from `main`: `git checkout -b hotfix/critical-issue main`
2. Fix the issue
3. Test thoroughly
4. Create PR targeting `main`
5. Expedited review and approval
6. Merge to `main`
7. Merge back to `develop` (if applicable)
8. Deploy to production immediately

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

## Folder Purposes

| Folder               | Purpose                                                                 |
| -------------------- | ----------------------------------------------------------------------- |
| `/migrations`        | Database migration files for schema versioning                          |
| `/public`            | Static assets (images, icons, fonts) served directly by Next.js         |
| `/src/app`           | Next.js App Router pages and routes (locale-based routing)              |
| `/src/config`        | Application configuration (environment variables, i18n, access control) |
| `/src/context`       | React Context providers for global state (Auth, Theme, Spinner)         |
| `/src/entity`        | TypeScript type definitions for domain entities                         |
| `/src/enum`          | TypeScript enum definitions (e.g., User roles)                          |
| `/src/hooks`         | Custom React hooks (queries, mutations, i18n)                           |
| `/src/layout`        | Layout components for different page types                              |
| `/src/lib`           | Utility libraries (Supabase clients, i18n utilities)                    |
| `/src/middleware.ts` | Next.js middleware (locale detection, auth protection, RBAC)            |
| `/src/providers`     | React provider components (QueryProvider, etc.)                         |
| `/src/types`         | TypeScript type definitions (Supabase types, etc.)                      |
| `/src/ui`            | UI component library (Atoms, components, utilities, assets)             |

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

## Technical Structure

### Design Patterns

#### 1. **Atomic Design Pattern**

- **Atoms:** Smallest reusable components (Button, Input, Badge)
- **Molecules:** Combinations of atoms (InputField with Label)
- **Organisms:** Complex components (Form, Navigation)
- **Templates:** Page layouts
- **Pages:** Complete page implementations

#### 2. **Container/Presentational Pattern**

- Separation of logic (containers) and presentation (components)
- Hooks handle business logic
- Components focus on rendering

#### 3. **Provider Pattern**

- Context providers for global state (Auth, Theme, Spinner)
- Wraps application in root layout

#### 4. **Custom Hooks Pattern**

- Reusable logic extraction
- Separation of concerns
- Examples: `useAuth`, `useLogin`, `useDictionary`

#### 5. **Repository Pattern** (via Supabase)

- Data access abstraction through Supabase client
- Centralized database operations

### Package Organization

```
src/
├── app/              # Next.js App Router (pages/routes)
├── config/          # Configuration files (env, i18n, access control)
├── context/         # React Context providers (global state)
├── entity/          # Domain entity type definitions
├── enum/            # TypeScript enums
├── hooks/           # Custom React hooks
│   ├── mutation/    # Mutation hooks (POST, PUT, DELETE)
│   └── i18n/        # Internationalization hooks
├── layout/          # Layout components
├── lib/             # Utility libraries
│   ├── supabase/    # Supabase client configuration
│   ├── i18n/        # i18n utilities and dictionaries
│   └── queries/     # Query definitions (future)
├── middleware.ts    # Next.js middleware
├── providers/       # React provider components
├── types/           # TypeScript type definitions
└── ui/              # UI component library
    ├── Atoms/       # Atomic components
    ├── components/  # Composite components
    └── utils/       # UI utilities
```

### Application Layers

1. **Presentation Layer** (`src/app`, `src/ui`)
   - Pages, components, UI atoms
   - User interface and interactions

2. **Business Logic Layer** (`src/hooks`, `src/context`)
   - Custom hooks for business logic
   - State management
   - Data transformations

3. **Data Access Layer** (`src/lib/supabase`)
   - Supabase client configuration
   - Database queries and mutations
   - API communication

4. **Configuration Layer** (`src/config`)
   - Environment configuration
   - Feature flags
   - Access control rules

5. **Type System Layer** (`src/entity`, `src/enum`, `src/types`)
   - Domain models
   - Type definitions
   - Type safety enforcement

### Module Organization Principles

- **Feature-based organization:** Related code grouped together
- **Separation of concerns:** Clear boundaries between layers
- **Reusability:** Shared components and utilities
- **Type safety:** TypeScript throughout
- **Barrel exports:** `index.ts` files for clean imports

---

## Backend-Frontend Communication

### Communication Architecture

GTEP uses a **RESTful API architecture** through Supabase, which provides:

1. **Supabase REST API**
   - Automatic REST API generation from database schema
   - RESTful endpoints for all database tables
   - Built-in authentication and authorization

2. **Supabase Realtime**
   - WebSocket connections for real-time updates
   - Subscriptions to database changes
   - Real-time collaboration features

3. **Supabase Auth API**
   - Authentication endpoints (sign up, sign in, sign out)
   - Session management
   - User management

### Communication Flow

```
Frontend (Next.js)
    ↓
Supabase Client (Browser/Server)
    ↓
Supabase REST API / Realtime
    ↓
PostgreSQL Database
```

### Data Fetching Patterns

#### 1. **React Query for Server State**

- Used for all data fetching operations
- Automatic caching and refetching
- Optimistic updates support

**Example:**

```typescript
// Query hook
const { data, isLoading } = useQuery({
  queryKey: ['user'],
  queryFn: async () => {
    const supabase = getSupabaseClient()
    const { data } = await supabase.from('users').select('*')
    return data
  }
})
```

#### 2. **Mutation Hooks for Data Modifications**

- POST, PUT, DELETE operations
- Error handling and loading states
- Cache invalidation

**Example:**

```typescript
// Mutation hook
const mutation = useMutation({
  mutationFn: async (userData) => {
    const supabase = getSupabaseClient()
    const { data } = await supabase.from('users').insert(userData)
    return data
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }
})
```

### API Client Configuration

#### Browser Client (`src/lib/supabase/supabaseBrowser.ts`)

- Client-side Supabase client
- Handles authentication persistence
- Session storage management
- Used in React components and hooks

#### Server Client (`src/lib/supabase/supabaseServer.ts`)

- Server-side Supabase client factory
- Used in Server Components and API routes
- Cookie-based session management
- SSR-compatible

### Request/Response Format

- **Request:** Standard HTTP methods (GET, POST, PUT, DELETE)
- **Response:** JSON format
- **Authentication:** JWT tokens via Supabase Auth
- **Error Handling:** Standardized error responses from Supabase

### Middleware Integration

The Next.js middleware (`src/middleware.ts`) handles:

- Session validation on each request
- Authentication checks
- Role-based access control
- Locale routing

---

## API Documentation

### API Architecture

GTEP uses **Supabase** as its backend, which automatically generates RESTful APIs from the database schema. The application does not currently have custom API routes in Next.js, but uses Supabase's auto-generated APIs.

### Authentication Endpoints

All Supabase endpoints are accessed through the Supabase client SDK, not directly via HTTP. Authentication is handled through:

- `supabase.auth.signUp()` - User registration
- `supabase.auth.signInWithPassword()` - User login
- `supabase.auth.signOut()` - User logout
- `supabase.auth.getSession()` - Get current session
- `supabase.auth.getUser()` - Get current user

### API Usage in Code

All API calls are made through Supabase client instances:

```typescript
// Browser-side
import { getSupabaseClient } from '@/lib/supabase/supabaseBrowser'
const supabase = getSupabaseClient()
const { data } = await supabase.from('users').select('*')

// Server-side
import { createServerClient } from '@/lib/supabase/supabaseServer'
const supabase = createServerClient()
const { data } = await supabase.from('users').select('*')
```

---

## Database Schemas

### Entity Relationship Diagram

```
┌─────────────────┐
│   auth.users    │ (Supabase Auth)
│  (managed by    │
│   Supabase)     │
└────────┬────────┘
         │
         │ (1:1 relationship via id)
         │
         ▼
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (uuid, PK)   │───┐
│ full_name       │   │
│ role (enum)     │   │
│ created_at      │   │
└─────────────────┘   │
                      │
                      │ (references auth.users.id)
                      │
         ┌────────────┘
         │
         │ Foreign Key Constraint
         │ ON DELETE CASCADE
```

---

## Integration Points

### External Systems and Services

#### 1. **Supabase**

**Purpose:** Backend-as-a-Service (BaaS)

**Integration Points:**

- **Authentication:** User sign up, sign in, sign out, session management
- **Database:** PostgreSQL database with REST API
- **Storage:** File storage (if used in future)
- **Realtime:** Real-time subscriptions (if used in future)

**Configuration:**

- URL: `NEXT_PUBLIC_SUPABASE_URL`
- Anon Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Service Role Key: Used server-side (not exposed to client)

**Integration Method:**

- Supabase JavaScript SDK (`@supabase/supabase-js`)
- SSR support via `@supabase/ssr`
- Client instances: Browser and Server

**Location in Code:**

- `src/lib/supabase/supabaseBrowser.ts` - Browser client
- `src/lib/supabase/supabaseServer.ts` - Server client
- `src/hooks/mutation/useAuth.ts` - Auth operations
- `src/middleware.ts` - Session validation

#### 2. **Vercel** (Deployment Platform)

**Purpose:** Hosting and deployment

**Integration Points:**

- Automatic deployments from Git
- Environment variable management
- Serverless function hosting (if used)

**Configuration:**

- Connected via Git repository
- Environment variables set in Vercel dashboard

### Future Integration Points

Potential integrations to be added:

- **Email Service** (SendGrid, AWS SES, etc.)
  - User notifications
  - Password reset emails
  - Welcome emails

- **Analytics** (Google Analytics, Mixpanel, etc.)
  - User behavior tracking
  - Performance monitoring

- **Error Tracking** (Sentry, Rollbar, etc.)
  - Error logging and monitoring
  - Performance tracking

- **Payment Gateway** (Stripe, PayPal, etc.)
  - Subscription management
  - Payment processing

### Integration Best Practices

1. **Environment Variables:** Store all API keys and secrets in environment variables
2. **Error Handling:** Implement proper error handling for all external API calls
3. **Rate Limiting:** Respect API rate limits
4. **Retry Logic:** Implement retry logic for transient failures
5. **Monitoring:** Monitor integration health and errors
6. **Documentation:** Document all integration points and their configurations

---

## Engineering Standards

### Code Quality Standards

#### 1. **Linting**

**Tool:** ESLint

**Configuration:** `eslint.config.mjs`

**Rules:**

- Next.js recommended rules
- TypeScript strict rules
- Unused variables treated as errors
- Custom rules can be added

**Commands:**

```bash
yarn lint          # Check for linting errors
yarn lint:fix       # Auto-fix linting errors
```

**Pre-commit:** Automatically runs via Husky

#### 2. **Code Formatting**

**Tool:** Prettier

**Configuration:** Default Prettier configuration (can be customized)

**Commands:**

```bash
# Runs automatically on pre-commit via lint-staged
# Can also run manually:
npx prettier --write .
```

**Pre-commit:** Automatically formats staged files

#### 3. **Type Checking**

**Tool:** TypeScript Compiler

**Configuration:** `tsconfig.json`

**Settings:**

- Strict mode enabled
- No implicit any
- Strict null checks
- Path aliases: `@/*` → `src/*`

**Commands:**

```bash
yarn type-check    # Type check without emitting files
```

**Pre-commit:** Runs as part of `yarn validate`

#### 4. **Static Analysis**

**Current Tools:**

- ESLint (code quality)
- TypeScript (type safety)

**Future Recommendations:**

- SonarQube (code quality metrics)
- CodeQL (security analysis)
- Bundle analyzer (bundle size analysis)

### Testing Standards

#### 1. **Testing Framework**

**Tool:** Jest with React Testing Library

**Configuration:** `jest.config.js`

**Setup:** `jest.setup.ts`

#### 2. **Test Types**

- **Unit Tests:** Test individual functions and components
- **Integration Tests:** Test component interactions
- **Component Tests:** Test UI components with React Testing Library

**Test File Naming:** `*.test.tsx` or `*.test.ts`

**Example Test Structure:**

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  })
})
```

#### 3. **Test Coverage**

**Current Status:** Tests exist for some components (Badge, Button, Chart, etc.)

**Target Coverage:** Aim for 80%+ coverage for critical paths

**Commands:**

```bash
yarn test           # Run tests
yarn test --coverage # Run with coverage report
```

**Pre-commit:** Tests run automatically before commit

### Code Review Standards

#### 1. **Review Requirements**

- At least **one approval** required before merge
- All CI/CD checks must pass
- No blocking issues from code review

#### 2. **Review Checklist**

- [ ] Code follows project conventions
- [ ] No linting or type errors
- [ ] Tests are included and passing
- [ ] Documentation is updated (if needed)
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed
- [ ] Error handling is appropriate
- [ ] Code is readable and maintainable

#### 3. **Review Process**

1. Author creates PR
2. Reviewers are assigned manually
3. Reviewers provide feedback
4. Author addresses feedback
5. Re-request review after changes
6. Approve and merge

### Commit Message Standards

**Tool:** Commitlint

**Configuration:** `commitlint.config.js`

**Format:** Conventional Commits

**Structure:**

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Maintenance tasks
- `build`: Build system changes
- `ci`: CI/CD changes
- `perf`: Performance improvements
- `revert`: Revert previous commit

**Examples:**

```
feat(auth): add remember me functionality
fix(ui): resolve button alignment issue
docs(readme): update installation instructions
refactor(hooks): simplify useAuth hook
```

**Validation:** Pre-commit hook validates commit messages

### Git Workflow Standards

1. **Branch Naming:** Follow [Branching Strategy](#branching-strategy)
2. **Commit Frequency:** Commit often with meaningful messages
3. **Pull Requests:** Required for all changes to main branch
4. **Code Review:** Mandatory before merge
5. **Clean History:** Use squash merge for feature branches (recommended)

### Documentation Standards

1. **Code Comments:** Add comments for complex logic
2. **README Updates:** Update README for significant changes
3. **API Documentation:** Document new APIs (if added)
4. **Changelog:** Maintain changelog for releases (if applicable)

### Security Standards

1. **Secrets Management:** Never commit secrets to repository
2. **Environment Variables:** Use `.env.local` for local development
3. **Dependencies:** Regularly update dependencies
4. **Authentication:** Always validate user sessions
5. **Authorization:** Implement role-based access control
6. **Input Validation:** Validate all user inputs
7. **SQL Injection:** Use parameterized queries (Supabase handles this)

### Performance Standards

1. **Bundle Size:** Monitor and optimize bundle size
2. **Code Splitting:** Use Next.js automatic code splitting
3. **Image Optimization:** Use Next.js Image component
4. **Lazy Loading:** Lazy load heavy components
5. **Caching:** Use React Query for data caching
6. **Database Queries:** Optimize database queries

### Automation

**Pre-commit Hooks (Husky):**

- Empty file check
- Linting (`yarn validate`)
- Tests (`yarn test`)
- Prettier formatting

**CI/CD (Future):**

- Automated testing on PR
- Automated deployment on merge
- Security scanning
- Performance monitoring

---

### Prerequisites

Before setting up the development environment, ensure you have:

- **Node.js:** Version 18.x or higher
- **Yarn:** Package manager (or npm)
- **Git:** Version control
- **Supabase Account:** For backend services
- **Code Editor:** VS Code (recommended) or any IDE

### Step-by-Step Setup Instructions

#### 1. **Clone the Repository**

```bash
git clone <repository-url>
cd gtep
```

#### 2. **Install Dependencies**

```bash
yarn install
```

This installs all project dependencies defined in `package.json`.

#### 3. **Set Up Environment Variables**

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local  # If .env.example exists
# Or create manually:
touch .env.local
```

Add the following environment variables:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Environment (Optional)
APP_ENV=local
```

#### 4. **Set Up Git Hooks**

Git hooks are automatically set up via Husky when you run `yarn install` (via `prepare` script).

If needed, manually set up:

```bash
yarn prepare
```

#### 5. **Verify Installation**

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The application should:

- Automatically redirect to `/en-US/` or `/es-ES/` based on browser language
- Show login page if not authenticated
- Allow signup/login functionality

#### 6. **Run Quality Checks**

Verify everything is working:

```bash
yarn validate  # Lint and type check
yarn test      # Run tests
```

### Required Environment Variables

| Variable                        | Description                                        | Required | Where to Get It                     |
| ------------------------------- | -------------------------------------------------- | -------- | ----------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                               | Yes      | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key                             | Yes      | Supabase Dashboard → Settings → API |
| `APP_ENV`                       | Application environment (local/staging/production) | No       | Set to `local` for development      |
| `NODE_ENV`                      | Node environment (development/production)          | Auto     | Auto-set by Next.js                 |

#### VS Code Extensions (Optional)

If using VS Code, these extensions are recommended for a better development experience:

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- GitLens

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
2. Update database schema
3. Update `accessControl.ts` route rules

---

## Support

For questions or issues, please refer to:

- Next.js Documentation: https://nextjs.org/docs
- Supabase Documentation: https://supabase.com/docs
- React Query Documentation: https://tanstack.com/query/latest
