# Next.js Starter Template

A production-ready starter template for building modern Next.js applications. Provides a clean, opinionated foundation with sensible defaults for code quality, security, testing, CI/CD, and developer experience — so you can skip the boilerplate and focus on building.

## Features

- **Next.js 16** with App Router and standalone output
- **React 19** with the React Compiler enabled
- **TypeScript** in strict mode
- **Tailwind CSS 4** with theme tokens and dark mode support
- **ESLint 9** with flat config and custom project rules
- **Prettier 3** with Tailwind-aware formatting
- **Vitest 4** with React Testing Library, jsdom, and V8 coverage
- **Security headers** — HSTS, CSP with per-request nonces, COOP, COEP, and more
- **Error boundaries** — custom `error`, `not-found`, `forbidden`, `unauthorized`, and `global-error` pages
- **SEO** — programmatic `robots.ts` and `sitemap.ts`
- **Environment validation** with T3 Env and Zod
- **Git hooks** — Husky, lint-staged, Commitlint, and branch name enforcement
- **Docker** — multi-stage Dockerfile with dev and production targets, plus Compose
- **CI/CD** — GitHub Actions for linting, type checking, tests, builds, dependency audits, and CodeQL analysis
- **Dependabot** — automated dependency updates for npm, GitHub Actions, and Docker
- **API routes** — `/api/health` endpoint (used by Docker healthcheck)
- **PNPM** as the package manager

## Stack

| Technology      | Version     |
| --------------- | ----------- |
| Next.js         | `16.2.4`    |
| React           | `19.2.4`    |
| TypeScript      | `^5`        |
| Tailwind CSS    | `^4`        |
| ESLint          | `^9`        |
| Vitest          | `^4`        |
| Testing Library | `^16`       |
| PNPM            | `10.30.0`   |
| Node.js         | `>=22.12.0` |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) `>=22.12.0`
- [PNPM](https://pnpm.io/) `10.30.0`

If you use [Corepack](https://nodejs.org/api/corepack.html), enable PNPM with:

```bash
corepack enable
```

### Installation

```bash
pnpm install
```

### Environment Variables

Copy the example file to create your local environment files:

```bash
cp .env.example .env.local
cp .env.example .env.test
```

The example file defines:

- `NODE_ENV` — runtime environment (`development` / `production` / `test`)
- `NEXT_PUBLIC_APP_BASE_URL` — public base URL for the application

`.env.local` is used for local development and as the runtime env file in the Docker Compose template. `.env.test` is required for running tests.

> **Note:** When adding new environment variables, update `.env.example`, `.env.local`, `.env.test` (if needed), and `src/lib/env/index.ts`.

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
pnpm build
```

To skip T3 Env validation at build time (e.g. in CI or Docker where env vars may not be available):

```bash
SKIP_ENV_VALIDATION=1 pnpm build
```

Validation still runs when the server starts, so misconfigurations are caught before serving traffic.

### Start the Production Server

```bash
pnpm start
```

## Configuration

### App Structure

```text
src/
  app/
    api/
      health/route.ts          # Health check endpoint
    error.tsx                   # Error boundary
    forbidden.tsx               # 403 page (requires authInterrupts)
    global-error.tsx            # Root error boundary
    globals.css                 # Tailwind imports and theme tokens
    layout.tsx                  # Root layout with Geist fonts
    loading.tsx                 # Loading state
    not-found.tsx               # 404 page
    page.tsx                    # Home page
    robots.ts                   # Programmatic robots.txt
    sitemap.ts                  # Programmatic sitemap.xml
    unauthorized.tsx            # 401 page (requires authInterrupts)
  lib/
    env/
      __tests__/env.test.ts     # Environment smoke test
      index.ts                  # T3 Env + Zod validation
    security/
      headers.ts                # Security header builders
  proxy.ts                      # Per-request CSP nonce injection
```

The `@/*` path alias is configured in `tsconfig.json` and maps to `src/*`.

### TypeScript

Configured with a strict baseline in `tsconfig.json`.

Notable settings:

- `strict: true`
- `moduleResolution: "bundler"`
- `noEmit: true`
- `jsx: "react-jsx"`
- `@/*` import alias

### ESLint

Linting uses the flat config format in `eslint.config.mjs`.

Current setup includes:

- `@eslint/js` recommended rules
- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`
- `eslint-plugin-import`
- Explicit global ignores for build artifacts, generated files, and `src/components/ui/**/*`

Custom rules:

- `no-console` — warns by default, allows `console.warn` and `console.error`
- `@typescript-eslint/naming-convention` — enforces consistent naming for variables, functions, and type-like symbols
- `import/order` — enforces grouped and alphabetized imports
- `no-restricted-imports` — enforces the `@/*` alias instead of parent-relative imports (`../`)

```bash
pnpm lint        # check
pnpm lint:fix    # auto-fix
```

### Prettier

Formatting is configured in `prettier.config.mjs`.

Current rules:

- `semi: false`
- `singleQuote: false`
- `trailingComma: "es5"`
- `printWidth: 100`
- `tabWidth: 2`
- `prettier-plugin-tailwindcss`
- `prettier-plugin-tailwindcss-canonical-classes`

```bash
pnpm format        # write
pnpm format:check  # check only
```

### Tailwind CSS

Tailwind CSS 4 is configured through `postcss.config.mjs` and imported in `src/app/globals.css`.

The template uses:

- `@import "tailwindcss"`
- Theme tokens defined with CSS custom properties
- Light/dark color foundation based on `prefers-color-scheme`

### React Compiler

The stable `reactCompiler` option is enabled in `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  reactCompiler: true,
}
```

### Fonts

The root layout uses `next/font/google` with:

- **Geist** (sans-serif)
- **Geist Mono** (monospace)

### Security Headers

Security is implemented as a two-layer architecture:

1. **Static headers** (`next.config.ts`) — applied to all routes via `buildSecurityHeaders()`:

   | Header                         | Value                                                          |
   | ------------------------------ | -------------------------------------------------------------- |
   | `Strict-Transport-Security`    | `max-age=63072000; includeSubDomains; preload`                 |
   | `X-Frame-Options`              | `DENY`                                                         |
   | `X-Content-Type-Options`       | `nosniff`                                                      |
   | `Referrer-Policy`              | `strict-origin-when-cross-origin`                              |
   | `Permissions-Policy`           | `camera=(), microphone=(), geolocation=(), browsing-topics=()` |
   | `Cross-Origin-Opener-Policy`   | `same-origin`                                                  |
   | `Cross-Origin-Embedder-Policy` | `unsafe-none`                                                  |
   | `Cross-Origin-Resource-Policy` | `same-origin`                                                  |
   | `X-DNS-Prefetch-Control`       | `on`                                                           |

2. **Per-request CSP** (`src/proxy.ts`) — generates a fresh 128-bit nonce for every HTML response and injects a strict `Content-Security-Policy` header. The nonce is forwarded to server components via the `x-nonce` request header.

   In development, `'unsafe-eval'` and `'unsafe-inline'` are added for HMR compatibility.

The header builders live in `src/lib/security/headers.ts`. See `src/lib/security/HEADERS.md` for a full reference of each header and its rationale.

### Error Boundaries

The template includes pre-built error and safety pages at the app root:

| File               | Purpose                                     |
| ------------------ | ------------------------------------------- |
| `error.tsx`        | Catches runtime errors within the app shell |
| `global-error.tsx` | Catches errors in the root layout itself    |
| `not-found.tsx`    | Custom 404 page                             |
| `loading.tsx`      | Loading state shown during navigation       |
| `forbidden.tsx`    | Custom 403 page (requires `authInterrupts`) |
| `unauthorized.tsx` | Custom 401 page (requires `authInterrupts`) |

> **Note:** `forbidden.tsx` and `unauthorized.tsx` require the `authInterrupts` experimental flag. To enable it, uncomment the block in `next.config.ts`:
>
> ```ts
> experimental: {
>   authInterrupts: true,
> }
> ```

### SEO

Programmatic SEO files are included under `src/app/`:

- **`robots.ts`** — generates `/robots.txt` allowing all crawlers with a sitemap reference
- **`sitemap.ts`** — generates `/sitemap.xml` with static pages (extend as routes are added)

Both files read `NEXT_PUBLIC_APP_BASE_URL` from the validated environment.

### Environment Variables

Environment variables are centralized in `src/lib/env/index.ts` using `@t3-oss/env-nextjs` and `zod`.

Current contract:

| Variable                   | Scope  | Validation                          | Description                         |
| -------------------------- | ------ | ----------------------------------- | ----------------------------------- |
| `NODE_ENV`                 | Shared | `development \| production \| test` | Runtime environment                 |
| `NEXT_PUBLIC_APP_BASE_URL` | Client | Valid URL                           | Public base URL for the application |

Implementation details:

- `shared` — values available on both server and client
- `client` — browser-safe variables requiring the `NEXT_PUBLIC_` prefix
- `experimental__runtimeEnv` — maps runtime values for client-safe access
- `emptyStringAsUndefined: true` — treats empty values as missing
- `skipValidation` — controlled by the `SKIP_ENV_VALIDATION` env var; defers Zod validation to runtime (server startup) instead of build time

Use the exported `env` object instead of reading `process.env` directly:

```ts
import { env } from "@/lib/env"

const baseUrl = env.NEXT_PUBLIC_APP_BASE_URL
```

### API Routes

| Endpoint      | Method | Description                              |
| ------------- | ------ | ---------------------------------------- |
| `/api/health` | `GET`  | Returns `{ ok: true, timestamp: "..." }` |

The health endpoint is used by the Docker `HEALTHCHECK` instruction.

### Testing

Testing is configured with Vitest and React Testing Library.

Setup includes:

- `vitest.config.mts` with `@vitejs/plugin-react`
- `jsdom` as the test environment
- `globals: true` — `describe`, `it`, `expect` available without imports
- `vitest.setup.ts` loading `@testing-library/jest-dom/vitest`
- `@next/env` loading environment variables before tests
- V8 coverage reporting to `coverage/`
- CI-specific reporters: `verbose` + `github-actions`

```bash
pnpm test            # run once
pnpm test:watch      # watch mode
pnpm test:coverage   # run with coverage
```

Test files use Vitest naming conventions: `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`.

Coverage includes `src/**/*.{js,jsx,ts,tsx}` and excludes declaration files, test files, `src/**/__tests__/**`, `src/app/layout.tsx`, and `src/lib/env/**`.

> **Note:** `.env.test` is required to run tests locally. Next.js does not load `.env.local` when `NODE_ENV=test`, so tests will fail unless `.env.test` defines the required values. CI generates this file automatically.

### Git Hooks

Git hooks are managed with [Husky](https://typicode.github.io/husky/) and installed automatically via the `prepare` script.

| Hook         | Action                                                 |
| ------------ | ------------------------------------------------------ |
| `pre-commit` | Validates the branch name, then runs `lint-staged`     |
| `commit-msg` | Runs Commitlint with `@commitlint/config-conventional` |
| `pre-push`   | Runs `pnpm type-check` and `pnpm test`                 |

`lint-staged` applies:

- `eslint --fix` to `*.{js,mjs,cjs,ts,tsx}`
- `prettier --write` to `*.{js,mjs,cjs,ts,tsx,json,md,css}`

#### Branch Naming

Branch names must follow:

```text
<type>/<scope-description>
```

Allowed types: `feat`, `fix`, `style`, `refactor`, `chore`, `test`, `build`, `ci`, `docs`, `perf`

Special allowed branch: `staging`

Examples: `feat/auth-setup`, `docs/readme-update`, `chore/code-quality-setup`

#### Commit Messages

Commits follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```text
feat(auth): add login form
```

### Continuous Integration

CI is configured with GitHub Actions in `.github/workflows/ci.yml`.

Triggers:

- Pushes to `main` and `staging`
- Pull requests targeting any branch

A concurrency group cancels older in-progress runs for the same ref.

| Job              | Commands                         | Notes                                                                                |
| ---------------- | -------------------------------- | ------------------------------------------------------------------------------------ |
| Lint & Format    | `pnpm lint`, `pnpm format:check` | Runs ESLint and verifies Prettier formatting                                         |
| Type Check       | `pnpm type-check`                | Runs TypeScript with `tsc --noEmit`                                                  |
| Unit Tests       | `pnpm test:coverage`             | Generates `.env.test` first via `.github/scripts/generate-env-test.sh`               |
| Dependency Audit | `pnpm audit:dependencies`        | Runs `pnpm audit` at moderate severity level                                         |
| CodeQL           | `github/codeql-action`           | Static analysis for JavaScript/TypeScript security vulnerabilities                   |
| Build            | `pnpm build`                     | Runs with `SKIP_ENV_VALIDATION=1`; restores `.next/cache`; depends on all other jobs |

All jobs use the composite action at `.github/actions/setup`, which installs PNPM 10.30.0, sets up Node.js 22 with caching, and runs `pnpm install --frozen-lockfile`.

### Dependabot

Automated dependency updates are configured in `.github/dependabot.yml` with weekly schedules for:

- **npm** — grouped by ecosystem (Next.js, React, testing, lint/format, types)
- **GitHub Actions** — keeps CI action versions current
- **Docker** — updates base image references

### GitHub Templates

A pull request template is included at `.github/PULL_REQUEST_TEMPLATE.md` with sections for summary, changes, reviewer notes, testing instructions, and a checklist.

## Docker

The `Dockerfile` is a multi-stage build with two usable targets:

| Target   | Purpose                               |
| -------- | ------------------------------------- |
| `dev`    | Development server with hot-reload    |
| `runner` | Production-optimized standalone image |

`docker-compose.yml` is configured for **production** by default.

### Production

```bash
docker compose up --build
```

Or build and run the image directly:

```bash
docker build --target runner \
  --build-arg NEXT_PUBLIC_APP_BASE_URL=https://example.com \
  -t nextjs-starter-template .
docker run --rm -p 3000:3000 --env-file .env.local nextjs-starter-template
```

> `NEXT_PUBLIC_APP_BASE_URL` must be passed as a `--build-arg` because Next.js inlines `NEXT_PUBLIC_*` variables into the client bundle at build time.

The production image includes a `HEALTHCHECK` that polls `/api/health` every 30 seconds.

### Development

To use Docker for development, edit `docker-compose.yml`:

- Change `target` from `runner` to `dev`
- Change `NODE_ENV` from `production` to `development`
- Add a `volumes` block:

```yaml
volumes:
  - .:/app
  - /app/node_modules
  - /app/.next
```

Then start:

```bash
docker compose up --build
```

## Available Scripts

| Script                    | Description                               |
| ------------------------- | ----------------------------------------- |
| `pnpm dev`                | Start the Next.js development server      |
| `pnpm build`              | Create a production build                 |
| `pnpm start`              | Run the production server                 |
| `pnpm lint`               | Run ESLint                                |
| `pnpm lint:fix`           | Run ESLint with auto-fixes                |
| `pnpm format`             | Format files with Prettier                |
| `pnpm format:check`       | Check formatting with Prettier            |
| `pnpm test`               | Run the Vitest test suite                 |
| `pnpm test:watch`         | Run Vitest in watch mode                  |
| `pnpm test:coverage`      | Run tests with coverage reporting         |
| `pnpm type-check`         | Run TypeScript type checking              |
| `pnpm audit:dependencies` | Audit dependencies at moderate severity   |
| `pnpm clean`              | Remove `.next` and `coverage` directories |
| `pnpm prepare`            | Install Husky Git hooks                   |

## Tooling Status

| Area               | Status   | Notes                                        |
| ------------------ | -------- | -------------------------------------------- |
| Next.js App Router | Included | `src/app` based structure                    |
| TypeScript         | Included | Strict configuration                         |
| ESLint             | Included | Flat config with custom rules                |
| Prettier           | Included | Project-wide formatting                      |
| Tailwind CSS       | Included | v4 with theme tokens and dark mode           |
| React Compiler     | Included | Enabled in `next.config.ts`                  |
| Security headers   | Included | Static headers + per-request nonce-based CSP |
| Error boundaries   | Included | Custom error, 404, 403, 401, and loading     |
| SEO                | Included | Programmatic `robots.ts` and `sitemap.ts`    |
| Environment vars   | Included | T3 Env + Zod with skip-validation support    |
| Testing            | Included | Vitest + Testing Library + V8 coverage       |
| Git hooks          | Included | Husky + lint-staged + Commitlint             |
| Docker             | Included | Standalone image + Compose                   |
| CI                 | Included | GitHub Actions (lint, test, build, audit)    |
| CodeQL             | Included | Static security analysis                     |
| Dependabot         | Included | Weekly updates for npm, Actions, and Docker  |

## Project Notes

### Package Manager

The repository uses PNPM via the `packageManager` field in `package.json`. Corepack is recommended.

### Workspace File

`pnpm-workspace.yaml` contains ignored built dependencies used by the local setup.

### Environment Files

All `.env*` files are gitignored. Use `.env.example` as the starting point:

```bash
cp .env.example .env.local    # local development / Docker runtime
cp .env.example .env.test     # required for running tests
```

CI generates `.env.test` automatically; local test runs still require creating it yourself.

### Auth Interrupts

The `forbidden()` and `unauthorized()` functions (and their corresponding pages) require the `authInterrupts` experimental flag. This is disabled by default. See the [Error Boundaries](#error-boundaries) section for instructions.

## Contributing

When extending the template, keep this README updated alongside any new setup so it stays self-documenting. Follow the branch naming and commit message conventions enforced by the Git hooks.

## License

This project is open source. See the repository for license details.
