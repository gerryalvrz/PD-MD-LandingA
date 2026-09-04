import { assessmentOgImage, ASSESSMENT_OG_SIZE, ASSESSMENT_OG_TYPE } from "@/lib/assessment-og"

export const alt =
  "Practice Index: autoevaluación orientativa sobre la organización de tu práctica digital. MotusDAO."
export const size = ASSESSMENT_OG_SIZE
export const contentType = ASSESSMENT_OG_TYPE

export default function Image() {
  return assessmentOgImage(
    "Practice Index",
    "¿Qué puedes fortalecer en tu práctica digital?",
    "Diez preguntas, sin puntaje global ni registro. Orientativa, no es un diagnóstico clínico.",
  )
}
