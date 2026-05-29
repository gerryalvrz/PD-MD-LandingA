import { LiquidGradientBackground } from "@/components/hero/LiquidGradientBackground"
import { LeadRedirectNotice } from "./LeadRedirectNotice"

type Flow = "lead" | "compra" | "llamada"

const LUMA_MASTERCLASS_URL =
  process.env.NEXT_PUBLIC_LUMA_MASTERCLASS_URL || "https://luma.com/mc1q69io?tk=SoXcZN"

function getContent(flow: Flow) {
  if (flow === "compra") {
    return {
      title: "Pago confirmado",
      body: "Tu lugar esta reservado. Revisa tu correo para instrucciones de acceso y siguientes pasos.",
      primary: { label: "Volver al inicio", href: "/" },
      secondary: { label: "Agendar llamada de onboarding", href: process.env.NEXT_PUBLIC_CALENDLY_URL || "/" },
    }
  }
  if (flow === "llamada") {
    return {
      title: "Llamada agendada",
      body: "Perfecto. Prepara tus objetivos clinicos para aprovechar al maximo la sesion.",
      primary: { label: "Ir al inicio", href: "/" },
      secondary: { label: "Pagar ahora", href: process.env.NEXT_PUBLIC_CHECKOUT_URL || "/" },
    }
  }
  return {
    title: "Falta 1 paso para completar tu registro",
    body: "Tu registro inicial fue recibido. Para apartar tu lugar y recibir recordatorios, debes confirmar tu asistencia en Luma.",
    primary: { label: "Completar registro en Luma", href: LUMA_MASTERCLASS_URL },
  }
}

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ flow?: string }>
}) {
  const params = await searchParams
  const flow = params.flow === "compra" || params.flow === "llamada" ? params.flow : "lead"
  const content = getContent(flow as Flow)

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#000",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <LiquidGradientBackground dark={true} showControls={false} />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(8,5,14,0.72) 0%, rgba(15,9,24,0.82) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <section
        style={{
          width: "100%",
          maxWidth: 680,
          borderRadius: 20,
          border: "1px solid rgba(147,51,234,0.35)",
          background: "rgba(255,255,255,0.04)",
          padding: "40px 28px",
          textAlign: "center",
          color: "rgba(255,255,255,0.92)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-jura)",
            fontWeight: 700,
            fontSize: "clamp(30px, 4vw, 44px)",
            marginBottom: 12,
          }}
        >
          {content.title}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 16,
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.72)",
            marginBottom: 28,
          }}
        >
          {content.body}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <a
            href={content.primary.href}
            style={{
              textDecoration: "none",
              padding: "12px 20px",
              borderRadius: 10,
              color: "#fff",
              fontFamily: "var(--font-inter)",
              fontWeight: 600,
              background: "linear-gradient(to right, #9333EA, #EC4899)",
            }}
          >
            {content.primary.label}
          </a>
        </div>
        <LeadRedirectNotice enabled={flow === "lead"} href={content.primary.href} seconds={5} />
      </section>
    </main>
  )
}
