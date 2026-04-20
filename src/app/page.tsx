// Landing page for: MotusDAO — Técnica Avanzada en Psicoterapia
"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
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

function scrollToId(id: string, focusFieldId?: string) {
  const target = document.getElementById(id)
  if (!target) return
  target.scrollIntoView({ behavior: "smooth", block: "start" })
  if (focusFieldId) {
    setTimeout(() => {
      const field = document.getElementById(focusFieldId) as HTMLInputElement | null
      field?.focus()
    }, 350)
  }
}

function MasterclassLeadForm({
  dark,
  sessionId,
  onTrack,
  section,
  formId,
  title,
  subtitle,
  buttonLabel = "Reserva tu lugar",
}: {
  dark: boolean
  sessionId: string
  onTrack: (eventName: FunnelEventName, payload?: Record<string, string>) => void
  section: string
  formId: string
  title?: string
  subtitle?: string
  buttonLabel?: string
}) {
  const tok = dark ? T.dark : T.light
  const registrar = useMutation(api.leads.registrar)
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [estado, setEstado] = useState<"idle" | "loading" | "ok" | "error">("idle")
  const [formStarted, setFormStarted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !email.trim() || !whatsapp.trim()) return
    setEstado("loading")
    try {
      const utm = new URLSearchParams(window.location.search)
      const result = await registrar({
        nombre: nombre.trim(),
        email: email.trim(),
        interes: "programa",
        certificado: false,
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
        JSON.stringify({ leadId: result.leadId, email: email.trim(), whatsapp: whatsapp.trim() })
      )
      onTrack("form_submitted", { section, intent: "lead", email: email.trim() })
      setEstado("ok")
      setTimeout(() => {
        window.location.href = "/gracias?flow=lead"
      }, 450)
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
    <div
      id={formId}
      style={{
        background: tok.cardHighBg,
        border: `1px solid ${tok.cardHighBorder}`,
        borderRadius: 16,
        padding: "clamp(20px, 3vw, 28px)",
        width: "100%",
      }}
    >
      {title && (
        <h3
          style={{
            fontFamily: "var(--font-jura)",
            fontWeight: 700,
            fontSize: "clamp(20px, 2.6vw, 28px)",
            color: tok.t1,
            marginBottom: 8,
          }}
        >
          {title}
        </h3>
      )}
      {subtitle && (
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 14,
            color: tok.t2,
            marginBottom: 18,
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      )}

      {estado === "ok" ? (
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 15,
            color: tok.t1,
            lineHeight: 1.6,
          }}
        >
          Registro enviado. Revisa tu correo y WhatsApp para recibir el acceso.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: 12, marginBottom: 14 }}>
            <input
              id={`${formId}-nombre`}
              style={inputStyle}
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value)
                if (!formStarted) {
                  setFormStarted(true)
                  onTrack("form_started", { section, intent: "lead" })
                }
              }}
              required
            />
            <input
              style={inputStyle}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (!formStarted) {
                  setFormStarted(true)
                  onTrack("form_started", { section, intent: "lead" })
                }
              }}
              required
            />
            <input
              style={inputStyle}
              type="tel"
              placeholder="WhatsApp"
              value={whatsapp}
              onChange={(e) => {
                setWhatsapp(e.target.value)
                if (!formStarted) {
                  setFormStarted(true)
                  onTrack("form_started", { section, intent: "lead" })
                }
              }}
              required
            />
          </div>
          {estado === "error" && (
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: "#EC4899", marginBottom: 12 }}>
              Algo salió mal. Intenta de nuevo.
            </p>
          )}
          <GradientButton full>{estado === "loading" ? "Enviando..." : buttonLabel}</GradientButton>
        </form>
      )}
    </div>
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

        <div onClick={onCta}><GradientButton small>Reserva tu lugar</GradientButton></div>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({
  dark,
  onPrimaryCta,
  onSecondaryCta,
  sessionId,
  onTrack,
}: {
  dark: boolean
  onPrimaryCta: () => void
  onSecondaryCta: () => void
  sessionId: string
  onTrack: (eventName: FunnelEventName, payload?: Record<string, string>) => void
}) {
  const tok = dark ? T.dark : T.light

  const stats = [
    { value: "Formación", label: "orientada a psicólogos" },
    { value: "Perspectiva", label: "ética, técnica y lógica" },
    { value: "Enfoque", label: "en clínica digital" },
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
              MASTERCLASS GRATUITA
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          style={{
            fontFamily: "var(--font-jura)",
            fontWeight: 700,
            fontSize: "clamp(30px, 5.4vw, 55px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: tok.t1,
            marginBottom: 24,
          }}
        >
          Cómo está cambiando la práctica clínica en la{" "}
          <GradientText>era digital</GradientText>
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
          Transicionar a la clínica digital no es solo atender online: requiere
          otra estructura ética, técnica y lógica para conducir la práctica
          clínica.
        </motion.p>

        <motion.ul
          variants={fadeUp}
          style={{
            listStyle: "none",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
            maxWidth: 920,
            margin: "0 auto 34px",
            padding: 0,
          }}
        >
          {[
            "Comprende qué cambia realmente al pasar de la terapia presencial a la clínica digital",
            "Replantea la escucha y el encuadre en el contexto online",
            "Orienta tu práctica más allá de diagnósticos cerrados",
          ].map((item) => (
            <li
              key={item}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "14px 16px",
                borderRadius: 14,
                border: dark
                  ? "1px solid rgba(147,51,234,0.35)"
                  : "1px solid rgba(147,51,234,0.25)",
                background: dark
                  ? "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(147,51,234,0.12))"
                  : "linear-gradient(145deg, rgba(255,255,255,0.7), rgba(147,51,234,0.09))",
                boxShadow: dark
                  ? "inset 0 1px 0 rgba(255,255,255,0.16), 0 10px 28px rgba(0,0,0,0.25)"
                  : "inset 0 1px 0 rgba(255,255,255,0.92), 0 12px 28px rgba(76,29,149,0.14)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                fontFamily: "var(--font-inter)",
                fontSize: 15,
                color: tok.t1,
                lineHeight: 1.5,
                textAlign: "left",
              }}
            >
              <span style={{ color: "#A855F7", fontSize: 16, lineHeight: 1.2 }}>✦</span>
              <span>{item}</span>
            </li>
          ))}
        </motion.ul>

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
          <div onClick={onPrimaryCta}><GradientButton>Reserva tu lugar en la masterclass gratuita</GradientButton></div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onSecondaryCta}
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
            Ver lo que aprenderás
          </motion.button>
        </motion.div>

        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 15,
            color: tok.t2,
            maxWidth: 740,
            margin: "0 auto 32px",
            lineHeight: 1.7,
          }}
        >
          Descubre por qué el paso de la terapia presencial al contexto digital
          implica una nueva forma de escuchar, leer el discurso y orientar el
          trabajo clínico más allá de diagnósticos cerrados.
        </motion.p>

        <motion.div variants={fadeUp} style={{ maxWidth: 560, margin: "0 auto 60px" }}>
          <MasterclassLeadForm
            dark={dark}
            sessionId={sessionId}
            onTrack={onTrack}
            section="hero"
            formId="registro-principal"
            title="Reserva tu lugar en la masterclass gratuita"
            subtitle="Completa tus datos para recibir el acceso por email y/o WhatsApp."
          />
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
          <SectionLabel>Masterclass gratuita</SectionLabel>
          <SectionHeading tok={tok}>Reserva tu lugar en la próxima masterclass</SectionHeading>
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
          Accede sin costo a una conversación diseñada para psicólogos que
          quieren comprender hacia dónde se mueve la práctica clínica y cómo
          transicionar con mayor claridad ética, técnica y lógica.
        </motion.p>
        <motion.div variants={fadeUp} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div onClick={onCta}><GradientButton>Reserva tu lugar en la masterclass gratuita</GradientButton></div>
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 13,
              color: tok.t3,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Fecha por confirmar. Cupo sujeto a disponibilidad.
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
    "Formación orientada a psicólogos",
    "Perspectiva ética, técnica y lógica",
    "Enfoque en clínica digital",
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
      title: "Comprender qué cambia realmente en la transición clínica",
      desc: "Para profesionales que quieren claridad sobre qué se transforma al pasar de la terapia presencial a la clínica digital.",
    },
    {
      num: "02",
      title: "Transicionar con estructura ética, técnica y lógica",
      desc: "Para quienes buscan ordenar su práctica digital con mayor criterio clínico y conducción del proceso.",
    },
    {
      num: "03",
      title: "Ir más allá de diagnósticos cerrados",
      desc: "Para psicólogos que quieren orientar el trabajo clínico con una mirada más conversacional y estructurada.",
    },
    {
      num: "04",
      title: "Leer el discurso y conducir procesos en contexto digital",
      desc: "Para quienes buscan una perspectiva más precisa para escuchar, leer y orientar la práctica en modalidad online.",
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
          <SectionLabel>Para quién es</SectionLabel>
          <SectionHeading tok={tok}>Esta masterclass es para psicólogos que:</SectionHeading>
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
      label: "Bloque 1",
      title: "Qué cambia realmente al pasar de la terapia presencial a la clínica digital",
      desc: "Comprenderás por qué la transición al contexto online no es solo un cambio de formato, sino una transformación en el encuadre, la escucha y la conducción del proceso clínico.",
    },
    {
      n: 2,
      label: "Bloque 2",
      title: "Cómo leer y orientar la práctica clínica más allá de diagnósticos cerrados",
      desc: "Verás una perspectiva que prioriza la psicoterapia conversacional, el síntoma y sus elementos significantes para abrir una orientación clínica más precisa, ética y estructurada.",
    },
    {
      n: 3,
      label: "Bloque 3",
      title: "Qué estructura ética, técnica y lógica exige hoy la práctica clínica digital",
      desc: "Identificarás los fundamentos que permiten transicionar tu práctica con mayor claridad clínica, y entender mejor cómo conducir procesos en el nuevo contexto digital más allá de diagnósticos cerrados.",
    },
  ]

  return (
    <section
      id="aprendizajes"
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
          <SectionLabel>Contenido central</SectionLabel>
          <SectionHeading tok={tok}>En esta masterclass aprenderás</SectionHeading>
          <p
            style={{
              marginTop: 12,
              fontFamily: "var(--font-inter)",
              fontSize: 15,
              color: tok.t2,
            }}
          >
            Tres ideas clave para comprender la transición clínica digital
          </p>
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
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: tok.t3,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {w.label}
                </p>
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
          <SectionHeading tok={tok}>Lo que esta conversación puede abrir en tu práctica</SectionHeading>
          <p
            style={{
              marginTop: 12,
              fontFamily: "var(--font-inter)",
              fontSize: 13,
              color: tok.t3,
            }}
          >
            Una perspectiva clínica distinta puede cambiar la forma en que orientas tu trabajo.
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
    "Muchos profesionales ya atienden online, pero no siempre han replanteado la estructura clínica que esta transición exige.",
    "La clínica digital demanda revisar encuadre, escucha y conducción con una base ética y técnica sólida.",
    "Esta masterclass abre una conversación necesaria para comprender el cambio de fondo en la práctica clínica.",
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
          <SectionLabel>Relevancia clínica</SectionLabel>
          <SectionHeading tok={tok}>La práctica clínica está cambiando</SectionHeading>
        </motion.div>
        <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
          <GlowingShadow className="!w-full !max-w-[560px] !aspect-[2.6/1] !cursor-default">
            <span
              className="pointer-events-none z-10 text-center text-xl font-semibold tracking-tight"
              style={{ color: tok.t1, margin: 0 }}
            >
              Nueva conversación clínica para el contexto digital
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

function RegistrationSection({
  dark,
  sessionId,
  onTrack,
}: {
  dark: boolean
  sessionId: string
  onTrack: (eventName: FunnelEventName, payload?: Record<string, string>) => void
}) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()

  return (
    <section
      id="registro"
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
        <motion.div variants={fadeUp} style={{ marginBottom: 32 }}>
          <SectionLabel>Registro final</SectionLabel>
          <SectionHeading tok={tok}>Reserva tu lugar en la masterclass gratuita</SectionHeading>
          <p
            style={{
              marginTop: 12,
              fontFamily: "var(--font-inter)",
              fontSize: 15,
              color: tok.t2,
              lineHeight: 1.7,
              maxWidth: 640,
            }}
          >
            Recibirás acceso e información por email y/o WhatsApp.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} style={{ maxWidth: 620 }}>
          <MasterclassLeadForm
            dark={dark}
            sessionId={sessionId}
            onTrack={onTrack}
            section="registro_final"
            formId="registro-final"
            buttonLabel="Reserva tu lugar"
          />
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
      q: "¿La masterclass es gratuita?",
      a: "Sí, el registro a la masterclass es gratuito.",
    },
    {
      q: "¿Esta masterclass es solo para psicólogos?",
      a: "Está dirigida principalmente a psicólogos y profesionales interesados en comprender el cambio hacia la clínica digital.",
    },
    {
      q: "¿Necesito experiencia previa en clínica digital?",
      a: "No. Está pensada como una introducción clara y estructurada.",
    },
    {
      q: "¿Qué recibiré al registrarme?",
      a: "Recibirás acceso e información por email y/o WhatsApp.",
    },
    {
      q: "¿La masterclass sustituye al curso completo?",
      a: "No. La masterclass es una puerta de entrada para entender el enfoque; el curso completo profundiza mucho más.",
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
          <SectionHeading tok={tok}>Preguntas frecuentes</SectionHeading>
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
          Cupos limitados
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
          Si te interesa comprender hacia dónde se mueve la práctica clínica y
          cómo transicionar con mayor claridad ética, técnica y lógica, reserva
          tu lugar.
        </p>
        <div onClick={onCta}><GradientButton>Reserva tu lugar</GradientButton></div>
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

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [dark, setDark] = useState(true)
  const [sessionId, setSessionId] = useState<string>("")
  const trackEvent = useMutation(api.leads.trackEvent)

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

  useEffect(() => {
    const id = getOrCreateSessionId()
    setSessionId(id)
  }, [])

  useEffect(() => {
    if (!sessionId) return
    onTrack("page_view", { section: "landing" })
  }, [sessionId])

  const handlePrimaryCta = () => {
    onTrack("cta_click", {
      section: "global",
      ctaLabel: "Reserva tu lugar en la masterclass gratuita",
      intent: "lead",
    })
    scrollToId("registro-principal", "registro-principal-nombre")
  }
  const handleLearnCta = () => {
    onTrack("cta_click", { section: "hero", ctaLabel: "Ver lo que aprenderás", intent: "lead" })
    scrollToId("aprendizajes")
  }
  const handleFinalRegisterCta = () => {
    onTrack("cta_click", { section: "final", ctaLabel: "Reserva tu lugar", intent: "lead" })
    scrollToId("registro", "registro-final-nombre")
  }

  return (
    <div
      style={{
        background: dark ? T.dark.bg : T.light.bg,
        transition: "background 0.35s ease",
        minHeight: "100vh",
      }}
    >
      <Nav dark={dark} onToggle={() => setDark((d) => !d)} onCta={handlePrimaryCta} />
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
          <span>Masterclass gratuita con cupos limitados.</span>
          <button
            type="button"
            onClick={handlePrimaryCta}
            className="rounded-md border border-white/30 px-2 py-1 text-xs font-semibold hover:bg-white/10"
          >
            Reservar lugar
          </button>
        </div>
      </Banner>
      <Hero
        dark={dark}
        onPrimaryCta={handlePrimaryCta}
        onSecondaryCta={handleLearnCta}
        sessionId={sessionId}
        onTrack={onTrack}
      />
      <TrustBar dark={dark} />
      <WhatYouBuild dark={dark} />
      <EightWeeks dark={dark} />
      <Testimonials dark={dark} />
      <RiskReversal dark={dark} />
      <ObjectionFaq dark={dark} />
      <UrgencyAndScarcity dark={dark} onCta={handleFinalRegisterCta} />
      <RegistrationSection dark={dark} sessionId={sessionId} onTrack={onTrack} />
      <FinalCTA dark={dark} onCta={handleFinalRegisterCta} />
      <Footer dark={dark} />
    </div>
  )
}
