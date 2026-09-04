import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Practice Index — MotusDAO Academy",
  description:
    "Autoevaluación orientativa sobre la organización de tu práctica digital. Diez preguntas, sin registro ni puntaje global. No es un diagnóstico clínico ni una certificación.",
}

export default function DiagnosticoLayout({ children }: { children: ReactNode }) {
  return children
}
