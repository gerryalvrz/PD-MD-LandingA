/**
 * Same-tab: in-page anchors and same-site relative routes (e.g. /diagnostico, /#membresia).
 * New tab: absolute http(s) / protocol links (Hub, mailto, etc.).
 */
export function leavesCurrentPage(href: string): boolean {
  const trimmed = href.trim()
  if (!trimmed || trimmed === "/") return false
  if (trimmed.startsWith("#")) return false
  // Same-origin path (not protocol-relative "//…")
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return false
  return true
}

export function newTabProps(href: string): { target?: "_blank"; rel?: string } {
  if (!leavesCurrentPage(href)) return {}
  return { target: "_blank", rel: "noopener noreferrer" }
}
