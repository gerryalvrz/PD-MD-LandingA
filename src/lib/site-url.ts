import { CANONICAL_SITE_URL } from "@/content/landing"

/** Canonical public origin for SEO, sitemap, and JSON-LD. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL
  if (fromEnv) return fromEnv.replace(/\/$/, "")

  // Preview deployments keep the ephemeral host so previews stay shareable.
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`
  }

  // Production (and local production builds) always advertise the canonical host,
  // never *.vercel.app — even if VERCEL_PROJECT_PRODUCTION_URL points at it.
  if (process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production") {
    return CANONICAL_SITE_URL
  }

  return "http://localhost:3000"
}

export function isVercelAppHost(host: string | null): boolean {
  if (!host) return false
  const hostname = host.split(":")[0]?.toLowerCase() ?? ""
  return hostname.endsWith(".vercel.app")
}
