import { env } from "@/lib/env"

import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_APP_BASE_URL
  const lastModified = new Date().toISOString()

  // Static pages — extend this list as new top-level routes are added.
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
  ]

  return staticPages
}
