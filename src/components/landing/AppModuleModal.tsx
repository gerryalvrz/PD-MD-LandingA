"use client"

import { useEffect, useId, useRef, type ReactNode } from "react"
import { X } from "lucide-react"
import {
  appModuleParagraphs,
  type AppModule,
  type AppModuleInline,
  type AppModuleParagraph,
} from "@/lib/app-experience"
import { ACCENT, T, type Tok } from "@/lib/landing-theme"
import styles from "./AppModuleModal.module.css"

function renderParagraph(paragraph: AppModuleParagraph, accent: string) {
  if (typeof paragraph === "string") return paragraph

  return paragraph.map((part: AppModuleInline, index) => {
    if (typeof part === "string") return <span key={index}>{part}</span>
    return (
      <a
        key={index}
        href={part.href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.inlineLink}
        style={{ color: accent }}
      >
        {part.label}
        <span className="sr-only"> (abre otra pestaña)</span>
      </a>
    )
  })
}

export function AppModuleModal({
  module,
  dark,
  icon,
  onClose,
  onMembership,
}: {
  module: AppModule
  dark: boolean
  icon: ReactNode
  onClose: () => void
  onMembership: () => void
}) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const tok: Tok = dark ? T.dark : T.light
  const paragraphs = appModuleParagraphs(module.detail)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  return (
    <div className={styles.backdrop} data-theme={dark ? "dark" : "light"} onClick={onClose} role="presentation">
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{ background: tok.bg, borderColor: tok.cardBorder, color: tok.t1 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Cerrar"
          style={{ color: tok.t2, borderColor: tok.cardBorder }}
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className={styles.header}>
          <span className={styles.iconWrap} style={{ color: ACCENT.iris }} aria-hidden="true">
            {icon}
          </span>
          <div>
            <p className={styles.kicker} style={{ color: ACCENT.iris }}>
              En la App MotusDAO
            </p>
            <h2 id={titleId} className={styles.title}>
              {module.title}
            </h2>
          </div>
        </div>

        <div className={styles.detail} style={{ color: tok.t2 }}>
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{renderParagraph(paragraph, ACCENT.iris)}</p>
          ))}
        </div>

        {module.aside ? (
          <p className={styles.aside} style={{ color: ACCENT.iris }}>
            {module.aside}
          </p>
        ) : null}

        <ul className={styles.points} style={{ color: tok.t2 }}>
          {module.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={onMembership}>
            Ver planes
          </button>
          <button
            type="button"
            className={styles.secondary}
            style={{ color: tok.t2, borderColor: tok.cardBorder }}
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
