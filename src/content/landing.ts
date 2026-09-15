/** Shared marketing copy for UI, SEO, GEO (/llms.txt), and JSON-LD. */

export const CANONICAL_SITE_URL = "https://academia.motusdao.org"

export const LANDING_META = {
  title: "MotusDAO — Membresía y ruta profesional para psicólogos",
  description:
    "Recursos, formación y comunidad para tu práctica digital. Conoce la membresía desde USD 20/mes y la ruta de cinco bloques hacia el Portal Clínico de MotusDAO.",
  headline: "Dale estructura a tu práctica digital.",
  lede:
    "Formación, herramientas y comunidad para ejercer online con mayor claridad.",
  audience: "Profesionales de salud mental",
  priceLine: "USD 20/mes · USD 120/año precio fundador",
  savingsBadge: "Mitad de precio · de USD 240 a USD 120 · por tiempo limitado",
  orgName: "MotusDAO",
  orgEmail: "contact@motusdao.org",
  contactEmail: "contact@motusdao.org",
  footerBrand: "MotusDAO · Ruta profesional PSM",
  footerLegal: "© 2026 MotusDAO · Todos los derechos reservados",
} as const

export const LANDING_OFFERS = {
  membershipMonthly: { name: "Membresía de Práctica Digital (mensual)", price: "20", currency: "USD", unit: "MONTH" },
  membershipAnnual: { name: "Membresía de Práctica Digital (anual fundador)", price: "120", currency: "USD", unit: "YEAR" },
  passCommunityMonthly: { name: "Pase Motus Beta comunitario (mensual)", price: "29", currency: "USD", unit: "MONTH" },
  passCommunityAnnual: { name: "Pase Motus Beta comunitario (anual)", price: "290", currency: "USD", unit: "YEAR" },
  passDirectMonthly: { name: "Pase Motus Beta directo por invitación (mensual)", price: "79", currency: "USD", unit: "MONTH" },
  passDirectAnnual: { name: "Pase Motus Beta directo por invitación (anual beta)", price: "790", currency: "USD", unit: "YEAR" },
} as const

export const LANDING_TRUST = [
  {
    title: "Formación y comunidad global",
    description: "Formación continua y una red de profesionales de salud mental en distintos países.",
  },
  {
    title: "Inteligencia Artificial",
    description: "Aplica lo más reciente en IA a tu práctica clínica, con criterio profesional.",
  },
  {
    title: "Pagos",
    description: "Cobros inmediatos, sin comisión, desde cualquier parte del mundo. Selecciona tu moneda de cobro.",
  },
] as const

/** Thin hero chips that name the tools referenced in the lede. */
export const LANDING_HERO_SERVICES = [
  { label: "Formación" },
  { label: "IA" },
  { label: "Pagos" },
  { label: "Comunidad Global" },
] as const

export type JourneyStage = {
  label: string
  title: string
  ordinal: string
  job: string
  line: string
  chips: readonly string[]
  cta: string
  href: string
  imageSrc: string
  imageAlt: string
}

export const LANDING_JOURNEY = {
  label: "Una ruta progresiva",
  heading: "Cinco bloques para avanzar contigo",
  lede:
    "Empieza en Génesis y continúa con Fundamentos y Praxis. La revisión en Validación habilita el acceso al Portal Clínico mediante el pase, según los requisitos profesionales. La membresía y el pase son productos distintos.",
  communityPathLabel: "Ruta comunitaria",
  fastPathLabel: "Ruta rápida",
  fastPathNote: "Validación y Portal Clínico también se pueden alcanzar por invitación, con revisión y onboarding.",
  stages: [
    {
      label: "01 — Génesis",
      title: "Génesis",
      ordinal: "01",
      job: "Entra a la comunidad",
      line: "Conoce MotusDAO y entra a la comunidad global. Acceso gratuito.",
      chips: ["Gratis", "Comunidad", "Academia"],
      cta: "Abrir Génesis",
      href: "https://app.motusdao.org/academia/01-genesis",
      imageSrc: "/experience/ruta/01-genesis.jpg",
      imageAlt: "Ilustración del Bloque Génesis: hub de MotusDAO donde comienza el viaje",
    },
    {
      label: "02 — Fundamentos",
      title: "Fundamentos",
      ordinal: "02",
      job: "Ordena tu práctica digital",
      line: "Ordena tu práctica con la Membresía de Práctica Digital: USD 20/mes o USD 120/año precio fundador.",
      chips: ["Membresía", "USD 20/mes", "Manual"],
      cta: "Ver membresía",
      href: "#membresia",
      imageSrc: "/experience/ruta/02-fundamentos.jpg",
      imageAlt: "Ilustración del Bloque Fundamentos: aprender el lenguaje común de la práctica digital",
    },
    {
      label: "03 — Praxis",
      title: "Praxis",
      ordinal: "03",
      job: "Profundiza con práctica aplicada",
      line: "Profundiza con talleres, cursos y supervisión. Taller: USD 15 por taller; supervisión: USD 50 por sesión. Cursos con precio propio.",
      chips: ["Talleres", "Cursos", "Supervisión"],
      cta: "Ver membresía",
      href: "#membresia",
      imageSrc: "/experience/ruta/03-praxis.jpg",
      imageAlt: "Ilustración del Bloque Praxis: laboratorio para aprender, aplicar e iterar",
    },
    {
      label: "04 — Validación",
      title: "Validación",
      ordinal: "04",
      job: "Revisa requisitos del pase",
      line: "Revisión interna de requisitos para el Pase Motus Beta. Pase comunitario: USD 29/mes o USD 290/año. Pase directo por invitación: USD 79/mes o USD 790/año beta.",
      chips: ["Pase Motus Beta", "Revisión", "Invitación"],
      cta: "Ver planes",
      href: "#membresia",
      imageSrc: "/experience/ruta/04-validacion.jpg",
      imageAlt: "Ilustración del Bloque Validación: evidencia, medición y mejora",
    },
    {
      label: "05 — Portal Clínico",
      title: "Portal Clínico",
      ordinal: "05",
      job: "Opera con herramientas profesionales",
      line: "Opera con herramientas profesionales según aprobación y permisos. Incluido en el Pase Motus Beta durante la beta.",
      chips: ["Portal", "Consultorio", "Beta"],
      cta: "Ver planes",
      href: "#membresia",
      imageSrc: "/experience/ruta/05-portal-clinico.jpg",
      imageAlt: "Ilustración del Portal Clínico: espacio seguro de atención y bienestar",
    },
  ] satisfies readonly JourneyStage[],
} as const

export const LANDING_MEMBERSHIP = {
  label: "Elige tu entrada",
  heading: "Empieza con la membresía. Avanza a tu ritmo.",
  lede:
    "La ruta comunitaria comienza con formación y recursos. La entrada profesional directa al Portal es por invitación, con revisión y onboarding.",
  community: {
    label: "Entrada comunitaria · Bloque 02",
    title: "Membresía de Práctica Digital",
    priceMonthlyLabel: "USD 20",
    priceMonthlySuffix: "/mes",
    priceAnnual: "USD 120/año precio fundador",
    savingsBadge: "Mitad de precio · de USD 240 a USD 120 · por tiempo limitado",
    includes: [
      "Manual clínico-operativo y biblioteca virtual.",
      "Actividades de formación continua e introducción a PsyChat.",
      "Comunidad de práctica y encuentros según calendario.",
    ],
    planLegend: "Elige tu plan",
    planMonthly: "Mensual · USD 20/mes",
    planAnnual: "Anual · USD 120/año precio fundador",
    continueLabel: "Continuar a Fundamentos",
    continueNote:
      "Acceso gratuito durante la revisión de contenido. Tu elección no genera un cobro ni activa una suscripción.",
    portalNoteTitle: "Al continuar hacia el Portal",
    portalNoteBody:
      "El Pase Motus Beta comunitario se contrata aparte, tras la revisión de requisitos: USD 29/mes o USD 290/año.",
  },
  invitation: {
    label: "Entrada profesional · Por invitación",
    title: "Pase Motus Beta directo",
    priceMonthlyLabel: "USD 79",
    priceMonthlySuffix: "/mes",
    priceAnnual: "USD 790/año beta",
    body:
      "Para profesionales invitados que ingresan mediante revisión y onboarding. Incluye el Portal Clínico durante la beta, según aprobación y permisos.",
    inviteRequired: "La invitación es necesaria para acceder a esta vía.",
    contactNote:
      "Contacta al equipo para conocer los requisitos de revisión y onboarding. Enviar una consulta no concede acceso al pase.",
    ctaLabel: "Consultar sobre la invitación",
    emailNote:
      "Se abrirá tu aplicación de correo. También puedes escribir a contact@motusdao.org. No envíes documentos ni datos de pacientes por esta vía.",
  },
  praxisNote:
    "Praxis se contrata aparte: USD 15 por taller y USD 50 por sesión de supervisión. Cada curso tiene su propio precio.",
} as const

export const LANDING_ASSESSMENT_TEASER = {
  label: "Empieza donde estás",
  disclaimer: "Orientativo · No es diagnóstico clínico ni certificación profesional.",
  inviteColleague: "Invitar a un colega",
} as const

export const LANDING_FINAL = {
  heading: "Dale estructura a tu siguiente etapa",
  lede:
    "Recursos, formación y comunidad para avanzar en tu práctica digital. Empieza por Fundamentos y conoce el recorrido hacia el Portal Clínico.",
  priceLine: "USD 20/mes · USD 120/año precio fundador",
  savingsBadge: "Mitad de precio · de USD 240 a USD 120 · por tiempo limitado",
} as const

export const LANDING_FAQS: ReadonlyArray<{ question: string; answer: string }> = [
  {
    question: "¿Qué incluye la membresía?",
    answer:
      "Manual clínico-operativo, biblioteca virtual, actividades de formación continua, introducción a PsyChat, comunidad de práctica y encuentros según calendario.",
  },
  {
    question: "¿Membresía y pase son lo mismo?",
    answer:
      "Son productos distintos. La membresía corresponde a Fundamentos. El Pase Motus Beta habilita el Portal Clínico tras la revisión de requisitos y se paga aparte.",
  },
  {
    question: "¿Los talleres y la supervisión están incluidos?",
    answer:
      "Se contratan aparte en Praxis: USD 15 por taller y USD 50 por sesión de supervisión. Los cursos tienen precios propios.",
  },
  {
    question: "¿Puedo entrar directamente al Portal?",
    answer:
      "La vía profesional directa es por invitación y requiere revisión y onboarding. Su precio beta es USD 79/mes o USD 790/año.",
  },
  {
    question: "¿Tengo que hacer el diagnóstico para incorporarme?",
    answer:
      "No. La autoevaluación es gratuita y opcional; orienta tu práctica digital, pero no es requisito para incorporarte a la membresía ni a la ruta. No sustituye el registro como psicólogo en la app de MotusDAO, que es un proceso aparte.",
  },
  {
    question: "¿La ruta certifica o garantiza pacientes?",
    answer:
      "La formación y la revisión interna no sustituyen tu autorización profesional ni garantizan asignación de pacientes.",
  },
]

export const LANDING_NON_CLAIMS = [
  "No es un diagnóstico clínico ni una certificación profesional.",
  "La formación y la revisión interna no sustituyen la autorización profesional del psicólogo.",
  "No garantiza asignación de pacientes.",
  "La autoevaluación de práctica digital es orientativa y opcional.",
] as const

export const LANDING_CTAS = {
  membership: { label: "Empezar mi membresía", href: "/#membresia" },
  membershipSticky: { label: "Empezar mi membresía · USD 20/mes", href: "/#membresia" },
  assessment: { label: "Evaluar mi práctica", href: "/diagnostico" },
  invitation: { label: "Consultar sobre la invitación", href: "mailto:contact@motusdao.org" },
} as const

export const LANDING_AGENT_PROMPT = {
  label: "Prompt para tu agente",
  helper:
    "¿Dudas antes de decidir? Pégalo en ChatGPT, Claude o Cursor para contrastar la membresía con fuentes oficiales.",
  expandHint: "Haz clic aquí para ver y copiar el prompt",
  collapseHint: "Ocultar prompt",
  prompt:
    "Lee https://academia.motusdao.org/SKILL.md y síguelo antes de explicar MotusDAO, la membresía, la ruta profesional o el Portal Clínico. Si necesitas más detalle, consulta también https://academia.motusdao.org/llms.txt y https://academia.motusdao.org/guia-membresia.",
  copyLabel: "Copiar prompt",
  copiedLabel: "Copiado",
  note: "Por sesión. Funciona en ChatGPT, Claude, Cursor u otro agente.",
  skillHref: "/SKILL.md",
  skillLabel: "SKILL.md",
} as const

export const LANDING_FOOTER = {
  brand: "MotusDAO",
  socialLabel: "Síguenos en @motusdao",
  resources: [
    { label: "Guía de membresía", href: "/guia-membresia", external: false },
    { label: "Evaluar mi práctica", href: "/diagnostico", external: false },
    { label: "App MotusDAO", href: "https://app.motusdao.org", external: true },
    { label: "Sitio MotusDAO", href: "https://www.motusdao.org", external: true },
  ],
  docs: [
    { label: "Manifiesto", href: "https://motusdao.gitbook.io/manifiesto/", external: true },
    {
      label: "MotusDAO para psicólogos",
      href: "https://motusdao.gitbook.io/motusdao-para-psicologos/",
      external: true,
    },
    { label: "Skill para agentes", href: "/SKILL.md", external: false },
    { label: "llms.txt", href: "/llms.txt", external: false },
  ],
  socials: [
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/motusdao/" },
    { id: "x", label: "X", href: "https://x.com/motusdao" },
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/motusdao" },
    { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@motusdao" },
    { id: "telegram", label: "Telegram", href: "https://t.me/motusdaoresearch" },
  ],
} as const

export const LANDING_NAV = {
  beneficios: { label: "Beneficios", href: "#beneficios" },
  ruta: { label: "Ruta", href: "#recorrido" },
  membresia: { label: "Membresía", href: "#membresia" },
} as const
