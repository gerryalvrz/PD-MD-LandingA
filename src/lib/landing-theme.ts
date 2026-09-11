import type { CSSProperties } from "react"

/**
 * Motus candy-glass design system — canonical source for PD-MD-LandingA and downstream apps.
 * Propagate by copying this file + `glass-cta.tsx` + `:root` motus-* vars in `globals.css`.
 * @see `.cursor/skills/pd-md-landing-design/reference.md` § Candy glass (locked)
 */
export const MOTUS_CANDY_GLASS_VERSION = "1.0.0"

export const T = {
  dark: {
    bg: "#0E0A1A",
    bgAlt: "#130D22",
    t1: "rgba(255,255,255,0.92)",
    t2: "rgba(255,255,255,0.52)",
    t3: "rgba(255,255,255,0.28)",
    card: "rgba(255,255,255,0.04)",
    cardBorder: "rgba(255,255,255,0.08)",
    cardHighBg: "rgba(110,86,207,0.10)",
    cardHighBorder: "rgba(155,138,255,0.32)",
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
    cardHighBg: "rgba(110,86,207,0.08)",
    cardHighBorder: "rgba(110,86,207,0.28)",
    navBg: "rgba(248,246,255,0.88)",
    navBorder: "rgba(0,0,0,0.07)",
    toggleTrack: "rgba(0,0,0,0.10)",
  },
} as const

export type Tok = (typeof T)["dark"] | (typeof T)["light"]

/**
 * Motus iris + candy glass hues.
 * Candy pink/purple appear only as transparent washes inside `glassCtaStyle` — never as opaque fills.
 */
export const ACCENT = {
  iris: "#9B8AFF",
  deep: "#6E56CF",
  lilac: "#C9C0FF",
  neon: "#F5E8FF",
  pink: "#F472B6",
  /** Candy-wash hues (transparent layers only) */
  candyPink: "#EC4899",
  candyPurple: "#A855F7",
  wash: "rgba(110, 86, 207, 0.14)",
  border: "rgba(155, 138, 255, 0.48)",
  glow: "rgba(110, 86, 207, 0.14)",
  danger: "#E11D48",
} as const

/** Frost highlight on top of candy fill (glass shine). */
export const GLASS_CTA_SHINE_DARK =
  "linear-gradient(180deg, rgba(255,255,255,0.17) 0%, rgba(255,255,255,0.05) 34%, transparent 56%)"

export const GLASS_CTA_SHINE_LIGHT =
  "linear-gradient(180deg, rgba(255,255,255,0.36) 0%, rgba(255,255,255,0.11) 40%, transparent 62%)"

/**
 * Candy pink → purple wash. Vivid hue, low opacity — stained glass, not a flat gradient pill.
 */
export const GLASS_CTA_CANDY_FILL_DARK =
  "linear-gradient(105deg, rgba(236,72,153,0.28) 0%, rgba(244,114,182,0.25) 14%, rgba(232,121,249,0.23) 28%, rgba(192,132,252,0.21) 44%, rgba(155,138,255,0.19) 60%, rgba(124,58,237,0.17) 78%, rgba(91,33,182,0.14) 100%)"

export const GLASS_CTA_CANDY_FILL_LIGHT =
  "linear-gradient(105deg, rgba(251,113,133,0.21) 0%, rgba(244,114,182,0.19) 18%, rgba(216,180,254,0.18) 42%, rgba(167,139,250,0.16) 68%, rgba(124,58,237,0.11) 100%)"

/** Locked primary CTA fill: shine layer + candy wash. */
export const GLASS_CTA_INNER_FILL_DARK = `${GLASS_CTA_SHINE_DARK}, ${GLASS_CTA_CANDY_FILL_DARK}`

export const GLASS_CTA_INNER_FILL_LIGHT = `${GLASS_CTA_SHINE_LIGHT}, ${GLASS_CTA_CANDY_FILL_LIGHT}`

export const GLASS_CTA_NEON_SHADOW =
  "inset 0 1px 0 rgba(255,255,255,0.31), inset 0 1px 12px rgba(255,255,255,0.06), inset 0 -6px 16px rgba(91,33,182,0.06), 0 0 0 1px rgba(253,230,255,0.31), 0 0 20px rgba(244,114,182,0.23), 0 0 40px rgba(192,132,252,0.21), 0 0 68px rgba(124,58,237,0.14), 0 10px 26px rgba(8,4,20,0.28)"

export const GLASS_CTA_NEON_SHADOW_HOVER =
  "inset 0 1px 0 rgba(255,255,255,0.39), inset 0 1px 14px rgba(255,255,255,0.08), inset 0 -6px 16px rgba(91,33,182,0.08), 0 0 0 1px rgba(255,240,252,0.44), 0 0 26px rgba(244,114,182,0.29), 0 0 52px rgba(217,70,239,0.24), 0 0 76px rgba(139,92,246,0.18), 0 12px 30px rgba(8,4,20,0.3)"

export const GLASS_CTA_NEON_SHADOW_FULL =
  "inset 0 1px 0 rgba(255,255,255,0.33), inset 0 1px 14px rgba(255,255,255,0.07), inset 0 -8px 18px rgba(91,33,182,0.07), 0 0 0 1px rgba(253,230,255,0.34), 0 0 24px rgba(244,114,182,0.26), 0 0 48px rgba(192,132,252,0.23), 0 0 76px rgba(124,58,237,0.16), 0 10px 28px rgba(8,4,20,0.3)"

/**
 * Text / meter highlight — not for opaque CTA fills.
 */
export const ACCENT_GRAD = `linear-gradient(135deg, ${ACCENT.candyPurple} 0%, ${ACCENT.candyPink} 52%, ${ACCENT.lilac} 100%)`

/** @deprecated Alias of ACCENT_GRAD. */
export const GRAD = ACCENT_GRAD

export type GlassCtaVariant = "primary" | "outline"

export function glassCtaStyle({
  dark = true,
  small = false,
  full = false,
  variant = "primary",
}: {
  dark?: boolean
  small?: boolean
  full?: boolean
  variant?: GlassCtaVariant
} = {}): CSSProperties {
  const primary = variant === "primary"

  const darkPrimary = {
    backgroundColor: "rgba(255,255,255,0.015)",
    backgroundImage: GLASS_CTA_INNER_FILL_DARK,
    border: "1px solid rgba(253,230,255,0.36)",
    boxShadow: full ? GLASS_CTA_NEON_SHADOW_FULL : GLASS_CTA_NEON_SHADOW,
    color: "#ffffff",
    textShadow: "0 0 22px rgba(251,207,232,0.25), 0 1px 0 rgba(91,33,182,0.18)",
  }
  const darkOutline = {
    backgroundColor: "rgba(255,255,255,0.01)",
    backgroundImage:
      "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 42%), linear-gradient(105deg, rgba(244,114,182,0.07) 0%, rgba(155,138,255,0.05) 55%, transparent 100%)",
    border: "1px solid rgba(253,230,255,0.19)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 18px rgba(155,138,255,0.09), 0 8px 20px rgba(8,4,20,0.2)",
    color: "#ffffff",
  }
  const lightPrimary = {
    backgroundColor: "rgba(255,255,255,0.21)",
    backgroundImage: GLASS_CTA_INNER_FILL_LIGHT,
    border: "1px solid rgba(192,132,252,0.28)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.95), 0 0 0 1px rgba(244,114,182,0.1), 0 0 22px rgba(192,132,252,0.14), 0 10px 24px rgba(110,86,207,0.06)",
    color: "rgba(14,10,26,0.92)",
  }
  const lightOutline = {
    background: "linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.28) 100%)",
    border: "1px solid rgba(14,10,26,0.14)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 6px 16px rgba(14,10,26,0.06)",
    color: "rgba(14,10,26,0.90)",
  }

  const skin = dark ? (primary ? darkPrimary : darkOutline) : primary ? lightPrimary : lightOutline

  return {
    ...skin,
    backdropFilter: primary ? "blur(22px) saturate(210%)" : "blur(18px) saturate(175%)",
    WebkitBackdropFilter: primary ? "blur(22px) saturate(210%)" : "blur(18px) saturate(175%)",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: small ? 14 : 16,
    padding: small ? "9px 18px" : "14px 28px",
    fontFamily: "var(--font-inter)",
    letterSpacing: "0.01em",
    width: full ? "100%" : undefined,
    display: full ? "block" : "inline-block",
    textAlign: "center",
    textDecoration: "none",
    boxSizing: "border-box",
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
    WebkitTextFillColor: skin.color as string,
  }
}
