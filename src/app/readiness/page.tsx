"use client"

import { useEffect, useMemo, useState, type CSSProperties } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { LiquidGradientBackground } from "@/components/hero/LiquidGradientBackground"
import { GlassFilter } from "@/components/ui/liquid-glass"
import { GRAD, T } from "@/lib/landing-theme"
import { ReadinessResultView } from "@/components/readiness/ReadinessResult"
import formStyles from "@/components/diagnostico/PracticeForm.module.css"
import {
  READINESS_IDS,
  READINESS_QUESTIONS,
  READINESS_VERSION,
  evaluateReadiness,
  readinessQuestionById,
  setReadinessAnswer,
  type ReadinessAnswers,
  type ReadinessLetter,
} from "@/lib/readiness-index"
import {
  getOrCreateSessionId,
  getStoredLeadContext,
  type FunnelEventName,
} from "@/lib/funnel-session"
import { isShareReferral } from "@/lib/share-card"

const tok = T.dark

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

type Phase = "intro" | "questions" | "result"

const optionStyle = (selected: boolean): CSSProperties => ({
  textAlign: "left",
  fontFamily: "var(--font-inter)",
  fontSize: 15,
  lineHeight: 1.45,
  color: tok.t1,
  background: selected ? "rgba(147,51,234,0.12)" : "rgba(255,255,255,0.04)",
  border: `1px solid ${selected ? "rgba(168,85,247,0.55)" : "rgba(255,255,255,0.10)"}`,
  borderRadius: 12,
  padding: "14px 16px",
  minHeight: 52,
  cursor: "pointer",
})

const navButtonStyle = (solid?: boolean): CSSProperties => ({
  minHeight: 44,
  borderRadius: 10,
  fontFamily: "var(--font-inter)",
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
  padding: "12px 20px",
  border: solid ? "0" : "1px solid rgba(255,255,255,0.18)",
  background: solid ? GRAD : "transparent",
  color: "#fff",
})

export default function ReadinessPage() {
  const [sessionId, setSessionId] = useState("")
  const [phase, setPhase] = useState<Phase>("intro")
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswersState] = useState<ReadinessAnswers>({})
  const [pending, setPending] = useState<ReadinessLetter | null>(null)
  const [started, setStarted] = useState(false)
  const trackEvent = useMutation(api.leads.trackEvent)

  const questionId = READINESS_IDS[questionIndex]
  const question = questionId ? readinessQuestionById(questionId) : null
  const answeredCount = READINESS_IDS.filter((id) => answers[id] !== undefined).length
  const progress = phase === "result" ? 100 : Math.round((answeredCount / READINESS_QUESTIONS.length) * 100)
  const canComplete =
    pending !== null && READINESS_IDS.every((id) => (id === questionId ? true : answers[id] !== undefined))
  const result = useMemo(() => {
    if (phase !== "result") return null
    return evaluateReadiness(answers)
  }, [phase, answers])

  const onTrack = (eventName: FunnelEventName, payload: Record<string, string> = {}) => {
    if (!sessionId) return
    try {
      const leadCtx = getStoredLeadContext()
      const args: Parameters<typeof trackEvent>[0] = {
        eventName,
        sessionId,
        page: "/readiness",
        section: payload.section,
        ctaLabel: payload.ctaLabel,
        intent: payload.intent === "lead" ? "lead" : undefined,
        metadata: payload,
      }
      if (leadCtx?.email) args.email = leadCtx.email
      if (leadCtx?.leadId) args.leadId = leadCtx.leadId as Parameters<typeof trackEvent>[0]["leadId"]
      void trackEvent(args).catch(() => {})
    } catch {
      // Analytics must not block the assessment.
    }
  }

  useEffect(() => {
    try {
      setSessionId(getOrCreateSessionId())
    } catch {
      setSessionId("local")
    }
  }, [])

  useEffect(() => {
    if (!sessionId) return
    onTrack("page_view", {
      section: "readiness",
      src: isShareReferral(window.location.search) ? "share" : "direct",
    })
  }, [sessionId])

  function begin() {
    setPhase("questions")
    setQuestionIndex(0)
    setPending(answers[READINESS_IDS[0]] ?? null)
    if (!started) {
      setStarted(true)
      onTrack("cta_click", { section: "assessment_started", ctaLabel: READINESS_VERSION, intent: "lead" })
    }
  }

  function goToQuestion(index: number) {
    const id = READINESS_IDS[index]
    setQuestionIndex(index)
    setPending(id && answers[id] ? answers[id]! : null)
    setPhase("questions")
  }

  function continueQuestion() {
    if (!questionId || pending === null) return
    const nextAnswers = setReadinessAnswer(answers, questionId, pending)
    setAnswersState(nextAnswers)
    const complete = READINESS_IDS.every((id) => nextAnswers[id] !== undefined)
    if (complete) {
      const next = evaluateReadiness(nextAnswers)
      setPhase("result")
      onTrack("cta_click", {
        section: "assessment_completed",
        ctaLabel: next.band.id,
        intent: "lead",
        instrument: READINESS_VERSION,
        band: next.band.id,
        priority: next.priority?.id ?? "",
        risk: String(next.flags.length),
      })
      return
    }
    goToQuestion(questionIndex + 1)
  }

  function handleRestart() {
    const confirmed = window.confirm("Esto borra las respuestas de este intento en tu navegador. ¿Quieres empezar de nuevo?")
    if (!confirmed) return
    setAnswersState({})
    setPending(null)
    setQuestionIndex(0)
    setPhase("intro")
  }

  return (
    <div style={{ minHeight: "100svh", background: tok.bg, color: tok.t1, position: "relative", overflow: "hidden" }}>
      <GlassFilter />
      <LiquidGradientBackground dark showControls={false} />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(8,5,14,0.72) 0%, rgba(15,9,24,0.86) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <header
        style={{
          position: "relative",
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px clamp(16px, 4vw, 32px)",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/logo.svg" alt="MotusDAO" style={{ width: 28, height: 28, borderRadius: 8 }} />
          <span style={{ fontFamily: "var(--font-jura)", fontWeight: 700, fontSize: 16, color: tok.t1 }}>
            Practice Readiness
          </span>
        </Link>
        <Link href="/" style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: tok.t2, textDecoration: "none" }}>
          Volver
        </Link>
      </header>

      <main style={{ position: "relative", zIndex: 2, padding: "12px 16px 48px", maxWidth: 640, margin: "0 auto" }}>
        <div
          style={{
            height: 4,
            borderRadius: 99,
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
            marginBottom: 28,
          }}
          aria-hidden={phase === "intro"}
        >
          <div style={{ width: `${phase === "intro" ? 0 : progress}%`, height: "100%", background: GRAD, transition: "width 0.35s ease" }} />
        </div>

        {phase === "intro" ? (
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 500, color: "#A855F7", letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 12 }}>
              Digital Practice Readiness · {READINESS_VERSION}
            </p>
            <h1 style={{ fontFamily: "var(--font-jura)", fontWeight: 700, fontSize: "clamp(26px, 6vw, 36px)", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 16 }}>
              ¿Qué tan preparada está tu práctica profesional para operar de forma digital, segura y sostenible?
            </h1>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 16, color: tok.t2, lineHeight: 1.6, marginBottom: 18 }}>
              Diez preguntas, unos tres minutos, resultado inmediato. Elige la situación que más se parece a lo que haces hoy. No incluyas información de pacientes.
            </p>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: tok.t2, lineHeight: 1.6, marginBottom: 24 }}>
              Verás un mapa de comunicación, IA, privacidad, pagos y comunidad. Orientativo: no es certificación ni auditoría legal.
            </p>
            <button type="button" onClick={begin} style={{ ...navButtonStyle(true), width: "100%" }}>
              Empezar
            </button>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: tok.t3, textAlign: "center", marginTop: 14 }}>
              Orientativo · Gratis · Para psicólogos
            </p>
          </motion.div>
        ) : null}

        {phase === "questions" && question ? (
          <motion.div key={question.id} variants={fadeUp} initial="hidden" animate="show">
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 500, color: "#A855F7", letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 12 }}>
              {question.area} · {questionIndex + 1} de {READINESS_QUESTIONS.length}
            </p>
            <h1 style={{ fontFamily: "var(--font-jura)", fontWeight: 700, fontSize: "clamp(24px, 5.4vw, 34px)", lineHeight: 1.18, letterSpacing: "-0.02em", marginBottom: 10 }}>
              {question.prompt}
            </h1>
            <p className={formStyles.help}>{question.help}</p>
            <div className={formStyles.primary} role="radiogroup" aria-label={question.prompt}>
              {question.options.map((option) => {
                const selected = pending === option.letter
                return (
                  <button
                    key={`${question.id}-${option.letter}`}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setPending(option.letter)}
                    style={optionStyle(selected)}
                  >
                    <strong style={{ color: "#d8b4fe", marginRight: 8 }}>{option.letter}.</strong>
                    {option.label}
                  </button>
                )
              })}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button
                type="button"
                onClick={() => {
                  if (questionIndex === 0) setPhase("intro")
                  else goToQuestion(questionIndex - 1)
                }}
                style={{ ...navButtonStyle(), flex: 1 }}
              >
                Volver
              </button>
              <button
                type="button"
                onClick={continueQuestion}
                disabled={pending === null}
                style={{ ...navButtonStyle(true), flex: 2, opacity: pending === null ? 0.45 : 1 }}
              >
                {canComplete ? "Ver resultado" : "Continuar"}
              </button>
            </div>
          </motion.div>
        ) : null}

        {phase === "result" && result ? (
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <ReadinessResultView
              result={result}
              onEdit={(id) => goToQuestion(READINESS_IDS.indexOf(id))}
              onRestart={handleRestart}
            />
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: tok.t3, textAlign: "center", marginTop: 18 }}>
              <Link href="/#membresia" style={{ color: "#d8b4fe" }}>
                Volver a la membresía
              </Link>
            </p>
          </motion.div>
        ) : null}
      </main>
    </div>
  )
}
