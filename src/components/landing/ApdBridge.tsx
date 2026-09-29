"use client"

import { LANDING_APD } from "@/content/landing"
import { ACCENT, T } from "@/lib/landing-theme"

export function ApdBridge({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light

  return (
    <section
      id="acompanamiento"
      aria-label={LANDING_APD.eyebrow}
      style={{
        background: tok.bg,
        padding: "clamp(36px, 6vh, 72px) clamp(20px, 5vw, 72px)",
        scrollMarginTop: 88,
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <p
          style={{
            margin: "0 0 12px",
            fontFamily: "var(--font-inter)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: ACCENT.iris,
          }}
        >
          {LANDING_APD.eyebrow}
        </p>
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--font-jura)",
            fontWeight: 700,
            fontSize: "clamp(26px, 4vw, 36px)",
            color: tok.t1,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          {LANDING_APD.heading}
        </h2>
        <p
          style={{
            margin: "16px auto 0",
            maxWidth: 560,
            fontFamily: "var(--font-inter)",
            fontSize: 15,
            color: tok.t2,
            lineHeight: 1.6,
          }}
        >
          {LANDING_APD.body}
        </p>
        <p
          style={{
            margin: "20px auto 0",
            fontFamily: "var(--font-jura)",
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: "0.02em",
            color: tok.t1,
          }}
        >
          {LANDING_APD.how}
        </p>
        <p
          style={{
            margin: "12px auto 0",
            maxWidth: 480,
            fontFamily: "var(--font-inter)",
            fontSize: 13,
            color: tok.t3,
            lineHeight: 1.5,
          }}
        >
          {LANDING_APD.limit}
        </p>
      </div>
    </section>
  )
}
