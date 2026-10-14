"use client"

import { BookOpen, CircleUserRound } from "lucide-react"
import { GlassCta } from "@/components/ui/glass-cta"
import { LANDING_JOURNEY } from "@/content/landing"
import { ACCENT, T } from "@/lib/landing-theme"
import { newTabProps } from "@/lib/new-tab"
import styles from "./DualPathSelector.module.css"

const SHARED_NODES = ["Validación", "Aprobación", "Invitación", "Portal Clínico"] as const

function DottedBookWatermark({
  className,
  color,
  opacity,
}: {
  className?: string
  color: string
  opacity: number
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={{ color, opacity }}
    >
      <g
        stroke="currentColor"
        strokeWidth={1.65}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="0.01 5.2"
      >
        <path d="M12 7v14" />
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </g>
    </svg>
  )
}

function DottedProfileWatermark({
  className,
  color,
  opacity,
}: {
  className?: string
  color: string
  opacity: number
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={{ color, opacity }}
    >
      <g
        stroke="currentColor"
        strokeWidth={1.65}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="0.01 5.2"
      >
        <path d="M17.925 20.056a6 6 0 0 0-11.851.001" />
        <circle cx="12" cy="11" r="4" />
        <circle cx="12" cy="12" r="10" />
      </g>
    </svg>
  )
}

function FlowLine({ color }: { color: string }) {
  return <div className={styles.line} style={{ background: color }} aria-hidden />
}

function FlowNode({
  children,
  color,
  weight = "node",
}: {
  children: React.ReactNode
  color: string
  weight?: "entry" | "route" | "node" | "destination"
}) {
  return (
    <p className={styles[weight]} style={{ color }}>
      {children}
    </p>
  )
}

export function DualPathSelector({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const copy = LANDING_JOURNEY.dualPath
  const communityAccent = ACCENT.pink
  const professionalAccent = dark ? "#67E8F9" : "#0891B2"
  const sharedAccent = ACCENT.iris
  const lineCommunity = dark ? "rgba(244,114,182,0.45)" : "rgba(236,72,153,0.4)"
  const lineProfessional = dark ? "rgba(103,232,249,0.4)" : "rgba(8,145,178,0.35)"
  const lineShared = dark ? "rgba(155,138,255,0.45)" : "rgba(110,86,207,0.35)"
  const watermarkOpacity = dark ? 0.34 : 0.22

  return (
    <div className={styles.wrap}>
      <div className={styles.branches}>
        <div className={styles.branch}>
          <DottedBookWatermark
            className={`${styles.pathWatermark} ${styles.pathWatermarkLeft}`}
            color={communityAccent}
            opacity={watermarkOpacity}
          />
          <BookOpen
            className={styles.pathIcon}
            style={{ color: communityAccent }}
            strokeWidth={1.75}
            aria-hidden
          />
          <FlowNode weight="entry" color={communityAccent}>
            {copy.community.audience}
          </FlowNode>
          <FlowLine color={lineCommunity} />
          <FlowNode weight="route" color={tok.t1}>
            {copy.community.title}
          </FlowNode>
          <div className={styles.actions}>
            <GlassCta small variant="outline" href={copy.community.primaryCta.href} dark={dark}>
              {copy.community.primaryCta.label}
            </GlassCta>
            <a
              className={styles.secondaryLink}
              href={copy.community.secondaryCta.href}
              {...newTabProps(copy.community.secondaryCta.href)}
              style={{ color: communityAccent }}
            >
              {copy.community.secondaryCta.label}
            </a>
          </div>
          {copy.community.steps.map((step) => (
            <div key={step} className={styles.stepBlock}>
              <FlowLine color={lineCommunity} />
              <FlowNode color={tok.t2}>{step}</FlowNode>
            </div>
          ))}
          <div className={styles.branchTail} style={{ background: lineCommunity }} aria-hidden />
        </div>

        <div className={styles.branch}>
          <DottedProfileWatermark
            className={`${styles.pathWatermark} ${styles.pathWatermarkRight}`}
            color={professionalAccent}
            opacity={watermarkOpacity}
          />
          <CircleUserRound
            className={styles.pathIcon}
            style={{ color: professionalAccent }}
            strokeWidth={1.75}
            aria-hidden
          />
          <FlowNode weight="entry" color={professionalAccent}>
            {copy.professional.audience}
          </FlowNode>
          <FlowLine color={lineProfessional} />
          <FlowNode weight="route" color={tok.t1}>
            {copy.professional.title}
          </FlowNode>
          <div className={styles.actions}>
            <GlassCta small variant="outline" href={copy.professional.primaryCta.href} dark={dark}>
              {copy.professional.primaryCta.label}
            </GlassCta>
          </div>
          {copy.professional.steps.map((step) => (
            <div key={step} className={styles.stepBlock}>
              <FlowLine color={lineProfessional} />
              <FlowNode color={tok.t2}>{step}</FlowNode>
            </div>
          ))}
          <div className={styles.branchTail} style={{ background: lineProfessional }} aria-hidden />
        </div>
      </div>

      <div className={styles.merge} aria-hidden>
        <span className={styles.mergeArm} style={{ color: lineCommunity }} />
        <span className={styles.mergeArm} style={{ color: lineProfessional }} />
        <span className={styles.mergeStem} style={{ background: lineShared }} />
      </div>

      <div className={styles.shared}>
        {SHARED_NODES.map((node, i) => {
          const isDestination = i === SHARED_NODES.length - 1
          return (
            <div key={node} className={styles.stepBlock}>
              {i > 0 ? <FlowLine color={lineShared} /> : null}
              <FlowNode
                weight={isDestination ? "destination" : "route"}
                color={isDestination ? tok.t1 : sharedAccent}
              >
                {node}
              </FlowNode>
            </div>
          )
        })}
        <p className={styles.microcopy} style={{ color: tok.t3 }}>
          {copy.microcopy}
        </p>
      </div>
    </div>
  )
}

export function DualPathSection({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light

  return (
    <section
      id="ruta"
      style={{
        background: tok.bg,
        padding: "clamp(36px, 6vh, 64px) clamp(20px, 5vw, 72px) clamp(48px, 8vh, 88px)",
        scrollMarginTop: 88,
      }}
    >
      <div style={{ marginBottom: 28, maxWidth: 720, marginInline: "auto", textAlign: "center" }}>
        <p
          style={{
            margin: "0 0 10px",
            fontFamily: "var(--font-inter)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: ACCENT.iris,
          }}
        >
          {LANDING_JOURNEY.label}
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
          {LANDING_JOURNEY.heading}
        </h2>
        <p
          style={{
            margin: "12px auto 0",
            fontFamily: "var(--font-inter)",
            fontSize: 15,
            color: tok.t2,
            lineHeight: 1.55,
          }}
        >
          {LANDING_JOURNEY.lede}
        </p>
      </div>
      <DualPathSelector dark={dark} />
    </section>
  )
}
