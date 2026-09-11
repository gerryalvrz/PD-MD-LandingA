"use client"

import { cn } from "@/lib/utils"
import { createShader } from "@/lib/thiago-shader.webgl"
import { useEffect, useRef } from "react"

interface ThiagoShaderPanelProps {
  dark?: boolean
  className?: string
}

export function ThiagoShaderPanel({ dark = true, className }: ThiagoShaderPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let shader: ReturnType<typeof createShader> | null = null
    try {
      shader = createShader(canvas, {
        theme: dark ? "dark" : "light",
        background: {
          dark: "#0E0A1A",
          light: "#6E56CF",
        },
      })
    } catch {
      return
    }

    return () => {
      shader?.destroy()
    }
  }, [dark])

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
