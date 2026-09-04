import type { PracticeResult } from "./practice-index"
import type { ReadinessResult } from "./readiness-index"
import {
  psychologistTypeFromPractice,
  psychologistTypeFromReadiness,
  type PsychologistTypeId,
} from "./psychologist-types.ts"

export const SHARE_SOURCE_PARAM = "src"
export const SHARE_SOURCE_VALUE = "share"

export type ShareDraft = {
  kicker: string
  headline: string
  detail: string
  path: string
  version: string
  redacted: boolean
  imageSrc?: string
  typeId?: PsychologistTypeId
}

const GENERIC_HEADLINE = "Estoy revisando la organización digital de mi práctica."
const GENERIC_DETAIL = "Una autoevaluación orientativa para psicólogos. Elige la que más se parece a lo que haces hoy."
const COLLEAGUE_INVITE = "¿Le serviría a un colega?"

const SENSITIVE_INDEX = new Set(["Q5", "Q6", "Q7"])
const SENSITIVE_READINESS = new Set(["R3", "R4", "R6"])

const INDEX_PUBLIC_STEP: Record<string, string> = {
  Q1: "Organizar la presencia profesional.",
  Q2: "Ordenar de dónde llegan las consultas.",
  Q3: "Definir cómo organizar las citas.",
  Q4: "Preparar el medio de la sesión online.",
  Q8: "Ordenar qué necesito aprender ahora.",
  Q9: "Definir con quién consultar dudas profesionales.",
  Q10: "Revisar de vez en cuando cómo estoy trabajando.",
}

const READINESS_PUBLIC_STEP: Record<string, string> = {
  R1: "Separar el canal profesional del personal.",
  R2: "Ordenar el procedimiento de sesión online.",
  R5: "Construir una presencia profesional propia.",
  R7: "Tener visibilidad de cobros y comisiones.",
  R8: "Sistematizar facturación y registros.",
  R9: "Encontrar una red profesional digital.",
  R10: "Decidir cómo circular el conocimiento fuera de la consulta.",
}

export function campaignShareUrl(path: string, origin: string): string {
  const url = new URL(path, origin)
  url.searchParams.set(SHARE_SOURCE_PARAM, SHARE_SOURCE_VALUE)
  return url.toString()
}

export function isShareReferral(search: string): boolean {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search)
  return params.get(SHARE_SOURCE_PARAM) === SHARE_SOURCE_VALUE
}

export function genericShareDraft(path: string, version = "landing"): ShareDraft {
  return {
    kicker: "MotusDAO",
    headline: COLLEAGUE_INVITE,
    detail: GENERIC_DETAIL,
    path,
    version,
    redacted: false,
  }
}

export function practiceShareDraft(result: PracticeResult): ShareDraft {
  const type = psychologistTypeFromPractice(result)
  if (type) {
    return {
      kicker: type.kicker,
      headline: `Soy ${type.title}.`,
      detail: `${type.shareLine} Descubre tu tipo.`,
      path: "/diagnostico",
      version: result.version,
      redacted: false,
      imageSrc: type.image,
      typeId: type.id,
    }
  }
  const sensitive =
    (result.priority !== null && SENSITIVE_INDEX.has(result.priority.questionId)) ||
    result.unorientedAreas.length > 0
  const publicStep =
    result.status === "ready" && result.priority && !sensitive
      ? INDEX_PUBLIC_STEP[result.priority.questionId]
      : undefined
  return {
    kicker: "Practice Index",
    headline: publicStep ? `Mi siguiente paso: ${publicStep.replace(/\.$/, "")}.` : GENERIC_HEADLINE,
    detail: publicStep
      ? "Autoevaluación orientativa. Sin puntaje global ni datos de pacientes."
      : GENERIC_DETAIL,
    path: "/diagnostico",
    version: result.version,
    redacted: !publicStep,
  }
}

export function readinessShareDraft(result: ReadinessResult): ShareDraft {
  const type = psychologistTypeFromReadiness(result)
  if (type) {
    return {
      kicker: type.kicker,
      headline: `Soy ${type.title}.`,
      detail: `${type.shareLine} Descubre tu tipo.`,
      path: "/readiness",
      version: result.version,
      redacted: false,
      imageSrc: type.image,
      typeId: type.id,
    }
  }
  const flagged = result.flags.some((flag) => flag.severity === "critical" || SENSITIVE_READINESS.has(flag.id))
  const sensitivePriority = result.priority !== null && SENSITIVE_READINESS.has(result.priority.id)
  const publicStep =
    result.status === "ready" && result.priority && !flagged && !sensitivePriority
      ? READINESS_PUBLIC_STEP[result.priority.id]
      : undefined
  return {
    kicker: "Practice Readiness",
    headline: publicStep ? `Mi siguiente paso: ${publicStep.replace(/\.$/, "")}.` : GENERIC_HEADLINE,
    detail: publicStep
      ? "Autoevaluación orientativa sobre práctica digital. Sin puntaje ni respuestas en este enlace."
      : GENERIC_DETAIL,
    path: "/readiness",
    version: result.version,
    redacted: !publicStep,
  }
}

export function assertPublicShareText(draft: ShareDraft) {
  const blob = `${draft.kicker} ${draft.headline} ${draft.detail} ${draft.path}`
  return {
    hasScore: /\b\d+\s*\/\s*\d+\b/.test(blob) || /\b\d{2,3}\s*%/.test(blob),
    hasSensitiveCue:
      /urgencia|contraseña|expediente|chatgpt|claude|identificable|vulnerabilidad/i.test(blob),
    text: blob,
  }
}

export function colleagueShareText(draft: ShareDraft): string {
  return `${COLLEAGUE_INVITE}\n${draft.headline}`
}

export const SOCIAL_NETWORKS = ["whatsapp", "instagram", "linkedin", "x", "facebook"] as const
export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number]

export function usesImageShare(network: SocialNetwork): boolean {
  return network === "instagram"
}

/** Intent URLs. Instagram has none: it needs the PNG via the system share sheet. Campaign URL only. */
export function socialShareUrl(network: SocialNetwork, pageUrl: string, text: string): string | null {
  switch (network) {
    case "whatsapp":
      return `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text}\n${pageUrl}`)}`
    case "instagram":
      return null
    case "linkedin":
      // share-offsite only sends a URL and LinkedIn now opens an empty composer.
      return `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(`${text}\n${pageUrl}`)}`
    case "x":
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`
  }
}
