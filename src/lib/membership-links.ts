export type MembershipPlan = "monthly" | "annual"

const HUB_URL = "https://app.motusdao.org"

// This carries a preference, never a price, payment confirmation or entitlement.
export function membershipUrl(plan: MembershipPlan): string {
  const url = new URL("/academia/02-fundamentos", HUB_URL)
  url.searchParams.set("plan", plan)
  url.searchParams.set("source", "psm-landing")
  return url.toString()
}

export const INVITATION_CONTACT_URL = "mailto:contact@motusdao.org?subject=" + encodeURIComponent("Consulta sobre invitación al Pase Motus Beta")
