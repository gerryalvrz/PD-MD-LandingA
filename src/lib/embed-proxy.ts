export const EMBED_HOSTS = {
  gitbook: "https://motusdao.gitbook.io",
  app: "https://app.motusdao.org",
  chat: "https://chat.motusdao.org",
} as const

export type EmbedHost = keyof typeof EMBED_HOSTS

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

const DROP_RESPONSE_HEADERS = new Set([
  "content-security-policy",
  "content-security-policy-report-only",
  "x-frame-options",
  "set-cookie",
  "set-cookie2",
  "report-to",
  "nel",
  "content-encoding",
  "content-length",
  "transfer-encoding",
  "connection",
  "keep-alive",
  "alt-svc",
  "strict-transport-security",
  "cache-control",
  "expires",
  "etag",
  "age",
  "last-modified",
])

const FORWARD_REQUEST_HEADERS = [
  "accept",
  "accept-language",
  "rsc",
  "next-router-state-tree",
  "next-router-prefetch",
  "next-router-segment-prefetch",
  "next-url",
  "content-type",
]

export function isEmbedHost(value: string): value is EmbedHost {
  return value in EMBED_HOSTS
}

export function embedPrefix(host: EmbedHost): string {
  return `/embed/${host}`
}

export function resolveUpstream(
  host: EmbedHost,
  pathSegments: string[],
  search = "",
): URL | null {
  const segments = pathSegments.filter(Boolean)
  for (const segment of segments) {
    if (segment === "." || segment === ".." || segment.includes("://") || segment.includes("\\")) {
      return null
    }
  }

  const origin = EMBED_HOSTS[host]
  const url = new URL(origin)
  url.pathname = `/${segments.join("/")}`
  url.search = search.startsWith("?") ? search.slice(1) : search
  if (url.origin !== new URL(origin).origin) return null
  return url
}

export function rewriteUpstreamContent(content: string, prefix: string): string {
  const p = prefix.replace(/\/$/, "")
  const skip = p.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return content
    .replace(new RegExp(`(\\b(?:src|href|action|poster)=["'])/(?!/)(?!${skip}(?:/|"|'|$))`, "gi"), `$1${p}/`)
    .replace(/(["'`])\/_next\//g, `$1${p}/_next/`)
    .replace(/url\(\/_next\//g, `url(${p}/_next/`)
}

export function embedShimSource(prefix: string): string {
  const p = JSON.stringify(prefix.replace(/\/$/, ""))
  return `(()=>{const p=${p};const wrap=u=>{try{if(typeof u!=="string"&&!(u instanceof URL))return u;const x=new URL(String(u),location.href);if(x.origin===location.origin&&x.pathname!==p&&!x.pathname.startsWith(p+"/")){x.pathname=p+(x.pathname.startsWith("/")?x.pathname:"/"+x.pathname);return x.toString()}}catch(e){}return u};const f=window.fetch;window.fetch=function(i,n){if(typeof i==="string")i=wrap(i);else if(i instanceof Request)i=new Request(wrap(i.url),i);else if(i instanceof URL)i=new URL(String(wrap(i)));return f.call(this,i,n)};const o=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(m,u,...r){return o.call(this,m,typeof u==="string"?wrap(u):u,...r)};const ps=history.pushState.bind(history);const rs=history.replaceState.bind(history);history.pushState=function(s,t,u){return ps(s,t,u==null?u:wrap(u))};history.replaceState=function(s,t,u){return rs(s,t,u==null?u:wrap(u))}})();`
}

export function injectEmbedShim(html: string, prefix: string): string {
  const shim = `<script>${embedShimSource(prefix)}</script>`
  if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, (open) => `${open}${shim}`)
  return `${shim}${html}`
}

export function shouldRewriteContentType(contentType: string): boolean {
  return /html|javascript|css|json|xml|text\/plain|text\/x-component|application\/x-javascript/i.test(contentType)
}

export function pickForwardRequestHeaders(
  from: Headers,
  host: EmbedHost,
  pathname: string,
): Headers {
  const headers = new Headers()
  headers.set("user-agent", BROWSER_UA)
  const language = from.get("accept-language")
  if (language) headers.set("accept-language", language)

  const isAsset = /\.(css|js|mjs|map|woff2?|png|jpe?g|gif|svg|webp|avif|ico|json)$/i.test(pathname)

  if (host === "gitbook") {
    headers.set("accept", isAsset ? (from.get("accept") ?? "*/*") : "text/html")
    return headers
  }

  for (const name of FORWARD_REQUEST_HEADERS) {
    if (name === "accept" && !isAsset && !from.get("rsc")) {
      headers.set("accept", "text/html,application/xhtml+xml;q=0.9")
      continue
    }
    const value = from.get(name)
    if (value) headers.set(name, value)
  }
  if (!headers.has("accept")) headers.set("accept", "text/html,application/xhtml+xml;q=0.9")
  return headers
}

export function filterResponseHeaders(from: Headers): Headers {
  const headers = new Headers()
  from.forEach((value, key) => {
    if (!DROP_RESPONSE_HEADERS.has(key.toLowerCase())) headers.append(key, value)
  })
  headers.set("content-security-policy", "frame-ancestors 'self'")
  headers.set("x-content-type-options", "nosniff")
  headers.set("cache-control", "private, no-store")
  headers.delete("x-frame-options")
  return headers
}
