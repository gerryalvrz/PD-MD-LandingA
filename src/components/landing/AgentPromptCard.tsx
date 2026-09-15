"use client"

import { useId, useState } from "react"
import { Check, ChevronDown, Copy } from "lucide-react"
import { LANDING_AGENT_PROMPT } from "@/content/landing"
import { ACCENT, T, type Tok } from "@/lib/landing-theme"
import styles from "./AgentPromptCard.module.css"

export function AgentPromptCard({
  dark,
  onCopy,
}: {
  dark: boolean
  onCopy?: () => void
}) {
  const tok: Tok = dark ? T.dark : T.light
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(LANDING_AGENT_PROMPT.prompt)
      setCopied(true)
      onCopy?.()
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <aside
      className={styles.card}
      data-theme={dark ? "dark" : "light"}
      style={{
        background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.72)",
        borderColor: tok.cardBorder,
        color: tok.t1,
      }}
    >
      <button
        type="button"
        className={styles.summary}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <div className={styles.header}>
          <p className={styles.label} style={{ color: ACCENT.iris }}>
            Prompt
          </p>
          <span className={styles.headerRight}>
            <a
              href={LANDING_AGENT_PROMPT.skillHref}
              className={styles.skillLink}
              style={{ color: tok.t3 }}
              onClick={(event) => event.stopPropagation()}
            >
              {LANDING_AGENT_PROMPT.skillLabel}
            </a>
            <ChevronDown
              size={16}
              aria-hidden="true"
              className={open ? styles.chevronOpen : styles.chevron}
              style={{ color: tok.t3 }}
            />
          </span>
        </div>
        <p className={styles.helper} style={{ color: tok.t2 }}>
          {LANDING_AGENT_PROMPT.helper}
        </p>
        <p className={styles.hint} style={{ color: ACCENT.iris }}>
          {open ? LANDING_AGENT_PROMPT.collapseHint : LANDING_AGENT_PROMPT.expandHint}
          <ChevronDown
            size={14}
            aria-hidden="true"
            className={open ? styles.chevronOpen : styles.chevron}
          />
        </p>
      </button>

      {open ? (
        <div id={panelId} className={styles.panel}>
          <pre className={styles.prompt} style={{ color: tok.t1, borderColor: tok.cardBorder }}>
            {LANDING_AGENT_PROMPT.prompt}
          </pre>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={() => void handleCopy()}
              style={{
                color: dark ? "#fff" : "rgba(14,10,26,0.92)",
                borderColor: dark ? "rgba(253,230,255,0.28)" : "rgba(112,37,174,0.28)",
                background: dark
                  ? "linear-gradient(105deg, rgba(236,72,153,0.22), rgba(155,138,255,0.18))"
                  : "linear-gradient(105deg, rgba(236,72,153,0.14), rgba(155,138,255,0.12))",
              }}
            >
              {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              {copied ? LANDING_AGENT_PROMPT.copiedLabel : LANDING_AGENT_PROMPT.copyLabel}
            </button>
            <p className={styles.note} style={{ color: tok.t3 }}>
              {LANDING_AGENT_PROMPT.note}
            </p>
          </div>
        </div>
      ) : null}
    </aside>
  )
}
