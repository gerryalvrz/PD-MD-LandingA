export const EXPERIENCE_GENESIS = {
  eyebrow: "Bloque Génesis",
  title: "Tu viaje comienza aquí",
  body: "Entrada gratuita a la Academia y a la comunidad MotusDAO. El punto de partida antes de ordenar tu práctica digital.",
  ctaLabel: "Abrir Bloque Génesis",
  href: "https://app.motusdao.org/academia/01-genesis",
  imageSrc: "/experience/bloque-genesis.jpg",
  imageAlt:
    "Ilustración del hub digital Bloque Génesis de MotusDAO: plaza isométrica con mapa, manifiesto y paneles de comunidad",
  imageWidth: 1024,
  imageHeight: 768,
  exploreId: "genesis",
} as const

export const EXPERIENCE_APP_CTA = {
  href: "https://app.motusdao.org",
  label: "Explora y regístrate",
  exploreId: "app_register",
} as const

export const EXPERIENCE_APP_SHOWCASE = {
  imageSrc: "/experience/app-wallet.png",
  imageAlt:
    "Pantalla de la App MotusDAO: enviar y recibir cripto desde la wallet integrada, con tokens y Motus Name",
  imageWidth: 512,
  imageHeight: 512,
} as const

export type AppModuleIcon =
  | "ai"
  | "profile"
  | "reputation"
  | "supervision"
  | "academy"
  | "payments"
  | "video"
  | "journal"

export type AppModuleInline = string | { href: string; label: string }
export type AppModuleParagraph = string | readonly AppModuleInline[]

export type AppModule = {
  id: string
  title: string
  line: string
  aside?: string
  /** Longer explanation shown in the detail modal (no login required). */
  detail: string | readonly AppModuleParagraph[]
  points: readonly string[]
  linkLabel: string
  icon: AppModuleIcon
}

export function appModuleParagraphs(detail: AppModule["detail"]): AppModuleParagraph[] {
  if (typeof detail === "string") return detail.split("\n\n")
  return [...detail]
}

/** Hub product copy aligned with Genesis lesson “Lo que hay dentro” + PSM surfaces. */
export const APP_MODULES: AppModule[] = [
  {
    id: "motusai",
    title: "MotusAI",
    line: "Asistente para profesionales: apoyo para pensar casos y preguntas del ecosistema.",
    aside: "Usa casos anónimos. No sustituye tu juicio clínico ni es una historia clínica.",
    detail:
      "MotusAI es el asistente orientado a profesionales clínicos de MotusDAO. Sirve para consultar el ecosistema, los cursos y para pensar casos — incluye un modo supervisor experimental. Está pensado como apoyo reflexivo, no como reemplazo de supervisión humana ni de tu criterio profesional.",
    points: [
      "Preguntas sobre la ruta, la Academia y el Hub",
      "Apoyo para formular hipótesis y revisar un caso (modo supervisor experimental)",
      "Privacidad en el procesamiento; describe el caso sin datos identificables",
      "No diagnostica, no es expediente clínico y no atiende emergencias",
    ],
    linkLabel: "Saber más",
    icon: "ai",
  },
  {
    id: "perfil",
    title: "Tu perfil",
    line: "Arma tu identidad clínica: especialidades, bio, capacidad de atención y documentos.",
    detail:
      "En Perfil construyes tu identidad profesional. Esa misma información alimenta tu presencia pública en Psicoterapia, donde las personas pueden conocerte y agendar. Completar el perfil no implica pago: es el paso para que te conozcan en el ecosistema.",
    points: [
      "Especialidades, bio, formación y capacidad de atención",
      "Documentación profesional cuando aplica (verificación)",
      "Base de tu presencia pública en Psicoterapia",
      "Emparejamientos activos y control del consultorio desde el mismo lugar",
    ],
    linkLabel: "Saber más",
    icon: "profile",
  },
  {
    id: "reputacion",
    title: "Reputación digital",
    line: "Confianza pública con verificación, opiniones y trayectoria — no likes vacíos.",
    detail:
      "Tu reputación en MotusDAO se construye con señales profesionales: verificación, opiniones de quienes trabajaron contigo y trayectoria visible. Puedes sumar certificados para ganar más confianza en el ecosistema. No es un juego de seguidores: es credibilidad clínica legible.",
    points: [
      "Badge de profesional verificado cuando tu documentación está aprobada",
      "Opiniones y valoración pública cuando hay suficiente historial",
      "Trayectoria y capacidad de atención visibles en tu perfil",
      "Certificados y formación que refuerzan confianza",
    ],
    linkLabel: "Saber más",
    icon: "reputation",
  },
  {
    id: "supervision",
    title: "Supervisión",
    line: "Espacio para revisar casos con estructura profesional y seguimiento claro.",
    detail:
      "La supervisión en MotusDAO te da un lugar para revisar casos con estructura: prioridad, notas y progreso. Complementa el modo supervisor de MotusAI (reflexión con IA) con un espacio de seguimiento profesional dentro del Hub.",
    points: [
      "Organiza casos activos, pendientes y completados",
      "Notas y etiquetas para el seguimiento clínico",
      "Complementa MotusAI: reflexión con IA vs. supervisión estructurada",
      "Parte del recorrido profesional de la práctica digital",
    ],
    linkLabel: "Saber más",
    icon: "supervision",
  },
  {
    id: "academia",
    title: "Academia",
    line: "Formación continua en la app: de Génesis a Portal, con lecciones y avance visible.",
    detail:
      "La Academia es el catálogo de bloques, lecciones y progreso. Arrancas en Génesis gratis; Fundamentos y lo que sigue aparecen cuando quieras avanzar. Educación continua para tu práctica digital — no sustituye cédula, licencia ni supervisión clínica formal.",
    points: [
      "Bloques de ruta: Génesis → Fundamentos → Praxis → Validación → Portal",
      "Lecciones, progreso y recursos por etapa",
      "Génesis gratuito como puerta de entrada",
      "Praxis y formación aplicada cuando eliges profundizar",
    ],
    linkLabel: "Saber más",
    icon: "academy",
  },
  {
    id: "pagos",
    title: "Pagos",
    line: "Envía y recibe desde tu wallet integrada, con autocustodia. MotusDAO no custodia tus fondos.",
    detail: [
      [
        "Envía y recibe desde tu wallet integrada en MotusDAO, con autocustodia protegida por ",
        { href: "https://human.tech", label: "human.tech" },
        " ",
        { href: "https://waap.human.tech", label: "WaaP" },
        ". MotusDAO no custodia tus fondos ni puede moverlos por ti.",
      ],
    ],
    points: [
      "Wallet integrada para enviar y recibir",
      "Tú autorizas tus operaciones",
      "Motus Name para simplificar direcciones",
      "Onramp / offramp según disponibilidad",
    ],
    linkLabel: "Saber más",
    icon: "payments",
  },
  {
    id: "videochat",
    title: "Videochat para tu consultorio",
    line: "Salas de videollamada con canal propio, separadas de tus cuentas personales.",
    detail:
      "Salas de videollamada integradas a tu práctica en MotusDAO. Tu consultorio tiene un canal propio, separado de tus cuentas personales.\n\nEl paciente entra desde cualquier dispositivo con un link único, sin instalar nada.",
    points: [
      "Sala vinculada a tu cuenta y sesión",
      "Acceso por link único",
      "Sin instalar apps adicionales",
      "Consultorio por app dedicada no zoom, ni meet.",
    ],
    linkLabel: "Saber más",
    icon: "video",
  },
  {
    id: "bitacora",
    title: "Bitácora",
    line: "Espacio de registro para anotar y organizar lo que acompaña tu práctica profesional.",
    detail:
      "La Bitácora es un espacio de registro dentro del ecosistema MotusDAO. Sirve para anotar y organizar información que acompaña tu práctica profesional sin dispersarla entre notas, documentos y chats.\n\nNo sustituye un expediente clínico completo: es una herramienta de organización y seguimiento de tu práctica dentro del Hub.",
    points: [
      "Notas y registros organizados en un solo lugar",
      "Un espacio diseñado específicamente para acompañar tu práctica profesional",
      "Entradas con contexto, estado y etiquetas para facilitar su seguimiento",
      "Una base para integrar progresivamente herramientas de gestión del consultorio",
    ],
    linkLabel: "Saber más",
    icon: "journal",
  },
]
