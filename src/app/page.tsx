// S1: oferta y ruta profesional PSM. Compra e Index se integran en slices posteriores.
"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { LiquidGradientBackground } from "@/components/hero/LiquidGradientBackground"
import { GlassEffect, GlassFilter } from "@/components/ui/liquid-glass"
import { getOrCreateSessionId, getStoredLeadContext, type FunnelEventName } from "@/lib/funnel-session"
import { membershipUrl, INVITATION_CONTACT_URL, type MembershipPlan } from "@/lib/membership-links"
import { LANDING_ASSESSMENT, LANDING_ASSESSMENT_COPY, landingAssessmentPath } from "@/lib/active-assessment"
import { genericShareDraft } from "@/lib/share-card"
import { ShareInviteButton } from "@/components/share/ShareModal"
import { AppExperience } from "@/components/landing/AppExperience"
import { MembershipResources } from "@/components/landing/MembershipResources"
import { ScrollSplitCard } from "@/components/ui/scroll-split-card"
import { GRAD, T, type Tok } from "@/lib/landing-theme"
import { BookOpen, Map, Users } from "lucide-react"

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
  dark = true,
}: {
  children: React.ReactNode
  small?: boolean
  full?: boolean
  href?: string
  onClick?: () => void
  variant?: "primary" | "outline"
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
    <motion.button type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClick} style={style}>
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

function PillarCard({
  label,
  line,
  tok,
}: {
  label: string
  line: string
  tok: Tok
}) {
  return (
    <motion.div
      variants={fadeUp}
      style={{
        background: tok.card,
        border: `1px solid ${tok.cardBorder}`,
        borderRadius: 14,
        padding: "16px 18px",
      }}
    >
      <p style={{ margin: 0, fontFamily: "var(--font-jura)", fontWeight: 700, fontSize: 16, color: tok.t1 }}>{label}</p>
      <p style={{ margin: "6px 0 0", fontFamily: "var(--font-inter)", fontSize: 14, color: tok.t2, lineHeight: 1.5 }}>
        {line}
      </p>
    </motion.div>
  )
}

function Nav({
  dark,
  onToggle,
  onMembership,
}: {
  dark: boolean
  onToggle: () => void
  onMembership: () => void
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
              <a href="#beneficios" style={linkStyle}>
                Beneficios
              </a>
              <a href="#recorrido" style={linkStyle}>
                Ruta
              </a>
              <a href="#membresia" style={linkStyle}>
                Membresía
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
                height: 44,
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
                  top: 13,
                  left: 0,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#9333EA",
                }}
              />
            </button>

            <GradientButton small href="#membresia" onClick={onMembership}>
              Elegir mi membresía
            </GradientButton>
          </div>
        </div>
      </GlassEffect>
    </nav>
  )
}

function Hero({
  dark,
  onConoce,
  onDiagnostico,
}: {
  dark: boolean
  onConoce: () => void
  onDiagnostico: () => void
}) {
  const tok = dark ? T.dark : T.light
  const isLight = !dark
  const isMobile = useIsMobile()

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
      <LiquidGradientBackground key={dark ? "dark" : "light"} dark={dark} />

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
                  padding: isMobile ? "8px 12px" : "7px 14px",
                  borderRadius: 100,
                  background: dark
                    ? "linear-gradient(135deg, rgba(50,18,72,0.42), rgba(86,34,122,0.26))"
                    : "linear-gradient(135deg, rgba(255,255,255,0.34), rgba(255,255,255,0.16))",
                  border: dark ? "1px solid rgba(192,132,252,0.34)" : "1px solid rgba(147,51,234,0.36)",
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
                  Profesionales de salud mental
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
              Dale estructura a tu práctica digital y avanza con <GradientText>MotusDAO</GradientText>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: isMobile ? 16 : "clamp(15px, 1.65vw, 17px)",
                lineHeight: 1.6,
                color: tok.t2,
                marginBottom: 22,
                maxWidth: 560,
              }}
            >
              Empieza con recursos, formación y comunidad. Continúa por una ruta de cinco bloques hacia el Portal Clínico, según tus objetivos y requisitos profesionales.
            </motion.p>

            <motion.div
              variants={fadeUp}
              style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}
            >
              <div style={{ flex: isMobile ? "1 1 100%" : "0 1 auto" }}>
                <GradientButton href="#membresia" onClick={onConoce} full={isMobile}>
                  Elegir mi membresía
                </GradientButton>
              </div>
              <div style={{ flex: isMobile ? "1 1 100%" : "0 1 auto" }}>
                <GradientButton href={landingAssessmentPath()} onClick={onDiagnostico} full={isMobile} variant="outline" dark={dark}>
                  Evaluar mi práctica
                </GradientButton>
              </div>
            </motion.div>
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 13,
                color: dark ? "rgba(255,255,255,0.72)" : "#000000",
                marginTop: 14,
                letterSpacing: "0.02em",
              }}
            >
              Membresía desde USD 20/mes · USD 120/año fundador
            </motion.p>
          </div>

          <motion.div variants={fadeUp} style={{ width: "100%", maxWidth: 420, justifySelf: "stretch" }}>
            <img
              src="/MAsterclass3.avif"
              alt="MotusDAO Academy — formación profesional para psicólogos en práctica digital"
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

function TrustBar({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const iconClass = "h-6 w-6 md:h-7 md:w-7"

  return (
    <section
      aria-label="Recursos, formación y ruta"
      style={{
        background: tok.bgAlt,
        borderTop: `1px solid ${tok.cardBorder}`,
        borderBottom: `1px solid ${tok.cardBorder}`,
      }}
    >
      <ScrollSplitCard
        imageSrc="/experience/ruta-cinco-bloques.jpg"
        imageAlt="Ilustración de la ruta de cinco bloques: Génesis, Fundamentos, Praxis, Validación y Portal Clínico"
        stickyClassName={`${dark ? "bg-[#130D22]" : "bg-[#F0ECF9]"} pb-[84px] md:pb-0`}
        startLabel="Desliza"
        endLabel="Empieza con la membresía"
        startLabelClassName="text-[#A855F7]"
        endLabelClassName={dark ? "text-white/90" : "text-[#0E0A1A]/90"}
        cards={[
          {
            title: "Recursos para tu práctica",
            description: "Manual clínico-operativo y biblioteca virtual para estructurar tu consulta digital.",
            bgColor: "#EDE8F7",
            textColor: "#0E0A1A",
            icon: <BookOpen className={iconClass} aria-hidden="true" />,
          },
          {
            title: "Formación y comunidad",
            description: "Actividades de formación continua y un espacio de práctica con otros profesionales.",
            bgColor: "#9333EA",
            textColor: "#ffffff",
            icon: <Users className={iconClass} aria-hidden="true" />,
          },
          {
            title: "Una ruta de cinco bloques",
            description: "De Génesis al Portal Clínico, según tus objetivos y requisitos profesionales.",
            bgColor: "#0E0A1A",
            textColor: "#ffffff",
            icon: <Map className={iconClass} aria-hidden="true" />,
          },
        ]}
      />
    </section>
  )
}

function BenefitsSection({ dark, onExplore }: { dark: boolean; onExplore: (id: string) => void }) {
  return <MembershipResources dark={dark} onExplore={onExplore} />
}

function DigitalPracticeDiagnosticSection({ dark, onDiagnostico }: { dark: boolean; onDiagnostico: () => void }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()

  return (
    <section
      id="diagnostico"
      style={{
        background: tok.bg,
        padding: "clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)",
        scrollMarginTop: 88,
      }}
    >
      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        style={{ maxWidth: 720 }}
      >
        <motion.div variants={fadeUp}>
          <SectionLabel>Empieza donde estás</SectionLabel>
          <SectionHeading tok={tok}>{LANDING_ASSESSMENT_COPY[LANDING_ASSESSMENT].heading}</SectionHeading>
          <p
            style={{
              marginTop: 12,
              fontFamily: "var(--font-inter)",
              fontSize: 15,
              color: tok.t2,
              lineHeight: 1.6,
              marginBottom: 22,
            }}
          >
            {LANDING_ASSESSMENT_COPY[LANDING_ASSESSMENT].lede}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <GradientButton href={landingAssessmentPath()} onClick={onDiagnostico}>
              Evaluar mi práctica
            </GradientButton>
            <ShareInviteButton draft={genericShareDraft(landingAssessmentPath())} label="Invitar a un colega" full={false} />
          </div>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: tok.t3, marginTop: 12, lineHeight: 1.5 }}>
            Orientativo · No es diagnóstico clínico ni certificación profesional.
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}

function JourneySection({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()
  const stages = [
    { label: "01 — Génesis", line: "Conoce MotusDAO y entra a la comunidad global. Acceso gratuito." },
    { label: "02 — Fundamentos", line: "Ordena tu práctica con la Membresía de Práctica Digital: USD 20/mes o USD 120/año fundador." },
    { label: "03 — Praxis", line: "Profundiza con talleres, cursos y supervisión. Taller: USD 15; supervisión: USD 50/sesión. Cursos con precio propio." },
    { label: "04 — Validación", line: "Revisión interna de requisitos para el Pase Motus Beta. Pase comunitario: USD 29/mes o USD 290/año. Pase directo por invitación: USD 79/mes o USD 790/año beta." },
    { label: "05 — Portal Clínico", line: "Opera con herramientas profesionales según aprobación y permisos. Incluido en el Pase Motus Beta durante la beta." },
  ]

  return (
    <section
      id="recorrido"
      style={{
        background: tok.bgAlt,
        padding: "clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)",
        scrollMarginTop: 88,
      }}
    >
      <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"}>
        <motion.div variants={fadeUp} style={{ marginBottom: 28, maxWidth: 720 }}>
          <SectionLabel>Una ruta progresiva</SectionLabel>
          <SectionHeading tok={tok}>Cinco bloques para avanzar contigo</SectionHeading>
          <p style={{ marginTop: 12, fontFamily: "var(--font-inter)", fontSize: 15, color: tok.t2, lineHeight: 1.6 }}>
            Empieza en Génesis y continúa con Fundamentos y Praxis. La revisión en Validación habilita el acceso al Portal Clínico mediante el pase, según los requisitos profesionales. La membresía y el pase son productos distintos.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 28 }}>
          {stages.map((stage, i) => (
            <span key={stage.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                {stage.label}
              </span>
              {i < stages.length - 1 && <span style={{ color: tok.t3 }}>→</span>}
            </span>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
            gap: 12,
          }}
        >
          {stages.map((stage) => (
            <PillarCard key={stage.label} label={stage.label} line={stage.line} tok={tok} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function MembershipSection({ dark, onContinue }: { dark: boolean; onContinue: (plan: MembershipPlan | "invitation") => void }) {
  const [plan, setPlan] = useState<MembershipPlan>("monthly")
  const tok = dark ? T.dark : T.light
  const cardStyle: React.CSSProperties = { border: `1px solid ${tok.cardBorder}`, borderRadius: 20, padding: "clamp(22px, 3vw, 36px)", background: tok.card }
  const bodyStyle: React.CSSProperties = { fontFamily: "var(--font-inter)", color: tok.t2, fontSize: 15, lineHeight: 1.65 }
  return (
    <section id="membresia" style={{ background: tok.bgAlt, padding: "clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)", scrollMarginTop: 88 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <SectionLabel>Elige tu entrada</SectionLabel>
        <SectionHeading tok={tok}>Empieza con la membresía. Avanza a tu ritmo.</SectionHeading>
        <p style={{ ...bodyStyle, maxWidth: 740, margin: "16px 0 28px" }}>La ruta comunitaria comienza con formación y recursos. La entrada profesional directa al Portal es por invitación, con revisión y onboarding.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 20, alignItems: "start" }}>
          <article style={{ ...cardStyle, background: tok.cardHighBg, borderColor: tok.cardHighBorder }}>
            <SectionLabel>Entrada comunitaria · Bloque 02</SectionLabel>
            <h3 style={{ fontFamily: "var(--font-jura)", fontWeight: 700, fontSize: 28, color: tok.t1, lineHeight: 1.2 }}>Membresía de Práctica Digital</h3>
            <p style={{ color: tok.t1, fontSize: 36, fontWeight: 700, margin: "24px 0 4px" }}>USD 20<span style={{ fontSize: 16, fontWeight: 400 }}>/mes</span></p>
            <p style={{ ...bodyStyle, marginBottom: 24 }}>o <strong style={{ color: tok.t1 }}>USD 120/año fundador</strong></p>
            <ul style={{ ...bodyStyle, paddingLeft: 20, display: "grid", gap: 10 }}>
              <li>Manual clínico-operativo y biblioteca virtual.</li>
              <li>Actividades de formación continua e introducción a PsyChat.</li>
              <li>Comunidad de práctica, recordatorios y encuentros según calendario.</li>
            </ul>
            <fieldset style={{ margin: "24px 0 18px", padding: 0, border: 0 }}>
              <legend style={{ ...bodyStyle, marginBottom: 10, color: tok.t1 }}>Elige tu plan</legend>
              <div style={{ display: "grid", gap: 10 }}>
                {(["monthly", "annual"] as const).map((value) => (
                  <label key={value} style={{ ...bodyStyle, display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, cursor: "pointer", border: `1px solid ${plan === value ? "#a855f7" : tok.cardBorder}`, color: tok.t1 }}>
                    <input type="radio" name="membership-plan" value={value} checked={plan === value} onChange={() => setPlan(value)} />
                    {value === "monthly" ? "Mensual · USD 20/mes" : "Anual fundador · USD 120/año"}
                  </label>
                ))}
              </div>
            </fieldset>
            <GradientButton full href={membershipUrl(plan)} onClick={() => onContinue(plan)}>Continuar a Fundamentos</GradientButton>
            <p style={{ ...bodyStyle, fontSize: 13, marginTop: 12 }}>Acceso gratuito durante la revisión de contenido. Tu elección no genera un cobro ni activa una suscripción.</p>
            <div style={{ borderTop: `1px solid ${tok.cardBorder}`, marginTop: 24, paddingTop: 20 }}>
              <p style={{ ...bodyStyle, margin: 0 }}><strong style={{ color: tok.t1 }}>Al continuar hacia el Portal</strong><br />El Pase Motus Beta comunitario se contrata aparte, tras la revisión de requisitos: USD 29/mes o USD 290/año.</p>
            </div>
          </article>
          <article style={cardStyle}>
            <SectionLabel>Entrada profesional · Por invitación</SectionLabel>
            <h3 style={{ fontFamily: "var(--font-jura)", fontWeight: 700, fontSize: 24, color: tok.t1 }}>Pase Motus Beta directo</h3>
            <p style={{ color: tok.t1, fontSize: 30, fontWeight: 700, margin: "24px 0 4px" }}>USD 79<span style={{ fontSize: 16, fontWeight: 400 }}>/mes</span></p>
            <p style={bodyStyle}>o <strong style={{ color: tok.t1 }}>USD 790/año beta</strong></p>
            <p style={{ ...bodyStyle, marginTop: 20 }}>Para profesionales invitados que ingresan mediante revisión y onboarding. Incluye el Portal Clínico durante la beta, según aprobación y permisos.</p>
            <p style={{ ...bodyStyle, marginTop: 16 }}>La invitación es necesaria para acceder a esta vía.</p>
            <p style={{ ...bodyStyle, margin: "16px 0" }}>Contacta al equipo para conocer los requisitos de revisión y onboarding. Enviar una consulta no concede acceso al pase.</p>
            <GradientButton full variant="outline" dark={dark} href={INVITATION_CONTACT_URL} onClick={() => onContinue("invitation")}>Consultar sobre la invitación</GradientButton>
            <p style={{ ...bodyStyle, fontSize: 13, marginTop: 12 }}>Se abrirá tu aplicación de correo. También puedes escribir a contact@motusdao.org. No envíes documentos ni datos de pacientes por esta vía.</p>
          </article>
        </div>
        <p style={{ ...bodyStyle, marginTop: 20 }}>Praxis se contrata aparte: taller USD 15 y supervisión USD 50 por sesión. Cada curso tiene su propio precio.</p>
      </div>
    </section>
  )
}

function ObjectionFaq({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()
  const faqs = [
    { q: "¿Qué incluye la membresía?", a: "Manual clínico-operativo, biblioteca virtual, actividades de formación continua, introducción a PsyChat, comunidad de práctica, recordatorios y encuentros según calendario." },
    { q: "¿Membresía y pase son lo mismo?", a: "Son productos distintos. La membresía corresponde a Fundamentos. El Pase Motus Beta habilita el Portal Clínico tras la revisión de requisitos y se paga aparte." },
    { q: "¿Los talleres y la supervisión están incluidos?", a: "Se contratan aparte en Praxis: taller USD 15 y supervisión USD 50 por sesión. Los cursos tienen precios propios." },
    { q: "¿Puedo entrar directamente al Portal?", a: "La vía profesional directa es por invitación y requiere revisión y onboarding. Su precio beta es USD 79/mes o USD 790/año." },
    { q: "¿Tengo que hacer el diagnóstico para incorporarme?", a: "No. La autoevaluación de práctica digital es gratuita y opcional. Su resultado no otorga invitación, validación ni acceso al Portal." },
    { q: "¿La ruta certifica o garantiza pacientes?", a: "La formación y la revisión interna no sustituyen tu autorización profesional ni garantizan asignación de pacientes." },
  ]

  return (
    <section style={{ background: tok.bgAlt, padding: "clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)" }}>
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

function FinalCTA({ dark, onMembership }: { dark: boolean; onMembership: () => void }) {
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
          Dale estructura a tu siguiente etapa
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
          Recursos, formación y comunidad para avanzar en tu práctica digital. Empieza por Fundamentos y conoce el recorrido hacia el Portal Clínico.
        </p>
        <GradientButton href="#membresia" onClick={onMembership}>
          Elegir mi membresía
        </GradientButton>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: tok.t3, marginTop: 14 }}>
          USD 20/mes · USD 120/año fundador
        </p>
      </div>
    </motion.section>
  )
}

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
        <img src="/logo.svg" alt="MotusDAO logo" style={{ width: 20, height: 20, borderRadius: 6, objectFit: "cover" }} />
        <span style={{ fontFamily: "var(--font-jura)", fontWeight: 700, fontSize: 14, color: tok.t3 }}>
          MotusDAO · Ruta profesional PSM
        </span>
      </div>
      <span style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: tok.t3 }}>
        © 2026 MotusDAO · Todos los derechos reservados
      </span>
    </footer>
  )
}

function StickyConversionBar({ onMembership }: { onMembership: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[95] border-t border-white/20 bg-[#160d25]/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
      <a href="#membresia" onClick={onMembership} className="block rounded-xl px-3 py-3 text-center text-sm font-semibold text-white" style={{ background: GRAD }}>Elegir mi membresía · USD 20/mes</a>
    </div>
  )
}

export default function Home() {
  const [dark, setDark] = useState(true)
  const sessionId = useRef("")
  const trackEvent = useMutation(api.leads.trackEvent)

  const onTrack = useCallback((eventName: FunnelEventName, payload: Record<string, string> = {}) => {
    if (!sessionId.current) return
    const leadCtx = getStoredLeadContext()
    const args: Parameters<typeof trackEvent>[0] = {
      eventName,
      sessionId: sessionId.current,
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
    void trackEvent(args).catch(() => { /* La navegación no depende de analítica. */ })
  }, [trackEvent])

  useEffect(() => {
    try {
      sessionId.current = getOrCreateSessionId()
      onTrack("page_view", { section: "landing" })
    } catch {
      // Storage restrictions must not block the landing.
    }
  }, [onTrack])

  const handleDiagnostico = (section: string) => {
    onTrack("cta_click", { section, ctaLabel: "Evaluar mi práctica", intent: "lead" })
  }

  const handleMembership = (section: string) => {
    onTrack("cta_click", { section, ctaLabel: "Elegir mi membresía", intent: "pay", action: "membership_cta_click" })
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
      <style>{`a:focus-visible, button:focus-visible { outline: 3px solid #c084fc; outline-offset: 4px; } @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }`}</style>
      <GlassFilter />
      <Nav dark={dark} onToggle={() => setDark((d) => !d)} onMembership={() => handleMembership("nav")} />
      <main>
        <Hero dark={dark} onConoce={() => handleMembership("hero")} onDiagnostico={() => handleDiagnostico("hero")} />
        <TrustBar dark={dark} />
        <BenefitsSection
          dark={dark}
          onExplore={(feature) => {
            onTrack("cta_click", { section: "beneficios", ctaLabel: feature, action: "resource_preview" })
            if (!feature.startsWith("filtro-")) onTrack("modal_open", { section: "beneficios", ctaLabel: feature })
          }}
        />
        <AppExperience dark={dark} onExplore={(feature) => onTrack("cta_click", { section: "experiencia", ctaLabel: feature, action: "app_feature_explore" })} />
        <JourneySection dark={dark} />
        <MembershipSection dark={dark} onContinue={(plan) => onTrack("cta_click", { section: "membresia", ctaLabel: plan === "invitation" ? "Consultar sobre la invitación" : "Continuar a Fundamentos", intent: "lead", plan, action: plan === "invitation" ? "invitation_contact_click" : "membership_review_continue" })} />
        <DigitalPracticeDiagnosticSection dark={dark} onDiagnostico={() => handleDiagnostico("diagnostico")} />
        <ObjectionFaq dark={dark} />
        <FinalCTA dark={dark} onMembership={() => handleMembership("final")} />
      </main>
      <StickyConversionBar onMembership={() => handleMembership("sticky")} />
      <Footer dark={dark} />
    </div>
  )
}
