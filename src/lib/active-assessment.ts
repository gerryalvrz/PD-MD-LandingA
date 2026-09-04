/**
 * Switch the landing CTA by changing LANDING_ASSESSMENT and committing.
 * Both routes stay live so the team can compare without a page toggle or login.
 */
export type LandingAssessment = "practice-index" | "readiness"

export const LANDING_ASSESSMENT: LandingAssessment = "readiness"

export const ASSESSMENT_PATH = {
  "practice-index": "/diagnostico",
  readiness: "/readiness",
} as const

export function landingAssessmentPath(): string {
  return ASSESSMENT_PATH[LANDING_ASSESSMENT]
}

export const LANDING_ASSESSMENT_COPY: Record<
  LandingAssessment,
  { heading: string; lede: string }
> = {
  "practice-index": {
    heading: "¿Qué puedes fortalecer en tu práctica digital?",
    lede: "El Practice Index es una autoevaluación orientativa: diez preguntas sobre prácticas concretas, un foco de trabajo y tres acciones. Sin registro y sin puntaje global.",
  },
  readiness: {
    heading: "¿Qué tan preparada está tu práctica digital?",
    lede: "Diez preguntas, unos tres minutos. Un mapa de comunicación, IA, privacidad, pagos y comunidad — sin registro. Orientativo, no es certificación.",
  },
}
