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
- ESLint 9 with Next.js rules
- PNPM as the package manager
- React Compiler enabled in `next.config.ts`

Planned or in progress:

- Prettier and shared formatting rules
- Git hooks
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

- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`
- Explicit global ignores for build artifacts and generated files

Current script:

```bash
pnpm lint
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

| Area               | Status            | Notes                      |
| ------------------ | ----------------- | -------------------------- |
| Next.js App Router | Included          | `src/app` based structure  |
| TypeScript         | Included          | Strict configuration       |
| ESLint             | Included          | Next.js + TypeScript rules |
| Prettier           | Not yet on `main` | Planned                    |
| Git hooks          | Not yet on `main` | Planned                    |
| Testing            | Not yet on `main` | Planned                    |
| Docker             | Not yet on `main` | Planned                    |
| CI                 | Not yet on `main` | Planned                    |

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

| Script       | Description                          |
| ------------ | ------------------------------------ |
| `pnpm dev`   | Start the Next.js development server |
| `pnpm build` | Create a production build            |
| `pnpm start` | Run the production server            |
| `pnpm lint`  | Run ESLint                           |

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

## Contributing To The Template

As this repository matures, keep the README updated alongside any new setup so the template stays self-documenting.
