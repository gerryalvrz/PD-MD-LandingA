import { NextResponse } from "next/server"
import {
  filterResponseHeaders,
  injectEmbedShim,
  isEmbedHost,
  pickForwardRequestHeaders,
  resolveUpstream,
  rewriteUpstreamContent,
  shouldRewriteContentType,
  embedPrefix,
} from "@/lib/embed-proxy"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

type RouteContext = {
  params: Promise<{ host: string; path?: string[] }>
}

async function proxy(request: Request, context: RouteContext) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.json({ error: "Método no permitido" }, { status: 405 })
  }

  const { host, path = [] } = await context.params
  if (!isEmbedHost(host)) {
    return NextResponse.json({ error: "Recurso no disponible" }, { status: 404 })
  }

  const incoming = new URL(request.url)
  const upstream = resolveUpstream(host, path, incoming.search)
  if (!upstream) {
    return NextResponse.json({ error: "Ruta inválida" }, { status: 400 })
  }

  const outbound = pickForwardRequestHeaders(request.headers, host, upstream.pathname)

  let upstreamResponse: Response
  try {
    upstreamResponse = await fetch(upstream, {
      method: "GET",
      headers: outbound,
      redirect: "follow",
      cache: "no-store",
    })
  } catch {
    return NextResponse.json({ error: "No se pudo abrir el recurso" }, { status: 502 })
  }

  const headers = filterResponseHeaders(upstreamResponse.headers)
  const contentType = headers.get("content-type") ?? ""
  const prefix = embedPrefix(host)

  if (!shouldRewriteContentType(contentType)) {
    return new NextResponse(request.method === "HEAD" ? null : upstreamResponse.body, {
      status: upstreamResponse.status,
      headers,
    })
  }

  const text = await upstreamResponse.text()
  const rewritten = rewriteUpstreamContent(text, prefix)
  const body = /html/i.test(contentType) ? injectEmbedShim(rewritten, prefix) : rewritten
  headers.set("cache-control", "private, no-store")
  return new NextResponse(request.method === "HEAD" ? null : body, {
    status: upstreamResponse.status,
    headers,
  })
}

export function GET(request: Request, context: RouteContext) {
  return proxy(request, context)
}

export function HEAD(request: Request, context: RouteContext) {
  return proxy(request, context)
}
