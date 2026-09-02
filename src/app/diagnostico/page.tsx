"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { LiquidGradientBackground } from "@/components/hero/LiquidGradientBackground"
import { GlassEffect, GlassFilter } from "@/components/ui/liquid-glass"
import { GRAD, T } from "@/lib/landing-theme"
import {
  DIGITAL_PROFILES,
  QUIZ_QUESTIONS,
  resolveProfile,
  type ProfileId,
} from "@/lib/digital-profiles"
import {
  getOrCreateSessionId,
  getStoredLeadContext,
  type FunnelEventName,
} from "@/lib/funnel-session"

const tok = T.dark

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

export default function DiagnosticoPage() {
  const [sessionId, setSessionId] = useState("")
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<{ questionId: string; profile: ProfileId }[]>([])
  const trackEvent = useMutation(api.leads.trackEvent)

  const onTrack = (eventName: FunnelEventName, payload: Record<string, string> = {}) => {
    if (!sessionId) return
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
    void trackEvent(args)
  }

  useEffect(() => {
    setSessionId(getOrCreateSessionId())
  }, [])

  useEffect(() => {
    if (!sessionId) return
    onTrack("page_view", { section: "diagnostico" })
  }, [sessionId])

  const question = QUIZ_QUESTIONS[step]
  const isResult = step >= QUIZ_QUESTIONS.length
  const profile = isResult ? resolveProfile(answers) : null
  const progress = isResult ? 100 : Math.round((step / QUIZ_QUESTIONS.length) * 100)

  function handleOption(profileId: ProfileId) {
    if (!question) return
    const nextAnswers = [...answers, { questionId: question.id, profile: profileId }]
    setAnswers(nextAnswers)
    const nextStep = step + 1
    setStep(nextStep)
    if (nextStep >= QUIZ_QUESTIONS.length) {
      const result = resolveProfile(nextAnswers)
      onTrack("cta_click", {
        section: "diagnostico_complete",
        ctaLabel: result.name,
        intent: "lead",
        profile: result.id,
      })
    }
  }

  function resetQuiz() {
    setAnswers([])
    setStep(0)
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
            MotusDAO Academy
          </span>
        </Link>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 13,
            color: tok.t2,
            textDecoration: "none",
          }}
        >
          Volver
        </Link>
      </header>

      <main
        style={{
          position: "relative",
          zIndex: 2,
          padding: "12px 16px 48px",
          maxWidth: 640,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            height: 4,
            borderRadius: 99,
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: GRAD,
              transition: "width 0.35s ease",
            }}
          />
        </div>

        {!isResult && question ? (
          <motion.div key={question.id} variants={fadeUp} initial="hidden" animate="show">
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 12,
                fontWeight: 500,
                color: "#A855F7",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Pregunta {step + 1} de {QUIZ_QUESTIONS.length}
            </p>
            <h1
              style={{
                fontFamily: "var(--font-jura)",
                fontWeight: 700,
                fontSize: "clamp(26px, 6vw, 36px)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: 22,
              }}
            >
              {question.prompt}
            </h1>
            <div style={{ display: "grid", gap: 10 }}>
              {question.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleOption(option.profile)}
                  style={{
                    textAlign: "left",
                    fontFamily: "var(--font-inter)",
                    fontSize: 15,
                    lineHeight: 1.45,
                    color: tok.t1,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 12,
                    padding: "14px 16px",
                    minHeight: 52,
                    cursor: "pointer",
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        ) : profile ? (
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 12,
                fontWeight: 500,
                color: "#A855F7",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Tu perfil
            </p>
            <GlassEffect
              className="rounded-2xl"
              style={{
                border: "1px solid rgba(147,51,234,0.35)",
                background: "rgba(18,12,34,0.34)",
              }}
            >
              <div style={{ padding: "clamp(20px, 4vw, 28px)" }}>
                <h1
                  style={{
                    fontFamily: "var(--font-jura)",
                    fontWeight: 700,
                    fontSize: "clamp(28px, 6vw, 40px)",
                    lineHeight: 1.12,
                    letterSpacing: "-0.02em",
                    marginBottom: 10,
                  }}
                >
                  {profile.name}
                </h1>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: 16, color: tok.t2, lineHeight: 1.6, marginBottom: 16 }}>
                  {profile.headline}
                </p>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: 15, color: tok.t1, lineHeight: 1.55 }}>
                  Tu siguiente paso: {profile.nextStep}
                </p>
              </div>
            </GlassEffect>

            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 14,
                color: tok.t2,
                lineHeight: 1.6,
                margin: "20px 0 22px",
              }}
            >
              Este resultado es orientativo: no es un diagnóstico clínico ni una evaluación de licencia. El siguiente
              paso concreto es la masterclass en vivo, la entrada a la comunidad profesional.
            </p>

            <a
              href="/?intent=clase#masterclass"
              onClick={() =>
                onTrack("cta_click", {
                  section: "diagnostico_result",
                  ctaLabel: "Reservar mi lugar",
                  intent: "lead",
                  profile: profile.id,
                })
              }
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                background: GRAD,
                borderRadius: 10,
                color: "#fff",
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                fontSize: 16,
                padding: "14px 28px",
                marginBottom: 12,
              }}
            >
              Reservar mi lugar gratis
            </a>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 13,
                color: tok.t3,
                textAlign: "center",
                marginBottom: 18,
              }}
            >
              En vivo · 90 min · Grupo reducido
            </p>

            <button
              type="button"
              onClick={resetQuiz}
              style={{
                display: "block",
                width: "100%",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 10,
                color: tok.t1,
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                fontSize: 15,
                padding: "12px 20px",
                cursor: "pointer",
              }}
            >
              Volver a intentar
            </button>

            <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, color: tok.t3, marginTop: 24, lineHeight: 1.5 }}>
              Los cinco perfiles de Motus: {DIGITAL_PROFILES.map((item) => item.name).join(" · ")}.
            </p>
          </motion.div>
        ) : null}
      </main>
    </div>
  )
}
