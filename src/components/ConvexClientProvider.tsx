"use client"

import { useMemo } from "react"
import { ConvexProvider, ConvexReactClient } from "convex/react"

export default function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  const convex = useMemo(() => {
    if (!convexUrl) return null
    return new ConvexReactClient(convexUrl)
  }, [convexUrl])

  // Allow build/prerender to succeed when deployment env vars are missing.
  if (!convex) return <>{children}</>

  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
