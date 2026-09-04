/**
 * Motus Practice Index — mpi-0.1-candidate
 * Source: outputs/S4-fundamento-instrumento.md (overrides the SDD score model).
 * Ordinal answers are never summed. No clinical, legal or Portal eligibility inference.
 */

export type QuestionId = "Q1" | "Q2" | "Q3" | "Q4" | "Q5" | "Q6" | "Q7" | "Q8" | "Q9" | "Q10"
export type AnswerValue = 0 | 1 | 2 | 3 | 4 | "UNKNOWN" | "NA" | "SKIP"
export type PracticeContext = "starting" | "transitioning" | "online"
export type Answers = Partial<Record<QuestionId, AnswerValue>>
export type ResultStatus = "incomplete" | "insufficient" | "ready"
export type PriorityMode = "start" | "develop" | "review" | "maintain"

export type QuestionOption = { value: AnswerValue; label: string }
export type Question = {
  id: QuestionId
  area: string
  prompt: string
  options: QuestionOption[]
  help: string
}

export type Priority = {
  questionId: QuestionId
  area: string
  title: string
  answerLabel: string
  level: number
  reason: string
  mode: PriorityMode
}

export type ResultPointer = {
  questionId: QuestionId
  area: string
  answerLabel: string
}

export type Recommendation = {
  title: string
  description: string
  href: string
  linkLabel: string
}

export type PracticeResult = {
  version: string
  status: ResultStatus
  unanswered: QuestionId[]
  numericCount: number
  excludedCounts: { unknown: number; na: number; skip: number }
  unorientedAreas: string[]
  priority: Priority | null
  alternative: ResultPointer | null
  established: ResultPointer | null
  actions: string[]
  recommendation: Recommendation | null
}

export const METHOD_VERSION = "mpi-0.1-candidate"
export const MIN_NUMERIC_COVERAGE = 6
export const QUESTION_IDS: QuestionId[] = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10"]

const HUB = "https://app.motusdao.org"
const FUNDAMENTOS_URL = `${HUB}/academia/02-fundamentos`
const PRAXIS_URL = `${HUB}/academia/03-praxis#catalogo`

export const CONTEXT_OPTIONS: { value: PracticeContext; label: string }[] = [
  { value: "starting", label: "Estoy preparando el inicio de mi práctica." },
  { value: "transitioning", label: "Ya atiendo y quiero incorporar la modalidad online." },
  { value: "online", label: "Ya atiendo online." },
]

const OMISSIONS: QuestionOption[] = [
  { value: "UNKNOWN", label: "No lo sé" },
  { value: "NA", label: "No aplica a mi práctica" },
  { value: "SKIP", label: "Prefiero omitir" },
]

function question(
  id: QuestionId,
  area: string,
  prompt: string,
  labels: [string, string, string, string, string],
  help: string,
): Question {
  return {
    id,
    area,
    prompt,
    help,
    options: [
      { value: 0, label: labels[0] },
      { value: 1, label: labels[1] },
      { value: 2, label: labels[2] },
      { value: 3, label: labels[3] },
      { value: 4, label: labels[4] },
      ...OMISSIONS,
    ],
  }
}

export const QUESTIONS: Question[] = [
  question(
    "Q1",
    "Presencia profesional",
    "Cuando alguien quiere saber sobre tu trabajo, ¿qué puede encontrar sobre ti y tus servicios?",
    [
      "Todavía no tengo información profesional publicada.",
      "Ya estoy preparando qué quiero mostrar y dónde publicarlo.",
      "Ya tengo información publicada en algún lugar, como redes, directorio o página.",
      "Mantengo actualizada la información sobre lo que ofrezco y cómo contactarme.",
      "Ya revisé si esa información se entiende fácilmente y la ajusté cuando fue necesario.",
    ],
    "Puede ser una página, directorio o perfil profesional. No evalúa reputación ni calidad clínica.",
  ),
  question(
    "Q2",
    "Origen de consultas",
    "Cuando alguien nuevo te contacta, ¿sabes cómo llegó a ti?",
    [
      "Normalmente no sé o no lo registro.",
      "Estoy pensando cómo identificarlo.",
      "Algunas veces anoto si llegó por recomendación, redes, directorio u otro canal.",
      "Habitualmente identifico de dónde llegan las nuevas consultas.",
      "Ya he revisado esos datos para entender qué canales realmente me están funcionando.",
    ],
    "Puede no aplicar si todavía no recibes consultas o trabajas dentro de una institución. No mide capacidad para atraer pacientes.",
  ),
  question(
    "Q3",
    "Agenda",
    "¿Qué tan clara tienes tu forma de organizar las citas?",
    [
      "Todavía no tengo una forma definida de hacerlo.",
      "Estoy eligiendo cómo organizar mis citas.",
      "Ya probé una forma, aunque todavía la uso de manera irregular.",
      "Tengo una forma que uso habitualmente para organizar mis citas.",
      "Ya revisé cómo me está funcionando y ajusté lo necesario.",
    ],
    "Puede ser una agenda, Calendar, WhatsApp u otra herramienta. No necesitas software especializado.",
  ),
  question(
    "Q4",
    "Sesiones online",
    "Antes de atender online, ¿qué tan preparado tienes el medio que utilizas para la sesión?",
    [
      "Todavía no he elegido cómo realizar las sesiones online.",
      "Ya elegí una opción, pero todavía no la he probado.",
      "Ya hice al menos una prueba antes de usarla normalmente.",
      "Ya sé cómo prepararla y la utilizo habitualmente para mis sesiones.",
      "Ya revisé cómo me funciona en la práctica y he ajustado mi forma de usarla.",
    ],
    "Una prueba técnica no certifica privacidad, seguridad ni idoneidad de la plataforma.",
  ),
  question(
    "Q5",
    "Acceso a información",
    "Piensa en tu correo, WhatsApp, archivos y dispositivos de trabajo. ¿Tienes claro quién puede acceder a esa información?",
    [
      "No lo he revisado.",
      "Estoy identificando dónde guardo información y quién puede verla.",
      "Ya hice algunos ajustes básicos de acceso.",
      "Tengo definido quién puede acceder a mis herramientas e información de trabajo.",
      "Ya revisé esos accesos y corregí los que no necesitaba.",
    ],
    "No compartas nombres, contraseñas, expedientes ni información de pacientes.",
  ),
  question(
    "Q6",
    "Condiciones de atención online",
    "Antes de empezar a trabajar con alguien online, ¿cómo explicas las condiciones de la atención?",
    [
      "Todavía no tengo una forma definida de explicarlas.",
      "Estoy preparando qué necesito comunicar.",
      "Ya lo he explicado en algunas ocasiones.",
      "Tengo una forma habitual de explicarlo antes de comenzar.",
      "Ya revisé si lo que comunico es claro y he hecho ajustes cuando los necesito.",
    ],
    "Puede incluir modalidad, horarios, honorarios, cancelaciones y forma de trabajo. No evalúa cumplimiento legal integral.",
  ),
  question(
    "Q7",
    "Situaciones urgentes",
    "Si durante una sesión online ocurre una situación urgente o necesitas interrumpir o derivar la atención, ¿qué tan claro tienes qué hacer?",
    [
      "Todavía no he pensado qué haría.",
      "Ya empecé a definir cómo respondería.",
      "Tengo claros algunos pasos y a quién podría recurrir.",
      "Tengo una forma definida de actuar y la he repasado para saber cómo aplicarla.",
      "Ya revisé si esos pasos siguen siendo adecuados para mi contexto y los he ajustado cuando corresponde.",
    ],
    "No necesitas haber vivido una urgencia. Esta respuesta no evalúa ni certifica capacidad clínica de respuesta.",
  ),
  question(
    "Q8",
    "Formación",
    "¿Cómo decides qué necesitas aprender o actualizar para tu práctica online?",
    [
      "No estoy trabajando actualmente en ningún tema específico.",
      "Ya identifiqué algo que quiero aprender o actualizar.",
      "Ya empecé a estudiarlo o practicarlo.",
      "Mantengo una forma regular de actualizarme en los temas que necesito.",
      "Reviso qué me sirvió y decido cuál es el siguiente tema que necesito trabajar.",
    ],
    "No exige comprar cursos ni equipara formación acumulada con competencia clínica.",
  ),
  question(
    "Q9",
    "Apoyo profesional",
    "Cuando aparece una duda profesional que quieres revisar con alguien más, ¿tienes a quién recurrir?",
    [
      "Actualmente no tengo a quién consultar.",
      "Estoy buscando un espacio o una persona adecuada.",
      "Ya identifiqué a alguien o algún espacio al que podría recurrir.",
      "Cuando lo necesito, recurro a un supervisor, colega o espacio profesional que ya conozco.",
      "Ya he revisado si ese apoyo realmente responde a lo que necesito y busco otras opciones cuando hace falta.",
    ],
    "Puede ser supervisión, intervisión o consulta con colegas. No establece una obligación universal de supervisión.",
  ),
  question(
    "Q10",
    "Revisión de la práctica",
    "De vez en cuando, ¿te detienes a revisar qué partes de tu forma de trabajar te están funcionando y cuáles necesitas cambiar?",
    [
      "Normalmente no hago esa revisión.",
      "Ya identifiqué algún aspecto que quiero revisar.",
      "Ya hice una primera revisión de cómo estoy trabajando.",
      "Lo hago de vez en cuando como parte de mi forma de trabajar.",
      "Uso esas revisiones para decidir concretamente qué mantener y qué ajustar.",
    ],
    "Se refiere al funcionamiento operativo de tu práctica, no a ingresos ni resultados clínicos.",
  ),
]

const QUESTION_BY_ID = Object.fromEntries(QUESTIONS.map((item) => [item.id, item])) as Record<QuestionId, Question>

const FOCUS_TITLE: Record<QuestionId, string> = {
  Q1: "organizar tu presencia profesional",
  Q2: "organizar tus canales de consulta",
  Q3: "organizar la agenda",
  Q4: "preparar el entorno de sesión",
  Q5: "cuidar la información",
  Q6: "comunicar el encuadre online",
  Q7: "revisar la preparación online",
  Q8: "organizar tu formación",
  Q9: "definir tu red de apoyo profesional",
  Q10: "revisar tus procesos",
}

const ACTION_BANK: Record<QuestionId, [string, string, string]> = {
  Q1: [
    "Escribe a quién atiendes y qué servicio ofreces.",
    "Revisa claridad con un colega.",
    "Actualiza una presentación pública.",
  ],
  Q2: [
    "Define categorías de procedencia.",
    "Registra solo información agregada para esta revisión.",
    "Revisa qué canales resultan útiles.",
  ],
  Q3: [
    "Define una fuente de citas.",
    "Establece cómo confirmar y reprogramar.",
    "Revisa conflictos sin compartir datos personales.",
  ],
  Q4: [
    "Revisa el funcionamiento del medio elegido.",
    "Haz una prueba sin pacientes.",
    "Documenta una alternativa ante fallos de conexión.",
  ],
  Q5: [
    "Identifica dónde manejas información.",
    "Revisa quién necesita acceso.",
    "Busca orientación pertinente para ajustar controles.",
  ],
  Q6: [
    "Localiza o prepara tu procedimiento de encuadre online.",
    "Revisa si se comprende.",
    "Identifica qué adaptar con apoyo pertinente.",
  ],
  Q7: [
    "Identifica tu procedimiento actual.",
    "Busca guía adecuada a tu jurisdicción y contexto.",
    "Revísalo con una persona competente.",
  ],
  Q8: [
    "Elige una necesidad concreta.",
    "Selecciona un recurso pertinente.",
    "Fija una fecha para revisar lo aprendido.",
  ],
  Q9: [
    "Identifica el apoyo que necesitas.",
    "Ubica una vía profesional adecuada.",
    "Define cuándo recurrir a ella.",
  ],
  Q10: [
    "Elige un aspecto operativo observable.",
    "Agenda su revisión.",
    "Registra qué mantendrás o ajustarás y cuándo revisarlo.",
  ],
}

const GENERAL_ACTIONS = [
  "Escoge un proceso de tu práctica que sí corresponda revisar.",
  "Descríbelo en privado, sin datos de pacientes.",
  "Elige un recurso pertinente para revisarlo.",
]

const SENSITIVE_ORDER: QuestionId[] = ["Q7", "Q5", "Q6"]
const OTHER_LOW_ORDER: QuestionId[] = ["Q3", "Q4", "Q1", "Q2", "Q8", "Q9", "Q10"]
const HIGH_ORDER: QuestionId[] = ["Q7", "Q5", "Q6", "Q3", "Q4", "Q1", "Q2", "Q8", "Q9", "Q10"]
const ESTABLISHED_ORDER: QuestionId[] = ["Q3", "Q1", "Q4", "Q8", "Q9", "Q10", "Q2", "Q6", "Q5", "Q7"]

class PracticeIndexError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PracticeIndexError"
  }
}

function isQuestionId(value: unknown): value is QuestionId {
  return typeof value === "string" && (QUESTION_IDS as string[]).includes(value)
}

function isNumericAnswer(value: unknown): value is 0 | 1 | 2 | 3 | 4 {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 4
}

function isOmission(value: unknown): value is "UNKNOWN" | "NA" | "SKIP" {
  return value === "UNKNOWN" || value === "NA" || value === "SKIP"
}

function isAnswerValue(value: unknown): value is AnswerValue {
  return isNumericAnswer(value) || isOmission(value)
}

function isPracticeContext(value: unknown): value is PracticeContext {
  return value === "starting" || value === "transitioning" || value === "online"
}

function assertAnswersShape(answers: unknown): asserts answers is Answers {
  if (answers === null || typeof answers !== "object" || Array.isArray(answers)) {
    throw new PracticeIndexError("Las respuestas deben ser un mapa por identificador de pregunta.")
  }
  for (const [key, value] of Object.entries(answers)) {
    if (!isQuestionId(key)) {
      throw new PracticeIndexError(`Identificador de pregunta no admitido: ${key}`)
    }
    if (!isAnswerValue(value)) {
      throw new PracticeIndexError(`Valor no admitido para ${key}.`)
    }
  }
}

export function setAnswer(answers: Answers, id: QuestionId, value: AnswerValue): Answers {
  assertAnswersShape(answers)
  if (!isQuestionId(id)) {
    throw new PracticeIndexError("Identificador de pregunta no admitido.")
  }
  if (!isAnswerValue(value)) {
    throw new PracticeIndexError("Valor de respuesta no admitido.")
  }
  return { ...answers, [id]: value }
}

function optionLabel(id: QuestionId, value: AnswerValue): string {
  const match = QUESTION_BY_ID[id].options.find((option) => option.value === value)
  return match?.label ?? ""
}

function modeFor(level: number): PriorityMode {
  if (level <= 1) return "start"
  if (level === 2) return "develop"
  if (level === 3) return "review"
  return "maintain"
}

function pickLowest(
  order: QuestionId[],
  answers: Answers,
  maxLevel: number,
): { id: QuestionId; level: number; tied: QuestionId[] } | null {
  const eligible = order.filter((id) => isNumericAnswer(answers[id]) && (answers[id] as number) <= maxLevel)
  if (eligible.length === 0) return null
  const level = Math.min(...eligible.map((id) => answers[id] as number))
  const tied = eligible.filter((id) => answers[id] === level)
  return { id: tied[0], level, tied }
}

function pointer(id: QuestionId, answers: Answers): ResultPointer {
  return {
    questionId: id,
    area: QUESTION_BY_ID[id].area,
    answerLabel: optionLabel(id, answers[id] as AnswerValue),
  }
}

function adaptActions(id: QuestionId, mode: PriorityMode, context?: PracticeContext): string[] {
  const [first, second, third] = ACTION_BANK[id]
  const framed =
    mode === "review" || mode === "maintain"
      ? [
          first.replace(/^(Define|Escribe|Elige|Identifica|Localiza o prepara)/, "Revisa"),
          second,
          third,
        ]
      : [first, second, third]

  if (context === "starting") {
    return framed.map((action) => `${action} Si todavía no atiendes, trátalo como preparación, no como una consulta en curso.`)
  }
  if (context === "transitioning") {
    return framed.map((action) => `${action} Apóyate en lo que ya haces en presencial y documenta solo lo que cambiará en online.`)
  }
  return framed
}

function recommendationFor(id: QuestionId): Recommendation {
  if (id === "Q7") {
    return {
      title: "Orientación profesional sobre procedimientos",
      description:
        "Este foco pide una guía adecuada a tu jurisdicción. Fundamentos puede apoyar el encuadre, pero una compra no resuelve por sí sola un procedimiento de urgencia.",
      href: FUNDAMENTOS_URL,
      linkLabel: "Ver recursos de Fundamentos",
    }
  }
  if (id === "Q8" || id === "Q9") {
    return {
      title: "Formación y consulta en Praxis",
      description:
        "Puedes explorar cursos, talleres o supervisión según la oferta y sus requisitos. El resultado no habilita un pase ni sustituye esa revisión.",
      href: PRAXIS_URL,
      linkLabel: "Explorar Praxis",
    }
  }
  return {
    title: "Recursos de Fundamentos para ordenar tu práctica",
    description:
      "La membresía de Práctica Digital concentra el manual, la biblioteca y actividades para organizar procesos iniciales. El resultado no concede acceso al Portal.",
    href: FUNDAMENTOS_URL,
    linkLabel: "Ver Fundamentos",
  }
}

function emptyResult(partial: Omit<PracticeResult, "version">): PracticeResult {
  return { version: METHOD_VERSION, ...partial }
}

export function evaluatePractice(answers: Answers, context?: PracticeContext): PracticeResult {
  assertAnswersShape(answers)
  if (context !== undefined && !isPracticeContext(context)) {
    throw new PracticeIndexError("Contexto no admitido.")
  }

  const unanswered = QUESTION_IDS.filter((id) => answers[id] === undefined)
  const values = QUESTION_IDS.map((id) => answers[id]).filter((value) => value !== undefined) as AnswerValue[]
  const numeric = values.filter(isNumericAnswer)
  const excludedCounts = {
    unknown: values.filter((value) => value === "UNKNOWN").length,
    na: values.filter((value) => value === "NA").length,
    skip: values.filter((value) => value === "SKIP").length,
  }
  const unorientedAreas = SENSITIVE_ORDER.filter((id) => isOmission(answers[id])).map((id) => QUESTION_BY_ID[id].area)

  const base = {
    unanswered,
    numericCount: numeric.length,
    excludedCounts,
    unorientedAreas,
    priority: null,
    alternative: null,
    established: null,
    actions: [] as string[],
    recommendation: null,
  }

  if (unanswered.length > 0) {
    return emptyResult({ ...base, status: "incomplete" })
  }

  if (numeric.length < MIN_NUMERIC_COVERAGE) {
    return emptyResult({
      ...base,
      status: "insufficient",
      actions: [...GENERAL_ACTIONS],
      recommendation: {
        title: "Explora un recurso de Fundamentos",
        description:
          "Con estas respuestas no asignamos un foco. Puedes completar más preguntas o revisar un recurso operativo, sin registro.",
        href: FUNDAMENTOS_URL,
        linkLabel: "Ver Fundamentos",
      },
    })
  }

  const sensitive = pickLowest(SENSITIVE_ORDER, answers, 2)
  const otherLow = pickLowest(OTHER_LOW_ORDER, answers, 2)
  const high = pickLowest(HIGH_ORDER, answers, 4)
  const chosen = sensitive ?? otherLow ?? high
  if (!chosen) {
    return emptyResult({ ...base, status: "insufficient", actions: [...GENERAL_ACTIONS] })
  }

  const mode = modeFor(chosen.level)
  const question = QUESTION_BY_ID[chosen.id]
  const answerLabel = optionLabel(chosen.id, answers[chosen.id] as AnswerValue)
  const alternativeId = chosen.tied.find((id) => id !== chosen.id) ?? null

  let established: ResultPointer | null = null
  const establishedIds = ESTABLISHED_ORDER.filter((id) => isNumericAnswer(answers[id]) && (answers[id] as number) >= 3)
  if (establishedIds.length > 0) {
    const best = Math.max(...establishedIds.map((id) => answers[id] as number))
    const winner = establishedIds.find((id) => answers[id] === best)
    if (winner) established = pointer(winner, answers)
  }

  return emptyResult({
    ...base,
    status: "ready",
    priority: {
      questionId: chosen.id,
      area: question.area,
      title: FOCUS_TITLE[chosen.id],
      answerLabel,
      level: chosen.level,
      reason: `En ${question.area.toLowerCase()} seleccionaste “${answerLabel.replace(/\.$/, "")}”.`,
      mode,
    },
    alternative: alternativeId ? pointer(alternativeId, answers) : null,
    established,
    actions: adaptActions(chosen.id, mode, context),
    recommendation: recommendationFor(chosen.id),
  })
}

export function questionById(id: QuestionId): Question {
  return QUESTION_BY_ID[id]
}
