export type MembershipPlan = "monthly" | "annual"

const HUB_URL = "https://app.motusdao.org"

// This carries a preference, never a price, payment confirmation or entitlement.
export function membershipUrl(plan: MembershipPlan): string {
  const url = new URL("/academia/02-fundamentos", HUB_URL)
  url.searchParams.set("plan", plan)
  url.searchParams.set("source", "psm-landing")
  return url.toString()
}

/** Professional direct entry — existing PSM onboarding (no new flow). */
export const PROFESSIONAL_REGISTRO_URL = `${HUB_URL}/registro`

export const GENESIS_HUB_URL = `${HUB_URL}/academia/01-genesis`

export const VALIDACION_HUB_URL = `${HUB_URL}/academia/04-validacion`

export const PORTAL_HUB_URL = `${HUB_URL}/academia/05-portal-clinico`

export const INVITATION_CONTACT_URL =
  "mailto:contact@motusdao.org?subject=" +
  encodeURIComponent("Consulta sobre invitación al Pase Motus Beta")
