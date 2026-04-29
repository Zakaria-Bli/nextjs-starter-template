# Next.js Starter Template

Opinionated starter template for building modern Next.js applications with a solid baseline for code quality, maintainability, and future project setup.

This repository is being evolved into a reusable template. The goal is to provide a clean starting point with sensible defaults for application structure, linting, formatting, testing, Git hooks, Docker, CI, and related tooling as they are added.

## Goals

- Start from a minimal but production-minded Next.js foundation
- Standardize code quality and developer experience across projects
- Keep configuration explicit and easy to understand
- Make the template easy to extend as more tooling is introduced

## Current Status

The repository is currently in an early stage.

Already included:

- Next.js 16 with the App Router
- React 19
- TypeScript with strict mode enabled
- Tailwind CSS 4
- ESLint 9 with custom project rules
- Prettier 3 with Tailwind-aware formatting
- Vitest 4 with Testing Library and jsdom
- Husky, lint-staged, and commitlint Git hooks
- Environment validation with T3 Env and Zod
- PNPM as the package manager
- React Compiler enabled in `next.config.ts`
- Docker support with a multi-stage Dockerfile and Compose template
- GitHub Actions CI for linting, formatting, type checking, tests, and builds

Planned or in progress:

- Additional project conventions and automation

## Stack

- Next.js `16.2.4`
- React `19.2.4`
- TypeScript `^5`
- Tailwind CSS `^4`
- ESLint `^9`
- Vitest `^4`
- Testing Library `^16`
- PNPM `10.30.0`
- Node.js `>=22.12.0`

## Included Configuration

### App Structure

The project currently uses the App Router under `src/app`:

```text
src/
  app/
    favicon.ico
    globals.css
    layout.tsx
    page.tsx
  lib/
    env/
      index.ts
```

The `@/*` path alias is configured in `tsconfig.json` and maps to `src/*`.

### TypeScript

TypeScript is configured with a strict baseline in `tsconfig.json`.

Notable settings:

- `strict: true`
- `moduleResolution: "bundler"`
- `noEmit: true`
- `jsx: "react-jsx"`
- `@/*` import alias

### ESLint

Linting is configured in `eslint.config.mjs` using the flat config format.

Current setup includes:

- `@eslint/js` recommended rules
- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`
- `eslint-plugin-import`
- Explicit global ignores for build artifacts, generated files, and `src/components/ui/**/*`

Custom rules include:

- `no-console` warns by default, while allowing `console.warn` and `console.error`
- `@typescript-eslint/naming-convention` enforces consistent naming for variables, functions, and type-like symbols
- `import/order` enforces grouped and alphabetized imports
- `no-restricted-imports` enforces using the `@/*` alias instead of parent-relative imports

Commands:

```bash
pnpm lint
pnpm lint:fix
```

### Prettier

Formatting is configured in `prettier.config.mjs`.

Current rules include:

- `semi: false`
- `singleQuote: false`
- `trailingComma: "es5"`
- `printWidth: 100`
- `tabWidth: 2`
- `prettier-plugin-tailwindcss`
- `prettier-plugin-tailwindcss-canonical-classes`

Commands:

```bash
pnpm format
pnpm format:check
```

### Testing

Testing is configured with Vitest and React Testing Library.

Current setup includes:

- `vitest.config.mts` with the `@vitejs/plugin-react` plugin
- `jsdom` as the test environment for component and DOM testing
- `globals: true` so Vitest globals like `describe`, `it`, and `expect` are available without imports
- `vitest.setup.ts` loading `@testing-library/jest-dom/vitest`
- `@next/env` loading environment variables before tests run
- V8 coverage reporting written to `coverage/`

TypeScript is already configured for the test environment with:

- `vitest/globals`
- `@testing-library/jest-dom`

Commands:

```bash
pnpm test
pnpm test:watch
pnpm test:coverage
```

Test files should use Vitest naming conventions such as:

- `*.test.ts`
- `*.test.tsx`
- `*.spec.ts`
- `*.spec.tsx`

Coverage currently includes `src/**/*.{js,jsx,ts,tsx}` and excludes:

- declaration files
- test files
- `src/**/__tests__/**`
- `src/app/layout.tsx`
- `src/lib/env/**`

Environment values for tests are provided through `.env.test`.

`.env.test` is required to run Vitest in this repository. Next.js does not load `.env.local` when `NODE_ENV=test`, so tests will fail unless `.env.test` defines the required values, currently `NEXT_PUBLIC_APP_BASE_URL`.

The repository includes a committed smoke test for environment loading under `src/lib/env/__tests__/env.test.ts`.

### Continuous Integration

CI is configured with GitHub Actions in `.github/workflows/ci.yml`.

The workflow runs on:

- Pushes to `main` and `staging`
- Pull requests targeting any branch

A concurrency group cancels older in-progress runs for the same Git ref when a newer run starts.

CI jobs:

| Job           | Commands                         | Notes                                                                     |
| ------------- | -------------------------------- | ------------------------------------------------------------------------- |
| Lint & Format | `pnpm lint`, `pnpm format:check` | Runs ESLint and verifies Prettier formatting                              |
| Type Check    | `pnpm type-check`                | Runs TypeScript with `tsc --noEmit`                                       |
| Unit Tests    | `pnpm test:coverage`             | Generates `.env.test` first with `.github/scripts/generate-env-test.sh`   |
| Build         | `pnpm build`                     | Runs after linting, type checking, and tests pass; restores `.next/cache` |

All CI jobs use the local composite action in `.github/actions/setup`, which installs PNPM 10.30.0, sets up Node.js 22 with PNPM caching, and installs dependencies with `pnpm install --frozen-lockfile`.

The test job generates a safe `.env.test` file in CI with:

- `NODE_ENV=test`
- `NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000`

Because CI runs Vitest coverage, the committed environment smoke test prevents the `Unit Tests` job from failing due to an empty test suite.

### Git Hooks

Git hooks are managed with Husky and installed automatically by `pnpm install` through the `prepare` script.

Configured hooks:

- `pre-commit` validates the current branch name and runs `lint-staged`
- `commit-msg` runs Commitlint with `@commitlint/config-conventional`
- `pre-push` runs `pnpm type-check`

`lint-staged` currently applies:

- `eslint --fix` to `*.{js,mjs,cjs,ts,tsx}`
- `prettier --write` to `*.{js,mjs,cjs,ts,tsx,json,md,css}`

Branch names must follow:

```text
<type>/<scope-description>
```

Allowed branch types: `feat`, `fix`, `style`, `refactor`, `chore`, `test`, `build`, `ci`, `docs`, `perf`

Special allowed branch: `staging`

Example branch names:

- `chore/code-quality-setup`
- `docs/readme-update`
- `feat/auth-setup`

Commit messages follow the Conventional Commits format. Example:

```text
feat(auth): add login form
```

### Environment Variables

Environment variables are centralized in `src/lib/env/index.ts` using `@t3-oss/env-nextjs` and `zod`.

Current environment contract:

| Variable                   | Scope  | Validation                          | Description                         |
| -------------------------- | ------ | ----------------------------------- | ----------------------------------- |
| `NODE_ENV`                 | Shared | `development \| production \| test` | Runtime environment                 |
| `NEXT_PUBLIC_APP_BASE_URL` | Client | Valid URL                           | Public base URL for the application |

Implementation details:

- `shared` is used for values available on both server and client
- `client` is used for browser-safe variables and requires the `NEXT_PUBLIC_` prefix
- `experimental__runtimeEnv` maps runtime values for client-safe access in Next.js
- `emptyStringAsUndefined: true` treats empty environment values as missing
- `.env.test` provides the baseline environment required by the Vitest setup and must exist locally for test runs

Use the exported `env` object instead of reading `process.env` directly in app code:

```ts
import { env } from "@/lib/env"

const baseUrl = env.NEXT_PUBLIC_APP_BASE_URL
```

### Tailwind CSS

Tailwind CSS 4 is configured through `postcss.config.mjs` and imported in `src/app/globals.css`.

The template currently uses:

- `@import "tailwindcss"`
- Theme tokens defined with CSS custom properties
- A simple light/dark color foundation based on `prefers-color-scheme`

### React Compiler

`next.config.ts` enables the stable `reactCompiler` option:

```ts
const nextConfig = {
  reactCompiler: true,
}
```

This aligns the template with modern React and Next.js optimization defaults.

### Fonts

The root layout uses `next/font/google` with:

- `Geist`
- `Geist Mono`

## Tooling Status

This section is intentionally separated so it can grow over time.

| Area               | Status   | Notes                      |
| ------------------ | -------- | -------------------------- |
| Next.js App Router | Included | `src/app` based structure  |
| TypeScript         | Included | Strict configuration       |
| ESLint             | Included | Flat config + custom rules |
| Prettier           | Included | Project-wide formatting    |
| Git hooks          | Included | Husky + lint-staged        |
| Environment vars   | Included | T3 Env + Zod               |
| Testing            | Included | Vitest + Testing Library   |
| Docker             | Included | Standalone image + Compose |
| CI                 | Included | GitHub Actions workflow    |

## Getting Started

### Prerequisites

- Node.js `>=22.12.0`
- PNPM `10.30.0`

If you use Corepack, you can enable PNPM with:

```bash
corepack enable
```

### Install Dependencies

```bash
pnpm install
```

### Set Up Environment Variables

```bash
cp .env.example .env.local
cp .env.example .env.test
```

The example file currently defines:

- `NODE_ENV`
- `NEXT_PUBLIC_APP_BASE_URL`

`.env.local` is used for local app development and as the runtime env file in the current Docker Compose template. `.env.test` is required for `pnpm test` and `pnpm test:coverage`.

### Start the Development Server

```bash
pnpm dev
```

Then open `http://localhost:3000`.

### Build for Production

```bash
pnpm build
```

### Start the Production Server

```bash
pnpm start
```

### Run With Docker

The `Dockerfile` is a multi-stage build with two usable targets:

| Target   | Purpose                               |
| -------- | ------------------------------------- |
| `dev`    | Development server with hot-reload    |
| `runner` | Production-optimised standalone image |

`docker-compose.yml` ships configured for **production** by default.

#### Production

```bash
docker compose up --build
```

Or build and run the image directly:

```bash
docker build --target runner -t nextjs-starter-template .
docker run --rm -p 3000:3000 --env-file .env.local nextjs-starter-template
```

#### Development

To use Docker for development, edit `docker-compose.yml` with the following changes:

- Change `target` from `runner` to `dev`
- Change `NODE_ENV` from `production` to `development`
- Add a `volumes` block to mount your source code into the container:

```yaml
volumes:
  - .:/app
  - /app/node_modules
  - /app/.next
```

Then start the container:

```bash
docker compose up --build
```

### Run Linting

```bash
pnpm lint
```

### Run Tests

```bash
pnpm test
```

For watch mode or coverage:

```bash
pnpm test:watch
pnpm test:coverage
```

The repository includes a committed environment smoke test so the default test command has at least one test file to run.

## Available Scripts

Current scripts from `package.json`:

| Script               | Description                          |
| -------------------- | ------------------------------------ |
| `pnpm dev`           | Start the Next.js development server |
| `pnpm build`         | Create a production build            |
| `pnpm start`         | Run the production server            |
| `pnpm lint`          | Run ESLint                           |
| `pnpm lint:fix`      | Run ESLint with auto-fixes           |
| `pnpm format`        | Format files with Prettier           |
| `pnpm format:check`  | Check formatting with Prettier       |
| `pnpm test`          | Run the Vitest test suite            |
| `pnpm test:watch`    | Run Vitest in watch mode             |
| `pnpm test:coverage` | Run tests with coverage reporting    |
| `pnpm type-check`    | Run TypeScript type checking         |
| `pnpm prepare`       | Install Husky Git hooks              |

## Project Notes

### Package Manager

The repository is configured to use PNPM via the `packageManager` field in `package.json`.

### Workspace File

`pnpm-workspace.yaml` currently contains ignored built dependencies used by the local setup.

### Environment Files

Environment files are ignored by default via `.gitignore`:

```text
.env*
```

Use `.env.example` as the starting point for local configuration:

```bash
cp .env.example .env.local
cp .env.example .env.test
```

`.env.test` is required for the Vitest setup in this repository. It is ignored by git with the other `.env*` files, so create it locally before running tests.

CI generates `.env.test` automatically before running coverage; local test runs still require creating it yourself.

When adding new environment variables, update:

- `.env.example`
- `.env.local`
- `.env.test` if tests need the variable
- `src/lib/env/index.ts`

## Contributing To The Template

As this repository matures, keep the README updated alongside any new setup so the template stays self-documenting.
