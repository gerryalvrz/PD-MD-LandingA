import type { Metadata } from "next"
import type { ReactNode } from "react"

const title = "Practice Index — MotusDAO Academy"
const description =
  "Autoevaluación orientativa sobre la organización de tu práctica digital. Diez preguntas, sin registro ni puntaje global. No es un diagnóstico clínico ni una certificación."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
}

export default function DiagnosticoLayout({ children }: { children: ReactNode }) {
  return children
}
