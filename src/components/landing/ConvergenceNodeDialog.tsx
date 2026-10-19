"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import { createPortal } from "react-dom"
import { SwarmDialog, SwarmUI } from "dots-swarm/ui"
import styles from "./HumanReviewDialog.module.css"

/** Always centered in the viewport — never relative to the trigger or scroll offset. */
const SCENE_STYLE: CSSProperties = {
  position: "fixed",
  inset: 0,
  display: "grid",
  placeItems: "center",
  pointerEvents: "none",
}

type ConvergenceNodeDialogProps = {
  eyebrow: string
  title: string
  itemsLabel: string
  items: readonly string[]
  note: string
  closeLabel?: string
}

/** Circular CTA + modal (same pattern as “Punto común · Revisión humana”). */
export function ConvergenceNodeDialog({
  eyebrow,
  title,
  itemsLabel,
  items,
  note,
  closeLabel = "Cerrar",
}: ConvergenceNodeDialogProps) {
  const [open, setOpen] = useState(false)
  const [showSwarm, setShowSwarm] = useState(false)
  const [formed, setFormed] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const timerIds = useRef<number[]>([])
  const frameId = useRef<number | null>(null)

  const clearTransition = useCallback(() => {
    timerIds.current.forEach((id) => window.clearTimeout(id))
    timerIds.current = []
    if (frameId.current !== null) {
      window.cancelAnimationFrame(frameId.current)
      frameId.current = null
    }
  }, [])

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setReducedMotion(media.matches)
    updatePreference()
    media.addEventListener("change", updatePreference)
    return () => {
      media.removeEventListener("change", updatePreference)
      clearTransition()
    }
  }, [clearTransition])

  // Freeze scroll while the swarm is on screen so particle coords stay locked to the viewport.
  useEffect(() => {
    if (!showSwarm) return
    const { body, documentElement } = document
    const lockedY = window.scrollY
    const previousOverflow = body.style.overflow
    const previousHtmlOverflow = documentElement.style.overflow
    body.style.overflow = "hidden"
    documentElement.style.overflow = "hidden"
    const keep = () => {
      if (window.scrollY !== lockedY) window.scrollTo(0, lockedY)
    }
    window.addEventListener("scroll", keep, { passive: false, capture: true })
    return () => {
      window.removeEventListener("scroll", keep, true)
      body.style.overflow = previousOverflow
      documentElement.style.overflow = previousHtmlOverflow
    }
  }, [showSwarm])

  const close = useCallback(() => {
    clearTransition()
    setOpen(false)
    setFormed(false)
    setShowSwarm(false)
  }, [clearTransition])

  const beginOpen = useCallback(() => {
    if (open || showSwarm) return
    if (reducedMotion) {
      setOpen(true)
      return
    }

    setShowSwarm(true)
    setFormed(false)
    frameId.current = window.requestAnimationFrame(() => {
      setFormed(true)
      frameId.current = null
    })
    timerIds.current.push(
      window.setTimeout(() => {
        setOpen(true)
        setShowSwarm(false)
        timerIds.current = []
      }, 420),
    )
  }, [open, reducedMotion, showSwarm])

  const swarmLayer =
    showSwarm && typeof document !== "undefined"
      ? createPortal(
          <div className={styles.swarmTransition} aria-hidden>
            <SwarmUI.Root
              viewport
              active={formed ? "control" : "swarm"}
              transition={false}
              spring={28}
              damping={12}
              count={520}
              color="rgba(201, 192, 255, 0.3)"
              reducedMotion={reducedMotion}
              interactive={false}
              style={{ position: "fixed", inset: 0 }}
            >
              <SwarmUI.Scene name="swarm" style={SCENE_STYLE}>
                <SwarmUI.Part shape="cloud" style={{ width: 160, height: 160 }} />
              </SwarmUI.Scene>
              <SwarmUI.Scene name="control" style={SCENE_STYLE}>
                {/* Orb matches the circular CTA — a tidy ring instead of a loose menu. */}
                <SwarmUI.Part shape="orb" style={{ width: 200, height: 200 }} />
              </SwarmUI.Scene>
            </SwarmUI.Root>
          </div>,
          document.body,
        )
      : null

  return (
    <SwarmDialog.Root open={open} onOpenChange={(nextOpen) => (nextOpen ? beginOpen() : close())}>
      {swarmLayer}

      <SwarmDialog.Trigger asChild>
        <button type="button" className={styles.reviewTrigger} data-review-node>
          <span>{eyebrow}</span>
          <strong>{title}</strong>
        </button>
      </SwarmDialog.Trigger>

      <SwarmDialog.Portal>
        <SwarmDialog.Overlay className={styles.overlay} />
        <SwarmDialog.Content className={styles.content}>
          <div className={styles.contentHeader}>
            <div>
              <p>{eyebrow}</p>
              <SwarmDialog.Title>{title}</SwarmDialog.Title>
            </div>
            <SwarmDialog.Close className={styles.close} aria-label={closeLabel}>
              {closeLabel}
            </SwarmDialog.Close>
          </div>
          <SwarmDialog.Description className={styles.description}>
            {itemsLabel}
          </SwarmDialog.Description>
          <ul className={styles.requirements}>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className={styles.note}>{note}</p>
        </SwarmDialog.Content>
      </SwarmDialog.Portal>
    </SwarmDialog.Root>
  )
}
