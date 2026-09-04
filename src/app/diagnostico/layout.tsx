import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Diagnóstico de Práctica Digital — MotusDAO Academy",
  description:
    "Orientación inicial sobre las áreas de tu práctica digital que podrías revisar y desarrollar. No es un diagnóstico clínico ni una certificación profesional.",
}

export default function DiagnosticoLayout({ children }: { children: ReactNode }) {
  return children
}
