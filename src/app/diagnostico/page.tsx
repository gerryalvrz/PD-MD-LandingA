"use client"

import { useEffect, useMemo, useState, type CSSProperties } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { LiquidGradientBackground } from "@/components/hero/LiquidGradientBackground"
import { GlassFilter } from "@/components/ui/liquid-glass"
import { GRAD, T } from "@/lib/landing-theme"
import { PracticeResultView } from "@/components/diagnostico/PracticeResult"
import formStyles from "@/components/diagnostico/PracticeForm.module.css"
import {
  CONTEXT_OPTIONS,
  METHOD_VERSION,
  QUESTION_IDS,
  QUESTIONS,
  evaluatePractice,
  questionById,
  setAnswer,
  type AnswerValue,
  type Answers,
  type PracticeContext,
  type QuestionId,
} from "@/lib/practice-index"
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

type Phase = "intro" | "context" | "questions" | "result"

const optionStyle = (selected: boolean, compact?: boolean): CSSProperties => ({
  textAlign: "left",
  fontFamily: "var(--font-inter)",
  fontSize: compact ? 13 : 15,
  lineHeight: 1.45,
  color: compact ? tok.t2 : tok.t1,
  background: selected ? "rgba(147,51,234,0.12)" : "rgba(255,255,255,0.04)",
  border: `1px solid ${selected ? "rgba(168,85,247,0.55)" : "rgba(255,255,255,0.10)"}`,
  borderRadius: compact ? 999 : 12,
  padding: compact ? "10px 14px" : "14px 16px",
  minHeight: compact ? 40 : 52,
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

export default function DiagnosticoPage() {
  const [sessionId, setSessionId] = useState("")
  const [phase, setPhase] = useState<Phase>("intro")
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswersState] = useState<Answers>({})
  const [context, setContext] = useState<PracticeContext | undefined>()
  const [pending, setPending] = useState<AnswerValue | null>(null)
  const [started, setStarted] = useState(false)
  const trackEvent = useMutation(api.leads.trackEvent)

  const questionId = QUESTION_IDS[questionIndex]
  const question = questionId ? questionById(questionId) : null
  const answeredCount = QUESTION_IDS.filter((id) => answers[id] !== undefined).length
  const progress = phase === "result" ? 100 : Math.round((answeredCount / QUESTIONS.length) * 100)
  const canComplete =
    pending !== null && QUESTION_IDS.every((id) => (id === questionId ? true : answers[id] !== undefined))
  const result = useMemo(() => {
    if (phase !== "result") return null
    return evaluatePractice(answers, context)
  }, [phase, answers, context])

  const onTrack = (eventName: FunnelEventName, payload: Record<string, string> = {}) => {
    if (!sessionId) return
    try {
      const leadCtx = getStoredLeadContext()
      const args: Parameters<typeof trackEvent>[0] = {
        eventName,
        sessionId,
        page: "/diagnostico",
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
      section: "diagnostico",
      src: isShareReferral(window.location.search) ? "share" : "direct",
    })
  }, [sessionId])

  function begin() {
    setPhase("context")
    if (!started) {
      setStarted(true)
      onTrack("cta_click", { section: "assessment_started", ctaLabel: METHOD_VERSION, intent: "lead" })
    }
  }

  function goToQuestion(index: number) {
    const id = QUESTION_IDS[index]
    setQuestionIndex(index)
    setPending(id && answers[id] !== undefined ? (answers[id] as AnswerValue) : null)
    setPhase("questions")
  }

  function continueQuestion() {
    if (!questionId || pending === null) return
    const nextAnswers = setAnswer(answers, questionId, pending)
    setAnswersState(nextAnswers)
    const complete = QUESTION_IDS.every((id) => nextAnswers[id] !== undefined)
    if (complete) {
      const next = evaluatePractice(nextAnswers, context)
      setPhase("result")
      onTrack("cta_click", {
        section: "assessment_completed",
        ctaLabel: next.status,
        intent: "lead",
      })
      return
    }
    goToQuestion(questionIndex + 1)
  }

  function handleRestart() {
    const confirmed = window.confirm("Esto borra las respuestas de este intento en tu navegador. ¿Quieres empezar de nuevo?")
    if (!confirmed) return
    setAnswersState({})
    setContext(undefined)
    setPending(null)
    setQuestionIndex(0)
    setPhase("intro")
  }

  function handleEdit(id?: QuestionId) {
    if (!id) {
      goToQuestion(0)
      return
    }
    goToQuestion(QUESTION_IDS.indexOf(id))
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
            Practice Index
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
              Motus Practice Index · {METHOD_VERSION}
            </p>
            <h1 style={{ fontFamily: "var(--font-jura)", fontWeight: 700, fontSize: "clamp(26px, 6vw, 36px)", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 16 }}>
              ¿Qué puedes fortalecer en la organización de tu práctica digital?
            </h1>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 16, color: tok.t2, lineHeight: 1.6, marginBottom: 18 }}>
              Responde sobre lo que haces o tienes preparado hoy. Recibirás una orientación basada en tus respuestas, sin registro. No incluyas información de pacientes.
            </p>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: tok.t2, lineHeight: 1.6, marginBottom: 24 }}>
              Diez situaciones de la práctica. En cada una eliges la que más se parece a lo que haces hoy. No hay puntaje global ni comparación con otros profesionales.
            </p>
            <button type="button" onClick={begin} style={{ ...navButtonStyle(true), width: "100%" }}>
              Empezar
            </button>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: tok.t3, textAlign: "center", marginTop: 14 }}>
              Orientativo · Gratis · Para psicólogos
            </p>
          </motion.div>
        ) : null}

        {phase === "context" ? (
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 500, color: "#A855F7", letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 12 }}>
              Contexto · no puntúa
            </p>
            <h1 style={{ fontFamily: "var(--font-jura)", fontWeight: 700, fontSize: "clamp(26px, 6vw, 36px)", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 22 }}>
              ¿En qué momento de tu práctica estás?
            </h1>
            <div style={{ display: "grid", gap: 10 }} role="group" aria-label="Situación de tu práctica">
              {CONTEXT_OPTIONS.map((option) => (
                <button key={option.value} type="button" onClick={() => setContext(option.value)} style={optionStyle(context === option.value)}>
                  {option.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button type="button" onClick={() => setPhase("intro")} style={{ ...navButtonStyle(), flex: 1 }}>
                Volver
              </button>
              <button
                type="button"
                onClick={() => goToQuestion(0)}
                style={{ ...navButtonStyle(true), flex: 2 }}
              >
                {context ? "Continuar" : "Omitir y continuar"}
              </button>
            </div>
          </motion.div>
        ) : null}

        {phase === "questions" && question ? (
          <motion.div key={question.id} variants={fadeUp} initial="hidden" animate="show">
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 500, color: "#A855F7", letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 12 }}>
              {question.area} · {questionIndex + 1} de {QUESTIONS.length}
            </p>
            <h1 style={{ fontFamily: "var(--font-jura)", fontWeight: 700, fontSize: "clamp(24px, 5.4vw, 34px)", lineHeight: 1.18, letterSpacing: "-0.02em", marginBottom: 10 }}>
              {question.prompt}
            </h1>
            <p className={formStyles.help}>{question.help}</p>
            <div role="radiogroup" aria-label={question.prompt}>
              <div className={formStyles.primary}>
                {question.options
                  .filter((option) => typeof option.value === "number")
                  .map((option) => {
                    const selected = pending === option.value
                    return (
                      <button
                        key={`${question.id}-${String(option.value)}`}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setPending(option.value)}
                        style={optionStyle(selected)}
                      >
                        {option.label}
                      </button>
                    )
                  })}
              </div>
              <div className={formStyles.secondary}>
                <p className={formStyles.secondaryLabel}>Si ninguna describe tu situación</p>
                <div className={formStyles.secondaryRow}>
                  {question.options
                    .filter((option) => typeof option.value !== "number")
                    .map((option) => {
                      const selected = pending === option.value
                      return (
                        <button
                          key={`${question.id}-${String(option.value)}`}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setPending(option.value)}
                          style={optionStyle(selected, true)}
                        >
                          {option.label}
                        </button>
                      )
                    })}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button
                type="button"
                onClick={() => {
                  if (questionIndex === 0) setPhase("context")
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
            <PracticeResultView result={result} answers={answers} onEdit={handleEdit} onRestart={handleRestart} />
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
