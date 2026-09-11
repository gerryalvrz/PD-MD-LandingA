"use client"

/** Candy-glass primary CTA — pair with `landing-theme.ts` (`MOTUS_CANDY_GLASS_VERSION`). */
import Link from "next/link"
import { motion } from "framer-motion"
import { GLASS_CTA_NEON_SHADOW_HOVER, glassCtaStyle, type GlassCtaVariant } from "@/lib/landing-theme"

type GlassCtaProps = {
  children: React.ReactNode
  small?: boolean
  full?: boolean
  href?: string
  onClick?: () => void
  variant?: GlassCtaVariant
  dark?: boolean
  type?: "button" | "submit"
  disabled?: boolean
}

const tap = { scale: 0.97 }

function motionProps(variant: GlassCtaVariant, dark: boolean, disabled?: boolean) {
  const neon = variant === "primary" && dark && !disabled
  return {
    whileHover: disabled ? undefined : { scale: 1.03, ...(neon ? { boxShadow: GLASS_CTA_NEON_SHADOW_HOVER } : {}) },
    whileTap: disabled ? undefined : tap,
  }
}

export function GlassCta({
  children,
  small,
  full,
  href,
  onClick,
  variant = "primary",
  dark = true,
  type = "button",
  disabled,
}: GlassCtaProps) {
  const style = {
    ...glassCtaStyle({ dark, small, full, variant }),
    opacity: disabled ? 0.45 : 1,
  }

  const ctaMotion = motionProps(variant, dark, disabled)

  if (href) {
    const inner = (
      <motion.span {...ctaMotion} onClick={onClick} style={style}>
        {children}
      </motion.span>
    )
    if (href.startsWith("/") && !href.startsWith("//")) {
      return (
        <Link
          href={href}
          style={{
            textDecoration: "none",
            color: style.color,
            width: full ? "100%" : undefined,
            display: full ? "block" : "inline-block",
          }}
        >
          {inner}
        </Link>
      )
    }
    return (
      <motion.a href={href} {...ctaMotion} onClick={onClick} style={style}>
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      type={type}
      {...ctaMotion}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </motion.button>
  )
}

/** @deprecated Use GlassCta. Same API during the candy-glass migration. */
export const GradientButton = GlassCta
