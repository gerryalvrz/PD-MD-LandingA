import type { PracticeResult } from "./practice-index"
import type { ReadinessResult } from "./readiness-index"

export const PSYCHOLOGIST_TYPE_IDS = [
  "dinosaurio",
  "godinez",
  "smartt",
  "automatizado",
  "anonimus",
  "futurista",
] as const

export type PsychologistTypeId = (typeof PSYCHOLOGIST_TYPE_IDS)[number]

export type PsychologistType = {
  id: PsychologistTypeId
  step: number
  title: string
  kicker: string
  blurb: string
  quote: string
  shareLine: string
  image: string
  shortName: string
}

const ART = "/experience/tipos_psicologos"

export const PSYCHOLOGIST_TYPES: Record<PsychologistTypeId, PsychologistType> = {
  dinosaurio: {
    id: "dinosaurio",
    step: 1,
    title: "Psicólogo Dinosaurio",
    shortName: "Dinosaurio",
    kicker: "Algunas cosas no cambian",
    blurb: "Casi no usa tecnología. Papel, agenda física y procesos de siempre.",
    quote: "Así lo he hecho toda la vida.",
    shareLine: "Casi no uso tecnología. Papel, agenda física y procesos de siempre.",
    image: `${ART}/dinosaurio.jpg`,
  },
  godinez: {
    id: "godinez",
    step: 2,
    title: "Psicólogo Godínez",
    shortName: "Godínez",
    kicker: "Digitalizó el papel, no los hábitos",
    blurb: "Vive entre Word, Excel, PDFs, carpetas y correos. Digitalizó el papel, pero no necesariamente su forma de trabajar.",
    quote: "Te lo mando en Word.",
    shareLine: "Vivo entre Word, Excel, PDFs, carpetas y correos.",
    image: `${ART}/godinez.jpg`,
  },
  smartt: {
    id: "smartt",
    step: 3,
    title: "Smart Psychologist",
    shortName: "Smart",
    kicker: "Inteligencia para una mejor práctica",
    blurb: "Usa IA y herramientas inteligentes para trabajar mejor y ahorrar tiempo. Ya tiene la consulta en la nube: agenda, videollamadas, formularios y pagos.",
    quote: "¿Para qué hacerlo manual si una herramienta lo puede hacer?",
    shareLine: "Uso herramientas inteligentes y tengo la consulta en la nube.",
    image: `${ART}/smartt.jpg`,
  },
  automatizado: {
    id: "automatizado",
    step: 4,
    title: "Psicólogo Automatizado",
    shortName: "Automatizado",
    kicker: "Una vez configurado, se hace solo",
    blurb: "No solo usa herramientas: conecta todo. Agenda → formulario → expediente → recordatorio → seguimiento.",
    quote: "Una vez configurado, se hace solo.",
    shareLine: "Conecto agenda, formularios, recordatorios y seguimiento.",
    image: `${ART}/automatizado.jpg`,
  },
  anonimus: {
    id: "anonimus",
    step: 5,
    title: "Psicólogo Anonimus",
    shortName: "Anonimus",
    kicker: "El nivel secreto",
    blurb: "El nivel secreto. Tiene prompts, sistemas, automatizaciones y herramientas que casi nadie conoce. Está muchísimo más avanzado que el promedio.",
    quote: "No sé cómo explicártelo, pero tengo un sistema.",
    shareLine: "Tengo sistemas y herramientas que casi nadie conoce.",
    image: `${ART}/anonimous.jpg`,
  },
  futurista: {
    id: "futurista",
    step: 6,
    title: "Psicólogo Futurista",
    shortName: "Futurista",
    kicker: "Esto apenas está empezando",
    blurb: "Está explorando lo que viene después: agentes de IA, asistentes autónomos, nuevas interfaces, análisis avanzado, etc.",
    quote: "Esto apenas está empezando.",
    shareLine: "Estoy explorando lo que viene después: agentes, nuevas interfaces y análisis avanzado.",
    image: `${ART}/futurista.jpg`,
  },
}

/** Commercial persona from Readiness percent. Not a certification and not a substitute for bands or flags. */
export function psychologistTypeFromPercent(percent: number): PsychologistTypeId {
  if (percent <= 16) return "dinosaurio"
  if (percent <= 33) return "godinez"
  if (percent <= 50) return "smartt"
  if (percent <= 66) return "automatizado"
  if (percent <= 83) return "anonimus"
  return "futurista"
}

export function psychologistTypeFromReadiness(result: ReadinessResult): PsychologistType | null {
  if (result.status !== "ready") return null
  return PSYCHOLOGIST_TYPES[psychologistTypeFromPercent(result.percent)]
}

/** Uses the Index focus mode, never a summed score. */
export function psychologistTypeFromPractice(result: PracticeResult): PsychologistType | null {
  if (result.status !== "ready" || !result.priority) return null
  const { mode, level } = result.priority
  const id: PsychologistTypeId =
    mode === "start" || level === 0
      ? "dinosaurio"
      : level === 1
        ? "godinez"
        : level === 2
          ? "smartt"
          : level === 3
            ? "automatizado"
            : result.established
              ? "futurista"
              : "anonimus"
  return PSYCHOLOGIST_TYPES[id]
}
