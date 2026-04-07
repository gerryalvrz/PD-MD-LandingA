// Landing page for: MotusDAO — Técnica Avanzada en Psicoterapia
"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"

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
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: GRAD,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1L11 9.5H1L6 1Z" fill="white" fillOpacity="0.95" />
          </svg>
        </div>
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
      </div>

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

        <div onClick={onCta}><GradientButton small>Inscribirme</GradientButton></div>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ dark, onCta }: { dark: boolean; onCta: () => void }) {
  const tok = dark ? T.dark : T.light

  const stats = [
    { value: "100+", label: "psicólogos formados" },
    { value: "10+", label: "países en LATAM" },
    { value: "8", label: "semanas intensivas" },
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
            fontSize: "clamp(36px, 6vw, 72px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: tok.t1,
            marginBottom: 24,
          }}
        >
          Actualiza tu práctica.{" "}
          <GradientText>Lidera la psicología digital.</GradientText>
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
          El programa que integra análisis clínico avanzado e inteligencia
          artificial — para psicólogos que saben que su práctica tiene más
          potencial.
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
          <div onClick={onCta}><GradientButton>Inscribirme</GradientButton></div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onCta}
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
            Ver el programa
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
                      ? "rgba(147,51,234,0.12)"
                      : "rgba(147,51,234,0.09)",
                  border:
                    i === 0 ? "none" : "1px solid rgba(147,51,234,0.28)",
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
                    color: i === 0 ? "#fff" : "#A855F7",
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
      initials: "MR",
      name: "M. Rodríguez",
      role: "Psicóloga clínica · México",
      quote:
        "Este programa cambió la manera en que conceptualizo mis casos. El nivel técnico es real, no superficial. Salí con herramientas que aplico desde la primera sesión.",
    },
    {
      initials: "AG",
      name: "A. González",
      role: "Psicoterapeuta · Colombia",
      quote:
        "Por fin un programa que integra IA sin perder el foco clínico. Benjamin enseña con un rigor y una claridad que no encontré en ninguna otra formación de posgrado.",
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

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing({ dark, onCta }: { dark: boolean; onCta: () => void }) {
  const tok = dark ? T.dark : T.light
  const { ref, inView } = useReveal()

  const included = [
    "8 módulos semanales en vivo",
    "Material clínico descargable",
    "Acceso a la comunidad LATAM",
    "Sesiones de supervisión grupal",
    "Grabaciones disponibles 12 meses",
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

            <div onClick={onCta}><GradientButton full>Inscribirme ahora</GradientButton></div>
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
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            background: GRAD,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
            <path d="M6 1L11 9.5H1L6 1Z" fill="white" fillOpacity="0.95" />
          </svg>
        </div>
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
}: {
  dark: boolean
  intent: ModalIntent
  onClose: () => void
}) {
  const tok = dark ? T.dark : T.light
  const registrar = useMutation(api.leads.registrar)

  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [certificado, setCertificado] = useState(false)
  const [estado, setEstado] = useState<"idle" | "loading" | "ok" | "error">("idle")

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
      await registrar({ nombre: nombre.trim(), email: email.trim(), interes: intent, certificado })
      setEstado("ok")
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
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <input
                style={inputStyle}
                type="email"
                placeholder="Tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

  return (
    <div
      style={{
        background: dark ? T.dark.bg : T.light.bg,
        transition: "background 0.35s ease",
        minHeight: "100vh",
      }}
    >
      <Nav dark={dark} onToggle={() => setDark((d) => !d)} onCta={() => setModal("programa")} />
      <Hero dark={dark} onCta={() => setModal("programa")} />
      <TrustBar dark={dark} />
      <WhatYouBuild dark={dark} />
      <EightWeeks dark={dark} />
      <Testimonials dark={dark} />
      <Pricing dark={dark} onCta={() => setModal("programa")} />
      <FinalCTA dark={dark} onCta={() => setModal("llamada")} />
      <Footer dark={dark} />

      <AnimatePresence>
        {modal && (
          <LeadModal dark={dark} intent={modal} onClose={() => setModal(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
