import assert from "node:assert/strict"
import { test } from "node:test"
import {
  embedPrefix,
  injectEmbedShim,
  isEmbedHost,
  pickForwardRequestHeaders,
  resolveUpstream,
  rewriteUpstreamContent,
} from "../src/lib/embed-proxy.ts"

test("allowlists only known embed hosts", () => {
  assert.equal(isEmbedHost("app"), true)
  assert.equal(isEmbedHost("gitbook"), true)
  assert.equal(isEmbedHost("chat"), true)
  assert.equal(isEmbedHost("evil"), false)
})

test("resolves nested upstream paths and rejects traversal", () => {
  const academia = resolveUpstream("app", ["academia"], "?rsc=1")
  assert.equal(academia?.toString(), "https://app.motusdao.org/academia?rsc=1")
  assert.equal(resolveUpstream("app", ["..", "etc"]), null)
  assert.equal(resolveUpstream("gitbook", ["motusdao-para-psicologos", "~gitbook", "image"])?.pathname, "/motusdao-para-psicologos/~gitbook/image")
})

test("rewrites root-relative assets through the embed prefix once", () => {
  const html = rewriteUpstreamContent(
    `<link href="/_next/static/x.css"><a href="/academia">Academia</a><a href="/embed/app/pagos">Pagos</a>`,
    "/embed/app",
  )
  assert.equal(
    html,
    `<link href="/embed/app/_next/static/x.css"><a href="/embed/app/academia">Academia</a><a href="/embed/app/pagos">Pagos</a>`,
  )
})

test("gitbook document requests ask for HTML, not markdown", () => {
  const headers = pickForwardRequestHeaders(
    new Headers({ accept: "text/markdown, text/html;q=0.9" }),
    "gitbook",
    "/motusdao-para-psicologos",
  )
  assert.equal(headers.get("accept")?.includes("text/html"), true)
  assert.equal(headers.get("accept")?.includes("markdown"), false)
  assert.equal(headers.get("user-agent")?.includes("Chrome"), true)
  assert.equal(headers.get("user-agent")?.includes("Cursor"), false)
})

test("injects the fetch shim before page scripts", () => {
  const html = injectEmbedShim("<head><script src='/app.js'></script></head>", "/embed/chat")
  assert.match(html, /^<head><script>\(\(\)=>\{/)
  assert.ok(html.indexOf("fetch") < html.indexOf("/app.js"))
  assert.equal(embedPrefix("chat"), "/embed/chat")
})
