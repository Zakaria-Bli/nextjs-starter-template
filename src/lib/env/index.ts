import { createEnv } from "@t3-oss/env-nextjs"
import * as z from "zod"

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_APP_BASE_URL: z.url(),
  },
  shared: {
    NODE_ENV: z.enum(["development", "production", "test"]),
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
  },
  emptyStringAsUndefined: true,

  // Skip Zod validation when SKIP_ENV_VALIDATION is set (e.g. CI builds,
  // Docker builds without real values). Validation still runs at runtime
  // when the server starts, so misconfigurations are caught before serving
  // any traffic.
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
