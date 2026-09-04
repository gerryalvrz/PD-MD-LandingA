/**
 * Digital Practice Readiness — dpr-0.1-candidate
 * Separate from mpi-0.1-candidate. Scores 0–40 with bands and educational risk flags.
 * A high score never clears a critical flag. Q9 isolation is not a clinical penalty.
 */

export type ReadinessId = "R1" | "R2" | "R3" | "R4" | "R5" | "R6" | "R7" | "R8" | "R9" | "R10"
export type ReadinessLetter = "A" | "B" | "C" | "D" | "E"
export type ReadinessAnswers = Partial<Record<ReadinessId, ReadinessLetter>>
export type ReadinessBandId = "foundation" | "transition" | "professional" | "ai-ready"
export type RiskSeverity = "critical" | "attention"

export type ReadinessOption = { letter: ReadinessLetter; label: string }

export type ReadinessQuestion = {
  id: ReadinessId
  area: string
  short: string
  prompt: string
  help: string
  options: ReadinessOption[]
}

export type AreaScore = {
  id: ReadinessId
  area: string
  short: string
  letter: ReadinessLetter
  points: number
  max: 4
}

export type RiskFlag = {
  id: ReadinessId
  severity: RiskSeverity
  title: string
  message: string
}

export type Offer = {
  title: string
  description: string
  href: string
  linkLabel: string
}

export type ReadinessResult = {
  version: string
  status: "incomplete" | "ready"
  unanswered: ReadinessId[]
  total: number
  maxTotal: 40
  percent: number
  band: {
    id: ReadinessBandId
    label: string
    title: string
    description: string
  }
  scores: AreaScore[]
  strengths: AreaScore[]
  opportunities: AreaScore[]
  priority: { id: ReadinessId; area: string; action: string } | null
  flags: RiskFlag[]
  offer: Offer | null
}

export const READINESS_VERSION = "dpr-0.1-candidate"
export const READINESS_IDS: ReadinessId[] = ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9", "R10"]
export const READINESS_MAX_TOTAL = 40

const HUB = "https://app.motusdao.org"
export const READINESS_COMMUNITY_URL = `${HUB}/academia/01-genesis`
export const READINESS_FUNDAMENTOS_URL = `${HUB}/academia/02-fundamentos`

const LETTERS: ReadinessLetter[] = ["A", "B", "C", "D", "E"]

function question(
  id: ReadinessId,
  area: string,
  short: string,
  prompt: string,
  help: string,
  options: [string, string, string, string] | [string, string, string, string, string],
): ReadinessQuestion {
  const letters: ReadinessLetter[] = ["A", "B", "C", "D", "E"]
  return {
    id,
    area,
    short,
    prompt,
    help,
    options: options.map((label, index) => ({ letter: letters[index], label })),
  }
}

export const READINESS_QUESTIONS: ReadinessQuestion[] = [
  question(
    "R1",
    "Comunicación profesional",
    "Comunicación",
    "¿Cómo gestionas actualmente la comunicación con tus consultantes?",
    "Se refiere a canales y límites, no a la calidad de tu vínculo terapéutico.",
    [
      "Uso principalmente mi número personal para llamadas, WhatsApp o SMS y mezclo comunicación personal y profesional.",
      "Utilizo WhatsApp, Telegram, email u otras herramientas con canales separados para mi práctica.",
      "Tengo canales profesionales definidos, reglas de comunicación y criterios claros sobre qué información puede compartirse por cada canal.",
      "Tengo un sistema integrado de comunicación, seguimiento y documentación, con políticas claras de privacidad y consentimiento.",
    ],
  ),
  question(
    "R2",
    "Sesiones online",
    "Sesiones",
    "¿Cómo realizas actualmente tus sesiones a distancia?",
    "Una plataforma conocida no equivale, por sí sola, a un procedimiento de privacidad.",
    [
      "Casi nunca atiendo online o dependo de llamadas telefónicas.",
      "Utilizo Zoom, Google Meet, WhatsApp u otra plataforma general.",
      "Utilizo una plataforma configurada para mi práctica y tengo definidos mis procedimientos de privacidad, consentimiento y contingencia.",
      "Mi videollamada está integrada con agenda, onboarding, seguimiento y demás procesos de mi práctica.",
    ],
  ),
  question(
    "R3",
    "Notas clínicas y documentación",
    "Documentación",
    "¿Cómo gestionas tus notas y documentación profesional?",
    "No compartas expedientes ni datos de pacientes. La opción de transcripción o IA mide el uso de esas herramientas, no una certificación.",
    [
      "Principalmente papel, Word, archivos locales u otros métodos sin una estructura de seguridad definida.",
      "Utilizo servicios generales de almacenamiento en la nube.",
      "Utilizo herramientas con controles de acceso, autenticación y medidas de seguridad apropiadas para la información que manejo.",
      "Tengo un sistema profesional de documentación con permisos, respaldo, trazabilidad y procesos definidos.",
      "Uso transcripción de voz/IA o automatización documental con revisión humana y criterios definidos sobre consentimiento, privacidad y almacenamiento.",
    ],
  ),
  question(
    "R4",
    "IA, LLMs y copilotos",
    "IA",
    "¿Cómo utilizas actualmente IA en tu práctica?",
    "No uses este espacio para pegar textos de pacientes. Un modelo público sin protocolo no es lo mismo que un marco profesional.",
    [
      "No utilizo IA.",
      "Utilizo herramientas como ChatGPT, Claude u otras para tareas generales, pero no tengo un protocolo específico para su uso profesional.",
      "Utilizo IA para tareas no clínicas o con información cuidadosamente anonimizada, evitando compartir información identificable sin una base adecuada.",
      "Utilizo copilotos o herramientas especializadas para tareas como transcripción, organización o documentación, con revisión humana.",
      "Tengo un marco definido para IA que contempla privacidad, consentimiento, límites clínicos, revisión humana y qué decisiones nunca delego a una IA.",
    ],
  ),
  question(
    "R5",
    "Identidad y soberanía profesional",
    "Identidad",
    "¿Quién controla tu presencia profesional online?",
    "Mide control de canales propios, no reputación ni número de seguidores.",
    [
      "No tengo presencia profesional significativa en internet.",
      "Mi presencia depende principalmente de directorios o plataformas de terceros.",
      "Tengo perfiles profesionales propios, pero todavía dependo bastante de plataformas externas.",
      "Controlo mi dominio, sitio web, correo y perfiles profesionales principales.",
      "Tengo un ecosistema digital profesional propio y una estrategia para mantener mi identidad, contenido y relación con mis consultantes bajo mi control.",
    ],
  ),
  question(
    "R6",
    "Ética, privacidad y consentimiento",
    "Privacidad",
    "¿Cómo manejas privacidad y consentimiento en tu práctica digital?",
    "Es una orientación educativa. No sustituye asesoría legal ni un dictamen sobre tu jurisdicción.",
    [
      "Principalmente mediante acuerdos verbales o documentos generales.",
      "Tengo consentimiento informado, pero no contempla específicamente todas las herramientas digitales que utilizo.",
      "Tengo políticas y consentimiento adaptados a mi práctica online y reviso qué información comparto con proveedores tecnológicos.",
      "Tengo procesos documentados para consentimiento, privacidad, almacenamiento, acceso y manejo de incidentes.",
      "Además, reviso periódicamente mis herramientas, proveedores y flujos para asegurar que continúan siendo adecuados para mi práctica y jurisdicción.",
    ],
  ),
  question(
    "R7",
    "Pagos, divisas y comisiones",
    "Pagos",
    "¿Cómo gestionas tus cobros?",
    "No pedimos montos, cuentas ni datos fiscales.",
    [
      "Principalmente efectivo o transferencias locales.",
      "Utilizo plataformas digitales de pago, pero no tengo mucho control sobre comisiones o conversión de divisas.",
      "Tengo un sistema definido para pagos digitales y conozco mis principales costos.",
      "Puedo cobrar en diferentes monedas y tengo control sobre comisiones, conversiones y conciliación.",
      "Tengo una operación preparada para pagos internacionales y entiendo cómo afectan a mi negocio las comisiones, divisas, impuestos y obligaciones aplicables.",
    ],
  ),
  question(
    "R8",
    "Fiscalidad y operación profesional",
    "Operación",
    "¿Qué tan estructurada está tu operación administrativa y fiscal?",
    "Describe organización, no el cumplimiento de una autoridad fiscal concreta.",
    [
      "Gestiono estos temas de manera informal.",
      "Facturo cuando es necesario, pero gran parte del proceso es manual.",
      "Tengo organizado el registro y facturación de mis ingresos profesionales.",
      "Mi facturación, registros y contabilidad están sistematizados.",
      "Si trabajo internacionalmente, tengo asesoría o procesos definidos para las obligaciones fiscales o regulatorias de las jurisdicciones relevantes.",
    ],
  ),
  question(
    "R9",
    "Comunidad y supervisión",
    "Colaboración",
    "¿Cómo colaboras con otros profesionales?",
    "Trabajar sin una red digital no equivale a mala práctica clínica. Esta pregunta no evalúa tu criterio terapéutico.",
    [
      "Trabajo principalmente de manera aislada.",
      "Participo ocasionalmente en grupos o comunidades profesionales online.",
      "Participo regularmente en comunidades profesionales y/o supervisión online.",
      "Tengo una red profesional activa para supervisión, aprendizaje y colaboración, con criterios adecuados de confidencialidad.",
      "Además de participar, comparto conocimiento, colaboro en proyectos o contribuyo activamente a una comunidad profesional digital.",
    ],
  ),
  question(
    "R10",
    "Investigación y economía del conocimiento",
    "Conocimiento",
    "¿Qué haces con tu conocimiento profesional fuera de la consulta?",
    "Atender solo en consulta es una posición válida. Aquí se mide circulación de conocimiento, no competencia clínica.",
    [
      "Mi actividad se concentra principalmente en atender pacientes.",
      "Comparto ocasionalmente contenido profesional online.",
      "Publico artículos, investigaciones, materiales educativos o participo en formación online.",
      "También doy cursos, webinars, supervisión, consultoría u otras actividades profesionales digitales.",
      "He conseguido que mi conocimiento genere oportunidades profesionales o económicas, incluyendo investigación, publicaciones, formación, colaboraciones o proyectos financiados.",
    ],
  ),
]

const QUESTION_BY_ID = Object.fromEntries(READINESS_QUESTIONS.map((item) => [item.id, item])) as Record<
  ReadinessId,
  ReadinessQuestion
>

const PRIORITY_ACTION: Record<ReadinessId, string> = {
  R1: "Separar el canal profesional de tu número personal y definir qué información puede viajar por cada medio.",
  R2: "Pasar de una videollamada genérica a un procedimiento de sesión con privacidad y contingencia.",
  R3: "Ordenar notas y almacenamiento con acceso controlado, sin improvisar el expediente.",
  R4: "Crear un marco seguro para incorporar IA a tu práctica sin delegar decisiones que requieren criterio clínico.",
  R5: "Construir una presencia profesional que no dependa solo de directorios o plataformas de terceros.",
  R6: "Adaptar consentimiento y privacidad a las herramientas digitales que ya usas.",
  R7: "Tener visibilidad de comisiones, divisas y conciliación en tus cobros.",
  R8: "Sistematizar facturación y registros para que la operación no dependa de lo informal.",
  R9: "Encontrar una red profesional digital para consultar y aprender, sin confundir eso con tu criterio clínico.",
  R10: "Decidir si quieres que tu conocimiento circule más allá de la consulta, y con qué formato.",
}

const PRODUCT_ORDER: ReadinessId[] = ["R4", "R6", "R3", "R7", "R5", "R1", "R2", "R8", "R10", "R9"]
const STRENGTH_ORDER: ReadinessId[] = ["R5", "R1", "R9", "R2", "R10", "R8", "R7", "R6", "R3", "R4"]

const BANDS: Record<ReadinessBandId, { label: string; title: string; description: string; maxPercent: number }> = {
  foundation: {
    label: "Digital Foundation",
    title: "Tu práctica todavía depende principalmente de procesos tradicionales.",
    description: "Hay una base para empezar a digitalizar sin pretender que ya opera como un sistema integrado.",
    maxPercent: 40,
  },
  transition: {
    label: "Digital Transition",
    title: "Ya utilizas tecnología, pero hay procesos fragmentados.",
    description: "Las herramientas están; falta ordenar límites, costos y cómo se hablan entre sí.",
    maxPercent: 60,
  },
  professional: {
    label: "Digital Professional",
    title: "Tu práctica tiene una estructura digital sólida.",
    description: "Hay una buena base, y todavía hay margen para integrar IA, privacidad u operación con más criterio.",
    maxPercent: 80,
  },
  "ai-ready": {
    label: "Digital + AI Ready",
    title: "Tienes infraestructura para incorporar herramientas nuevas con más estructura.",
    description: "Un puntaje alto no elimina una alerta de privacidad o de IA. Revisa las banderas si aparecen.",
    maxPercent: 100,
  },
}

class ReadinessError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ReadinessError"
  }
}

function isReadinessId(value: unknown): value is ReadinessId {
  return typeof value === "string" && (READINESS_IDS as string[]).includes(value)
}

function isLetter(value: unknown): value is ReadinessLetter {
  return typeof value === "string" && (LETTERS as string[]).includes(value)
}

function assertAnswers(answers: unknown): asserts answers is ReadinessAnswers {
  if (answers === null || typeof answers !== "object" || Array.isArray(answers)) {
    throw new ReadinessError("Las respuestas deben ser un mapa por identificador de pregunta.")
  }
  for (const [key, value] of Object.entries(answers)) {
    if (!isReadinessId(key)) {
      throw new ReadinessError(`Identificador no admitido: ${key}`)
    }
    if (!isLetter(value)) {
      throw new ReadinessError(`Valor no admitido para ${key}.`)
    }
    const allowed = QUESTION_BY_ID[key].options.map((option) => option.letter)
    if (!allowed.includes(value)) {
      throw new ReadinessError(`La opción ${value} no existe en ${key}.`)
    }
  }
}

export function readinessPoints(id: ReadinessId, letter: ReadinessLetter): number {
  const maxLetter = QUESTION_BY_ID[id].options.at(-1)?.letter
  const index = LETTERS.indexOf(letter)
  if (maxLetter === "D") {
    return [0, 1, 2, 4][index] ?? 0
  }
  return index
}

function bandFor(percent: number): ReadinessResult["band"] {
  const id: ReadinessBandId =
    percent <= BANDS.foundation.maxPercent
      ? "foundation"
      : percent <= BANDS.transition.maxPercent
        ? "transition"
        : percent <= BANDS.professional.maxPercent
          ? "professional"
          : "ai-ready"
  const band = BANDS[id]
  return { id, label: band.label, title: band.title, description: band.description }
}

function flagsFor(answers: Record<ReadinessId, ReadinessLetter>): RiskFlag[] {
  const flags: RiskFlag[] = []
  if (answers.R1 === "A") {
    flags.push({
      id: "R1",
      severity: "attention",
      title: "Canal personal mezclado con la consulta",
      message:
        "Usar tu número personal para la práctica puede diluir el encuadre y exponer información en un hilo que no está pensado para la consulta. Revisa ese flujo antes de sumar más herramientas.",
    })
  }
  if (answers.R3 === "A") {
    flags.push({
      id: "R3",
      severity: "critical",
      title: "Documentación sin estructura de seguridad",
      message:
        "Notas en papel, Word o archivos sueltos, sin un criterio de acceso, dejan el expediente a merced del dispositivo. Te recomendamos revisar este flujo antes de incorporar más automatización.",
    })
  }
  if (answers.R3 === "B") {
    flags.push({
      id: "R3",
      severity: "attention",
      title: "Almacenamiento general en la nube",
      message:
        "Un servicio general no te dice, por sí solo, dónde quedan los datos ni quién puede acceder. Conviene revisar proveedores y permisos.",
    })
  }
  if (answers.R4 === "B") {
    flags.push({
      id: "R4",
      severity: "critical",
      title: "IA pública sin protocolo profesional",
      message:
        "Usar un modelo general sin un criterio definido no prueba una filtración, pero sí una vulnerabilidad frecuente: no está claro qué nunca se pega en esa herramienta. Un puntaje alto en otras áreas no anula esta alerta.",
    })
  }
  if (answers.R6 === "A") {
    flags.push({
      id: "R6",
      severity: "critical",
      title: "Consentimiento no cubre el entorno digital",
      message:
        "Un acuerdo verbal o un documento general suele no alcanzar para herramientas, proveedores e incidentes. Es una señal educativa, no un dictamen legal.",
    })
  }
  return flags
}

export function setReadinessAnswer(
  answers: ReadinessAnswers,
  id: ReadinessId,
  letter: ReadinessLetter,
): ReadinessAnswers {
  assertAnswers(answers)
  if (!isReadinessId(id)) throw new ReadinessError("Identificador no admitido.")
  assertAnswers({ [id]: letter })
  return { ...answers, [id]: letter }
}

export function evaluateReadiness(answers: ReadinessAnswers): ReadinessResult {
  assertAnswers(answers)
  const unanswered = READINESS_IDS.filter((id) => answers[id] === undefined)
  if (unanswered.length > 0) {
    return {
      version: READINESS_VERSION,
      status: "incomplete",
      unanswered,
      total: 0,
      maxTotal: READINESS_MAX_TOTAL,
      percent: 0,
      band: bandFor(0),
      scores: [],
      strengths: [],
      opportunities: [],
      priority: null,
      flags: [],
      offer: null,
    }
  }

  const complete = answers as Record<ReadinessId, ReadinessLetter>
  const scores: AreaScore[] = READINESS_IDS.map((id) => {
    const question = QUESTION_BY_ID[id]
    const letter = complete[id]
    return {
      id,
      area: question.area,
      short: question.short,
      letter,
      points: readinessPoints(id, letter),
      max: 4,
    }
  })
  const total = scores.reduce((sum, item) => sum + item.points, 0)
  const percent = Math.round((total / READINESS_MAX_TOTAL) * 100)
  const flags = flagsFor(complete)

  const strengths = [...scores]
    .filter((item) => item.points >= 3)
    .sort((a, b) => b.points - a.points || STRENGTH_ORDER.indexOf(a.id) - STRENGTH_ORDER.indexOf(b.id))
    .slice(0, 3)

  const opportunities = [...scores]
    .sort((a, b) => a.points - b.points || PRODUCT_ORDER.indexOf(a.id) - PRODUCT_ORDER.indexOf(b.id))
    .filter((item) => item.points <= 2)
    .slice(0, 3)

  const critical = flags.find((flag) => flag.severity === "critical")
  const lowest = [...scores].sort(
    (a, b) => a.points - b.points || PRODUCT_ORDER.indexOf(a.id) - PRODUCT_ORDER.indexOf(b.id),
  )[0]
  const priorityId = critical?.id ?? (opportunities[0]?.id || lowest?.id)
  const priority = priorityId
    ? { id: priorityId, area: QUESTION_BY_ID[priorityId].area, action: PRIORITY_ACTION[priorityId] }
    : null

  return {
    version: READINESS_VERSION,
    status: "ready",
    unanswered: [],
    total,
    maxTotal: READINESS_MAX_TOTAL,
    percent,
    band: bandFor(percent),
    scores,
    strengths,
    opportunities,
    priority,
    flags,
    offer: {
      title: "Explora cómo avanzar",
      description:
        opportunities.length > 0
          ? `Tu práctica tiene potencial para avanzar en: ${opportunities.map((item) => item.short).join(", ")}.`
          : "Puedes seguir profundizando en IA responsable, privacidad y operación digital con la comunidad.",
      href: READINESS_COMMUNITY_URL,
      linkLabel: "Entrar a Comunidad Motus",
    },
  }
}

export function readinessQuestionById(id: ReadinessId): ReadinessQuestion {
  return QUESTION_BY_ID[id]
}
