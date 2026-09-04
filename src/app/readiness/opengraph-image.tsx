import { assessmentOgImage, ASSESSMENT_OG_SIZE, ASSESSMENT_OG_TYPE } from "@/lib/assessment-og"

export const alt =
  "Autoevaluación orientativa de práctica digital para psicólogos. MotusDAO. No es certificación."
export const size = ASSESSMENT_OG_SIZE
export const contentType = ASSESSMENT_OG_TYPE

export default function Image() {
  return assessmentOgImage(
    "Practice Readiness",
    "¿Qué tan preparada está tu práctica digital?",
    "Diez preguntas. Sin registro. Orientativa, no es un diagnóstico clínico ni una certificación.",
  )
}
