export type ProfileId =
  | "constructor"
  | "estructurado"
  | "explorador"
  | "conector"
  | "profesional"

export type DigitalProfile = {
  id: ProfileId
  name: string
  headline: string
  nextStep: string
}

export const DIGITAL_PROFILES: DigitalProfile[] = [
  {
    id: "constructor",
    name: "El Constructor",
    headline: "Estás creando las bases de tu práctica digital.",
    nextStep: "Estructura y fundamentos.",
  },
  {
    id: "estructurado",
    name: "El Estructurado",
    headline: "Ya tienes procesos digitales definidos y buscas integrarlos mejor.",
    nextStep: "Optimización y desarrollo profesional.",
  },
  {
    id: "explorador",
    name: "El Explorador de IA",
    headline: "Estás experimentando con nuevas herramientas y quieres hacerlo con criterio.",
    nextStep: "IA responsable y práctica digital.",
  },
  {
    id: "conector",
    name: "El Conector",
    headline: "Tu desarrollo profesional está ligado a comunidad, formación e intercambio.",
    nextStep: "Comunidad, formación y supervisión.",
  },
  {
    id: "profesional",
    name: "El Profesional digital",
    headline: "Ya cuentas con una práctica digital estructurada y buscas profundizar.",
    nextStep: "Integración y progresión profesional.",
  },
]

export const PROFILE_BY_ID = Object.fromEntries(
  DIGITAL_PROFILES.map((profile) => [profile.id, profile])
) as Record<ProfileId, DigitalProfile>

export type QuizOption = {
  id: string
  label: string
  profile: ProfileId
}

export type QuizQuestion = {
  id: string
  prompt: string
  options: QuizOption[]
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "estado",
    prompt: "Hoy, tu práctica digital está…",
    options: [
      { id: "estado-constructor", label: "Empezando a armarse. Aún estoy en las bases.", profile: "constructor" },
      { id: "estado-estructurado", label: "Con procesos, pero todavía sueltos entre sí.", profile: "estructurado" },
      { id: "estado-explorador", label: "Más en modo exploración de herramientas e IA.", profile: "explorador" },
      { id: "estado-conector", label: "Ligada sobre todo a formarme y conectar con colegas.", profile: "conector" },
      { id: "estado-profesional", label: "Ya estructurada y en marcha.", profile: "profesional" },
    ],
  },
  {
    id: "necesidad",
    prompt: "Lo que más necesitas ahora es…",
    options: [
      { id: "necesidad-constructor", label: "Un marco claro para empezar sin improvisar.", profile: "constructor" },
      { id: "necesidad-estructurado", label: "Integrar y optimizar lo que ya haces.", profile: "estructurado" },
      { id: "necesidad-explorador", label: "Criterio clínico para usar IA y herramientas nuevas.", profile: "explorador" },
      { id: "necesidad-conector", label: "Comunidad, formación e intercambio con pares.", profile: "conector" },
      { id: "necesidad-profesional", label: "Profundizar y llevar la práctica al siguiente nivel.", profile: "profesional" },
    ],
  },
  {
    id: "tecnologia",
    prompt: "Con la tecnología en clínica, tú…",
    options: [
      { id: "tec-constructor", label: "La incorporas con cautela, paso a paso.", profile: "constructor" },
      { id: "tec-estructurado", label: "Ya la usas de forma ordenada.", profile: "estructurado" },
      { id: "tec-explorador", label: "Experimentas rápido y quieres más rigor.", profile: "explorador" },
      { id: "tec-conector", label: "La usas sobre todo para aprender y estar en red.", profile: "conector" },
      { id: "tec-profesional", label: "La tienes integrada a la operación diaria.", profile: "profesional" },
    ],
  },
  {
    id: "riesgo",
    prompt: "El riesgo que más quieres evitar es…",
    options: [
      { id: "riesgo-constructor", label: "Improvisar el encuadre digital.", profile: "constructor" },
      { id: "riesgo-estructurado", label: "Tener herramientas sin un sistema.", profile: "estructurado" },
      { id: "riesgo-explorador", label: "Adoptar IA sin criterio clínico.", profile: "explorador" },
      { id: "riesgo-conector", label: "Trabajar aislado, sin pares.", profile: "conector" },
      { id: "riesgo-profesional", label: "Estancarte con lo que ya funciona.", profile: "profesional" },
    ],
  },
  {
    id: "masterclass",
    prompt: "En 90 minutos de masterclass, te serviría más…",
    options: [
      { id: "mc-constructor", label: "Entender qué cambia al pasar de lo presencial a lo digital.", profile: "constructor" },
      { id: "mc-estructurado", label: "Ordenar encuadre y procesos en entorno virtual.", profile: "estructurado" },
      { id: "mc-explorador", label: "Ver límites y usos de herramientas nuevas.", profile: "explorador" },
      { id: "mc-conector", label: "Conocer el espacio y a otros psicólogos.", profile: "conector" },
      { id: "mc-profesional", label: "Una muestra de formación más avanzada.", profile: "profesional" },
    ],
  },
  {
    id: "siguiente",
    prompt: "Tu siguiente paso ideal sería…",
    options: [
      { id: "next-constructor", label: "Estructura y fundamentos.", profile: "constructor" },
      { id: "next-estructurado", label: "Optimizar la práctica que ya tienes.", profile: "estructurado" },
      { id: "next-explorador", label: "IA responsable y práctica digital.", profile: "explorador" },
      { id: "next-conector", label: "Comunidad, formación y supervisión.", profile: "conector" },
      { id: "next-profesional", label: "Integración y progresión profesional.", profile: "profesional" },
    ],
  },
]

const TIEBREAK_QUESTION_IDS = new Set(["necesidad", "siguiente"])

export function resolveProfile(answers: { questionId: string; profile: ProfileId }[]): DigitalProfile {
  const scores: Record<ProfileId, number> = {
    constructor: 0,
    estructurado: 0,
    explorador: 0,
    conector: 0,
    profesional: 0,
  }

  for (const answer of answers) {
    const weight = TIEBREAK_QUESTION_IDS.has(answer.questionId) ? 2 : 1
    scores[answer.profile] += weight
  }

  let winner: ProfileId = answers[answers.length - 1]?.profile ?? "constructor"
  let max = -1
  for (const profile of DIGITAL_PROFILES) {
    if (scores[profile.id] > max) {
      max = scores[profile.id]
      winner = profile.id
    }
  }

  return PROFILE_BY_ID[winner]
}
