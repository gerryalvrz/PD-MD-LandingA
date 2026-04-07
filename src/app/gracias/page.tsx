type Flow = "lead" | "compra" | "llamada"

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
    title: "Registro recibido",
    body: "Gracias. Te contactaremos pronto. Si ya estas listo, puedes asegurar tu lugar ahora.",
    primary: { label: "Pagar ahora", href: process.env.NEXT_PUBLIC_CHECKOUT_URL || "/" },
    secondary: { label: "Agendar llamada", href: process.env.NEXT_PUBLIC_CALENDLY_URL || "/" },
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
        background: "linear-gradient(180deg, #0E0A1A 0%, #130D22 100%)",
        padding: 24,
      }}
    >
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
          <a
            href={content.secondary.href}
            style={{
              textDecoration: "none",
              padding: "12px 20px",
              borderRadius: 10,
              color: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(255,255,255,0.2)",
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
            }}
          >
            {content.secondary.label}
          </a>
        </div>
      </section>
    </main>
  )
}
