import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Digital Practice Readiness — MotusDAO Academy",
  description:
    "Autoevaluación orientativa sobre comunicación, IA, privacidad, pagos y comunidad. Diez preguntas, resultado inmediato. No es un diagnóstico clínico ni una certificación.",
}

export default function ReadinessLayout({ children }: { children: ReactNode }) {
  return children
}
