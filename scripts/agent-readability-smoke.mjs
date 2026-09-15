#!/usr/bin/env node
/**
 * Agent-readability smoke checks for MotusDAO Academy landing.
 * Usage:
 *   node scripts/agent-readability-smoke.mjs
 *   BASE_URL=https://academia.motusdao.org node scripts/agent-readability-smoke.mjs
 */

const BASE = (process.env.BASE_URL || "https://academia.motusdao.org").replace(/\/$/, "")
const UA =
  process.env.AGENT_UA ||
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.0; +https://openai.com/gptbot)"

const checks = [
  {
    path: "/",
    expectStatus: 200,
    mustInclude: ["Dale estructura", "application/ld+json", "FAQPage", "data-agent-document"],
    mustNotMatch: [/style="[^"]*opacity:\s*0[^"]*"[^>]*>Dale estructura/i],
  },
  {
    path: "/llms.txt",
    expectStatus: 200,
    contentTypeIncludes: "text/plain",
    mustInclude: ["guia-membresia", "USD 20", "Non-claims", "SKILL.md"],
  },
  {
    path: "/SKILL.md",
    expectStatus: 200,
    mustInclude: [
      "name: motusdao-academy",
      "Brief para asistentes",
      "Membresía vs Pase",
      "USD 20/mes",
      "No inventes precios",
      "guia-membresia",
    ],
  },
  {
    path: "/skill.md",
    expectStatus: 200,
    mustInclude: ["motusdao-academy", "USD 20/mes"],
  },

  {
    path: "/robots.txt",
    expectStatus: 200,
    mustInclude: ["Sitemap:", "Allow: /", "GPTBot"],
  },
  {
    path: "/sitemap.xml",
    expectStatus: 200,
    mustInclude: ["guia-membresia", "academia.motusdao.org", "SKILL.md"],
  },
  {
    path: "/guia-membresia",
    expectStatus: 200,
    mustInclude: [
      "Qué es la membresía MotusDAO",
      "Qué no es",
      "application/ld+json",
      "Article",
      "¿Qué incluye la membresía?",
    ],
  },
]

async function fetchText(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "user-agent": UA, accept: "*/*" },
    redirect: "follow",
  })
  const text = await res.text()
  return { res, text }
}

function fail(msg) {
  console.error(`FAIL  ${msg}`)
  process.exitCode = 1
}

function ok(msg) {
  console.log(`OK    ${msg}`)
}

async function main() {
  console.log(`Base: ${BASE}`)
  console.log(`UA:   ${UA}`)
  console.log("")

  for (const check of checks) {
    try {
      const { res, text } = await fetchText(check.path)
      if (res.status !== check.expectStatus) {
        fail(`${check.path} status ${res.status} (expected ${check.expectStatus})`)
        continue
      }
      if (check.contentTypeIncludes) {
        const ct = res.headers.get("content-type") || ""
        if (!ct.includes(check.contentTypeIncludes)) {
          fail(`${check.path} content-type "${ct}" missing "${check.contentTypeIncludes}"`)
          continue
        }
      }
      let bad = false
      for (const needle of check.mustInclude || []) {
        if (!text.includes(needle)) {
          fail(`${check.path} missing "${needle}"`)
          bad = true
        }
      }
      for (const re of check.mustNotMatch || []) {
        if (re.test(text)) {
          fail(`${check.path} matched forbidden pattern ${re}`)
          bad = true
        }
      }
      if (!bad) ok(`${check.path}`)
    } catch (err) {
      fail(`${check.path} ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  if (process.exitCode) {
    console.error("\nAgent readability smoke failed.")
    process.exit(1)
  }
  console.log("\nAgent readability smoke passed.")
}

main()
