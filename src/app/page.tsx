// Landing page for: MotusDAO Academy — adquisición (diagnóstico + masterclass)
"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { LiquidGradientBackground } from "@/components/hero/LiquidGradientBackground"
import { GlassEffect, GlassFilter } from "@/components/ui/liquid-glass"
import DotField from "@/components/effects/DotField"
import { DIGITAL_PROFILES } from "@/lib/digital-profiles"
import { getOrCreateSessionId, getStoredLeadContext, type FunnelEventName } from "@/lib/funnel-session"
import { GRAD, T, type Tok } from "@/lib/landing-theme"

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

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return { ref, inView }
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const onChange = () => setIsMobile(media.matches)
    onChange()
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [breakpoint])

  return isMobile
}

function useHorizontalPin(pinWrapRef: React.RefObject<HTMLDivElement | null>, trackRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const pinWrap = pinWrapRef.current
    const track = trackRef.current
    if (!pinWrap || !track) return

    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()
    mm.add("(min-width: 901px)", () => {
      const getDistance = () => Math.max(0, track.scrollWidth - pinWrap.clientWidth)
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
  }, [pinWrapRef, trackRef])
}

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
  href,
  onClick,
  variant = "primary",
  type = "button",
  dark = true,
}: {
  children: React.ReactNode
  small?: boolean
  full?: boolean
  href?: string
  onClick?: () => void
  variant?: "primary" | "outline"
  type?: "button" | "submit"
  dark?: boolean
}) {
  const isPrimary = variant === "primary"
  const style: React.CSSProperties = {
    background: isPrimary ? GRAD : "transparent",
    border: isPrimary ? "none" : `1px solid ${dark ? "rgba(255,255,255,0.22)" : "rgba(14,10,26,0.18)"}`,
    borderRadius: 10,
    color: isPrimary ? "#fff" : dark ? "rgba(255,255,255,0.92)" : "rgba(14,10,26,0.90)",
    fontWeight: 600,
    fontSize: small ? 14 : 16,
    padding: small ? "9px 18px" : "14px 28px",
    cursor: "pointer",
    fontFamily: "var(--font-inter)",
    letterSpacing: "0.01em",
    width: full ? "100%" : undefined,
    display: "inline-block",
    textAlign: "center",
    textDecoration: "none",
    boxSizing: "border-box",
  }

  if (href) {
    const inner = (
      <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClick} style={style}>
        {children}
      </motion.span>
    )
    if (href.startsWith("/") && !href.startsWith("//")) {
      return (
        <Link href={href} style={{ textDecoration: "none", width: full ? "100%" : undefined, display: full ? "block" : "inline-block" }}>
          {inner}
        </Link>
      )
    }
    return (
      <motion.a href={href} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClick} style={style}>
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button type={type} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClick} style={style}>
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
  buttonLabel = "Reservar mi lugar gratis",
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
  const isMobile = useIsMobile()
  const convexConfigured = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL)
  const registrar = useMutation(api.leads.registrar)
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [estado, setEstado] = useState<"idle" | "loading" | "ok" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formStarted, setFormStarted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !email.trim()) return
    if (!convexConfigured) {
      setErrorMessage(
        "El sitio en producción no tiene Convex configurado. Añade NEXT_PUBLIC_CONVEX_URL en Vercel y vuelve a desplegar."
      )
      setEstado("error")
      return
    }
    setErrorMessage(null)
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
      void fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim() || undefined,
          interes: "programa",
          sessionId,
          leadId: result.leadId,
          utmSource: utm.get("utm_source") ?? undefined,
          utmMedium: utm.get("utm_medium") ?? undefined,
          utmCampaign: utm.get("utm_campaign") ?? undefined,
          utmContent: utm.get("utm_content") ?? undefined,
          utmTerm: utm.get("utm_term") ?? undefined,
          referrer: document.referrer || undefined,
        }),
      }).catch((err) => {
        console.warn("[registro] No se enviaron correos inmediatos:", err)
      })
      onTrack("form_submitted", { section, intent: "lead", email: email.trim() })
      setEstado("ok")
      setTimeout(() => {
        window.location.href = "/gracias?flow=lead"
      }, 450)
    } catch (err) {
      console.error("[registro] Error al guardar lead:", err)
      setErrorMessage("No se pudo guardar tu registro. Revisa tu conexión e intenta de nuevo.")
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
    fontSize: isMobile ? 16 : 15,
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
      <div id={formId} style={{ padding: "clamp(20px, 3vw, 28px)", width: "100%" }}>
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
              fontSize: isMobile ? 16 : 14,
              color: tok.t2,
              marginBottom: 18,
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </p>
        )}

        {estado === "ok" ? (
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 15, color: tok.t1, lineHeight: 1.6 }}>
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
              />
            </div>
            {estado === "error" && (
              <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: "#EC4899", marginBottom: 12 }}>
                {errorMessage ?? "Algo salió mal. Intenta de nuevo."}
              </p>
            )}
            <GradientButton type="submit" full>
              {estado === "loading" ? "Enviando..." : buttonLabel}
            </GradientButton>
          </form>
        )}
      </div>
    </GlassEffect>
  )
}

function Nav({
  dark,
  onToggle,
  onDiagnostico,
}: {
  dark: boolean
  onToggle: () => void
  onDiagnostico: () => void
}) {
  const tok = dark ? T.dark : T.light
  const isMobile = useIsMobile()
  const linkStyle: React.CSSProperties = {
    fontFamily: "var(--font-inter)",
    fontSize: 13,
    fontWeight: 500,
    color: tok.t2,
    textDecoration: "none",
  }

  return (
    <nav
      style={{
        position: "fixed",
        top: `max(8px, env(safe-area-inset-top, 0px))`,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: isMobile ? "0 10px" : "0 clamp(12px, 3vw, 24px)",
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
            gap: isMobile ? 10 : 16,
            padding: isMobile ? "0 8px" : "0 clamp(8px, 2vw, 18px)",
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img
              src="/logo.svg"
              alt="MotusDAO logo"
              style={{ width: 28, height: 28, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
            />
            <span
              style={{
                fontFamily: "var(--font-jura)",
                fontWeight: 700,
                fontSize: isMobile ? 15 : 17,
                color: tok.t1,
                letterSpacing: "-0.01em",
                display: isMobile ? "none" : "inline",
              }}
            >
              MotusDAO
            </span>
          </Link>

          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <a href="#academia" style={linkStyle}>
                Academia
              </a>
              <a href="#comunidad" style={linkStyle}>
                Comunidad
              </a>
              <a href="#ecosistema" style={linkStyle}>
                Ecosistema
              </a>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 16 }}>
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

            <GradientButton small href="/diagnostico" onClick={onDiagnostico}>
              Hacer diagnóstico
            </GradientButton>
          </div>
        </div>
      </GlassEffect>
    </nav>
  )
}

function Hero({
  dark,
  claseFirst,
  onPrimaryCta,
  onReservar,
}: {
  dark: boolean
  claseFirst: boolean
  onPrimaryCta: () => void
  onReservar: () => void
}) {
  const tok = dark ? T.dark : T.light
  const isLight = !dark
  const isMobile = useIsMobile()

  const badge = claseFirst ? "Masterclass gratuita en vivo para psicólogos" : "Formación · Comunidad · Práctica Digital"

  const diagnosticoCta = (
    <div style={{ flex: isMobile ? "1 1 100%" : "0 1 auto" }}>
      <GradientButton href="/diagnostico" onClick={onPrimaryCta} full={isMobile} variant={claseFirst ? "outline" : "primary"} dark={dark}>
        Descubrir mi perfil
      </GradientButton>
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 13,
          color: dark ? "rgba(255,255,255,0.72)" : "#000000",
          marginTop: 10,
          letterSpacing: "0.02em",
        }}
      >
        Gratis · 6 preguntas · Resultado inmediato
      </p>
    </div>
  )

  const reservarCta = (
    <div style={{ flex: isMobile ? "1 1 100%" : "0 1 auto" }}>
      <GradientButton onClick={onReservar} full={isMobile} variant={claseFirst ? "primary" : "outline"} dark={dark}>
        Reservar mi lugar gratis
      </GradientButton>
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 13,
          color: dark ? "rgba(255,255,255,0.72)" : "#000000",
          marginTop: 10,
          letterSpacing: "0.02em",
        }}
      >
        En vivo · 90 min · Grupo reducido
      </p>
    </div>
  )

  return (
    <section
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        padding: isMobile
          ? `max(92px, calc(env(safe-area-inset-top, 0px) + 82px)) 16px 170px`
          : "clamp(96px, 14vh, 130px) clamp(20px, 5vw, 72px) clamp(48px, 7vh, 80px)",
        background: tok.bg,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <LiquidGradientBackground key={dark ? "dark" : "light"} dark={dark} showControls={false} />

      <div
        style={{
          position: "absolute",
          top: "28%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(720px, 95vw)",
          height: 420,
          background: "radial-gradient(ellipse, rgba(147,51,234,0.11) 0%, transparent 72%)",
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
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <motion.div variants={fadeUp} style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: isMobile ? "8px 12px" : "7px 14px",
                  borderRadius: 100,
                  background: dark
                    ? "linear-gradient(135deg, rgba(50,18,72,0.42), rgba(86,34,122,0.26))"
                    : "linear-gradient(135deg, rgba(255,255,255,0.34), rgba(255,255,255,0.16))",
                  border: dark ? "1px solid rgba(192,132,252,0.34)" : "1px solid rgba(147,51,234,0.36)",
                  backdropFilter: "blur(10px) saturate(120%)",
                  WebkitBackdropFilter: "blur(10px) saturate(120%)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: isMobile ? 12 : 11,
                    fontWeight: 600,
                    color: isLight ? "rgba(109,40,217,0.96)" : "rgba(216,180,254,0.98)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    lineHeight: 1.35,
                  }}
                >
                  {badge}
                </span>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-jura)",
                fontWeight: 700,
                fontSize: isMobile ? "clamp(30px, 9.2vw, 40px)" : "clamp(26px, 4.6vw, 44px)",
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
                color: tok.t1,
                marginBottom: 16,
              }}
            >
              {claseFirst ? (
                <>
                  Psicología clínica en la <GradientText>era digital</GradientText>
                </>
              ) : (
                <>
                  La psicología está entrando en una nueva era. Aprende a trabajar en digital sin perder el{" "}
                  <GradientText>criterio clínico</GradientText>
                </>
              )}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: isMobile ? 16 : "clamp(15px, 1.65vw, 17px)",
                lineHeight: 1.6,
                color: tok.t2,
                marginBottom: 10,
                maxWidth: 560,
              }}
            >
              {claseFirst
                ? "Una sesión en vivo de 90 minutos para psicólogos que quieren comprender qué cambia cuando la práctica clínica pasa al entorno digital."
                : "MotusDAO Academy es el espacio de formación y comunidad para psicólogos que quieren comprender, adaptar y desarrollar su práctica en entornos digitales."}
            </motion.p>

            {!claseFirst && (
              <motion.p
                variants={fadeUp}
                style={{
                  fontFamily: "var(--font-jura)",
                  fontWeight: 700,
                  fontSize: 15,
                  color: tok.t1,
                  marginBottom: 22,
                  letterSpacing: "-0.01em",
                }}
              >
                Aprende. Conecta. Experimenta. Evoluciona.
              </motion.p>
            )}

            <motion.div
              variants={fadeUp}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                alignItems: "flex-start",
                marginTop: claseFirst ? 22 : 0,
              }}
            >
              {claseFirst ? (
                <>
                  {reservarCta}
                  {diagnosticoCta}
                </>
              ) : (
                <>
                  {diagnosticoCta}
                  {reservarCta}
                </>
              )}
            </motion.div>
          </div>

          <motion.div variants={fadeUp} style={{ width: "100%", maxWidth: 420, justifySelf: "stretch" }}>
            <img
              src="/MAsterclass3.avif"
              alt="MotusDAO Academy — formación y comunidad para psicólogos en práctica digital"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 16,
                objectFit: "cover",
                border: isLight ? "1px solid rgba(147,51,234,0.22)" : "1px solid rgba(192,132,252,0.28)",
                boxShadow: dark ? "0 16px 40px rgba(0,0,0,0.35)" : "0 16px 40px rgba(31,10,56,0.12)",
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

function AcademyIntroSection({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()
  const pillars = [
    { label: "Formación", line: "Contenido y experiencias para desarrollar competencias de práctica digital." },
    { label: "Comunidad", line: "Un espacio para conectar, compartir y discutir los desafíos de la práctica digital." },
    { label: "Herramientas", line: "Recursos para organizar aspectos de tu práctica profesional." },
    { label: "Supervisión", line: "Espacios de discusión y desarrollo profesional dentro de la ruta." },
    { label: "Investigación", line: "Conocimiento para profundizar en psicología, tecnología y práctica digital." },
    { label: "Entorno digital", line: "Un ecosistema donde formación, comunidad y herramientas conviven." },
  ]

  return (
    <section
      id="academia"
      style={{
        background: tok.bgAlt,
        padding: "clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)",
      }}
    >
      <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"} style={{ maxWidth: 920 }}>
        <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
          <SectionLabel>Qué es</SectionLabel>
          <SectionHeading tok={tok}>MotusDAO Academy</SectionHeading>
          <p
            style={{
              marginTop: 12,
              fontFamily: "var(--font-inter)",
              fontSize: 15,
              color: tok.t2,
              lineHeight: 1.6,
              maxWidth: 620,
            }}
          >
            La práctica digital no consiste solamente en cambiar el consultorio por una videollamada. Cambian el
            contexto, el encuadre, la comunicación, la privacidad y la forma de relacionarte con la tecnología.
            Academia existe para entender esos cambios y desarrollar tu práctica con estructura y criterio profesional.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: 12,
          }}
        >
          {pillars.map((item) => (
            <motion.div
              key={item.label}
              variants={fadeUp}
              style={{
                background: tok.card,
                border: `1px solid ${tok.cardBorder}`,
                borderRadius: 14,
                padding: "16px 18px",
              }}
            >
              <p style={{ margin: 0, fontFamily: "var(--font-jura)", fontWeight: 700, fontSize: 16, color: tok.t1 }}>
                {item.label}
              </p>
              <p style={{ margin: "6px 0 0", fontFamily: "var(--font-inter)", fontSize: 14, color: tok.t2, lineHeight: 1.5 }}>
                {item.line}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function DiagnosticSection({ dark, onDiagnostico }: { dark: boolean; onDiagnostico: () => void }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()
  const pinWrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  useHorizontalPin(pinWrapRef, trackRef)

  const discoveries = [
    "Tu perfil de práctica digital",
    "Tus principales fortalezas",
    "Las áreas que podrías revisar",
    "Tu siguiente paso dentro de Motus",
  ]

  const path = ["Diagnóstico", "Perfil", "Next step", "Comunidad", "Formación", "Progresión"]

  return (
    <section
      id="diagnostico"
      style={{
        background: tok.bg,
        padding: "clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)",
      }}
    >
      <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"}>
        <motion.div variants={fadeUp} style={{ marginBottom: 28, maxWidth: 640 }}>
          <SectionLabel>Antes de aprender</SectionLabel>
          <SectionHeading tok={tok}>¿Qué tipo de psicólogo digital eres?</SectionHeading>
          <p style={{ marginTop: 12, fontFamily: "var(--font-inter)", fontSize: 15, color: tok.t2, lineHeight: 1.6 }}>
            Tu práctica no tiene que parecerse a la de nadie más. Hay quienes están comenzando, quienes ya trabajan
            online y buscan estructura, quienes exploran IA y quienes quieren llevar una práctica consolidada al
            siguiente nivel.
          </p>
        </motion.div>

        <ul style={{ listStyle: "none", margin: "0 0 24px", padding: 0, display: "grid", gap: 10, maxWidth: 640 }}>
          {discoveries.map((line) => (
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

        <motion.div variants={fadeUp} style={{ marginBottom: 36 }}>
          <GradientButton href="/diagnostico" onClick={onDiagnostico}>
            Descubrir mi perfil
          </GradientButton>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: tok.t3, marginTop: 10 }}>
            Gratis · Orientativo · 6 preguntas · Diseñado para profesionales
          </p>
        </motion.div>

        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: "var(--font-jura)",
            fontWeight: 700,
            fontSize: 18,
            color: tok.t1,
            marginBottom: 16,
          }}
        >
          Encuentra tu perfil
        </motion.p>

        <div
          ref={pinWrapRef}
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            width: "100%",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div ref={trackRef} style={{ display: "flex", width: "max-content", gap: 14, paddingRight: 24, willChange: "transform" }}>
            {DIGITAL_PROFILES.map((profile, index) => (
              <motion.div
                key={profile.id}
                variants={fadeUp}
                style={{
                  background: tok.card,
                  border: `1px solid ${tok.cardBorder}`,
                  borderRadius: 14,
                  padding: "20px 20px 22px",
                  width: "clamp(240px, 28vw, 320px)",
                  minHeight: 260,
                  flex: "0 0 auto",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-jura)",
                    fontWeight: 700,
                    fontSize: "clamp(36px, 5vw, 52px)",
                    lineHeight: 1,
                    marginBottom: 12,
                    color: dark ? "rgba(255,255,255,0.18)" : "rgba(14,10,26,0.18)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 style={{ fontFamily: "var(--font-jura)", fontWeight: 700, fontSize: 16, color: tok.t1, marginBottom: 8 }}>
                  {profile.name}
                </h3>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: tok.t2, lineHeight: 1.5, margin: "0 0 10px" }}>
                  {profile.headline}
                </p>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: tok.t1, lineHeight: 1.45, margin: 0 }}>
                  Siguiente paso: {profile.nextStep}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div variants={fadeUp} style={{ marginTop: 28, maxWidth: 800 }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: tok.t3, marginBottom: 12, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Después del diagnóstico
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {path.map((step, i) => (
              <span key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "var(--font-jura)",
                    fontWeight: 700,
                    fontSize: 13,
                    color: tok.t1,
                    background: tok.card,
                    border: `1px solid ${tok.cardBorder}`,
                    borderRadius: 99,
                    padding: "6px 12px",
                  }}
                >
                  {step}
                </span>
                {i < path.length - 1 && <span style={{ color: tok.t3 }}>→</span>}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function MasterclassSection({
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
  const points = [
    "Qué cambia al pasar de consulta presencial a práctica digital.",
    "Cómo pensar el encuadre clínico en un entorno virtual.",
    "Errores frecuentes de una práctica digital improvisada.",
    "Nuevas variables técnicas y éticas de la psicoterapia online.",
    "Cómo comenzar a estructurar tu práctica digital.",
  ]

  return (
    <section
      id="masterclass"
      style={{
        background: tok.bgAlt,
        padding: "clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)",
        scrollMarginTop: 88,
      }}
    >
      <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "clamp(28px, 5vw, 48px)",
            alignItems: "start",
          }}
        >
          <div>
            <motion.div variants={fadeUp} style={{ marginBottom: 22 }}>
              <SectionLabel>Masterclass gratuita</SectionLabel>
              <SectionHeading tok={tok}>Psicología clínica en la era digital</SectionHeading>
              <p style={{ marginTop: 12, fontFamily: "var(--font-inter)", fontSize: 15, color: tok.t2, lineHeight: 1.6, maxWidth: 560 }}>
                Una sesión introductoria en vivo para psicólogos que quieren comprender qué cambia realmente cuando la
                práctica clínica pasa del entorno presencial al digital.
              </p>
            </motion.div>

            <p style={{ fontFamily: "var(--font-jura)", fontWeight: 700, fontSize: 15, color: tok.t1, marginBottom: 14 }}>
              En 90 minutos
            </p>
            <ol style={{ listStyle: "none", margin: "0 0 22px", padding: 0, display: "grid", gap: 12 }}>
              {points.map((point, index) => (
                <motion.li
                  key={point}
                  variants={fadeUp}
                  style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-jura)",
                      fontWeight: 700,
                      fontSize: 14,
                      color: "#A855F7",
                      minWidth: 28,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: 15, color: tok.t1, lineHeight: 1.5 }}>
                    {point}
                  </span>
                </motion.li>
              ))}
            </ol>

            <motion.p variants={fadeUp} style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: tok.t2, lineHeight: 1.55, maxWidth: 520 }}>
              Conduce: <span style={{ color: tok.t1 }}>Mtro. Benjamín Buzali</span> — especialista en psicología clínica
              digital. Vocabulario técnico, ejemplos de práctica y criterio para operar en digital sin perder
              profundidad.
            </motion.p>
          </div>

          <motion.div variants={fadeUp} style={{ width: "100%", maxWidth: 420 }}>
            <MasterclassLeadForm
              dark={dark}
              sessionId={sessionId}
              onTrack={onTrack}
              section="masterclass"
              formId="registro-principal"
              title="Regístrate a la Masterclass gratuita en vivo"
              titleFontSize="clamp(18px, 2.2vw, 24px)"
              subtitle="Nombre y correo. Te enviamos el acceso a la sesión en vivo."
              buttonLabel="Reservar mi lugar gratis"
            />
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 13,
                color: tok.t3,
                marginTop: 12,
                textAlign: "center",
              }}
            >
              En vivo · 90 min · Grupo reducido
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

function CommunityPathSection({ dark, onReservar }: { dark: boolean; onReservar: () => void }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()
  const items = [
    { label: "Comunidad", line: "Conecta con otros profesionales interesados en práctica digital." },
    { label: "Formación", line: "Profundiza en fundamentos, herramientas y nuevas competencias." },
    { label: "Supervisión", line: "Espacios de discusión y desarrollo profesional dentro de la ruta." },
    { label: "Progresión", line: "Continúa construyendo tu práctica dentro del ecosistema Motus." },
  ]

  return (
    <section
      id="comunidad"
      style={{
        background: tok.bg,
        padding: "clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)",
      }}
    >
      <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"} style={{ maxWidth: 800 }}>
        <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
          <SectionLabel>Recorrido</SectionLabel>
          <SectionHeading tok={tok}>No es solamente una clase</SectionHeading>
          <p style={{ marginTop: 12, fontFamily: "var(--font-inter)", fontSize: 15, color: tok.t2, lineHeight: 1.6, maxWidth: 620 }}>
            Después de la masterclass puedes continuar tu recorrido dentro de MotusDAO Academy. La sesión en vivo es
            la entrada a la comunidad profesional.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
            gap: 12,
            marginBottom: 28,
          }}
        >
          {items.map((item) => (
            <motion.div
              key={item.label}
              variants={fadeUp}
              style={{
                background: tok.card,
                border: `1px solid ${tok.cardBorder}`,
                borderRadius: 14,
                padding: "16px 18px",
              }}
            >
              <p style={{ margin: 0, fontFamily: "var(--font-jura)", fontWeight: 700, fontSize: 16, color: tok.t1 }}>
                {item.label}
              </p>
              <p style={{ margin: "6px 0 0", fontFamily: "var(--font-inter)", fontSize: 14, color: tok.t2, lineHeight: 1.5 }}>
                {item.line}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp}>
          <GradientButton onClick={onReservar}>Reservar mi lugar gratis</GradientButton>
        </motion.div>
      </motion.div>
    </section>
  )
}

const GALLERY_PHOTOS = [
  {
    src: "/photo_4915935373217696687_y.jpg",
    alt: "Investigación en psicología digital: publicaciones y recursos clínicos",
    label: "Investigación",
    caption: "Conocimiento, publicaciones y recursos para profundizar tu práctica.",
  },
  {
    src: "/photo_4915935373217696688_y.jpg",
    alt: "Consultorio virtual para sesión clínica e interacción profesional",
    label: "Consultorios virtuales",
    caption: "Espacios para interacción profesional dentro del ecosistema.",
  },
  {
    src: "/photo_4915935373217696689_y.jpg",
    alt: "Recursos para organizar la práctica digital",
    label: "Práctica digital",
    caption: "Recursos para organizar honorarios, procesos y operación profesional.",
  },
  {
    src: "/photo_4915935373217696690_y.jpg",
    alt: "Formación y sesiones en vivo de MotusDAO Academy",
    label: "Academia",
    caption: "Formación profesional para psicólogos en entorno digital.",
  },
  {
    src: "/photo_4915935373217696691_y.jpg",
    alt: "Comunidad de psicólogos en MotusDAO",
    label: "Comunidad",
    caption: "Red de profesionales que operan en digital con criterio clínico.",
  },
] as const

function GlassPhotoCard({
  photo,
  index,
  dark,
  tok,
}: {
  photo: (typeof GALLERY_PHOTOS)[number]
  index: number
  dark: boolean
  tok: Tok
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 0.92", "end 0.12"],
  })
  const cardY = useTransform(scrollYProgress, [0, 1], [32, -18])
  const cardScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.98])
  const imageY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"])
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.14, 1.02, 1.1])

  return (
    <motion.div
      ref={cardRef}
      variants={fadeUp}
      style={{
        flex: "0 0 auto",
        width: "clamp(280px, 38vw, 400px)",
        y: cardY,
        scale: cardScale,
      }}
    >
      <GlassEffect
        className="rounded-2xl"
        style={{
          borderRadius: 16,
          border: `1px solid ${dark ? "rgba(147,51,234,0.28)" : "rgba(147,51,234,0.22)"}`,
          boxShadow: dark
            ? "0 24px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06)"
            : "0 20px 40px rgba(147,51,234,0.12), 0 0 0 1px rgba(14,10,26,0.06)",
        }}
      >
        <Card className="gap-0 border-0 bg-transparent py-0 shadow-none ring-0">
          <div
            className="relative overflow-hidden"
            style={{
              aspectRatio: "4 / 5",
              margin: 10,
              borderRadius: 12,
              border: `1px solid ${tok.cardBorder}`,
            }}
          >
            <motion.img
              src={photo.src}
              alt={photo.alt}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                y: imageY,
                scale: imageScale,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(14,10,26,0.72) 0%, rgba(14,10,26,0.08) 48%, transparent 72%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 14,
                bottom: 14,
                fontFamily: "var(--font-jura)",
                fontWeight: 700,
                fontSize: "clamp(36px, 5vw, 52px)",
                lineHeight: 1,
                color: "rgba(255,255,255,0.22)",
                letterSpacing: "-0.03em",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
          </div>
          <CardContent className="px-4 pb-4 pt-1">
            <h3
              style={{
                fontFamily: "var(--font-jura)",
                fontWeight: 700,
                fontSize: 16,
                color: tok.t1,
                marginBottom: 6,
                lineHeight: 1.35,
              }}
            >
              {photo.label}
            </h3>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: tok.t2, lineHeight: 1.55, margin: 0 }}>
              {photo.caption}
            </p>
          </CardContent>
        </Card>
      </GlassEffect>
    </motion.div>
  )
}

function EcosystemGallerySection({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()
  const pinWrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  useHorizontalPin(pinWrapRef, trackRef)

  return (
    <section
      id="ecosistema"
      style={{
        background: tok.bgAlt,
        padding: "clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "12%",
          right: "-8%",
          width: "min(52vw, 480px)",
          height: "min(52vw, 480px)",
          background: "radial-gradient(ellipse, rgba(147,51,234,0.14) 0%, transparent 72%)",
          pointerEvents: "none",
        }}
      />
      <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"} style={{ position: "relative" }}>
        <motion.div variants={fadeUp} style={{ marginBottom: 28, maxWidth: 620 }}>
          <SectionLabel>Ecosistema</SectionLabel>
          <SectionHeading tok={tok}>Un mismo entorno para aprender, practicar y conectar</SectionHeading>
          <p style={{ marginTop: 10, fontFamily: "var(--font-inter)", fontSize: 15, color: tok.t2, lineHeight: 1.55 }}>
            Academia, comunidad, práctica digital, consultorios virtuales e investigación — y herramientas como PsyChat
            / MotusAI con orientación humana y profesional.
          </p>
        </motion.div>

        <div
          ref={pinWrapRef}
          className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ overflowX: "auto", overflowY: "hidden", width: "100%", WebkitOverflowScrolling: "touch" }}
        >
          <div
            ref={trackRef}
            style={{
              display: "flex",
              width: "max-content",
              gap: 16,
              paddingRight: 24,
              paddingBottom: 8,
              alignItems: "stretch",
              willChange: "transform",
            }}
          >
            {GALLERY_PHOTOS.map((photo, index) => (
              <GlassPhotoCard key={photo.src} photo={photo} index={index} dark={dark} tok={tok} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function AudienceFitSection({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()
  const forYou = [
    "Ya atiendes online y quieres más estructura.",
    "Estás pensando en comenzar una práctica digital.",
    "Quieres entender qué cambia clínicamente en el entorno virtual.",
    "Te interesa la relación entre psicología, tecnología e IA.",
    "Quieres formación con marco y criterio profesional.",
    "Quieres conectar con otros psicólogos.",
  ]
  const notFor = [
    "Buscas únicamente hacks para conseguir pacientes.",
    "Esperas que una IA sustituya el criterio profesional.",
    "Buscas una certificación automática.",
    "No tienes interés en desarrollar una práctica profesional digital.",
  ]
  const builders = [
    { label: "Profesionales clínicos", line: "Experiencia y criterio para abordar los desafíos de la práctica." },
    { label: "Educadores", line: "Contenido y formación para desarrollar nuevas competencias." },
    { label: "Investigadores", line: "Conocimiento para comprender hacia dónde se dirige la psicología digital." },
    { label: "Builders", line: "Tecnología e infraestructura para convertir esas ideas en herramientas reales." },
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
      <div style={{ position: "absolute", inset: 0, opacity: dark ? 0.27 : 0.76, pointerEvents: "none" }}>
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
          <SectionHeading tok={tok}>¿Para quién es MotusDAO Academy?</SectionHeading>
        </motion.div>

        <p style={{ fontFamily: "var(--font-jura)", fontWeight: 700, fontSize: 18, color: tok.t1, marginBottom: 14 }}>
          Es para ti si…
        </p>
        <ul style={{ listStyle: "none", margin: "0 0 32px", padding: 0, display: "grid", gap: 12, maxWidth: 720 }}>
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
          <ul style={{ listStyle: "none", margin: "0 0 40px", padding: 0, display: "grid", gap: 10, maxWidth: 720 }}>
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

        <motion.div variants={fadeUp} style={{ marginBottom: 16 }}>
          <SectionLabel>Quiénes construyen Motus</SectionLabel>
          <SectionHeading tok={tok}>Una comunidad alrededor de profesionales</SectionHeading>
        </motion.div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
            gap: 12,
          }}
        >
          {builders.map((item) => (
            <motion.div
              key={item.label}
              variants={fadeUp}
              style={{
                background: tok.card,
                border: `1px solid ${tok.cardBorder}`,
                borderRadius: 14,
                padding: "16px 18px",
              }}
            >
              <p style={{ margin: 0, fontFamily: "var(--font-jura)", fontWeight: 700, fontSize: 16, color: tok.t1 }}>
                {item.label}
              </p>
              <p style={{ margin: "6px 0 0", fontFamily: "var(--font-inter)", fontSize: 14, color: tok.t2, lineHeight: 1.5 }}>
                {item.line}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function DualStartBand({
  dark,
  onDiagnostico,
  onReservar,
}: {
  dark: boolean
  onDiagnostico: () => void
  onReservar: () => void
}) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()
  const isMobile = useIsMobile()

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
        style={{ maxWidth: 720, margin: "0 auto" }}
      >
        <motion.div variants={fadeUp} style={{ marginBottom: 22 }}>
          <SectionLabel>Empieza donde estés</SectionLabel>
          <SectionHeading tok={tok}>No necesitas una práctica digital perfecta</SectionHeading>
          <p style={{ marginTop: 10, fontFamily: "var(--font-inter)", fontSize: 15, color: tok.t2, lineHeight: 1.55 }}>
            Necesitas saber dónde estás y qué quieres construir después.
          </p>
        </motion.div>
        <motion.div
          variants={fadeUp}
          style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}
        >
          <div>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: tok.t2, marginBottom: 10 }}>
              ¿Quieres descubrir tu perfil?
            </p>
            <GradientButton href="/diagnostico" onClick={onDiagnostico} full>
              Hacer mi diagnóstico
            </GradientButton>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, color: tok.t3, marginTop: 8 }}>
              Gratis · 6 preguntas · Resultado inmediato
            </p>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: tok.t2, marginBottom: 10 }}>
              ¿Prefieres empezar aprendiendo?
            </p>
            <GradientButton onClick={onReservar} variant="outline" dark={dark} full>
              Reservar mi lugar en la Masterclass
            </GradientButton>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, color: tok.t3, marginTop: 8 }}>
              Gratis · En vivo · 90 minutos · Grupo reducido
            </p>
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
      q: "¿Qué es MotusDAO Academy?",
      a: "Es el espacio de formación y comunidad de MotusDAO para profesionales que quieren desarrollar su práctica en entornos digitales.",
    },
    {
      q: "¿Necesito trabajar online actualmente?",
      a: "No. Puedes participar tanto si ya atiendes online como si estás considerando comenzar.",
    },
    {
      q: "¿La masterclass es gratuita?",
      a: "Sí. El registro es gratuito para la sesión introductoria.",
    },
    {
      q: "¿Qué es el diagnóstico?",
      a: "Es una evaluación orientativa de tu práctica digital: fortalezas, áreas de atención y un posible siguiente paso. No es un diagnóstico clínico, certificación ni evaluación de licencia profesional.",
    },
    {
      q: "¿Qué ocurre después del diagnóstico?",
      a: "Recibes un perfil y una recomendación de siguiente paso. El camino concreto de entrada es la masterclass en vivo, y desde ahí comunidad y formación.",
    },
    {
      q: "¿La IA sustituye al psicólogo en Motus?",
      a: "No. Motus mantiene un enfoque de tecnología asistiva y revisión profesional humana.",
    },
    {
      q: "¿Puedo entrar a la comunidad aunque sea principiante?",
      a: "Sí. La comunidad está pensada para profesionales y perfiles interesados en desarrollar su práctica digital.",
    },
  ]

  return (
    <section style={{ background: tok.bg, padding: "clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)" }}>
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

function FinalCTA({
  dark,
  onDiagnostico,
  onReservar,
}: {
  dark: boolean
  onDiagnostico: () => void
  onReservar: () => void
}) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()
  const isMobile = useIsMobile()

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: tok.bgAlt,
        padding: "clamp(80px, 14vh, 160px) clamp(24px, 6vw, 120px)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 300,
          background: "radial-gradient(ellipse, rgba(236,72,153,0.07) 0%, transparent 70%)",
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
          Tu práctica. Tu criterio. Tu siguiente etapa.
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
          Empieza con MotusDAO Academy.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 12,
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          <GradientButton href="/diagnostico" onClick={onDiagnostico} full={isMobile}>
            Descubrir mi perfil
          </GradientButton>
          <GradientButton onClick={onReservar} variant="outline" dark={dark} full={isMobile}>
            Reservar mi lugar gratis
          </GradientButton>
        </div>
      </div>
    </motion.section>
  )
}

function Footer({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light

  return (
    <footer
      style={{
        background: tok.bg,
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
        <img src="/logo.svg" alt="MotusDAO logo" style={{ width: 20, height: 20, borderRadius: 6, objectFit: "cover" }} />
        <span style={{ fontFamily: "var(--font-jura)", fontWeight: 700, fontSize: 14, color: tok.t3 }}>
          MotusDAO Academy · Formación · Comunidad · Práctica Digital
        </span>
      </div>
      <span style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: tok.t3 }}>
        © 2026 MotusDAO · Todos los derechos reservados
      </span>
    </footer>
  )
}

function StickyConversionBar({
  masterclassInView,
  onDiagnostico,
  onReservar,
}: {
  masterclassInView: boolean
  onDiagnostico: () => void
  onReservar: () => void
}) {
  return (
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
          {masterclassInView
            ? "Masterclass gratuita en vivo · 90 min · grupo reducido"
            : "¿Qué tipo de psicólogo digital eres?"}
        </span>
        {masterclassInView ? (
          <button
            type="button"
            onClick={onReservar}
            className="rounded-md border border-white/30 bg-white/10 px-2 py-1 text-xs font-semibold text-white hover:bg-white/20"
          >
            Reservar mi lugar
          </button>
        ) : (
          <Link
            href="/diagnostico"
            onClick={onDiagnostico}
            className="rounded-md border border-white/30 bg-white/10 px-2 py-1 text-xs font-semibold text-white hover:bg-white/20"
          >
            Descubrir mi perfil
          </Link>
        )}
      </div>
    </div>
  )
}

function Landing() {
  const searchParams = useSearchParams()
  const claseFirst = searchParams.get("intent") === "clase"
  const [dark, setDark] = useState(true)
  const [sessionId, setSessionId] = useState<string>("")
  const [masterclassInView, setMasterclassInView] = useState(false)
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
    setSessionId(getOrCreateSessionId())
  }, [])

  useEffect(() => {
    if (!sessionId) return
    onTrack("page_view", { section: "landing", intent: claseFirst ? "clase" : "perfil" })
  }, [sessionId])

  useEffect(() => {
    if (window.location.hash === "#masterclass") {
      const timer = window.setTimeout(() => {
        scrollToId("registro-principal", "registro-principal-nombre")
      }, 200)
      return () => window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const el = document.getElementById("masterclass")
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setMasterclassInView(entry.isIntersecting),
      { threshold: 0.28, rootMargin: "-72px 0px -30% 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleDiagnostico = (section: string) => {
    onTrack("cta_click", { section, ctaLabel: "Descubrir mi perfil", intent: "lead" })
  }

  const handleReservar = (section: string) => {
    onTrack("cta_click", { section, ctaLabel: "Reservar mi lugar", intent: "lead" })
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
      <Nav dark={dark} onToggle={() => setDark((d) => !d)} onDiagnostico={() => handleDiagnostico("nav")} />
      <Hero
        dark={dark}
        claseFirst={claseFirst}
        onPrimaryCta={() => handleDiagnostico("hero")}
        onReservar={() => handleReservar("hero")}
      />
      <AcademyIntroSection dark={dark} />
      <DiagnosticSection dark={dark} onDiagnostico={() => handleDiagnostico("diagnostico")} />
      <MasterclassSection dark={dark} sessionId={sessionId} onTrack={onTrack} />
      <CommunityPathSection dark={dark} onReservar={() => handleReservar("community")} />
      <EcosystemGallerySection dark={dark} />
      <AudienceFitSection dark={dark} />
      <DualStartBand
        dark={dark}
        onDiagnostico={() => handleDiagnostico("mid_funnel")}
        onReservar={() => handleReservar("mid_funnel")}
      />
      <ObjectionFaq dark={dark} />
      <FinalCTA
        dark={dark}
        onDiagnostico={() => handleDiagnostico("final")}
        onReservar={() => handleReservar("final")}
      />
      <StickyConversionBar
        masterclassInView={masterclassInView}
        onDiagnostico={() => handleDiagnostico("sticky")}
        onReservar={() => handleReservar("sticky")}
      />
      <Footer dark={dark} />
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: T.dark.bg }} />}>
      <Landing />
    </Suspense>
  )
}
