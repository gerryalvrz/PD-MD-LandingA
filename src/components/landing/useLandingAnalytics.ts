"use client"

import { useCallback, useEffect, useRef } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { getOrCreateSessionId, getStoredLeadContext, type FunnelEventName } from "@/lib/funnel-session"

/** Client island: funnel analytics (Convex). Safe to omit for static HTML. */
export function useLandingAnalytics() {
  const sessionId = useRef("")
  const trackEvent = useMutation(api.leads.trackEvent)

  const onTrack = useCallback(
    (eventName: FunnelEventName, payload: Record<string, string> = {}) => {
      if (!sessionId.current) return
      const leadCtx = getStoredLeadContext()
      const args: Parameters<typeof trackEvent>[0] = {
        eventName,
        sessionId: sessionId.current,
        page: window.location.pathname,
        section: payload.section,
        ctaLabel: payload.ctaLabel,
        intent:
          payload.intent === "pay" || payload.intent === "lead" || payload.intent === "call"
            ? payload.intent
            : undefined,
        metadata: payload,
      }
      if (leadCtx?.email) args.email = leadCtx.email
      if (leadCtx?.leadId) args.leadId = leadCtx.leadId as Parameters<typeof trackEvent>[0]["leadId"]
      void trackEvent(args).catch(() => {
        /* La navegación no depende de analítica. */
      })
    },
    [trackEvent],
  )

  useEffect(() => {
    try {
      sessionId.current = getOrCreateSessionId()
      onTrack("page_view", { section: "landing" })
    } catch {
      // Storage restrictions must not block the landing.
    }
  }, [onTrack])

  return { onTrack }
}
