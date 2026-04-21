"use client"

import React from "react"

interface GlassEffectProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  href?: string
  target?: string
}

interface DockIcon {
  src: string
  alt: string
  onClick?: () => void
}

export const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  className = "",
  style = {},
  href,
  target = "_blank",
}) => {
  const glassStyle = {
    boxShadow:
      "0 16px 36px rgba(0, 0, 0, 0.24), 0 2px 8px rgba(0, 0, 0, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.14)",
    border: "0.7px solid rgba(255, 255, 255, 0.18)",
    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
    ...style,
  }

  const content = (
    <div
      className={`relative flex overflow-hidden font-semibold text-black transition-all duration-700 ${className}`}
      style={glassStyle}
    >
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-inherit rounded-3xl"
        style={{
          backdropFilter: "blur(18px) saturate(120%)",
          WebkitBackdropFilter: "blur(18px) saturate(120%)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />
      <div className="absolute inset-0 z-10 rounded-inherit" style={{ background: "rgba(255, 255, 255, 0.08)" }} />
      <div
        className="absolute inset-0 z-20 overflow-hidden rounded-inherit rounded-3xl"
        style={{
          boxShadow: "inset 0 0 0 0.8px rgba(255, 255, 255, 0.16), inset 0 10px 18px rgba(255, 255, 255, 0.05)",
        }}
      />

      <div className="relative z-30 w-full">{children}</div>
    </div>
  )

  return href ? (
    <a href={href} target={target} rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  )
}

export const GlassDock: React.FC<{ icons: DockIcon[]; href?: string }> = ({ icons, href }) => (
  <GlassEffect href={href} className="rounded-3xl p-3 hover:rounded-[2rem] hover:p-4">
    <div className="flex items-center justify-center gap-2 overflow-hidden rounded-3xl px-0.5 py-0">
      {icons.map((icon, index) => (
        <img
          key={index}
          src={icon.src}
          alt={icon.alt}
          className="h-16 w-16 cursor-pointer transition-all duration-700 hover:scale-110"
          style={{
            transformOrigin: "center center",
            transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
          }}
          onClick={icon.onClick}
        />
      ))}
    </div>
  </GlassEffect>
)

export const GlassButton: React.FC<{ children: React.ReactNode; href?: string; className?: string }> = ({
  children,
  href,
  className = "",
}) => (
  <GlassEffect
    href={href}
    className={`overflow-hidden rounded-3xl px-10 py-6 hover:rounded-[2rem] hover:px-11 hover:py-7 ${className}`}
  >
    <div
      className="transition-all duration-700 hover:scale-95"
      style={{
        transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
      }}
    >
      {children}
    </div>
  </GlassEffect>
)

export const GlassFilter: React.FC = () => (
  <svg style={{ display: "none" }}>
    <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
      <feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" seed="17" result="turbulence" />
      <feComponentTransfer in="turbulence" result="mapped">
        <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
        <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
        <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
      </feComponentTransfer>
      <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
      <feSpecularLighting
        in="softMap"
        surfaceScale="5"
        specularConstant="1"
        specularExponent="100"
        lightingColor="white"
        result="specLight"
      >
        <fePointLight x="-200" y="-200" z="300" />
      </feSpecularLighting>
      <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
      <feDisplacementMap in="SourceGraphic" in2="softMap" scale="200" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
)

export const Component = () => {
  const dockIcons: DockIcon[] = [
    { src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=128&q=80&auto=format&fit=crop", alt: "Glass 1" },
    { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=128&q=80&auto=format&fit=crop", alt: "Glass 2" },
    { src: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=128&q=80&auto=format&fit=crop", alt: "Glass 3" },
  ]

  return (
    <div
      className="relative flex h-full min-h-screen w-full items-center justify-center overflow-hidden font-light"
      style={{
        background:
          'url("https://images.unsplash.com/photo-1432251407527-504a6b4174a2?q=80&w=1480&auto=format&fit=crop") center center',
        animation: "moveBackground 60s linear infinite",
      }}
    >
      <GlassFilter />
      <div className="flex w-full flex-col items-center justify-center gap-6">
        <GlassDock icons={dockIcons} href="https://x.com/notsurajgaud" />
        <GlassButton href="https://x.com/notsurajgaud">
          <div className="text-xl text-white">
            <p>How can i help you today?</p>
          </div>
        </GlassButton>
      </div>
    </div>
  )
}
