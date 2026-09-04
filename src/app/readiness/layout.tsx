import type { Metadata } from "next"
import type { ReactNode } from "react"

const title = "Digital Practice Readiness — MotusDAO Academy"
const description =
  "Autoevaluación orientativa sobre comunicación, IA, privacidad, pagos y comunidad. Diez preguntas, resultado inmediato. No es un diagnóstico clínico ni una certificación."

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

export default function ReadinessLayout({ children }: { children: ReactNode }) {
  return children
}
