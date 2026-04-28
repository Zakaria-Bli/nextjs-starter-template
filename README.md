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
- Husky, lint-staged, and commitlint Git hooks
- Environment validation with T3 Env and Zod
- PNPM as the package manager
- React Compiler enabled in `next.config.ts`

Planned or in progress:

- Testing setup
- Docker support
- CI workflows
- Additional project conventions and automation

## Stack

- Next.js `16.2.4`
- React `19.2.4`
- TypeScript `^5`
- Tailwind CSS `^4`
- ESLint `^9`
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
- `import/no-restricted-paths` enforces using the `@/*` alias instead of relative imports within `src`

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

| Area               | Status           | Notes                      |
| ------------------ | ---------------- | -------------------------- |
| Next.js App Router | Included         | `src/app` based structure  |
| TypeScript         | Included         | Strict configuration       |
| ESLint             | Included         | Flat config + custom rules |
| Prettier           | Included         | Project-wide formatting    |
| Git hooks          | Included         | Husky + lint-staged        |
| Environment vars   | Included         | T3 Env + Zod               |
| Testing            | Not yet included | Planned                    |
| Docker             | Not yet included | Planned                    |
| CI                 | Not yet included | Planned                    |

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
```

The example file currently defines:

- `NODE_ENV`
- `NEXT_PUBLIC_APP_BASE_URL`

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

### Run Linting

```bash
pnpm lint
```

## Available Scripts

Current scripts from `package.json`:

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Start the Next.js development server |
| `pnpm build`        | Create a production build            |
| `pnpm start`        | Run the production server            |
| `pnpm lint`         | Run ESLint                           |
| `pnpm lint:fix`     | Run ESLint with auto-fixes           |
| `pnpm format`       | Format files with Prettier           |
| `pnpm format:check` | Check formatting with Prettier       |
| `pnpm type-check`   | Run TypeScript type checking         |
| `pnpm prepare`      | Install Husky Git hooks              |

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
```

When adding new environment variables, update:

- `.env.example`
- `.env.local`
- `src/lib/env/index.ts`

## Contributing To The Template

As this repository matures, keep the README updated alongside any new setup so the template stays self-documenting.
