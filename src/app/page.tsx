// Landing page for: MotusDAO — Técnica Avanzada en Psicoterapia
"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Banner } from "@/components/ui/banner"
import { LiquidGradientBackground } from "@/components/hero/LiquidGradientBackground"
import { GlassEffect, GlassFilter } from "@/components/ui/liquid-glass"
import DotField from "@/components/effects/DotField"

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
  titleFontSize = "clamp(20px, 2.6vw, 28px)",
  buttonLabel = "Reserva tu lugar",
}: {
  dark: boolean
  sessionId: string
  onTrack: (eventName: FunnelEventName, payload?: Record<string, string>) => void
  section: string
  formId: string
  title?: string
  subtitle?: string
  titleFontSize?: string
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
    if (!nombre.trim() || !email.trim()) return
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
    background: dark ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.30)",
    border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(14,10,26,0.10)",
    borderRadius: 10,
    padding: "12px 14px",
    fontFamily: "var(--font-inter)",
    fontSize: 15,
    color: tok.t1,
    outline: "none",
    boxSizing: "border-box",
  }

  return (
    <GlassEffect
      className="w-full rounded-2xl"
      style={{
        border: dark ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.38)",
        background: dark ? "rgba(18,12,34,0.34)" : "rgba(255,255,255,0.32)",
      }}
    >
      <div
        id={formId}
        style={{
          padding: "clamp(20px, 3vw, 28px)",
          width: "100%",
        }}
      >
        {title && (
          <h3
            style={{
              fontFamily: "var(--font-jura)",
              fontWeight: 700,
              fontSize: titleFontSize,
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
                placeholder="WhatsApp (opcional)"
                value={whatsapp}
                onChange={(e) => {
                  setWhatsapp(e.target.value)
                  if (!formStarted) {
                    setFormStarted(true)
                    onTrack("form_started", { section, intent: "lead" })
                  }
                }}
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
    </GlassEffect>
  )
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav({ dark, onToggle, onCta }: { dark: boolean; onToggle: () => void; onCta: () => void }) {
  const tok = dark ? T.dark : T.light

  return (
    <nav
      style={{
        position: "fixed",
        top: 8,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 clamp(12px, 3vw, 24px)",
      }}
    >
      <GlassEffect
        className="h-14 w-full rounded-2xl px-4 md:px-6"
        style={{
          background: dark
            ? "linear-gradient(135deg, rgba(16, 10, 30, 0.36), rgba(38, 16, 58, 0.30))"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.36), rgba(245, 238, 255, 0.30))",
        }}
      >
        <div
          style={{
            display: "flex",
            height: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "0 clamp(8px, 2vw, 18px)",
          }}
        >
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

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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

            <div onClick={onCta}>
              <GradientButton small>Reservar lugar</GradientButton>
            </div>
          </div>
        </div>
      </GlassEffect>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({
  dark,
  onPrimaryCta,
  sessionId,
  onTrack,
}: {
  dark: boolean
  onPrimaryCta: () => void
  sessionId: string
  onTrack: (eventName: FunnelEventName, payload?: Record<string, string>) => void
}) {
  const tok = dark ? T.dark : T.light
  const isLight = !dark

  const formatBullets = [
    "En vivo cada 15 días",
    "Videollamada en metaverso",
    "Grupo reducido",
    "Cupo limitado",
  ]

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        padding:
          "clamp(96px, 14vh, 130px) clamp(20px, 5vw, 72px) clamp(48px, 7vh, 80px)",
        background: tok.bg,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <LiquidGradientBackground key={dark ? "dark" : "light"} dark={dark} />

      <div
        style={{
          position: "absolute",
          top: "28%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(720px, 95vw)",
          height: 420,
          background:
            "radial-gradient(ellipse, rgba(147,51,234,0.11) 0%, transparent 72%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          width: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "clamp(28px, 5vw, 48px)",
            alignItems: "start",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <motion.div variants={fadeUp} style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 14px",
                  borderRadius: 100,
                  background: dark
                    ? "linear-gradient(135deg, rgba(50,18,72,0.42), rgba(86,34,122,0.26))"
                    : "linear-gradient(135deg, rgba(255,255,255,0.34), rgba(255,255,255,0.16))",
                  border: dark ? "1px solid rgba(192,132,252,0.34)" : "1px solid rgba(147,51,234,0.36)",
                  backdropFilter: "blur(10px) saturate(120%)",
                  WebkitBackdropFilter: "blur(10px) saturate(120%)",
                  boxShadow: dark
                    ? "0 8px 18px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.16)"
                    : "0 8px 18px rgba(31,10,56,0.10), inset 0 1px 0 rgba(255,255,255,0.45)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: 11,
                    fontWeight: 600,
                    color: isLight ? "rgba(109,40,217,0.96)" : "rgba(216,180,254,0.98)",
                    textShadow: isLight ? "0 1px 1px rgba(255,255,255,0.35)" : "0 1px 1px rgba(0,0,0,0.28)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    lineHeight: 1.35,
                  }}
                >
                  Masterclass gratuita en vivo para psicólogos
                </span>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-jura)",
                fontWeight: 700,
                fontSize: "clamp(26px, 4.6vw, 44px)",
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
                color: tok.t1,
                marginBottom: 16,
                textShadow: isLight ? "0 1px 2px rgba(255,255,255,0.32)" : undefined,
              }}
            >
              Aprende a adaptar tu práctica clínica al entorno digital con más{" "}
              <GradientText>claridad, criterio y estructura</GradientText>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "clamp(15px, 1.65vw, 17px)",
                lineHeight: 1.6,
                color: tok.t2,
                marginBottom: 20,
                maxWidth: 560,
                textShadow: isLight ? "0 1px 2px rgba(255,255,255,0.24)" : undefined,
              }}
            >
              Una sesión en vivo de 1 hora y media para psicólogos que quieren transicionar a la
              clínica digital sin reducir su trabajo a solo atender por videollamada.
            </motion.p>

            <motion.ul
              variants={fadeUp}
              style={{
                listStyle: "none",
                margin: "0 0 22px",
                padding: 0,
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {formatBullets.map((item) => (
                <li
                  key={item}
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: 13,
                    fontWeight: 500,
                    color: isLight ? "rgba(14,10,26,0.95)" : tok.t1,
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: isLight ? "1px solid rgba(255,255,255,0.34)" : `1px solid ${tok.cardBorder}`,
                    background: isLight ? "rgba(255,255,255,0.24)" : tok.card,
                  }}
                >
                  {item}
                </li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} style={{ marginBottom: 10 }}>
              <div onClick={onPrimaryCta}>
                <GradientButton>Reservar mi lugar gratis</GradientButton>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 13,
                  color: dark ? "rgba(255,255,255,0.72)" : "#000000",
                  marginTop: 10,
                  letterSpacing: "0.02em",
                }}
              >
                Gratis · En vivo · Registro limitado
              </p>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} style={{ width: "100%", maxWidth: 420, justifySelf: "stretch" }}>
            <MasterclassLeadForm
              dark={dark}
              sessionId={sessionId}
              onTrack={onTrack}
              section="hero"
              formId="registro-principal"
              title="Regístrate a la Masterclass gratuita en vivo"
              titleFontSize="clamp(18px, 2.2vw, 24px)"
              subtitle="Nombre y correo. Te enviamos el acceso a la sesión en vivo."
              buttonLabel="Reservar mi lugar gratis"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

// ─── Trust Bar ────────────────────────────────────────────────────────────────

function TrustBar({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()

  const items = [
    "Solo psicólogos y clínica",
    "Sesión en vivo (no grabación)",
    "Grupo reducido · cupo limitado",
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
              fontSize: 13,
              fontWeight: 500,
              color: tok.t2,
              letterSpacing: "0.01em",
              lineHeight: 1.3,
              textAlign: "center",
            }}
          >
            {item}
          </span>
        </div>
      ))}
    </motion.section>
  )
}

// ─── Para quién es ───────────────────────────────────────────────────────────

function AudienceFitSection({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()

  const forYou = [
    "Ya atienden online pero sienten que les falta estructura o criterio clínico.",
    "Quieren empezar a trabajar en entorno digital sin improvisar la práctica.",
    "Buscan una mirada seria (no solo tips de “terapia online”).",
    "Quieren actualizar la práctica sin perder profundidad clínica.",
    "Quieren entender mejor el paso de lo presencial a lo virtual.",
  ]

  const notFor = [
    "Buscas solo hacks rápidos sin reflexión clínica.",
    "No trabajas en clínica ni te interesa adaptar tu práctica profesional.",
    "Esperas una charla genérica, sin rigor ni marco técnico.",
  ]

  return (
    <section
      style={{
        background: tok.bg,
        padding: "clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: dark ? 0.27 : 0.76,
          pointerEvents: "none",
        }}
      >
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          bulgeStrength={67}
          glowRadius={dark ? 160 : 0}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom={dark ? "#a855f7" : "rgba(147,51,234,0.85)"}
          gradientTo={dark ? "#b497cf" : "rgba(99,102,241,0.72)"}
          glowColor={dark ? "#120f17" : "transparent"}
          aria-hidden
        />
      </div>
      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        style={{ position: "relative", zIndex: 1 }}
      >
        <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
          <SectionLabel>Para quién es</SectionLabel>
          <SectionHeading tok={tok}>Esta masterclass es para psicólogos que…</SectionHeading>
        </motion.div>

        <ul
          style={{
            listStyle: "none",
            margin: "0 0 36px",
            padding: 0,
            display: "grid",
            gap: 12,
            maxWidth: 720,
          }}
        >
          {forYou.map((line) => (
            <motion.li
              key={line}
              variants={fadeUp}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                fontFamily: "var(--font-inter)",
                fontSize: 15,
                color: tok.t1,
                lineHeight: 1.55,
              }}
            >
              <span style={{ color: "#A855F7", flexShrink: 0, marginTop: 2 }}>✓</span>
              <span>{line}</span>
            </motion.li>
          ))}
        </ul>

        <motion.div variants={fadeUp}>
          <h3
            style={{
              fontFamily: "var(--font-jura)",
              fontWeight: 700,
              fontSize: "clamp(18px, 2.4vw, 22px)",
              color: tok.t1,
              marginBottom: 14,
            }}
          >
            No es para ti si…
          </h3>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10, maxWidth: 720 }}>
            {notFor.map((line) => (
              <li
                key={line}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  fontFamily: "var(--font-inter)",
                  fontSize: 14,
                  color: tok.t2,
                  lineHeight: 1.55,
                }}
              >
                <span style={{ color: tok.t3, flexShrink: 0 }}>—</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─── Qué aprenderás ───────────────────────────────────────────────────────────

function WhatYouLearnSection({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()
  const pinWrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const items = [
    {
      title: "Qué cambia al pasar de consulta presencial a práctica digital",
      desc: "Variables de encuadre, escucha y conducción que no se resuelven solo cambiando de sala a pantalla.",
    },
    {
      title: "Cómo adaptar el encuadre clínico al entorno virtual",
      desc: "Criterios para sostener la clínica con rigor cuando el dispositivo y el contexto cambian.",
    },
    {
      title: "Errores frecuentes al trabajar online sin estructura",
      desc: "Señales de improvisación que debilitan la práctica y cómo evitarlas desde el primer contacto.",
    },
    {
      title: "Nuevas variables en psicoterapia en línea",
      desc: "Qué observar y cómo ordenar decisiones técnicas y éticas en sesión remota.",
    },
    {
      title: "Marcos y técnicas para operar mejor como psicólogo digital",
      desc: "Introducción aplicable a tu trabajo clínico, con vocabulario claro y orientación práctica.",
    },
  ]

  useEffect(() => {
    const pinWrap = pinWrapRef.current
    const track = trackRef.current
    if (!pinWrap || !track) return

    gsap.registerPlugin(ScrollTrigger)

    const mm = gsap.matchMedia()
    mm.add("(min-width: 901px)", () => {
      const getDistance = () => {
        const distance = track.scrollWidth - pinWrap.clientWidth
        return Math.max(0, distance)
      }
      if (getDistance() < 8) return

      const tween = gsap.fromTo(
        track,
        { x: 0 },
        {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: pinWrap,
            start: "top top+=72",
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      id="aprendizajes"
      style={{
        background: tok.bgAlt,
        padding: "clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)",
      }}
    >
      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
          <SectionLabel>Contenido</SectionLabel>
          <SectionHeading tok={tok}>En esta masterclass aprenderás</SectionHeading>
          <p
            style={{
              marginTop: 10,
              fontFamily: "var(--font-inter)",
              fontSize: 15,
              color: tok.t2,
              lineHeight: 1.55,
              maxWidth: 620,
            }}
          >
            Resultados concretos para tu consulta: menos confusión conceptual, más criterio para decidir cómo
            trabajar en digital.
          </p>
        </motion.div>

        <div
          ref={pinWrapRef}
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            width: "100%",
            minHeight: "min(62vh, 560px)",
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <div
            ref={trackRef}
            style={{
              display: "flex",
              width: "max-content",
            gap: 14,
              paddingRight: 24,
              alignItems: "stretch",
              willChange: "transform",
          }}
        >
            {items.map((f, index) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                style={{
                  background: tok.card,
                  border: `1px solid ${tok.cardBorder}`,
                  borderRadius: 14,
                  padding: "20px 20px 22px",
                  width: "clamp(260px, 32vw, 380px)",
                  minHeight: "min(62vh, 560px)",
                  flex: "0 0 auto",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-jura)",
                    fontWeight: 700,
                    fontSize: "clamp(42px, 6vw, 68px)",
                    lineHeight: 1,
                    marginBottom: 12,
                    color: dark ? "rgba(255,255,255,0.18)" : "rgba(14,10,26,0.18)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-jura)",
                    fontWeight: 700,
                    fontSize: 16,
                    color: tok.t1,
                    marginBottom: 8,
                    lineHeight: 1.35,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: 14,
                    color: tok.t2,
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

// ─── Formato de la sesión ─────────────────────────────────────────────────────

function ExperienceFormatSection({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()
  const pinWrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const cards = [
    { title: "En vivo", body: "Clase en tiempo real: preguntas y participación, no grabación en frío." },
    { title: "1 h 30", body: "Duración fija para cubrir marco, ejemplos clínicos y espacio de reflexión." },
    { title: "Metaverso", body: "Videollamada en entorno inmersivo: mismo estándar profesional, formato claro." },
    { title: "Grupo reducido", body: "Cupo limitado por edición para mantener la conversación clínica ordenada." },
    { title: "Cada 15 días", body: "Nueva edición con fecha límite de registro. Si no entras, puedes anotarte a la siguiente." },
    {
      title: "Qué haremos",
      body: "Presentación breve, autoevaluación guiada, marcos nuevos y técnicas aplicadas a psicoterapia en línea.",
    },
  ]

  useEffect(() => {
    const pinWrap = pinWrapRef.current
    const track = trackRef.current
    if (!pinWrap || !track) return

    const mm = gsap.matchMedia()
    mm.add("(min-width: 901px)", () => {
      const getDistance = () => {
        const distance = track.scrollWidth - pinWrap.clientWidth
        return Math.max(0, distance)
      }
      if (getDistance() < 8) return

      const tween = gsap.fromTo(
        track,
        { x: () => -getDistance() },
        {
          x: 0,
          ease: "none",
          scrollTrigger: {
            trigger: pinWrap,
            start: "top top+=72",
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      style={{
        background: tok.bg,
        padding: "clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)",
      }}
    >
      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
          <SectionLabel>Formato</SectionLabel>
          <SectionHeading tok={tok}>¿Cómo será la masterclass?</SectionHeading>
        </motion.div>

        <div
          ref={pinWrapRef}
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            width: "100%",
            minHeight: "min(56vh, 460px)",
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <div
            ref={trackRef}
            style={{
              display: "flex",
              width: "max-content",
            gap: 12,
              alignItems: "stretch",
              paddingRight: 24,
              willChange: "transform",
          }}
        >
            {cards.map((c, index) => (
              <motion.div
                key={c.title}
                variants={fadeUp}
                style={{
                  background: tok.cardHighBg,
                  border: `1px solid ${tok.cardHighBorder}`,
                  borderRadius: 14,
                  padding: "18px 18px 20px",
                  width: "clamp(240px, 29vw, 340px)",
                  minHeight: "min(56vh, 460px)",
                  flex: "0 0 auto",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-jura)",
                    fontWeight: 700,
                    fontSize: "clamp(36px, 5vw, 58px)",
                    lineHeight: 1,
                    marginBottom: 10,
                    color: dark ? "rgba(255,255,255,0.17)" : "rgba(14,10,26,0.16)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {String(cards.length - index).padStart(2, "0")}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-jura)",
                    fontWeight: 700,
                    fontSize: 16,
                    color: tok.t1,
                    marginBottom: 8,
                  }}
                >
                  {c.title}
                </h3>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: tok.t2, lineHeight: 1.5, margin: 0 }}>
                  {c.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function InstructorBlock({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()

  const creds = [
    "Especialista en psicología clínica digital",
    "Maestría en psicoterapia",
    "Docencia y práctica clínica con foco en encuadre y lectura del síntoma en contexto digital",
  ]

  return (
    <section
      style={{
        background: tok.bgAlt,
        padding: "clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)",
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
          padding: "clamp(22px, 4vw, 32px)",
        }}
      >
        <motion.div variants={fadeUp} style={{ marginBottom: 12 }}>
          <SectionLabel>Profesor</SectionLabel>
          <SectionHeading tok={tok}>Mtro. Benjamín Buzali</SectionHeading>
        </motion.div>
        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 15,
            color: tok.t2,
            lineHeight: 1.6,
            maxWidth: 720,
            marginBottom: 16,
          }}
        >
          Conduce una masterclass clínica (no motivacional): vocabulario técnico preciso, ejemplos de práctica y
          criterios para decidir cómo operar en digital sin perder profundidad.
        </motion.p>
        <motion.ul
          variants={fadeUp}
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "grid",
            gap: 10,
          }}
        >
          {creds.map((c) => (
            <li
              key={c}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                fontFamily: "var(--font-inter)",
                fontSize: 14,
                color: tok.t1,
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: "#A855F7", flexShrink: 0 }}>·</span>
              <span>{c}</span>
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  )
}

// ─── Confianza (sin testimonios placeholder) ─────────────────────────────────

function TrustSignalsSection({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()

  const lines = [
    "Enfoque clínico serio: marco técnico, no discurso genérico de “mindset”.",
    "Profesor con trayectoria en psicología clínica digital y psicoterapia.",
    "Sesión en vivo con interacción; cupo acotado por edición.",
    "Edición recurrente cada 15 días: si no entras ahora, puedes registrarte a la siguiente.",
    "Pensada como muestra introductoria de un diplomado: rigor, sin humo.",
  ]

  return (
    <section
      style={{
        background: tok.bg,
        padding: "clamp(48px, 7vh, 88px) clamp(20px, 5vw, 72px)",
      }}
    >
      <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"}>
        <motion.div variants={fadeUp} style={{ marginBottom: 22 }}>
          <SectionLabel>Confianza</SectionLabel>
          <SectionHeading tok={tok}>Por qué puedes tomar esta masterclass en serio</SectionHeading>
        </motion.div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, maxWidth: 720, display: "grid", gap: 12 }}>
          {lines.map((line) => (
            <motion.li
              key={line}
              variants={fadeUp}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                fontFamily: "var(--font-inter)",
                fontSize: 15,
                color: tok.t2,
                lineHeight: 1.55,
              }}
            >
              <span style={{ color: "#A855F7", flexShrink: 0, marginTop: 2 }}>✓</span>
              <span>{line}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  )
}

function MidCtaBand({ dark, onCta }: { dark: boolean; onCta: () => void }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()
  return (
    <section
      style={{
        background: tok.bgAlt,
        padding: "clamp(36px, 6vh, 56px) clamp(20px, 5vw, 72px)",
        borderTop: `1px solid ${tok.cardBorder}`,
        borderBottom: `1px solid ${tok.cardBorder}`,
      }}
    >
      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        style={{
          maxWidth: 720,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 15,
            color: tok.t2,
            lineHeight: 1.55,
            marginBottom: 18,
          }}
        >
          Si encajas con el perfil, el siguiente paso es dejar tu nombre y correo: te enviamos el acceso a la sesión
          en vivo.
        </motion.p>
        <motion.div variants={fadeUp}>
          <div onClick={onCta} style={{ display: "inline-block" }}>
            <GradientButton>Reservar mi lugar gratis</GradientButton>
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
      q: "¿La masterclass es gratuita?",
      a: "Sí. El registro es gratuito; no hay pago para participar en esta sesión introductoria.",
    },
    {
      q: "¿Está dirigida solo a psicólogos?",
      a: "Sí, está pensada para psicólogos (y perfiles equivalentes en clínica). No es una charla para público general.",
    },
    {
      q: "¿Necesito experiencia previa atendiendo online?",
      a: "No es obligatorio. Sirve tanto si ya atiendes online como si estás evaluando el paso: el foco es criterio y estructura clínica.",
    },
    {
      q: "¿La clase es en vivo o grabada?",
      a: "En vivo. Hay espacio de participación; no es un video grabado enviado por correo.",
    },
    {
      q: "¿Cuánto dura?",
      a: "Una hora y media, con bloques claros: marco, aplicación clínica y espacio breve de reflexión.",
    },
    {
      q: "¿Cómo se lleva a cabo la sesión?",
      a: "Videollamada en metaverso (entorno inmersivo), con grupo reducido y conducción por el profesor.",
    },
    {
      q: "¿Qué pasa si no alcanzo lugar en esta edición?",
      a: "Abrimos una nueva edición aproximadamente cada 15 días. Puedes volver a registrarte para la siguiente fecha.",
    },
    {
      q: "¿Esta masterclass forma parte de una formación más amplia?",
      a: "Sí. Es una muestra seria y acotada; el diplomado profundiza marcos, técnica y práctica en clínica digital.",
    },
    {
      q: "¿Qué datos pedís al registrarme?",
      a: "Nombre y correo (obligatorio). WhatsApp es opcional si querés recordatorios por ese canal.",
    },
  ]
  return (
    <section
      style={{
        background: tok.bgAlt,
        padding: "clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)",
      }}
    >
      <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"}>
        <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
          <SectionLabel>FAQ</SectionLabel>
          <SectionHeading tok={tok}>Preguntas frecuentes</SectionHeading>
        </motion.div>
        <div style={{ display: "grid", gap: 10, maxWidth: 800, margin: "0 auto" }}>
          {faqs.map((item) => (
            <motion.div
              key={item.q}
              variants={fadeUp}
              style={{
                background: tok.card,
                border: `1px solid ${tok.cardBorder}`,
                borderRadius: 12,
                padding: "16px 18px",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-jura)",
                  fontWeight: 700,
                  fontSize: 16,
                  color: tok.t1,
                  marginBottom: 6,
                  lineHeight: 1.3,
                }}
              >
                {item.q}
              </h3>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: tok.t2, lineHeight: 1.55, margin: 0 }}>
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
            fontSize: "clamp(26px, 4.2vw, 44px)",
            color: tok.t1,
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          Cupo reducido por edición
        </h2>
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(15px, 1.5vw, 17px)",
            color: tok.t2,
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          Nueva sesión en vivo aproximadamente cada 15 días. El registro cierra por fecha límite y por lugares
          disponibles: si esta edición se llena, pasás a la lista de la siguiente.
        </p>
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 14,
            color: tok.t3,
            lineHeight: 1.5,
            marginBottom: 28,
          }}
        >
          Dejá nombre y correo arriba para asegurar tu lugar gratis en la próxima masterclass.
        </p>
        <div onClick={onCta}>
          <GradientButton>Reservar mi lugar gratis</GradientButton>
        </div>
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
        © 2026 · Todos los derechos reservados
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
      ctaLabel: "Reservar mi lugar gratis",
      intent: "lead",
    })
    scrollToId("registro-principal", "registro-principal-nombre")
  }
  const handleMidCta = () => {
    onTrack("cta_click", { section: "mid_funnel", ctaLabel: "Reservar mi lugar gratis", intent: "lead" })
    scrollToId("registro-principal", "registro-principal-nombre")
  }
  const handleFinalRegisterCta = () => {
    onTrack("cta_click", { section: "final", ctaLabel: "Reservar mi lugar gratis", intent: "lead" })
    scrollToId("registro-principal", "registro-principal-nombre")
  }

  return (
    <div
      style={{
        background: dark ? T.dark.bg : T.light.bg,
        transition: "background 0.35s ease",
        minHeight: "100vh",
        paddingBottom: 84,
      }}
    >
      <GlassFilter />
      <Nav dark={dark} onToggle={() => setDark((d) => !d)} onCta={handlePrimaryCta} />
      <Hero dark={dark} onPrimaryCta={handlePrimaryCta} sessionId={sessionId} onTrack={onTrack} />
      <TrustBar dark={dark} />
      <WhatYouLearnSection dark={dark} />
      <ExperienceFormatSection dark={dark} />
      <AudienceFitSection dark={dark} />
      <MidCtaBand dark={dark} onCta={handleMidCta} />
      <InstructorBlock dark={dark} />
      <TrustSignalsSection dark={dark} />
      <ObjectionFaq dark={dark} />
      <FinalCTA dark={dark} onCta={handleFinalRegisterCta} />
      <div className="fixed bottom-0 left-0 right-0 z-[95] border-t border-white/25 bg-black/35 shadow-[0_-8px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(70deg, rgba(236,72,153,0.65) 0%, rgba(147,51,234,0.72) 33%, rgba(99,102,241,0.62) 66%, rgba(236,72,153,0.65) 100%)",
            backgroundSize: "200% 100%",
            animation: "fd-moving-banner 20s linear infinite",
            filter: "saturate(1.4)",
            opacity: 0.75,
          }}
        />
        <style>
          {`@keyframes fd-moving-banner {
            from { background-position: 0% 0; }
            to { background-position: 100% 0; }
          }`}
        </style>
        <div className="relative flex flex-wrap items-center justify-center gap-2 px-12 py-2 sm:gap-3">
          <span className="text-center text-xs text-white sm:text-sm">
            Masterclass gratuita en vivo · grupo reducido · registro con cupo
          </span>
          <button
            type="button"
            onClick={handlePrimaryCta}
            className="rounded-md border border-white/30 bg-white/10 px-2 py-1 text-xs font-semibold text-white hover:bg-white/20"
          >
            Reservar gratis
          </button>
        </div>
      </div>
      <Footer dark={dark} />
    </div>
  )
}
