"use client"

import { LiquidGradientBackground } from "@/components/hero/LiquidGradientBackground"
import { GlobePulse } from "@/components/ui/cobe-globe-pulse"
import { ACCENT } from "@/lib/landing-theme"

/** Client island: liquid gradient + glow behind hero copy. */
export function HeroBackground({ dark }: { dark: boolean }) {
  return (
    <>
      <LiquidGradientBackground key={dark ? "dark" : "light"} dark={dark} />
      <div
        style={{
          position: "absolute",
          top: "28%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(720px, 95vw)",
          height: 420,
          background: `radial-gradient(ellipse, ${ACCENT.glow} 0%, transparent 72%)`,
          pointerEvents: "none",
          zIndex: 1,
        }}
        aria-hidden
      />
    </>
  )
}

/** Client island: interactive globe (canvas). */
export function HeroGlobe({ dark }: { dark: boolean }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        justifySelf: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-8%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${ACCENT.glow} 0%, transparent 70%)`,
          pointerEvents: "none",
          opacity: dark ? 0.55 : 0.35,
        }}
        aria-hidden
      />
      <GlobePulse
        className="mx-auto w-full max-w-[420px]"
        markers={[
          { id: "mexico", location: [19.43, -99.13], delay: 0 },
          { id: "argentina", location: [-34.6, -58.38], delay: 0.5 },
        ]}
      />
    </div>
  )
}
