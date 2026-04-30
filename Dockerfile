# syntax=docker.io/docker/dockerfile:1
ARG NODE_VERSION=22.12.0
ARG PNPM_VERSION=10.30.0

# ---------------------------
# Base
# ---------------------------
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app

# libc6-compat may be needed by native dependencies on Alpine.
RUN apk add --no-cache libc6-compat
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

# ---------------------------
# Dependencies (cached) - Install dependencies only when needed
# ---------------------------
FROM base AS deps
ENV HUSKY=0

# Install dependencies based on the lockfile and reuse the pnpm store cache.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm fetch --frozen-lockfile --store-dir /pnpm/store
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --offline --store-dir /pnpm/store

# ---------------------------
# Development Stage
# ---------------------------

FROM base AS dev

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run dev
ENV NODE_ENV=development
EXPOSE 3000
CMD ["pnpm", "dev"]

# ---------------------------
# Build Stage
# ---------------------------

# Rebuild the source code only when needed
FROM base AS builder
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Skip t3-env Zod validation at build time; the server validates on startup.
ENV SKIP_ENV_VALIDATION=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run build (cache .next/cache for faster incremental rebuilds)
RUN --mount=type=cache,target=/app/.next/cache \
    pnpm build

# ---------------------------
# Production Runner
# ---------------------------

# Production image, copy the standalone output and run Next.js
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache libc6-compat wget

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets (not included in standalone output)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget --spider -q "http://127.0.0.1:${PORT}/api/health" || exit 1

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
CMD ["node", "server.js"]
