import { ImageResponse } from "next/og"

export const ASSESSMENT_OG_SIZE = { width: 1200, height: 630 }
export const ASSESSMENT_OG_TYPE = "image/png"

/** Generic campaign card. Never pass score, band, name, or answers. */
export function assessmentOgImage(kicker: string, headline: string, detail: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #1a1230 0%, #0e0a1a 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#c084fc",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            MotusDAO · {kicker}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 36,
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: -1,
              maxWidth: 980,
            }}
          >
            {headline}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 28,
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.4,
              maxWidth: 920,
            }}
          >
            {detail}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "flex-start",
              height: 52,
              padding: "0 22px",
              borderRadius: 12,
              background: "linear-gradient(to right, #9333ea, #ec4899)",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            Evalúa tu práctica
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 16,
              fontSize: 20,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Autoevaluación orientativa · no es certificación
          </div>
        </div>
      </div>
    ),
    { ...ASSESSMENT_OG_SIZE },
  )
}
