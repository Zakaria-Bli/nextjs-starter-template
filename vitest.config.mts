import nextEnv from "@next/env"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

const { loadEnvConfig } = nextEnv

loadEnvConfig(process.cwd())

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    clearMocks: true,
    reporters: process.env.CI ? ["verbose", "github-actions"] : ["default"],
    coverage: {
      provider: "v8",
      reporter: process.env.CI
        ? ["text", "text-summary", "json-summary"]
        : ["text", "text-summary"],
      reportOnFailure: true,
      reportsDirectory: "./coverage",
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.{test,spec}.{js,jsx,ts,tsx}",
        "src/**/__tests__/**",
        "src/app/layout.tsx",
        "src/lib/env/**",
      ],
    },
  },
})
