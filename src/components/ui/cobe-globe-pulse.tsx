"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

interface PulseMarker {
  id: string
  location: [number, number]
  delay: number
}

interface GlobePulseProps {
  markers?: PulseMarker[]
  className?: string
  speed?: number
}

const defaultMarkers: PulseMarker[] = [
  { id: "mexico", location: [19.43, -99.13], delay: 0 },
  { id: "argentina", location: [-34.6, -58.38], delay: 0.5 },
]

export function GlobePulse({
  markers = defaultMarkers,
  className = "",
  speed = 0.003,
}: GlobePulseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const markersRef = useRef(markers)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)

  markersRef.current = markers

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        }
      }
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId = 0
    let phi = 0
    let disposed = false
    let resizeObserver: ResizeObserver | null = null

    const destroy = () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
        animationId = 0
      }
      if (globe) {
        try {
          globe.destroy()
        } catch {
          // Context may already be gone.
        }
        globe = null
      }
      canvas.style.opacity = "0"
    }

    const init = () => {
      if (disposed) return
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      try {
        globe = createGlobe(canvas, {
          devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
          width,
          height: width,
          phi: 0,
          theta: 0.2,
          dark: 1,
          diffuse: 1.5,
          mapSamples: 16000,
          mapBrightness: 10,
          baseColor: [0.5, 0.5, 0.5],
          markerColor: [0.2, 0.8, 0.9],
          glowColor: [0.05, 0.05, 0.05],
          markerElevation: 0,
          markers: markersRef.current.map((m) => ({ location: m.location, size: 0.025, id: m.id })),
          arcs: [],
          arcColor: [0.3, 0.85, 0.95],
          arcWidth: 0.5,
          arcHeight: 0.25,
          opacity: 0.7,
        })
      } catch {
        globe = null
        return
      }

      const animate = () => {
        if (disposed || !globe) return
        if (!isPausedRef.current) phi += speed
        try {
          globe.update({
            phi: phi + phiOffsetRef.current + dragOffset.current.phi,
            theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
          })
        } catch {
          destroy()
          return
        }
        animationId = requestAnimationFrame(animate)
      }
      animate()
      requestAnimationFrame(() => {
        if (!disposed && canvas.isConnected) canvas.style.opacity = "1"
      })
    }

    const onContextLost = (event: Event) => {
      event.preventDefault()
      destroy()
    }

    const onContextRestored = () => {
      init()
    }

    canvas.addEventListener("webglcontextlost", onContextLost)
    canvas.addEventListener("webglcontextrestored", onContextRestored)

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      resizeObserver = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          resizeObserver?.disconnect()
          resizeObserver = null
          init()
        }
      })
      resizeObserver.observe(canvas)
    }

    return () => {
      disposed = true
      resizeObserver?.disconnect()
      canvas.removeEventListener("webglcontextlost", onContextLost)
      canvas.removeEventListener("webglcontextrestored", onContextRestored)
      destroy()
    }
  }, [speed])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <style>{`
        @keyframes pulse-expand {
          0% { transform: scaleX(0.3) scaleY(0.3); opacity: 0.8; }
          100% { transform: scaleX(1.5) scaleY(1.5); opacity: 0; }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        aria-label="Globo interactivo de la comunidad MotusDAO"
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
          backgroundColor: "transparent",
        }}
      />
      {markers.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(center)",
            left: "anchor(center)",
            translate: "-50% 50%",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none" as const,
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
            transition: "opacity 0.4s, filter 0.4s",
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              border: "2px solid #33ccdd",
              borderRadius: "50%",
              opacity: 0,
              animation: `pulse-expand 2s ease-out infinite ${m.delay}s`,
            }}
          />
          <span
            style={{
              position: "absolute",
              inset: 0,
              border: "2px solid #33ccdd",
              borderRadius: "50%",
              opacity: 0,
              animation: `pulse-expand 2s ease-out infinite ${m.delay + 0.5}s`,
            }}
          />
          <span
            style={{
              width: 10,
              height: 10,
              background: "#33ccdd",
              borderRadius: "50%",
              boxShadow: "0 0 0 3px #111, 0 0 0 5px #33ccdd",
            }}
          />
        </div>
      ))}
    </div>
  )
}
