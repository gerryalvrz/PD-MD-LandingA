"use client"

import { BookOpen, GraduationCap, Stethoscope, BadgeCheck, Building2 } from "lucide-react"
import { LayoutGroup, motion } from "framer-motion"
import { ShiftCard } from "@/components/ui/shift-card"
import type { JourneyStage } from "@/content/landing"
import { ACCENT, T, type Tok } from "@/lib/landing-theme"
import styles from "./JourneyPathCards.module.css"

const ICONS = [GraduationCap, BookOpen, Stethoscope, BadgeCheck, Building2] as const

export function JourneyPathCards({
  stages,
  dark,
  variant = "community",
}: {
  stages: readonly JourneyStage[]
  dark: boolean
  variant?: "community" | "fast"
}) {
  const tok: Tok = dark ? T.dark : T.light

  return (
    <div data-theme={dark ? "dark" : "light"} className={variant === "fast" ? styles.gridFast : styles.grid}>
      {stages.map((stage, index) => (
        <DoorCard key={stage.label} stage={stage} index={index} tok={tok} dark={dark} />
      ))}
    </div>
  )
}

function DoorCard({
  stage,
  index,
  tok,
  dark,
}: {
  stage: JourneyStage
  index: number
  tok: Tok
  dark: boolean
}) {
  const Icon = ICONS[Number(stage.ordinal) - 1] ?? GraduationCap
  const layoutId = `journey-door-${stage.ordinal}`

  const topContent = (
    <div
      className={styles.topBar}
      style={{
        background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.72)",
        borderColor: tok.cardBorder,
        color: tok.t1,
      }}
    >
      <div className={styles.topBarInner}>
        <span className={styles.ordinal} style={{ color: ACCENT.iris }}>
          {stage.ordinal}
        </span>
        <Icon className={styles.icon} style={{ color: ACCENT.iris }} aria-hidden />
        <h3 className={styles.title}>{stage.title}</h3>
      </div>
    </div>
  )

  const topAnimateContent = (
    <>
      <motion.img
        layout
        src={stage.imageSrc}
        layoutId={layoutId}
        width={72}
        height={88}
        alt=""
        className={styles.thumb}
      />
      <motion.div
        className={styles.thumbFrame}
        style={{ borderColor: `${ACCENT.iris}B3` }}
        initial={{ opacity: 0, scale: 1.5, filter: "blur(4px)" }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          transition: { delay: 0.32, duration: 0.16 },
        }}
        exit={{
          opacity: 0,
          y: 80,
          filter: "blur(4px)",
          transition: { duration: 0 },
        }}
      />
    </>
  )

  const middleContent = (
    <motion.img
      layout
      src={stage.imageSrc}
      layoutId={layoutId}
      width={280}
      height={168}
      alt={stage.imageAlt}
      className={styles.heroImage}
      style={{ borderColor: tok.cardBorder }}
    />
  )

  const bottomContent = (
    <div className={styles.bottom}>
      <div
        className={styles.bottomPanel}
        style={{
          background: dark ? "rgba(14,10,26,0.94)" : "rgba(255,255,255,0.94)",
          borderColor: tok.cardBorder,
        }}
      >
        <div className={styles.jobRow} style={{ color: tok.t1 }}>
          <span className={styles.dot} style={{ background: ACCENT.deep }} aria-hidden />
          <p>{stage.job}</p>
        </div>
        <div className={styles.details}>
          <p style={{ color: tok.t2 }}>{stage.line}</p>
          <ul className={styles.chips}>
            {stage.chips.map((chip) => (
              <li
                key={chip}
                style={{
                  borderColor: tok.cardBorder,
                  background: dark ? "rgba(255,255,255,0.04)" : "rgba(14,10,26,0.04)",
                  color: tok.t2,
                }}
              >
                {chip}
              </li>
            ))}
          </ul>
          <span className={styles.cta}>{stage.cta} →</span>
        </div>
        <p className="sr-only">{stage.line}</p>
      </div>
    </div>
  )

  return (
    <LayoutGroup id={layoutId}>
      <ShiftCard
        href={stage.href}
        aria-label={`${stage.label}. ${stage.cta}`}
        className={styles.shell}
        topContent={topContent}
        topAnimateContent={topAnimateContent}
        middleContent={middleContent}
        bottomContent={bottomContent}
        transition={{ delay: index * 0.06, duration: 0.45 }}
      />
    </LayoutGroup>
  )
}
