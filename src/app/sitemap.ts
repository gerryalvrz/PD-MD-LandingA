import type { MetadataRoute } from "next"
import { MEMBRESIA_GUIDE_PATH } from "@/content/membresia-guide"
import { getSiteUrl } from "@/lib/site-url"

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  const lastModified = new Date()

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}${MEMBRESIA_GUIDE_PATH}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/diagnostico`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/readiness`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]
}
