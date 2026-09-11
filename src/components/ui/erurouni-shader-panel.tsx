"use client"

import { cn } from "@/lib/utils"
import { createShader } from "@/lib/erurouni-shader.webgl"
import { useEffect, useRef } from "react"

interface ErurouniShaderPanelProps {
  dark?: boolean
  className?: string
  active?: boolean
}

export function ErurouniShaderPanel({ dark = true, className, active = true }: ErurouniShaderPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return

    let shader: ReturnType<typeof createShader> | null = null
    try {
      shader = createShader(canvas, {
        theme: dark ? "dark" : "light",
        background: {
          dark: "#0E0A1A",
          light: "#EDE8F7",
        },
      })
    } catch {
      return
    }

    return () => {
      shader?.destroy()
    }
  }, [active, dark])

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#0E0A1A] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
        className,
      )}
    >
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
    </div>
  )
}
