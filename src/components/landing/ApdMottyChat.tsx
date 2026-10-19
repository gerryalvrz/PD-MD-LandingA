"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import {
  MottyAvatar,
  type MottyAvatarHandle,
  type MottyExpression,
} from "@/components/motty/MottyAvatar"
import { MottyMarkdown } from "@/components/motty/MottyMarkdown"
import { PromptInput } from "@/components/ui/ai-chat-input"
import { MOTTY_DEFAULT_LOCALE, mottyCopy } from "@/lib/motty/copy"
import type { MottyMessage } from "@/lib/motty/types"
import { cn } from "@/lib/utils"
import styles from "./ApdMottyChat.module.css"

const DIZZY_HOLD_MS = 1600

type ApdMottyChatProps = {
  dark: boolean
}

export function ApdMottyChat({ dark }: ApdMottyChatProps) {
  const copy = mottyCopy(MOTTY_DEFAULT_LOCALE)
  const [lines, setLines] = useState<MottyMessage[]>([
    { role: "assistant", content: copy.greeting },
  ])
  const [pending, setPending] = useState(false)
  const [expression, setExpression] = useState<MottyExpression>("curious")
  const [exploding, setExploding] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<MottyAvatarHandle>(null)
  const dizzyTimerRef = useRef(0)
  const pendingRef = useRef(pending)
  pendingRef.current = pending

  const restExpression = useCallback((): MottyExpression => {
    return pendingRef.current ? "thinking" : "curious"
  }, [])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
  }, [lines, pending])

  useEffect(() => {
    if (exploding) return
    setExpression((current) => {
      if (current === "dizzy") return current
      if (pending) return "thinking"
      if (current === "excited") return current
      return "curious"
    })
  }, [pending, exploding])

  useEffect(
    () => () => {
      if (dizzyTimerRef.current) window.clearTimeout(dizzyTimerRef.current)
    },
    [],
  )

  const onAvatarAction = useCallback(
    (action: "explode" | "reform") => {
      if (action === "explode") {
        setExpression("dizzy")
        return
      }
      setExploding(false)
      if (dizzyTimerRef.current) window.clearTimeout(dizzyTimerRef.current)
      dizzyTimerRef.current = window.setTimeout(() => {
        setExpression(restExpression())
      }, DIZZY_HOLD_MS)
    },
    [restExpression],
  )

  const triggerExplode = useCallback(() => {
    if (exploding) return
    setExploding(true)
    setExpression("excited")
    avatarRef.current?.explode()
  }, [exploding])

  const send = useCallback(
    async (message: string) => {
      const trimmed = message.trim()
      if (!trimmed || pending) return

      setPending(true)
      setExpression("thinking")
      setLines((current) => [...current, { role: "user", content: trimmed }])

      try {
        const response = await fetch("/api/motty/chat", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, locale: MOTTY_DEFAULT_LOCALE }),
        })
        const json = (await response.json()) as { reply?: string; error?: string }
        const reply =
          json.reply?.trim() ||
          (response.status === 429 ? copy.rateLimit : copy.error)
        setLines((current) => [...current, { role: "assistant", content: reply }])
        setExpression("excited")
        window.setTimeout(() => setExpression(restExpression()), 900)
      } catch {
        setLines((current) => [
          ...current,
          { role: "assistant", content: copy.error },
        ])
        setExpression("curious")
      } finally {
        setPending(false)
      }
    },
    [pending, copy.error, copy.rateLimit, restExpression],
  )

  return (
    <div className={cn(styles.wrap, !dark && styles.wrapLight)}>
      <div className={styles.avatarCol}>
        <button
          type="button"
          className={styles.avatarButton}
          onDoubleClick={(event) => {
            event.preventDefault()
            triggerExplode()
          }}
          disabled={exploding}
          aria-label="Motty. Doble clic para sorprender a Motty."
        >
          <MottyAvatar
            ref={avatarRef}
            size={84}
            expression={expression}
            trackPointer
            onActionComplete={onAvatarAction}
            label="Motty"
          />
        </button>
        <p className={styles.avatarHint}>Motty · guía</p>
      </div>

      <div className={styles.chatCol}>
        <div className={styles.header}>
          <strong>{copy.title}</strong>
          <span>{copy.subtitle}</span>
        </div>

        <div ref={listRef} className={styles.messages} aria-live="polite">
          {lines.map((line, index) =>
            line.role === "user" ? (
              <p key={`u-${index}`} className={styles.userBubble}>
                {line.content}
              </p>
            ) : (
              <div key={`a-${index}`} className={styles.assistantBubble}>
                <MottyMarkdown>{line.content}</MottyMarkdown>
              </div>
            ),
          )}
          {pending ? (
            <p className={styles.pending}>
              <Loader2 size={14} className="animate-spin" />
              {copy.thinking}
            </p>
          ) : null}
        </div>

        <div className={styles.inputRow}>
          <PromptInput
            onSubmit={(value) => void send(value)}
            placeholder={copy.placeholder}
            pending={pending}
            disabled={pending}
            collapsedLabel="Pregunta a Motty…"
            className="mx-auto"
          />
        </div>

        <p className={styles.disclaimer}>{copy.disclaimer}</p>
      </div>
    </div>
  )
}
