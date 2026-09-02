import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "¿Qué tipo de psicólogo digital eres? — MotusDAO Academy",
  description:
    "Diagnóstico básico y orientativo de tu práctica digital. Seis preguntas, resultado inmediato y un siguiente paso dentro de MotusDAO Academy.",
}

export default function DiagnosticoLayout({ children }: { children: ReactNode }) {
  return children
}
