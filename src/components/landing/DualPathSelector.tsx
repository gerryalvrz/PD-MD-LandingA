"use client"

import { GlassCta } from "@/components/ui/glass-cta"
import { LANDING_JOURNEY } from "@/content/landing"
import { ACCENT, T } from "@/lib/landing-theme"
import styles from "./DualPathSelector.module.css"

export function DualPathSelector({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const copy = LANDING_JOURNEY.dualPath
  const communityAccent = ACCENT.pink
  const professionalAccent = dark ? "#67E8F9" : "#0891B2"

  const communityCard = {
    border: `1px solid ${dark ? "rgba(244,114,182,0.42)" : "rgba(236,72,153,0.32)"}`,
    background: dark
      ? "linear-gradient(165deg, rgba(244,114,182,0.14) 0%, rgba(14,10,26,0.55) 42%, rgba(14,10,26,0.82) 100%)"
      : "linear-gradient(165deg, rgba(251,113,133,0.16) 0%, rgba(255,255,255,0.88) 48%, rgba(248,246,255,0.96) 100%)",
    boxShadow: dark
      ? "0 0 0 1px rgba(253,230,255,0.08), 0 0 36px rgba(244,114,182,0.16), 0 18px 40px rgba(8,4,20,0.35)"
      : "0 0 0 1px rgba(244,114,182,0.08), 0 14px 32px rgba(190,24,93,0.08)",
  } as const

  const professionalCard = {
    border: `1px solid ${dark ? "rgba(103,232,249,0.28)" : "rgba(8,145,178,0.24)"}`,
    background: dark
      ? "linear-gradient(165deg, rgba(34,211,238,0.08) 0%, rgba(14,10,26,0.72) 45%, rgba(14,10,26,0.9) 100%)"
      : "linear-gradient(165deg, rgba(165,243,252,0.35) 0%, rgba(255,255,255,0.92) 50%, rgba(240,249,255,0.98) 100%)",
    boxShadow: dark
      ? "0 0 28px rgba(34,211,238,0.08), 0 16px 36px rgba(8,4,20,0.28)"
      : "0 12px 28px rgba(8,145,178,0.06)",
  } as const

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <article className={styles.card} style={communityCard}>
          <p className={styles.audience} style={{ color: communityAccent }}>
            {copy.community.audience}
          </p>
          <h3 className={styles.title} style={{ color: tok.t1 }}>
            {copy.community.title}
          </h3>
          <ol className={styles.steps}>
            {copy.community.steps.map((step, i) => (
              <li key={step}>
                <div className={styles.step} style={{ color: tok.t1 }}>
                  <span aria-hidden style={{ color: communityAccent }}>
                    ●
                  </span>
                  {step}
                </div>
                {i < copy.community.steps.length - 1 ? (
                  <div className={styles.stepArrow} style={{ color: tok.t3 }} aria-hidden>
                    ↓
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
          <div className={styles.actions}>
            <GlassCta full href={copy.community.primaryCta.href} dark={dark}>
              {copy.community.primaryCta.label}
            </GlassCta>
            <a
              className={styles.secondaryLink}
              href={copy.community.secondaryCta.href}
              style={{ color: communityAccent }}
            >
              {copy.community.secondaryCta.label}
            </a>
          </div>
        </article>

        <article className={styles.card} style={professionalCard}>
          <p className={styles.audience} style={{ color: professionalAccent }}>
            {copy.professional.audience}
          </p>
          <h3 className={styles.title} style={{ color: tok.t1 }}>
            {copy.professional.title}
          </h3>
          <ol className={styles.steps}>
            {copy.professional.steps.map((step, i) => (
              <li key={step}>
                <div className={styles.step} style={{ color: tok.t1 }}>
                  <span aria-hidden style={{ color: professionalAccent }}>
                    ●
                  </span>
                  {step}
                </div>
                {i < copy.professional.steps.length - 1 ? (
                  <div className={styles.stepArrow} style={{ color: tok.t3 }} aria-hidden>
                    ↓
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
          <div className={styles.actions}>
            <GlassCta full href={copy.professional.primaryCta.href} dark={dark}>
              {copy.professional.primaryCta.label}
            </GlassCta>
          </div>
        </article>
      </div>

      <div className={styles.convergence}>
        <div className={styles.join} aria-hidden>
          <div className={styles.joinArm} style={{ background: communityAccent }} />
          <div className={styles.joinArm} style={{ background: professionalAccent }} />
        </div>
        <p className={styles.convergenceLabel} style={{ color: tok.t2 }}>
          {copy.convergenceLabel}
        </p>
        <div className={styles.flow}>
          {copy.convergenceSteps.map((step, i) => (
            <span key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className={styles.flowPill} style={{ background: ACCENT.deep, border: `1px solid ${ACCENT.iris}` }}>
                {step}
              </span>
              {i < copy.convergenceSteps.length - 1 ? (
                <span className={styles.flowArrow} style={{ color: ACCENT.iris }} aria-hidden>
                  →
                </span>
              ) : null}
            </span>
          ))}
        </div>
        <p className={styles.microcopy} style={{ color: tok.t3 }}>
          {copy.microcopy}
        </p>
      </div>
    </div>
  )
}
