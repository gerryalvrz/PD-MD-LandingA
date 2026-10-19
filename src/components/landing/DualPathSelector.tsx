"use client"

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { BookOpen, CircleUserRound } from "lucide-react"
import { GlassCta } from "@/components/ui/glass-cta"
import { ColorBends } from "@/components/ui/color-bends"
import { ConvergenceNodeDialog } from "@/components/landing/ConvergenceNodeDialog"
import { LANDING_JOURNEY } from "@/content/landing"
import { ACCENT, T } from "@/lib/landing-theme"
import { newTabProps } from "@/lib/new-tab"
import styles from "./DualPathSelector.module.css"

const SHARED_NODES = ["Validación", "Aprobación", "Invitación"] as const
const ROUTE_BEND_COLORS = ["#A855F7"]

type ConvergenceStream = {
  side: 0 | 1
  spread: number
  progress: number
  speed: number
}

function VerticalConvergenceField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const root = canvas?.parentElement
    if (!canvas || !root) return

    const context = canvas.getContext("2d")
    if (!context) return

    const streams: ConvergenceStream[] = Array.from({ length: 36 }, (_, index) => ({
      side: index % 2 === 0 ? 0 : 1,
      spread: Math.random(),
      progress: Math.random(),
      speed: 0.00007 + Math.random() * 0.00008,
    }))
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0
    let lastTime = performance.now()

    const bezierPoint = (
      progress: number,
      p0: { x: number; y: number },
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      p3: { x: number; y: number },
    ) => {
      const inverse = 1 - progress
      return {
        x:
          inverse ** 3 * p0.x +
          3 * inverse ** 2 * progress * p1.x +
          3 * inverse * progress ** 2 * p2.x +
          progress ** 3 * p3.x,
        y:
          inverse ** 3 * p0.y +
          3 * inverse ** 2 * progress * p1.y +
          3 * inverse * progress ** 2 * p2.y +
          progress ** 3 * p3.y,
      }
    }

    const draw = (time: number) => {
      const rootRect = root.getBoundingClientRect()
      const review = root.querySelector<HTMLElement>("[data-review-node]")
      const entries = Array.from(root.querySelectorAll<HTMLElement>("[data-route-entry]"))
      if (!review || entries.length !== 2 || rootRect.width === 0 || rootRect.height === 0) {
        frame = requestAnimationFrame(draw)
        return
      }

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.round(rootRect.width)
      const height = Math.round(rootRect.height)
      if (canvas.width !== width * pixelRatio || canvas.height !== height * pixelRatio) {
        canvas.width = width * pixelRatio
        canvas.height = height * pixelRatio
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      }

      context.clearRect(0, 0, width, height)
      const reviewRect = review.getBoundingClientRect()
      const target = {
        x: reviewRect.left - rootRect.left + reviewRect.width / 2,
        y: reviewRect.top - rootRect.top + reviewRect.height / 2,
      }
      const elapsed = Math.min(48, time - lastTime)
      lastTime = time

      streams.forEach((stream) => {
        const entry = entries[stream.side]
        const entryRect = entry.getBoundingClientRect()
        const start = {
          x: entryRect.left - rootRect.left + entryRect.width * (0.16 + stream.spread * 0.68),
          y: entryRect.bottom - rootRect.top - 2,
        }
        const p1 = { x: start.x, y: start.y + 48 }
        const p2 = {
          x: target.x + (start.x - target.x) * 0.2,
          y: target.y - 76,
        }

        context.beginPath()
        context.moveTo(start.x, start.y)
        context.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, target.x, target.y)
        context.setLineDash([1, 5])
        context.strokeStyle = "rgba(168, 164, 245, 0.3)"
        context.lineWidth = 1
        context.stroke()

        if (!reduceMotion.matches) {
          stream.progress = (stream.progress + stream.speed * elapsed) % 1
          const dot = bezierPoint(stream.progress, start, p1, p2, target)
          context.setLineDash([])
          context.fillStyle = "rgba(221, 214, 254, 0.3)"
          context.fillRect(dot.x - 1.45, dot.y - 1.45, 2.9, 2.9)
        }
      })

      context.setLineDash([])
      frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [])

  return <canvas ref={canvasRef} className={styles.journeyFlowField} aria-hidden />
}

type WatermarkProps = {
  className?: string
  color: string
  opacity: number
}

/** Lucide icons are drawn on a 24-unit grid; padding keeps blurred halos and outer rings unclipped. */
const WM_PAD = 3
const WM_BOX = { x: -WM_PAD, y: -WM_PAD, width: 24 + WM_PAD * 2, height: 24 + WM_PAD * 2 }
const WM_VIEWBOX = `${WM_BOX.x} ${WM_BOX.y} ${WM_BOX.width} ${WM_BOX.height}`

const DOT_PITCH = 0.28
const DOT_RADIUS = 0.065

function useSvgId() {
  return `wm${useId().replace(/[^a-zA-Z0-9]/g, "")}`
}

const BOOK_PATHS = [
  "M12 7v14",
  "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
]

function DottedBookWatermark({ className, color, opacity }: WatermarkProps) {
  const id = useSvgId()
  const paths = BOOK_PATHS.map((d) => <path key={d} d={d} />)

  return (
    <svg
      className={className}
      viewBox={WM_VIEWBOX}
      fill="none"
      aria-hidden
      style={{ color, "--wm-opacity": opacity } as React.CSSProperties}
    >
      <defs>
        <pattern
          id={`${id}-dots`}
          width={DOT_PITCH}
          height={DOT_PITCH}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={DOT_PITCH / 2} cy={DOT_PITCH / 2} r={DOT_RADIUS} fill="currentColor" />
        </pattern>
        <filter id={`${id}-core`} filterUnits="userSpaceOnUse" {...WM_BOX}>
          <feGaussianBlur stdDeviation={0.3} />
        </filter>
        <filter id={`${id}-halo`} filterUnits="userSpaceOnUse" {...WM_BOX}>
          <feGaussianBlur stdDeviation={1.1} />
        </filter>
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" {...WM_BOX}>
          <g stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
            <g filter={`url(#${id}-halo)`} strokeWidth={3.4} opacity={0.32}>
              {paths}
            </g>
            <g filter={`url(#${id}-core)`} strokeWidth={1.5}>
              {paths}
            </g>
          </g>
        </mask>
      </defs>
      <rect {...WM_BOX} fill={`url(#${id}-dots)`} mask={`url(#${id}-mask)`} />
    </svg>
  )
}

/** Offsets (in icon units) and relative strength of each concentric dot ring. */
const OUTER_BAND = [
  [-1.12, 0.2],
  [-0.84, 0.4],
  [-0.56, 0.65],
  [-0.28, 0.88],
  [0, 1],
  [0.28, 0.88],
  [0.56, 0.65],
  [0.84, 0.4],
  [1.12, 0.2],
  [1.68, 0.1],
] as const
const INNER_BAND = [
  [-0.56, 0.2],
  [-0.28, 0.6],
  [0, 1],
  [0.28, 0.6],
  [0.56, 0.2],
] as const

function DotRings({
  cx,
  cy,
  r,
  band,
}: {
  cx: number
  cy: number
  r: number
  band: ReadonlyArray<readonly [number, number]>
}) {
  return band.map(([offset, strength]) => (
    <circle
      key={offset}
      cx={cx}
      cy={cy}
      r={r + offset}
      opacity={strength}
      strokeDasharray={`0.01 ${DOT_PITCH}`}
    />
  ))
}

function DottedProfileWatermark({ className, color, opacity }: WatermarkProps) {
  const id = useSvgId()

  return (
    <svg
      className={className}
      viewBox={WM_VIEWBOX}
      fill="none"
      aria-hidden
      style={{ color, "--wm-opacity": opacity } as React.CSSProperties}
    >
      <defs>
        {/* Shoulders are the top of a r=6 circle centred at (12, 21), clipped inside the outer ring. */}
        <clipPath id={`${id}-shoulders`}>
          <circle cx={12} cy={12} r={8.4} />
        </clipPath>
      </defs>
      <g stroke="currentColor" strokeWidth={DOT_RADIUS * 2} strokeLinecap="round">
        <DotRings cx={12} cy={12} r={10} band={OUTER_BAND} />
        <DotRings cx={12} cy={11} r={4} band={INNER_BAND} />
        <g clipPath={`url(#${id}-shoulders)`}>
          <DotRings cx={12} cy={21} r={6} band={INNER_BAND} />
        </g>
      </g>
    </svg>
  )
}

function FlowLine({ color }: { color: string }) {
  return <div className={styles.line} style={{ background: color }} aria-hidden />
}

type WatermarkComponent = (props: WatermarkProps) => React.ReactElement

/**
 * Base watermark stays at 20%. A second layer reveals only a small disc
 * around the pointer — never the whole glyph at once.
 */
function PathBranch({
  Watermark,
  watermarkClassName,
  color,
  children,
}: {
  Watermark: WatermarkComponent
  watermarkClassName: string
  color: string
  children: ReactNode
}) {
  const branchRef = useRef<HTMLDivElement>(null)
  const [spot, setSpot] = useState<{ x: number; y: number } | null>(null)

  const updateSpot = useCallback((clientX: number, clientY: number) => {
    const branch = branchRef.current
    // Hit-test the base layer (same box as the spot layer).
    const wm = branch?.querySelector<HTMLElement>(`.${styles.pathWatermarkBase}`)
    if (!wm) {
      setSpot(null)
      return
    }
    const r = wm.getBoundingClientRect()
    if (r.width <= 0 || r.height <= 0) {
      setSpot(null)
      return
    }
    // Only when the pointer is actually over the watermark canvas.
    if (
      clientX < r.left ||
      clientX > r.right ||
      clientY < r.top ||
      clientY > r.bottom
    ) {
      setSpot(null)
      return
    }
    const x = ((clientX - r.left) / r.width) * 100
    const y = ((clientY - r.top) / r.height) * 100
    setSpot({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    })
  }, [])

  return (
    <div
      ref={branchRef}
      className={styles.branch}
      data-spotlight={spot ? "true" : undefined}
      style={
        spot
          ? ({ "--wm-x": `${spot.x}%`, "--wm-y": `${spot.y}%` } as CSSProperties)
          : undefined
      }
      onMouseEnter={(e) => updateSpot(e.clientX, e.clientY)}
      onMouseMove={(e) => updateSpot(e.clientX, e.clientY)}
      onMouseLeave={() => setSpot(null)}
    >
      <Watermark
        className={`${styles.pathWatermark} ${styles.pathWatermarkBase} ${watermarkClassName}`}
        color={color}
        opacity={0.2}
      />
      <Watermark
        className={`${styles.pathWatermark} ${styles.pathWatermarkSpot} ${watermarkClassName}`}
        color={color}
        opacity={1}
      />
      {children}
    </div>
  )
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function PreviousDualPathSelector({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const copy = LANDING_JOURNEY.dualPath
  const communityAccent = ACCENT.pink
  const professionalAccent = dark ? "#67E8F9" : "#0891B2"
  const sharedAccent = ACCENT.iris
  const lineCommunity = dark ? "rgba(244,114,182,0.45)" : "rgba(236,72,153,0.4)"
  const lineProfessional = dark ? "rgba(103,232,249,0.4)" : "rgba(8,145,178,0.35)"
  const lineShared = dark ? "rgba(155,138,255,0.45)" : "rgba(110,86,207,0.35)"
  return (
    <div className={styles.wrap}>
      <div className={styles.branches}>
        <PathBranch
          Watermark={DottedBookWatermark}
          watermarkClassName={styles.pathWatermarkLeft}
          color={communityAccent}
        >
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
        </PathBranch>

        <PathBranch
          Watermark={DottedProfileWatermark}
          watermarkClassName={styles.pathWatermarkRight}
          color={professionalAccent}
        >
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
        </PathBranch>
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

export function DualPathSelector({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const copy = LANDING_JOURNEY.dualPath
  const branchGlassStyle = {
    "--journey-glass-background": dark
      ? "linear-gradient(135deg, rgba(16, 10, 30, 0.36), rgba(38, 16, 58, 0.30))"
      : "linear-gradient(135deg, rgba(255, 255, 255, 0.36), rgba(245, 238, 255, 0.30))",
  } as CSSProperties

  return (
    <div className={styles.journeyWrap}>
      <VerticalConvergenceField />
      <div className={styles.journeyBranches}>
        <article className={styles.journeyBranch} data-route-entry style={branchGlassStyle}>
          <BookOpen
            className={`${styles.journeyWatermark} ${styles.journeyWatermarkCommunity}`}
            strokeWidth={1.15}
            aria-hidden
          />
          <div className={styles.journeyTopline}>
            <BookOpen className={styles.journeyIcon} strokeWidth={1.75} aria-hidden />
            <span>01 · Punto de partida</span>
          </div>
          <h3 style={{ color: tok.t1 }}>{copy.community.audience}</h3>
          <p className={styles.journeyRoute} style={{ color: tok.t2 }}>
            {copy.community.title}
          </p>
          <div
            className={styles.journeySteps}
            style={{ color: tok.t2 }}
            aria-label="Etapas de la ruta formativa"
          >
            {copy.community.steps.map((step) => (
              <span key={step}>{step}</span>
            ))}
          </div>
          <div className={styles.journeyActions}>
            <GlassCta small variant="outline" href={copy.community.primaryCta.href} dark={dark}>
              {copy.community.primaryCta.label}
            </GlassCta>
            <a
              className={styles.journeySecondaryLink}
              href={copy.community.secondaryCta.href}
              {...newTabProps(copy.community.secondaryCta.href)}
            >
              {copy.community.secondaryCta.label}
            </a>
          </div>
        </article>

        <article className={styles.journeyBranch} data-route-entry style={branchGlassStyle}>
          <CircleUserRound
            className={`${styles.journeyWatermark} ${styles.journeyWatermarkProfessional}`}
            strokeWidth={1.15}
            aria-hidden
          />
          <div className={styles.journeyTopline}>
            <CircleUserRound className={styles.journeyIcon} strokeWidth={1.75} aria-hidden />
            <span>02 · Punto de partida</span>
          </div>
          <h3 style={{ color: tok.t1 }}>{copy.professional.audience}</h3>
          <p className={styles.journeyRoute} style={{ color: tok.t2 }}>
            {copy.professional.title}
          </p>
          <div
            className={styles.journeySteps}
            style={{ color: tok.t2 }}
            aria-label="Etapas del ingreso profesional"
          >
            {copy.professional.steps.map((step) => (
              <span key={step}>{step}</span>
            ))}
          </div>
          <div className={styles.journeyActions}>
            <GlassCta small variant="outline" href={copy.professional.primaryCta.href} dark={dark}>
              {copy.professional.primaryCta.label}
            </GlassCta>
          </div>
        </article>
      </div>

      <div className={styles.journeyMerge} aria-hidden>
        <svg viewBox="0 0 920 78" preserveAspectRatio="none">
          <path d="M230 0C230 42 364 48 460 76" />
          <path d="M690 0C690 42 556 48 460 76" />
        </svg>
      </div>

      <div className={styles.journeyConvergence}>
        <p className={styles.journeyConvergenceLabel}>Ambas entradas se integran aquí</p>
        <ConvergenceNodeDialog
          eyebrow="Punto común"
          title="Revisión humana"
          itemsLabel={copy.review.requirementsLabel}
          items={copy.review.requirements}
          note={copy.review.note}
          closeLabel="Cerrar requisitos"
        />
        <ol className={styles.journeySharedFlow}>
          {SHARED_NODES.map((node) => (
            <li key={node}>{node}</li>
          ))}
        </ol>
        <div className={styles.journeyPortalNode}>
          <ConvergenceNodeDialog
            eyebrow={copy.portal.eyebrow}
            title={copy.portal.title}
            itemsLabel={copy.portal.itemsLabel}
            items={copy.portal.items}
            note={copy.portal.note}
            closeLabel="Cerrar Portal"
          />
        </div>
        <p className={styles.journeyMicrocopy} style={{ color: tok.t3 }}>
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
      className={styles.journeySection}
      style={{
        background: tok.bg,
        padding: "clamp(36px, 6vh, 64px) clamp(20px, 5vw, 72px) clamp(48px, 8vh, 88px)",
        scrollMarginTop: 88,
      }}
    >
      <div className={styles.colorBendsLayer} aria-hidden>
        <ColorBends
          colors={ROUTE_BEND_COLORS}
          rotation={90}
          autoRotate={0}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={0.5}
          noise={0.15}
          iterations={1}
          intensity={1.5}
          bandWidth={6}
          transparent
        />
      </div>
      <div className={styles.journeySectionContent}>
        <div style={{ marginBottom: 36, maxWidth: 760, marginInline: "auto", textAlign: "center" }}>
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
      </div>
    </section>
  )
}
