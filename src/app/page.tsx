// Landing page for: MotusDAO — Técnica Avanzada en Psicoterapia
"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Banner } from "@/components/ui/banner"
import { GlowingShadow } from "@/components/ui/glowing-shadow"

// ─── Color tokens ────────────────────────────────────────────────────────────

const T = {
  dark: {
    bg: "#0E0A1A",
    bgAlt: "#130D22",
    t1: "rgba(255,255,255,0.92)",
    t2: "rgba(255,255,255,0.52)",
    t3: "rgba(255,255,255,0.28)",
    card: "rgba(255,255,255,0.04)",
    cardBorder: "rgba(255,255,255,0.08)",
    cardHighBg: "rgba(147,51,234,0.07)",
    cardHighBorder: "rgba(147,51,234,0.3)",
    navBg: "rgba(14,10,26,0.85)",
    navBorder: "rgba(255,255,255,0.06)",
    toggleTrack: "rgba(255,255,255,0.10)",
  },
  light: {
    bg: "#F8F6FF",
    bgAlt: "#F0ECF9",
    t1: "rgba(14,10,26,0.90)",
    t2: "rgba(14,10,26,0.55)",
    t3: "rgba(14,10,26,0.32)",
    card: "rgba(0,0,0,0.03)",
    cardBorder: "rgba(0,0,0,0.08)",
    cardHighBg: "rgba(147,51,234,0.06)",
    cardHighBorder: "rgba(147,51,234,0.25)",
    navBg: "rgba(248,246,255,0.88)",
    navBorder: "rgba(0,0,0,0.07)",
    toggleTrack: "rgba(0,0,0,0.10)",
  },
} as const

type Tok = (typeof T)["dark"] | (typeof T)["light"]

const GRAD = "linear-gradient(to right, #9333EA, #EC4899)"

type FunnelEventName =
  | "page_view"
  | "cta_click"
  | "modal_open"
  | "form_started"
  | "form_submitted"
  | "checkout_click"
  | "checkout_complete"
  | "calendly_booked"

function getOrCreateSessionId() {
  const key = "motus_session_id"
  const existing = window.localStorage.getItem(key)
  if (existing) return existing
  const generated = crypto.randomUUID()
  window.localStorage.setItem(key, generated)
  return generated
}

function getStoredLeadContext() {
  try {
    const raw = window.localStorage.getItem("motus_lead_ctx")
    if (!raw) return null
    const parsed = JSON.parse(raw) as { leadId?: string; email?: string }
    return parsed
  } catch {
    return null
  }
}

// ─── Motion variants ─────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11 } },
}

// ─── Custom hook ─────────────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return { ref, inView }
}

// ─── Shared components ───────────────────────────────────────────────────────

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        backgroundImage: GRAD,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  )
}

function GradientButton({
  children,
  small,
  full,
}: {
  children: React.ReactNode
  small?: boolean
  full?: boolean
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{
        background: GRAD,
        border: "none",
        borderRadius: 10,
        color: "#fff",
        fontWeight: 600,
        fontSize: small ? 14 : 16,
        padding: small ? "9px 18px" : "14px 28px",
        cursor: "pointer",
        fontFamily: "var(--font-inter)",
        letterSpacing: "0.01em",
        width: full ? "100%" : undefined,
      }}
    >
      {children}
    </motion.button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-inter)",
        fontSize: 12,
        fontWeight: 500,
        color: "#A855F7",
        letterSpacing: "0.10em",
        textTransform: "uppercase",
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  )
}

function SectionHeading({ children, tok }: { children: React.ReactNode; tok: Tok }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-jura)",
        fontWeight: 700,
        fontSize: "clamp(28px, 4vw, 44px)",
        color: tok.t1,
        lineHeight: 1.15,
        letterSpacing: "-0.02em",
      }}
    >
      {children}
    </h2>
  )
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav({ dark, onToggle, onCta }: { dark: boolean; onToggle: () => void; onCta: () => void }) {
  const tok = dark ? T.dark : T.light

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(24px, 5vw, 80px)",
        height: 64,
        background: tok.navBg,
        borderBottom: `1px solid ${tok.navBorder}`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Logo */}
      <a
        href="http://motusdao.org/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
      >
        <img
          src="/logo.svg"
          alt="MotusDAO logo"
          style={{ width: 28, height: 28, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
        />
        <span
          style={{
            fontFamily: "var(--font-jura)",
            fontWeight: 700,
            fontSize: 17,
            color: tok.t1,
            letterSpacing: "-0.01em",
          }}
        >
          MotusDAO
        </span>
      </a>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Toggle */}
        <button
          onClick={onToggle}
          aria-label="Cambiar tema"
          style={{
            background: tok.toggleTrack,
            border: "none",
            borderRadius: 20,
            width: 44,
            height: 24,
            cursor: "pointer",
            position: "relative",
            padding: 0,
            flexShrink: 0,
          }}
        >
          <motion.div
            animate={{ x: dark ? 2 : 22 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              position: "absolute",
              top: 3,
              left: 0,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#9333EA",
            }}
          />
        </button>

        <div onClick={onCta}><GradientButton small>Pagar ahora</GradientButton></div>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({
  dark,
  onCta,
  onLeadCta,
}: {
  dark: boolean
  onCta: () => void
  onLeadCta: () => void
}) {
  const tok = dark ? T.dark : T.light

  const stats = [
    { value: "100+", label: "psicólogos entrenados" },
    { value: "10+", label: "países en LATAM" },
    { value: "8", label: "semanas para implementar" },
  ]

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding:
          "clamp(110px, 16vh, 150px) clamp(24px, 6vw, 120px) clamp(60px, 8vh, 100px)",
        background: tok.bg,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 500,
          background:
            "radial-gradient(ellipse, rgba(147,51,234,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        style={{ maxWidth: 800, position: "relative" }}
      >
        {/* Eyebrow */}
        <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 100,
              background: dark
                ? "rgba(147,51,234,0.12)"
                : "rgba(147,51,234,0.08)",
              border: "1px solid rgba(147,51,234,0.25)",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#9333EA",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 12,
                fontWeight: 500,
                color: "#A855F7",
                letterSpacing: "0.05em",
              }}
            >
              TÉCNICA AVANZADA EN PSICOTERAPIA
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          style={{
            fontFamily: "var(--font-jura)",
            fontWeight: 700,
            fontSize: "clamp(34px, 5.4vw, 64px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: tok.t1,
            marginBottom: 24,
          }}
        >
          Domina intervención clínica avanzada en 8 semanas.{" "}
          <GradientText>Sin improvisar en tu consulta.</GradientText>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(16px, 1.8vw, 19px)",
            lineHeight: 1.7,
            color: tok.t2,
            maxWidth: 640,
            margin: "0 auto 40px",
          }}
        >
          Formación aplicada para psicólogos y psicoterapeutas que quieren
          mejorar resultados clínicos, integrar IA con criterio ético y cobrar
          con más confianza por una práctica de mayor nivel.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 72,
          }}
        >
          <div onClick={onCta}><GradientButton>Pagar ahora</GradientButton></div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onLeadCta}
            style={{
              background: "transparent",
              border: `1px solid ${tok.cardBorder}`,
              borderRadius: 10,
              color: tok.t1,
              fontWeight: 500,
              fontSize: 16,
              padding: "14px 28px",
              cursor: "pointer",
              fontFamily: "var(--font-inter)",
            }}
          >
            Inscribirme
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeUp}
          style={{
            display: "flex",
            gap: "clamp(32px, 6vw, 80px)",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--font-jura)",
                  fontWeight: 700,
                  fontSize: "clamp(30px, 4vw, 48px)",
                  color: tok.t1,
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 13,
                  color: tok.t3,
                  letterSpacing: "0.02em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

function UrgencyAndScarcity({ dark, onCta }: { dark: boolean; onCta: () => void }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()
  return (
    <section
      style={{
        background: tok.bg,
        padding: "clamp(48px, 7vh, 80px) clamp(24px, 6vw, 120px)",
      }}
    >
      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        style={{
          background: tok.card,
          border: `1px solid ${tok.cardBorder}`,
          borderRadius: 18,
          padding: "clamp(24px, 4vw, 36px)",
          maxWidth: 980,
          margin: "0 auto",
        }}
      >
        <motion.div variants={fadeUp} style={{ marginBottom: 14 }}>
          <SectionLabel>Cupo limitado</SectionLabel>
          <SectionHeading tok={tok}>Cohorte próxima: inicio en mayo 2026</SectionHeading>
        </motion.div>
        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 15,
            color: tok.t2,
            lineHeight: 1.7,
            maxWidth: 760,
            marginBottom: 24,
          }}
        >
          Para mantener supervisión real y feedback clínico de calidad, abrimos
          lugares limitados por generación. Cuando se llena el cupo, pasas a
          lista de espera para la siguiente cohorte.
        </motion.p>
        <motion.div variants={fadeUp} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div onClick={onCta}><GradientButton>Reservar mi lugar</GradientButton></div>
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 13,
              color: tok.t3,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Cierre de inscripciones sujeto a disponibilidad.
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─── Trust Bar ────────────────────────────────────────────────────────────────

function TrustBar({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()

  const items = [
    "Coordinado por Benjamin Buzali",
    "Certificación digital incluida",
    "Comunidad activa LATAM",
  ]

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      style={{
        background: tok.bgAlt,
        borderTop: `1px solid ${tok.cardBorder}`,
        borderBottom: `1px solid ${tok.cardBorder}`,
        padding: "20px clamp(24px, 6vw, 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "clamp(20px, 4vw, 56px)",
        flexWrap: "wrap",
      }}
    >
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#9333EA",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 14,
              fontWeight: 500,
              color: tok.t2,
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
            }}
          >
            {item}
          </span>
        </div>
      ))}
    </motion.section>
  )
}

// ─── Lo que construyes ────────────────────────────────────────────────────────

function WhatYouBuild({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()

  const features = [
    {
      num: "01",
      title: "Sistema de evaluación propio",
      desc: "Desarrollas un protocolo de evaluación clínica estructurado, adaptable a cualquier presentación y fundamentado en evidencia actualizada.",
    },
    {
      num: "02",
      title: "Formulación de caso avanzada",
      desc: "Dominas la conceptualización de casos complejos desde múltiples marcos teóricos, con la precisión que exige la práctica contemporánea.",
    },
    {
      num: "03",
      title: "Integración ética de IA",
      desc: "Incorporas herramientas de inteligencia artificial en tu consulta de forma responsable, sin perder el núcleo clínico y humano del trabajo.",
    },
    {
      num: "04",
      title: "Red profesional LATAM",
      desc: "Accedes a una comunidad activa de psicólogos de más de 10 países, con el mismo nivel de exigencia y visión que tú.",
    },
  ]

  return (
    <section
      style={{
        background: tok.bg,
        padding: "clamp(64px, 10vh, 120px) clamp(24px, 6vw, 120px)",
      }}
    >
      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        <motion.div variants={fadeUp} style={{ marginBottom: 48 }}>
          <SectionLabel>El programa</SectionLabel>
          <SectionHeading tok={tok}>Lo que construyes en 8 semanas</SectionHeading>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {features.map((f) => (
            <motion.div
              key={f.num}
              variants={fadeUp}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              style={{
                background: tok.card,
                border: `1px solid ${tok.cardBorder}`,
                borderRadius: 16,
                padding: 28,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jura)",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#9333EA",
                  letterSpacing: "0.08em",
                  marginBottom: 18,
                }}
              >
                {f.num}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-jura)",
                  fontWeight: 700,
                  fontSize: 19,
                  color: tok.t1,
                  marginBottom: 12,
                  lineHeight: 1.3,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 15,
                  color: tok.t2,
                  lineHeight: 1.65,
                }}
              >
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

// ─── 8 Semanas ────────────────────────────────────────────────────────────────

function EightWeeks({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()

  const weeks = [
    {
      n: 1,
      title: "Evaluación clínica estructurada",
      desc: "Protocolos multiaxiales, entrevista diagnóstica y formulación de caso inicial.",
    },
    {
      n: 2,
      title: "Marcos teóricos integradores",
      desc: "Del pensamiento de escuela única al pluralismo técnico informado por evidencia.",
    },
    {
      n: 3,
      title: "Neurociencia y psicoterapia",
      desc: "Bases neurobiológicas del cambio terapéutico y su aplicación clínica directa.",
    },
    {
      n: 4,
      title: "Inteligencia artificial en la consulta",
      desc: "Herramientas actuales, límites éticos y flujos de trabajo para el profesional clínico.",
    },
    {
      n: 5,
      title: "Casos complejos y comorbilidades",
      desc: "Formulación diferenciada en trauma, trastornos de personalidad y presentaciones atípicas.",
    },
    {
      n: 6,
      title: "Intervenciones basadas en evidencia",
      desc: "ACT, EMDR, TCC y terapias de tercera generación en profundidad.",
    },
    {
      n: 7,
      title: "Práctica digital y ética profesional",
      desc: "Telepsicología, privacidad de datos y marcos deontológicos para el contexto digital.",
    },
    {
      n: 8,
      title: "Integración y proyecto final",
      desc: "Presentación de caso clínico supervisado y proceso de certificación.",
    },
  ]

  return (
    <section
      style={{
        background: tok.bgAlt,
        padding: "clamp(64px, 10vh, 120px) clamp(24px, 6vw, 120px)",
      }}
    >
      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        <motion.div variants={fadeUp} style={{ marginBottom: 56 }}>
          <SectionLabel>El recorrido</SectionLabel>
          <SectionHeading tok={tok}>8 semanas de formación intensiva</SectionHeading>
        </motion.div>

        <div style={{ position: "relative", maxWidth: 660 }}>
          {/* Connecting line */}
          <div
            style={{
              position: "absolute",
              left: 19,
              top: 20,
              bottom: 20,
              width: 1,
              background:
                "linear-gradient(to bottom, #9333EA 0%, rgba(147,51,234,0.08) 100%)",
              pointerEvents: "none",
            }}
          />

          {weeks.map((w, i) => (
            <motion.div
              key={w.n}
              variants={fadeUp}
              style={{
                display: "flex",
                gap: 24,
                marginBottom: i < weeks.length - 1 ? 32 : 0,
                position: "relative",
              }}
            >
              {/* Step dot */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background:
                    i === 0
                      ? GRAD
                      : dark
                      ? "linear-gradient(145deg, rgba(255,255,255,0.12), rgba(147,51,234,0.2))"
                      : "linear-gradient(145deg, rgba(255,255,255,0.8), rgba(147,51,234,0.16))",
                  border:
                    i === 0
                      ? "none"
                      : dark
                      ? "1px solid rgba(147,51,234,0.42)"
                      : "1px solid rgba(147,51,234,0.5)",
                  boxShadow:
                    i === 0
                      ? "0 10px 22px rgba(147,51,234,0.35)"
                      : dark
                      ? "inset 0 1px 0 rgba(255,255,255,0.2), 0 10px 24px rgba(0,0,0,0.25)"
                      : "inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 20px rgba(76,29,149,0.16)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jura)",
                    fontWeight: 700,
                    fontSize: 13,
                    color: i === 0 ? "#fff" : dark ? "#C084FC" : "#6D28D9",
                    textShadow:
                      i === 0
                        ? "none"
                        : dark
                        ? "0 0 6px rgba(0,0,0,0.35)"
                        : "0 0 1px rgba(255,255,255,0.6)",
                  }}
                >
                  {w.n}
                </span>
              </div>

              {/* Content */}
              <div style={{ paddingTop: 8 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-jura)",
                    fontWeight: 700,
                    fontSize: 17,
                    color: tok.t1,
                    marginBottom: 6,
                  }}
                >
                  {w.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: 15,
                    color: tok.t2,
                    lineHeight: 1.65,
                  }}
                >
                  {w.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

// ─── Testimonios ──────────────────────────────────────────────────────────────

function Testimonials({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()

  const testimonials = [
    {
      initials: "P1",
      name: "Testimonio verificado #1",
      role: "Psicóloga clínica · Placeholder temporal",
      quote:
        "Aquí irá un testimonio real sobre resultados clínicos, seguridad técnica y cambios concretos en consulta.",
    },
    {
      initials: "P2",
      name: "Testimonio verificado #2",
      role: "Psicoterapeuta · Placeholder temporal",
      quote:
        "Aquí irá un testimonio real sobre integración ética de IA, estructura de casos y mejora de práctica.",
    },
  ]

  return (
    <section
      style={{
        background: tok.bg,
        padding: "clamp(64px, 10vh, 120px) clamp(24px, 6vw, 120px)",
      }}
    >
      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        <motion.div variants={fadeUp} style={{ marginBottom: 48 }}>
          <SectionLabel>Testimonios</SectionLabel>
          <SectionHeading tok={tok}>Lo que dicen quienes lo vivieron</SectionHeading>
          <p
            style={{
              marginTop: 12,
              fontFamily: "var(--font-inter)",
              fontSize: 13,
              color: tok.t3,
            }}
          >
            Sección en actualización: placeholders temporales hasta publicar
            testimonios clínicos verificados.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              style={{
                background: tok.cardHighBg,
                border: `1px solid ${tok.cardHighBorder}`,
                borderRadius: 16,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              {/* Quote mark */}
              <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                <path
                  d="M0 18V10.8C0 4.8 3.6 1.2 10.8 0L12 2.4C8.4 3.2 6.4 5.2 6 8.4H10.8V18H0ZM13.2 18V10.8C13.2 4.8 16.8 1.2 24 0L25.2 2.4C21.6 3.2 19.6 5.2 19.2 8.4H24V18H13.2Z"
                  fill="#9333EA"
                  fillOpacity="0.4"
                />
              </svg>

              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 16,
                  color: tok.t1,
                  lineHeight: 1.7,
                  flex: 1,
                }}
              >
                {t.quote}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: GRAD,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-jura)",
                      fontWeight: 700,
                      fontSize: 13,
                      color: "#fff",
                    }}
                  >
                    {t.initials}
                  </span>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontWeight: 600,
                      fontSize: 14,
                      color: tok.t1,
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: 12,
                      color: tok.t3,
                    }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function RiskReversal({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()
  const bullets = [
    "Garantía de satisfacción de 7 días desde el inicio del programa.",
    "Si no es el fit adecuado, puedes solicitar baja y reembolso según política vigente.",
    "Todas las condiciones se comparten antes de pagar para decisión informada.",
  ]
  return (
    <section
      style={{
        background: tok.bgAlt,
        padding: "clamp(56px, 8vh, 92px) clamp(24px, 6vw, 120px)",
      }}
    >
      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        style={{
          maxWidth: 920,
          margin: "0 auto",
          background: tok.cardHighBg,
          border: `1px solid ${tok.cardHighBorder}`,
          borderRadius: 18,
          padding: "clamp(24px, 4vw, 36px)",
        }}
      >
        <motion.div variants={fadeUp} style={{ marginBottom: 20 }}>
          <SectionLabel>Riesgo bajo</SectionLabel>
          <SectionHeading tok={tok}>Decides con claridad, no con presión</SectionHeading>
        </motion.div>
        <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
          <GlowingShadow className="!w-full !max-w-[560px] !aspect-[2.6/1] !cursor-default">
            <span
              className="pointer-events-none z-10 text-center text-xl font-semibold tracking-tight"
              style={{ color: tok.t1, margin: 0 }}
            >
              Riesgo controlado, decisión informada
            </span>
          </GlowingShadow>
        </motion.div>
        <motion.ul
          variants={fadeUp}
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {bullets.map((item) => (
            <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: "#9333EA", fontSize: 18, lineHeight: 1 }}>•</span>
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 15,
                  color: tok.t1,
                  lineHeight: 1.7,
                }}
              >
                {item}
              </span>
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing({
  dark,
  onCta,
  onLeadCta,
}: {
  dark: boolean
  onCta: () => void
  onLeadCta: () => void
}) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()

  const included = [
    "8 módulos semanales en vivo",
    "Material clínico descargable",
    "Acceso a la comunidad LATAM",
    "Sesiones de supervisión grupal",
    "Grabaciones disponibles 12 meses",
  ]
  const fit = [
    "Psicólogos/as y psicoterapeutas en práctica activa.",
    "Profesionales que quieren estructura de caso y criterio técnico.",
    "Quienes buscan integrar IA sin comprometer ética clínica.",
  ]
  const noFit = [
    "Si buscas soluciones rápidas sin estudio ni aplicación semanal.",
    "Si no puedes comprometer tiempo para práctica y supervisión.",
    "Si no trabajas con pacientes actualmente.",
  ]

  return (
    <section
      style={{
        background: tok.bgAlt,
        padding: "clamp(64px, 10vh, 120px) clamp(24px, 6vw, 120px)",
      }}
    >
      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        <motion.div variants={fadeUp} style={{ marginBottom: 48 }}>
          <SectionLabel>Inversión</SectionLabel>
          <SectionHeading tok={tok}>Transparente y sin sorpresas</SectionHeading>
        </motion.div>

        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          {/* Featured */}
          <motion.div
            variants={fadeUp}
            style={{
              background: tok.cardHighBg,
              border: `1px solid ${tok.cardHighBorder}`,
              borderRadius: 20,
              padding: 40,
              flex: "1 1 300px",
              maxWidth: 460,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Corner glow */}
            <div
              style={{
                position: "absolute",
                top: -60,
                right: -60,
                width: 240,
                height: 240,
                background:
                  "radial-gradient(circle, rgba(147,51,234,0.14) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "4px 12px",
                borderRadius: 100,
                background: "rgba(147,51,234,0.15)",
                border: "1px solid rgba(147,51,234,0.3)",
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#A855F7",
                  letterSpacing: "0.06em",
                }}
              >
                PROGRAMA COMPLETO
              </span>
            </div>

            <div style={{ marginBottom: 8 }}>
              <span
                style={{
                  fontFamily: "var(--font-jura)",
                  fontWeight: 700,
                  fontSize: "clamp(44px, 5vw, 60px)",
                  color: tok.t1,
                  lineHeight: 1,
                }}
              >
                $2,300
              </span>
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 16,
                  color: tok.t2,
                  marginLeft: 8,
                }}
              >
                MXN
              </span>
            </div>

            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 15,
                color: tok.t2,
                marginBottom: 32,
                lineHeight: 1.6,
              }}
            >
              Acceso completo al programa — 8 semanas, materiales, comunidad y
              seguimiento.
            </p>

            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginBottom: 36,
              }}
            >
              {included.map((item) => (
                <li
                  key={item}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "rgba(147,51,234,0.15)",
                      border: "1px solid rgba(147,51,234,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path
                        d="M1 3L3 5L7 1"
                        stroke="#A855F7"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: 14,
                      color: tok.t1,
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div onClick={onCta}><GradientButton full>Pagar ahora</GradientButton></div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={onLeadCta}
              style={{
                marginTop: 10,
                background: "transparent",
                border: "none",
                color: tok.t2,
                textDecoration: "underline",
                textUnderlineOffset: 3,
                fontFamily: "var(--font-inter)",
                fontSize: 14,
                cursor: "pointer",
                width: "100%",
              }}
            >
              Aun no estoy listo para pagar, quiero inscribirme
            </motion.button>
          </motion.div>

          {/* Secondary */}
          <motion.div
            variants={fadeUp}
            style={{
              background: tok.card,
              border: `1px solid ${tok.cardBorder}`,
              borderRadius: 20,
              padding: 36,
              flex: "1 1 240px",
              maxWidth: 340,
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: 100,
                background: dark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 11,
                  fontWeight: 600,
                  color: tok.t3,
                  letterSpacing: "0.06em",
                }}
              >
                OPCIONAL
              </span>
            </div>

            <div style={{ marginBottom: 12 }}>
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 18,
                  color: tok.t3,
                }}
              >
                +
              </span>
              <span
                style={{
                  fontFamily: "var(--font-jura)",
                  fontWeight: 700,
                  fontSize: "clamp(36px, 4vw, 48px)",
                  color: tok.t1,
                  lineHeight: 1,
                  marginLeft: 4,
                }}
              >
                $400
              </span>
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 15,
                  color: tok.t2,
                  marginLeft: 8,
                }}
              >
                MXN
              </span>
            </div>

            <h3
              style={{
                fontFamily: "var(--font-jura)",
                fontWeight: 700,
                fontSize: 20,
                color: tok.t1,
                marginBottom: 12,
              }}
            >
              Certificado digital
            </h3>

            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 15,
                color: tok.t2,
                lineHeight: 1.65,
                marginBottom: 32,
              }}
            >
              Certificado de finalización con validez digital, emitido al
              completar el programa y el proyecto clínico final. Opcional al
              finalizar.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "transparent",
                border: `1px solid ${tok.cardBorder}`,
                borderRadius: 10,
                color: tok.t1,
                fontWeight: 500,
                fontSize: 15,
                padding: "12px 24px",
                cursor: "pointer",
                fontFamily: "var(--font-inter)",
                width: "100%",
              }}
            >
              Añadir certificado
            </motion.button>
          </motion.div>
        </div>
        <motion.div
          variants={fadeUp}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
            marginTop: 16,
          }}
        >
          <div
            style={{
              background: tok.card,
              border: `1px solid ${tok.cardBorder}`,
              borderRadius: 16,
              padding: 24,
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-jura)",
                fontWeight: 700,
                fontSize: 18,
                color: tok.t1,
                marginBottom: 10,
              }}
            >
              Este programa es para ti si...
            </h3>
            {fit.map((item) => (
              <p key={item} style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: tok.t2, lineHeight: 1.7 }}>
                • {item}
              </p>
            ))}
          </div>
          <div
            style={{
              background: tok.card,
              border: `1px solid ${tok.cardBorder}`,
              borderRadius: 16,
              padding: 24,
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-jura)",
                fontWeight: 700,
                fontSize: 18,
                color: tok.t1,
                marginBottom: 10,
              }}
            >
              No es para ti si...
            </h3>
            {noFit.map((item) => (
              <p key={item} style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: tok.t2, lineHeight: 1.7 }}>
                • {item}
              </p>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function ObjectionFaq({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()
  const faqs = [
    {
      q: "No tengo mucho tiempo, ¿podré seguir el programa?",
      a: "Si apartas de 3 a 4 horas por semana para sesiones y aplicación clínica, sí. El programa está diseñado para profesionales en consulta activa.",
    },
    {
      q: "¿Necesito experiencia previa en IA?",
      a: "No. Cubrimos herramientas desde cero y su uso responsable en contexto clínico.",
    },
    {
      q: "¿Esto reemplaza supervisión o terapia personal?",
      a: "No. Es formación técnica y estratégica para mejorar práctica clínica; no sustituye procesos terapéuticos personales ni supervisión individual especializada.",
    },
    {
      q: "¿Cuándo recupero la inversión?",
      a: "Depende de tu práctica, posicionamiento y adopción. El enfoque está en elevar calidad clínica y valor percibido para sostener honorarios de mayor nivel.",
    },
  ]
  return (
    <section
      style={{
        background: tok.bg,
        padding: "clamp(64px, 10vh, 120px) clamp(24px, 6vw, 120px)",
      }}
    >
      <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"}>
        <motion.div variants={fadeUp} style={{ marginBottom: 40 }}>
          <SectionLabel>Preguntas frecuentes</SectionLabel>
          <SectionHeading tok={tok}>Resolvemos las objeciones más comunes</SectionHeading>
        </motion.div>
        <div style={{ display: "grid", gap: 12, maxWidth: 920 }}>
          {faqs.map((item) => (
            <motion.div
              key={item.q}
              variants={fadeUp}
              style={{
                background: tok.card,
                border: `1px solid ${tok.cardBorder}`,
                borderRadius: 14,
                padding: 22,
              }}
            >
              <h3 style={{ fontFamily: "var(--font-jura)", fontWeight: 700, fontSize: 18, color: tok.t1, marginBottom: 8 }}>
                {item.q}
              </h3>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: 15, color: tok.t2, lineHeight: 1.7 }}>
                {item.a}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

// ─── CTA Final ────────────────────────────────────────────────────────────────

function FinalCTA({ dark, onCta }: { dark: boolean; onCta: () => void }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: tok.bg,
        padding: "clamp(80px, 14vh, 160px) clamp(24px, 6vw, 120px)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Bottom glow */}
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 300,
          background:
            "radial-gradient(ellipse, rgba(236,72,153,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-jura)",
            fontWeight: 700,
            fontSize: "clamp(28px, 4.5vw, 56px)",
            color: tok.t1,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 20,
          }}
        >
          ¿Tienes el perfil que buscamos?
        </h2>
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(16px, 1.6vw, 18px)",
            color: tok.t2,
            lineHeight: 1.7,
            marginBottom: 40,
          }}
        >
          El programa es selectivo. Agenda una llamada de 20 minutos para
          evaluar si es el momento adecuado para ti.
        </p>
        <div onClick={onCta}><GradientButton>Agendar llamada</GradientButton></div>
      </div>
    </motion.section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light

  return (
    <footer
      style={{
        background: tok.bgAlt,
        borderTop: `1px solid ${tok.cardBorder}`,
        padding: "24px clamp(24px, 6vw, 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <img
          src="/logo.svg"
          alt="MotusDAO logo"
          style={{ width: 20, height: 20, borderRadius: 6, objectFit: "cover" }}
        />
        <span
          style={{
            fontFamily: "var(--font-jura)",
            fontWeight: 700,
            fontSize: 14,
            color: tok.t3,
          }}
        >
          MotusDAO
        </span>
      </div>
      <span
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 13,
          color: tok.t3,
        }}
      >
        © 2025 · Todos los derechos reservados
      </span>
    </footer>
  )
}

// ─── Lead Modal ───────────────────────────────────────────────────────────────

type ModalIntent = "programa" | "llamada"

function LeadModal({
  dark,
  intent,
  onClose,
  sessionId,
  onTrack,
}: {
  dark: boolean
  intent: ModalIntent
  onClose: () => void
  sessionId: string
  onTrack: (eventName: FunnelEventName, payload?: Record<string, string>) => void
}) {
  const tok = dark ? T.dark : T.light
  const registrar = useMutation(api.leads.registrar)
  const marcarEtapa = useMutation(api.leads.marcarEtapa)

  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [certificado, setCertificado] = useState(false)
  const [estado, setEstado] = useState<"idle" | "loading" | "ok" | "error">("idle")
  const [formStarted, setFormStarted] = useState(false)

  const titulo =
    intent === "llamada"
      ? "Agenda tu llamada"
      : "Reserva tu lugar"

  const subtitulo =
    intent === "llamada"
      ? "Cuéntanos quién eres y te escribimos para coordinar."
      : "Déjanos tus datos y te enviamos toda la información."

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !email.trim()) return
    setEstado("loading")
    try {
      const utm = new URLSearchParams(window.location.search)
      const result = await registrar({
        nombre: nombre.trim(),
        email: email.trim(),
        interes: intent,
        certificado,
        sessionId,
        utmSource: utm.get("utm_source") ?? undefined,
        utmMedium: utm.get("utm_medium") ?? undefined,
        utmCampaign: utm.get("utm_campaign") ?? undefined,
        utmContent: utm.get("utm_content") ?? undefined,
        utmTerm: utm.get("utm_term") ?? undefined,
        referrer: document.referrer || undefined,
      })
      window.localStorage.setItem(
        "motus_lead_ctx",
        JSON.stringify({ leadId: result.leadId, email: email.trim() })
      )
      onTrack("form_submitted", { intent, email: email.trim() })
      if (intent === "llamada") {
        await marcarEtapa({
          leadId: result.leadId,
          etapa: "booked_call",
        })
        window.location.href = "/gracias?flow=llamada"
        return
      }
      setEstado("ok")
      setTimeout(() => {
        window.location.href = "/gracias?flow=lead"
      }, 500)
    } catch {
      setEstado("error")
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    border: `1px solid ${tok.cardBorder}`,
    borderRadius: 10,
    padding: "12px 14px",
    fontFamily: "var(--font-inter)",
    fontSize: 15,
    color: tok.t1,
    outline: "none",
    boxSizing: "border-box",
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: dark ? T.dark.bgAlt : T.light.bg,
          border: `1px solid ${tok.cardHighBorder}`,
          borderRadius: 20,
          padding: "36px 32px",
          width: "100%",
          maxWidth: 440,
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: tok.t3,
            fontSize: 20,
            lineHeight: 1,
            padding: 4,
          }}
        >
          ✕
        </button>

        {estado === "ok" ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: GRAD,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
                <path d="M2 7L8 13L18 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3
              style={{
                fontFamily: "var(--font-jura)",
                fontWeight: 700,
                fontSize: 22,
                color: tok.t1,
                marginBottom: 10,
              }}
            >
              Recibido
            </h3>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 15,
                color: tok.t2,
                lineHeight: 1.65,
              }}
            >
              Te escribiremos a <strong style={{ color: tok.t1 }}>{email}</strong> en las próximas 24 horas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3
              style={{
                fontFamily: "var(--font-jura)",
                fontWeight: 700,
                fontSize: 22,
                color: tok.t1,
                marginBottom: 8,
              }}
            >
              {titulo}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 14,
                color: tok.t2,
                marginBottom: 28,
                lineHeight: 1.6,
              }}
            >
              {subtitulo}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              <input
                style={inputStyle}
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value)
                  if (!formStarted) {
                    setFormStarted(true)
                    onTrack("form_started", { intent })
                  }
                }}
                required
              />
              <input
                style={inputStyle}
                type="email"
                placeholder="Tu correo"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (!formStarted) {
                    setFormStarted(true)
                    onTrack("form_started", { intent })
                  }
                }}
                required
              />
            </div>

            {/* Certificado checkbox */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                marginBottom: 28,
              }}
            >
              <div
                onClick={() => setCertificado((c) => !c)}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  border: `1px solid ${certificado ? "#9333EA" : tok.cardBorder}`,
                  background: certificado ? "rgba(147,51,234,0.2)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s",
                }}
              >
                {certificado && (
                  <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                    <path d="M1 3.5L3.5 6L9 1" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: tok.t2 }}>
                Me interesa el certificado digital (+$400 MXN)
              </span>
            </label>

            {estado === "error" && (
              <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: "#EC4899", marginBottom: 12 }}>
                Algo salió mal. Intenta de nuevo.
              </p>
            )}

            <GradientButton full>
              {estado === "loading" ? "Enviando..." : intent === "llamada" ? "Agendar llamada" : "Reservar mi lugar"}
            </GradientButton>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [dark, setDark] = useState(true)
  const [modal, setModal] = useState<ModalIntent | null>(null)
  const [sessionId, setSessionId] = useState<string>("")
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL
  const checkoutUrl = process.env.NEXT_PUBLIC_CHECKOUT_URL
  const trackEvent = useMutation(api.leads.trackEvent)
  const marcarEtapa = useMutation(api.leads.marcarEtapa)

  const onTrack = (eventName: FunnelEventName, payload: Record<string, string> = {}) => {
    if (!sessionId) return
    const leadCtx = getStoredLeadContext()
    const args: Parameters<typeof trackEvent>[0] = {
      eventName,
      sessionId,
      page: window.location.pathname,
      section: payload.section,
      ctaLabel: payload.ctaLabel,
      intent:
        payload.intent === "pay" || payload.intent === "lead" || payload.intent === "call"
          ? payload.intent
          : undefined,
      metadata: payload,
    }
    if (leadCtx?.email) args.email = leadCtx.email
    if (leadCtx?.leadId) args.leadId = leadCtx.leadId as Parameters<typeof trackEvent>[0]["leadId"]
    void trackEvent(args)
  }

  const openModal = (intent: ModalIntent, section: string) => {
    onTrack("modal_open", { intent: intent === "programa" ? "lead" : "call", section })
    setModal(intent)
  }

  useEffect(() => {
    const id = getOrCreateSessionId()
    setSessionId(id)
  }, [])

  useEffect(() => {
    if (!sessionId) return
    onTrack("page_view", { section: "landing" })
    const params = new URLSearchParams(window.location.search)
    const checkout = params.get("checkout")
    const calendly = params.get("calendly")
    const leadCtx = getStoredLeadContext()
    if (checkout === "success") {
      onTrack("checkout_complete", { section: "return" })
      void marcarEtapa({
        ...(leadCtx?.leadId ? { leadId: leadCtx.leadId as Parameters<typeof marcarEtapa>[0]["leadId"] } : {}),
        ...(leadCtx?.email ? { email: leadCtx.email } : {}),
        etapa: "purchased",
      })
      window.location.href = "/gracias?flow=compra"
      return
    }
    if (calendly === "booked") {
      onTrack("calendly_booked", { section: "return" })
      void marcarEtapa({
        ...(leadCtx?.leadId ? { leadId: leadCtx.leadId as Parameters<typeof marcarEtapa>[0]["leadId"] } : {}),
        ...(leadCtx?.email ? { email: leadCtx.email } : {}),
        etapa: "booked_call",
      })
      window.location.href = "/gracias?flow=llamada"
    }
  }, [sessionId])

  const handleCheckoutCta = () => {
    onTrack("cta_click", { section: "global", ctaLabel: "Pagar ahora", intent: "pay" })
    onTrack("checkout_click", { section: "global", ctaLabel: "Pagar ahora", intent: "pay" })
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank", "noopener,noreferrer")
      return
    }
    openModal("programa", "checkout_fallback")
  }
  const handleCallCta = () => {
    onTrack("cta_click", { section: "final", ctaLabel: "Agendar llamada", intent: "call" })
    if (calendlyUrl) {
      window.open(calendlyUrl, "_blank", "noopener,noreferrer")
      return
    }
    openModal("llamada", "final")
  }
  const handleLeadCta = () => {
    onTrack("cta_click", { section: "global", ctaLabel: "Inscribirme", intent: "lead" })
    openModal("programa", "lead")
  }

  return (
    <div
      style={{
        background: dark ? T.dark.bg : T.light.bg,
        transition: "background 0.35s ease",
        minHeight: "100vh",
      }}
    >
      <Nav dark={dark} onToggle={() => setDark((d) => !d)} onCta={handleCheckoutCta} />
      <Banner
        variant="rainbow"
        className="!top-16 border-b border-white/10 px-12"
        rainbowColors={[
          "rgba(236,72,153,0.65)",
          "rgba(147,51,234,0.72)",
          "rgba(99,102,241,0.62)",
          "rgba(236,72,153,0.65)",
        ]}
      >
        <div className="flex items-center gap-3">
          <span>Cupo limitado de la cohorte actual.</span>
          <button
            type="button"
            onClick={handleLeadCta}
            className="rounded-md border border-white/30 px-2 py-1 text-xs font-semibold hover:bg-white/10"
          >
            Inscribirme
          </button>
        </div>
      </Banner>
      <Hero dark={dark} onCta={handleCheckoutCta} onLeadCta={handleLeadCta} />
      <TrustBar dark={dark} />
      <WhatYouBuild dark={dark} />
      <EightWeeks dark={dark} />
      <Testimonials dark={dark} />
      <RiskReversal dark={dark} />
      <ObjectionFaq dark={dark} />
      <UrgencyAndScarcity dark={dark} onCta={handleLeadCta} />
      <Pricing dark={dark} onCta={handleCheckoutCta} onLeadCta={handleLeadCta} />
      <FinalCTA dark={dark} onCta={handleCallCta} />
      <Footer dark={dark} />

      <AnimatePresence>
        {modal && (
          <LeadModal
            dark={dark}
            intent={modal}
            sessionId={sessionId}
            onTrack={onTrack}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
