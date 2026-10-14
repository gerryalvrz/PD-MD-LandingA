/** In-page anchors and the site home stay in the same tab. Everything else opens a new one. */
export function leavesCurrentPage(href: string): boolean {
  const trimmed = href.trim()
  if (!trimmed || trimmed === "/") return false
  if (trimmed.startsWith("#")) return false
  if (/^\/#/.test(trimmed)) return false
  return true
}

export function newTabProps(href: string): { target?: "_blank"; rel?: string } {
  if (!leavesCurrentPage(href)) return {}
  return { target: "_blank", rel: "noopener noreferrer" }
}
