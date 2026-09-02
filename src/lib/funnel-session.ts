export type FunnelEventName =
  | "page_view"
  | "cta_click"
  | "modal_open"
  | "form_started"
  | "form_submitted"
  | "checkout_click"
  | "checkout_complete"
  | "calendly_booked"

export function getOrCreateSessionId() {
  const key = "motus_session_id"
  const existing = window.localStorage.getItem(key)
  if (existing) return existing
  const generated = crypto.randomUUID()
  window.localStorage.setItem(key, generated)
  return generated
}

export function getStoredLeadContext() {
  try {
    const raw = window.localStorage.getItem("motus_lead_ctx")
    if (!raw) return null
    const parsed = JSON.parse(raw) as { leadId?: string; email?: string }
    return parsed
  } catch {
    return null
  }
}
