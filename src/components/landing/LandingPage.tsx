// S1: oferta y ruta profesional PSM. Compra e Index se integran en slices posteriores.
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { GlassEffect, GlassFilter } from "@/components/ui/liquid-glass"
import { membershipUrl, INVITATION_CONTACT_URL, type MembershipPlan } from "@/lib/membership-links"
import { LANDING_ASSESSMENT, LANDING_ASSESSMENT_COPY, landingAssessmentPath } from "@/lib/active-assessment"
import {
  LANDING_ASSESSMENT_TEASER,
  LANDING_CTAS,
  LANDING_FAQS,
  LANDING_FINAL,
  LANDING_JOURNEY,
  LANDING_MEMBERSHIP,
  LANDING_HERO_SERVICES,
  LANDING_META,
  LANDING_NAV,
  LANDING_TRUST,
} from "@/content/landing"
import { genericShareDraft } from "@/lib/share-card"
import { ShareInviteButton } from "@/components/share/ShareModal"
import { AppExperience } from "@/components/landing/AppExperience"
import { MembershipResources } from "@/components/landing/MembershipResources"
import { JourneyPathCards } from "@/components/landing/JourneyPathCards"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { AgentPromptCard } from "@/components/landing/AgentPromptCard"
import { HeroBackground, HeroGlobe } from "@/components/landing/HeroVisual"
import { LiquidGradientBackground } from "@/components/hero/LiquidGradientBackground"
import { useLandingAnalytics } from "@/components/landing/useLandingAnalytics"
import { ScrollSplitCard } from "@/components/ui/scroll-split-card"
import { ErurouniShaderPanel } from "@/components/ui/erurouni-shader-panel"
import { OzzyShaderPanel } from "@/components/ui/ozzy-shader-panel"
import { ThiagoShaderPanel } from "@/components/ui/thiago-shader-panel"
import { ACCENT, T, type Tok, glassCtaStyle } from "@/lib/landing-theme"
import { GlassCta } from "@/components/ui/glass-cta"
import { CreditCard, Globe, Sparkles } from "lucide-react"

// Keep opacity at 1 in all states so SSR/HTML extractors (SEO, GEO, LLM crawlers)
// can read copy. Motion uses translate only — never hides text with opacity:0.
const fadeUp = {
  hidden: { opacity: 1, y: 28 },
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

function SavingsBadge({
  dark,
  badge,
  hint,
}: {
  dark: boolean
  badge: string
  hint?: string
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          fontFamily: "var(--font-inter)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.02em",
          color: dark ? "#0E0A1A" : "#fff",
          background: ACCENT.iris,
          borderRadius: 999,
          padding: "5px 11px",
          lineHeight: 1.25,
          maxWidth: "100%",
        }}
      >
        {badge}
      </span>
      {hint ? (
        <span
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 12,
            fontWeight: 500,
            color: dark ? "rgba(255,255,255,0.72)" : "rgba(14,10,26,0.72)",
          }}
        >
          {hint}
        </span>
      ) : null}
    </span>
  )
}

function PriceOfferLine({
  dark,
  priceLine,
  savingsBadge,
  muted,
}: {
  dark: boolean
  priceLine: string
  savingsBadge: string
  muted?: boolean
}) {
  const tok = dark ? T.dark : T.light
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "8px 12px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 13,
          color: muted ? tok.t3 : dark ? "rgba(255,255,255,0.72)" : "#000000",
          letterSpacing: "0.02em",
        }}
      >
        {priceLine}
      </span>
      <SavingsBadge dark={dark} badge={savingsBadge} />
    </div>
  )
}

function SectionLabel({ children, color = ACCENT.iris }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-inter)",
        fontSize: 12,
        fontWeight: 500,
        color,
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
              <a href={LANDING_NAV.beneficios.href} style={linkStyle}>
                {LANDING_NAV.beneficios.label}
              </a>
              <a href={LANDING_NAV.ruta.href} style={linkStyle}>
                {LANDING_NAV.ruta.label}
              </a>
              <a href={LANDING_NAV.membresia.href} style={linkStyle}>
                {LANDING_NAV.membresia.label}
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
                  background: ACCENT.iris,
                }}
              />
            </button>

            <GlassCta small href="#membresia" onClick={onMembership} dark={dark}>
              {LANDING_CTAS.membership.label}
            </GlassCta>
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
      <HeroBackground dark={dark} />

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
                  {LANDING_META.audience}
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
              {LANDING_META.headline}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: isMobile ? 16 : "clamp(15px, 1.65vw, 17px)",
                lineHeight: 1.6,
                color: tok.t2,
                marginBottom: 16,
                maxWidth: 560,
              }}
            >
              {LANDING_META.lede}
            </motion.p>

            <motion.ul
              variants={fadeUp}
              aria-label="Herramientas principales"
              style={{
                listStyle: "none",
                margin: "0 0 22px",
                padding: 0,
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                maxWidth: 560,
              }}
            >
              {LANDING_HERO_SERVICES.map((service) => (
                <li key={service.label}>
                  <GlassEffect
                    className="rounded-full"
                    style={{
                      background: dark
                        ? "linear-gradient(135deg, rgba(16, 10, 30, 0.36), rgba(38, 16, 58, 0.30))"
                        : "linear-gradient(135deg, rgba(255, 255, 255, 0.42), rgba(245, 238, 255, 0.28))",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        padding: "8px 18px",
                        fontFamily: "var(--font-jura)",
                        fontWeight: 700,
                        fontSize: 13,
                        letterSpacing: "-0.01em",
                        color: tok.t1,
                        lineHeight: 1.2,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {service.label}
                    </p>
                  </GlassEffect>
                </li>
              ))}
            </motion.ul>

            <motion.div
              variants={fadeUp}
              style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}
            >
              <div style={{ flex: isMobile ? "1 1 100%" : "0 1 auto" }}>
                <GlassCta href="#membresia" onClick={onConoce} full={isMobile} dark={dark}>
                  {LANDING_CTAS.membership.label}
                </GlassCta>
              </div>
              <div style={{ flex: isMobile ? "1 1 100%" : "0 1 auto" }}>
                <GlassCta href={landingAssessmentPath()} onClick={onDiagnostico} full={isMobile} variant="outline" dark={dark}>
                  {LANDING_CTAS.assessment.label}
                </GlassCta>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} style={{ marginTop: 14 }}>
              <PriceOfferLine
                dark={dark}
                priceLine={LANDING_META.priceLine}
                savingsBadge={LANDING_META.savingsBadge}
              />
            </motion.div>
          </div>

          <motion.div variants={fadeUp}>
            <HeroGlobe dark={dark} />
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
      aria-label="Formación, IA, pagos y comunidad"
      style={{
        background: tok.bgAlt,
        borderTop: `1px solid ${tok.cardBorder}`,
        borderBottom: `1px solid ${tok.cardBorder}`,
      }}
    >
      <ScrollSplitCard
        imageSrc="/experience/recorrido-bloques.jpg"
        imageAlt="Recorrido de cinco bloques: Génesis, Fundamentos, Praxis, Validación y Portal Clínico"
        stickyClassName={`${dark ? "bg-[#130D22]" : "bg-[#F0ECF9]"} pb-[84px]`}
        startLabel="Desliza"
        endLabel="Empieza con la membresía"
        startLabelClassName="text-[#9B8AFF]"
        endLabelClassName={dark ? "text-white/90" : "text-[#0E0A1A]/90"}
        cards={[
          {
            title: LANDING_TRUST[0].title,
            description: LANDING_TRUST[0].description,
            bgColor: "#EDE8F7",
            textColor: "#0E0A1A",
            icon: <Globe className={iconClass} color="#0E0A1A" aria-hidden="true" strokeWidth={2} />,
            media: <OzzyShaderPanel className="aspect-[5/3] min-h-[88px] w-full" dark />,
          },
          {
            title: LANDING_TRUST[1].title,
            description: LANDING_TRUST[1].description,
            bgColor: "#6E56CF",
            textColor: "#ffffff",
            icon: <Sparkles className={iconClass} color="#ffffff" aria-hidden="true" strokeWidth={2} />,
            media: <ThiagoShaderPanel className="aspect-[5/3] min-h-[88px] w-full" dark />,
            mediaClassName: "-translate-y-[20%]",
          },
          {
            title: LANDING_TRUST[2].title,
            description: LANDING_TRUST[2].description,
            bgColor: "#0E0A1A",
            textColor: "#ffffff",
            icon: <CreditCard className={iconClass} color="#ffffff" aria-hidden="true" strokeWidth={2} />,
            media: <ErurouniShaderPanel className="aspect-[5/3] min-h-[88px] w-full" dark />,
          },
        ]}
      />
    </section>
  )
}

function BenefitsSection({ dark, onExplore }: { dark: boolean; onExplore: (id: string) => void }) {
  return <MembershipResources dark={dark} onExplore={onExplore} />
}

function SectionAtmosphere({ dark }: { dark: boolean }) {
  return (
    <>
      <LiquidGradientBackground dark={dark} showControls={false} />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: dark
            ? "linear-gradient(180deg, rgba(8,5,14,0.62) 0%, rgba(14,10,26,0.78) 55%, rgba(14,10,26,0.88) 100%)"
            : "linear-gradient(180deg, rgba(244,240,252,0.55) 0%, rgba(240,236,249,0.72) 55%, rgba(240,236,249,0.86) 100%)",
        }}
      />
    </>
  )
}

function DigitalPracticeDiagnosticSection({ dark, onDiagnostico }: { dark: boolean; onDiagnostico: () => void }) {
  const tok = dark ? T.dark : T.light

  return (
    <section
      id="diagnostico"
      style={{
        background: dark ? "#0e0a1a" : "#f0ecf9",
        padding: "clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)",
        scrollMarginTop: 88,
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <SectionAtmosphere dark={dark} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 720, marginInline: "auto", textAlign: "center", color: tok.t1 }}>
        <SectionLabel>{LANDING_ASSESSMENT_TEASER.label}</SectionLabel>
        <SectionHeading tok={tok}>{LANDING_ASSESSMENT_COPY[LANDING_ASSESSMENT].heading}</SectionHeading>
        <p
          style={{
            marginTop: 12,
            marginInline: "auto",
            fontFamily: "var(--font-inter)",
            fontSize: 15,
            color: tok.t2,
            lineHeight: 1.6,
            marginBottom: 22,
          }}
        >
          {LANDING_ASSESSMENT_COPY[LANDING_ASSESSMENT].lede}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "center" }}>
          <GlassCta href={landingAssessmentPath()} onClick={onDiagnostico} dark={dark}>
            {LANDING_CTAS.assessment.label}
          </GlassCta>
          <ShareInviteButton
            draft={genericShareDraft(landingAssessmentPath())}
            label={LANDING_ASSESSMENT_TEASER.inviteColleague}
            full={false}
            dark={dark}
          />
        </div>
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 13,
            color: tok.t3,
            marginTop: 12,
            lineHeight: 1.5,
          }}
        >
          {LANDING_ASSESSMENT_TEASER.disclaimer}
        </p>
      </div>
    </section>
  )
}

function JourneySection({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light
  const stages = LANDING_JOURNEY.stages
  const communityStages = stages.slice(0, 3)
  const fastStages = stages.slice(3)

  return (
    <section
      id="recorrido"
      style={{
        background: tok.bgAlt,
        padding: "clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)",
        scrollMarginTop: 88,
      }}
    >
      <div style={{ marginBottom: 28, maxWidth: 920, marginInline: "auto", textAlign: "center" }}>
        <SectionLabel>{LANDING_JOURNEY.label}</SectionLabel>
        <SectionHeading tok={tok}>{LANDING_JOURNEY.heading}</SectionHeading>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
            marginBottom: 18,
          }}
        >
          {stages.map((stage, i) => (
            <span key={stage.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontFamily: "var(--font-jura)",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#ffffff",
                  background: ACCENT.deep,
                  border: `1px solid ${ACCENT.iris}`,
                  borderRadius: 99,
                  padding: "7px 14px",
                }}
              >
                {stage.label}
              </span>
              {i < stages.length - 1 && <span style={{ color: ACCENT.iris }}>→</span>}
            </span>
          ))}
        </div>

        <p
          style={{
            margin: "0 auto",
            maxWidth: 720,
            fontFamily: "var(--font-inter)",
            fontSize: 15,
            color: tok.t2,
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          {LANDING_JOURNEY.lede}
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p
          style={{
            margin: "0 0 14px",
            fontFamily: "var(--font-inter)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: ACCENT.iris,
            textAlign: "center",
          }}
        >
          {LANDING_JOURNEY.communityPathLabel}
        </p>
        <JourneyPathCards stages={communityStages} dark={dark} variant="community" />

        <div style={{ marginTop: 36, marginBottom: 14, textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-inter)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: ACCENT.iris,
            }}
          >
            {LANDING_JOURNEY.fastPathLabel}
          </p>
          <p
            style={{
              margin: "8px auto 0",
              maxWidth: 560,
              fontFamily: "var(--font-inter)",
              fontSize: 14,
              color: tok.t2,
              lineHeight: 1.55,
            }}
          >
            {LANDING_JOURNEY.fastPathNote}
          </p>
        </div>

        <JourneyPathCards stages={fastStages} dark={dark} variant="fast" />
      </div>
    </section>
  )
}

function MembershipSection({
  dark,
  onContinue,
  onAgentPromptCopy,
}: {
  dark: boolean
  onContinue: (plan: MembershipPlan | "invitation") => void
  onAgentPromptCopy?: () => void
}) {
  const [plan, setPlan] = useState<MembershipPlan>("monthly")
  const tok = dark ? T.dark : T.light
  const copy = LANDING_MEMBERSHIP
  const communityAccent = ACCENT.pink
  const invitationAccent = dark ? "#67E8F9" : "#0891B2"
  const communityCard: React.CSSProperties = {
    border: `1px solid ${dark ? "rgba(244,114,182,0.42)" : "rgba(236,72,153,0.32)"}`,
    borderRadius: 20,
    padding: "clamp(22px, 3vw, 36px)",
    background: dark
      ? "linear-gradient(165deg, rgba(244,114,182,0.14) 0%, rgba(14,10,26,0.55) 42%, rgba(14,10,26,0.82) 100%)"
      : "linear-gradient(165deg, rgba(251,113,133,0.16) 0%, rgba(255,255,255,0.88) 48%, rgba(248,246,255,0.96) 100%)",
    boxShadow: dark
      ? "0 0 0 1px rgba(253,230,255,0.08), 0 0 36px rgba(244,114,182,0.16), 0 18px 40px rgba(8,4,20,0.35)"
      : "0 0 0 1px rgba(244,114,182,0.08), 0 14px 32px rgba(190,24,93,0.08)",
  }
  const invitationCard: React.CSSProperties = {
    border: `1px solid ${dark ? "rgba(103,232,249,0.28)" : "rgba(8,145,178,0.24)"}`,
    borderRadius: 20,
    padding: "clamp(22px, 3vw, 36px)",
    background: dark
      ? "linear-gradient(165deg, rgba(34,211,238,0.08) 0%, rgba(14,10,26,0.72) 45%, rgba(14,10,26,0.9) 100%)"
      : "linear-gradient(165deg, rgba(165,243,252,0.35) 0%, rgba(255,255,255,0.92) 50%, rgba(240,249,255,0.98) 100%)",
    boxShadow: dark
      ? "0 0 28px rgba(34,211,238,0.08), 0 16px 36px rgba(8,4,20,0.28)"
      : "0 12px 28px rgba(8,145,178,0.06)",
  }
  const bodyStyle: React.CSSProperties = { fontFamily: "var(--font-inter)", color: tok.t2, fontSize: 15, lineHeight: 1.65 }
  return (
    <section id="membresia" style={{ background: tok.bgAlt, padding: "clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)", scrollMarginTop: 88 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <SectionLabel>{copy.label}</SectionLabel>
        <SectionHeading tok={tok}>{copy.heading}</SectionHeading>
        <p style={{ ...bodyStyle, maxWidth: 740, margin: "16px 0 28px" }}>{copy.lede}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 20, alignItems: "start" }}>
          <article style={communityCard}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-inter)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: communityAccent,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                }}
              >
                {copy.community.label}
              </p>
              <span
                style={{
                  flexShrink: 0,
                  fontFamily: "var(--font-inter)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: dark ? "#0E0A1A" : "#fff",
                  background: communityAccent,
                  borderRadius: 999,
                  padding: "5px 10px",
                }}
              >
                Recomendado
              </span>
            </div>
            <h3 style={{ fontFamily: "var(--font-jura)", fontWeight: 700, fontSize: 28, color: tok.t1, lineHeight: 1.2 }}>{copy.community.title}</h3>
            <p style={{ color: communityAccent, fontSize: 36, fontWeight: 700, margin: "24px 0 4px" }}>
              {copy.community.priceMonthlyLabel}
              <span style={{ fontSize: 16, fontWeight: 400, color: tok.t2 }}>{copy.community.priceMonthlySuffix}</span>
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 12px", marginBottom: 24 }}>
              <p style={{ ...bodyStyle, margin: 0 }}>
                o <strong style={{ color: tok.t1 }}>{copy.community.priceAnnual}</strong>
              </p>
              <SavingsBadge dark={dark} badge={copy.community.savingsBadge} />
            </div>
            <ul style={{ ...bodyStyle, paddingLeft: 20, display: "grid", gap: 10 }}>
              {copy.community.includes.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <fieldset style={{ margin: "24px 0 18px", padding: 0, border: 0 }}>
              <legend style={{ ...bodyStyle, marginBottom: 10, color: tok.t1 }}>{copy.community.planLegend}</legend>
              <div style={{ display: "grid", gap: 10 }}>
                {(["monthly", "annual"] as const).map((value) => (
                  <label
                    key={value}
                    style={{
                      ...bodyStyle,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 14px",
                      borderRadius: 10,
                      cursor: "pointer",
                      border: `1px solid ${plan === value ? communityAccent : tok.cardBorder}`,
                      background: plan === value ? (dark ? "rgba(244,114,182,0.10)" : "rgba(244,114,182,0.08)") : "transparent",
                      color: tok.t1,
                    }}
                  >
                    <input type="radio" name="membership-plan" value={value} checked={plan === value} onChange={() => setPlan(value)} />
                    <span style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, flex: 1 }}>
                      {value === "monthly" ? copy.community.planMonthly : copy.community.planAnnual}
                      {value === "annual" ? <SavingsBadge dark={dark} badge={copy.community.savingsBadge} /> : null}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <GlassCta full href={membershipUrl(plan)} onClick={() => onContinue(plan)} dark={dark}>
              {copy.community.continueLabel}
            </GlassCta>
            <p style={{ ...bodyStyle, fontSize: 13, marginTop: 12 }}>{copy.community.continueNote}</p>
            <div style={{ borderTop: `1px solid ${dark ? "rgba(244,114,182,0.22)" : "rgba(236,72,153,0.18)"}`, marginTop: 24, paddingTop: 20 }}>
              <p style={{ ...bodyStyle, margin: 0 }}>
                <strong style={{ color: tok.t1 }}>{copy.community.portalNoteTitle}</strong>
                <br />
                {copy.community.portalNoteBody}
              </p>
            </div>
          </article>
          <article style={invitationCard}>
            <SectionLabel color={invitationAccent}>{copy.invitation.label}</SectionLabel>
            <h3 style={{ fontFamily: "var(--font-jura)", fontWeight: 700, fontSize: 24, color: tok.t1 }}>{copy.invitation.title}</h3>
            <p style={{ color: invitationAccent, fontSize: 30, fontWeight: 700, margin: "24px 0 4px" }}>
              {copy.invitation.priceMonthlyLabel}
              <span style={{ fontSize: 16, fontWeight: 400, color: tok.t2 }}>{copy.invitation.priceMonthlySuffix}</span>
            </p>
            <p style={bodyStyle}>
              o <strong style={{ color: tok.t1 }}>{copy.invitation.priceAnnual}</strong>
            </p>
            <p style={{ ...bodyStyle, marginTop: 20 }}>{copy.invitation.body}</p>
            <p style={{ ...bodyStyle, marginTop: 16 }}>{copy.invitation.inviteRequired}</p>
            <p style={{ ...bodyStyle, margin: "16px 0" }}>{copy.invitation.contactNote}</p>
            <GlassCta full variant="outline" dark={dark} href={INVITATION_CONTACT_URL} onClick={() => onContinue("invitation")}>
              {copy.invitation.ctaLabel}
            </GlassCta>
            <p style={{ ...bodyStyle, fontSize: 13, marginTop: 12 }}>{copy.invitation.emailNote}</p>
          </article>
        </div>
        <AgentPromptCard dark={dark} onCopy={onAgentPromptCopy} />
        <p style={{ ...bodyStyle, marginTop: 20 }}>{copy.praxisNote}</p>
      </div>
    </section>
  )
}

function ObjectionFaq({ dark }: { dark: boolean }) {
  const tok = dark ? T.dark : T.light

  return (
    <section style={{ background: tok.bgAlt, padding: "clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)" }}>
      <div style={{ marginBottom: 28 }}>
        <SectionLabel>FAQ</SectionLabel>
        <SectionHeading tok={tok}>Preguntas frecuentes</SectionHeading>
      </div>
      <div style={{ display: "grid", gap: 10, maxWidth: 800, margin: "0 auto" }}>
        {LANDING_FAQS.map((item) => (
          <div
            key={item.question}
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
              {item.question}
            </h3>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: tok.t2, lineHeight: 1.55, margin: 0 }}>
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

function FinalCTA({ dark, onMembership }: { dark: boolean; onMembership: () => void }) {
  const tok = dark ? T.dark : T.light

  return (
    <section
      style={{
        background: dark ? "#0e0a1a" : "#f0ecf9",
        padding: "clamp(52px, 8vh, 88px) clamp(24px, 6vw, 120px) clamp(40px, 6vh, 64px)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <SectionAtmosphere dark={dark} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 560, margin: "0 auto", color: tok.t1 }}>
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
          {LANDING_FINAL.heading}
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
          {LANDING_FINAL.lede}
        </p>
        <GlassCta href="#membresia" onClick={onMembership} dark={dark}>
          {LANDING_CTAS.membership.label}
        </GlassCta>
        <div style={{ marginTop: 14 }}>
          <PriceOfferLine
            dark={dark}
            priceLine={LANDING_FINAL.priceLine}
            savingsBadge={LANDING_FINAL.savingsBadge}
            muted
          />
        </div>
      </div>
    </section>
  )
}

/** Height of sticky CTA chrome (pt + button), excluding safe-area — Motty clears this via CSS var. */
const STICKY_CTA_CONTENT_H = "72px"

function StickyConversionBar({ onMembership }: { onMembership: () => void }) {
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty(
      "--landing-sticky-cta-offset",
      `calc(${STICKY_CTA_CONTENT_H} + env(safe-area-inset-bottom, 0px))`,
    )
    return () => {
      root.style.removeProperty("--landing-sticky-cta-offset")
    }
  }, [])

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[95] border-t border-white/20 bg-[#160d25]/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-xl">
      <a
        href="#membresia"
        onClick={onMembership}
        className="mx-auto block max-w-xl text-center text-sm font-semibold"
        style={{ ...glassCtaStyle({ dark: true, full: true, small: true }), padding: "12px 16px" }}
      >
        {LANDING_CTAS.membershipSticky.label}
      </a>
    </div>
  )
}

export default function LandingPage() {
  const [dark, setDark] = useState(true)
  const { onTrack } = useLandingAnalytics()

  useEffect(() => {
    document.documentElement.dataset.landingTheme = dark ? "dark" : "light"
  }, [dark])

  const handleDiagnostico = (section: string) => {
    onTrack("cta_click", { section, ctaLabel: LANDING_CTAS.assessment.label, intent: "lead" })
  }

  const handleMembership = (section: string) => {
    onTrack("cta_click", {
      section,
      ctaLabel: LANDING_CTAS.membership.label,
      intent: "pay",
      action: "membership_cta_click",
    })
  }

  return (
    <div
      style={{
        background: dark ? T.dark.bg : T.light.bg,
        transition: "background 0.35s ease",
        minHeight: "100vh",
      }}
    >
      <style>{`a:focus-visible, button:focus-visible { outline: 3px solid ${ACCENT.iris}; outline-offset: 4px; } @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }`}</style>
      <GlassFilter />
      <Nav dark={dark} onToggle={() => setDark((d) => !d)} onMembership={() => handleMembership("nav")} />
      <main>
        <Hero
          dark={dark}
          onConoce={() => handleMembership("hero")}
          onDiagnostico={() => handleDiagnostico("hero")}
        />
        <TrustBar dark={dark} />
        <BenefitsSection
          dark={dark}
          onExplore={(feature) => {
            onTrack("cta_click", { section: "beneficios", ctaLabel: feature, action: "resource_select" })
          }}
        />
        <AppExperience dark={dark} onExplore={(feature) => onTrack("cta_click", { section: "experiencia", ctaLabel: feature, action: "app_feature_explore" })} />
        <JourneySection dark={dark} />
        <MembershipSection
          dark={dark}
          onContinue={(plan) =>
            onTrack("cta_click", {
              section: "membresia",
              ctaLabel: plan === "invitation" ? LANDING_MEMBERSHIP.invitation.ctaLabel : LANDING_MEMBERSHIP.community.continueLabel,
              intent: "lead",
              plan,
              action: plan === "invitation" ? "invitation_contact_click" : "membership_review_continue",
            })
          }
          onAgentPromptCopy={() =>
            onTrack("cta_click", {
              section: "membresia",
              ctaLabel: "Copiar prompt",
              action: "agent_prompt_copy",
              intent: "lead",
            })
          }
        />
        <DigitalPracticeDiagnosticSection dark={dark} onDiagnostico={() => handleDiagnostico("diagnostico")} />
        <ObjectionFaq dark={dark} />
        <FinalCTA dark={dark} onMembership={() => handleMembership("final")} />
      </main>
      <StickyConversionBar onMembership={() => handleMembership("sticky")} />
      <LandingFooter dark={dark} />
    </div>
  )
}
