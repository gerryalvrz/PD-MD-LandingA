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
    title: "Encuadre y práctica digital",
    description: "Deja de improvisar tu consulta online: encuadre claro y herramientas justas para ejercer con orden.",
  },
  {
    title: "Ética digital",
    description: "Criterio profesional para la consulta online: límites, cuidados y ética clara en tu práctica digital.",
  },
  {
    title: "Comunidad de colegas",
    description: "Colegas que entienden el trabajo clínico: Telegram y encuentros para no practicar en soledad.",
  },
] as const

/** Thin hero chips aligned with Fundamentos membership themes. */
export const LANDING_HERO_SERVICES = [
  { label: "Encuadre" },
  { label: "Ética digital" },
  { label: "Perfil profesional" },
  { label: "Comunidad" },
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
    "Empieza en Génesis y continúa con Fundamentos y Praxis. Después, la Validación humana y la invitación preparan el acceso al Portal Clínico / PSM activo. La membresía y el pase son productos distintos.",
  communityPathLabel: "Ruta comunitaria",
  fastPathLabel: "Ruta rápida",
  fastPathNote: "Validación y Portal Clínico también se pueden alcanzar por invitación, con revisión y onboarding.",
  stages: [
    {
      label: "01 — Génesis",
      title: "Génesis",
      ordinal: "01",
      job: "Onboarding de la Ruta PSM",
      line: "Paso 01 gratuito: conoce MotusDAO y orienta tu práctica. Forma parte del onboarding de todo profesional; no bloquea la compra de Fundamentos.",
      chips: ["Gratis", "Paso 01", "Onboarding"],
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
      line: "Membresía de Práctica Digital (USD 20/mes · USD 120/año precio fundador). Deja de improvisar tu consulta online: encuadre, herramientas justas, ética clara y colegas que entienden el trabajo clínico.",
      chips: ["Membresía", "USD 20/mes", "Encuadre"],
      cta: "Ver membresía",
      href: "#membresia",
      imageSrc: "/experience/ruta/02-fundamentos.jpg",
      imageAlt: "Ilustración del Bloque Fundamentos: aprender el lenguaje común de la práctica digital",
    },
    {
      label: "03 — Praxis",
      title: "Praxis",
      ordinal: "03",
      job: "Construye tu formación clínica a tu ritmo.",
      line: "Colección progresiva en la Ruta Comunitaria: cursos individuales desde USD 15; colección completa USD 100. Escucha es recomendado para empezar. Completar la colección (0/5→5/5) no es Validación ni acceso al Portal.",
      chips: ["Desde USD 15", "Colección", "Escucha"],
      cta: "Explorar Praxis",
      href: "https://app.motusdao.org/academia/03-praxis#catalogo",
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
      line: "Sin compra pública. Tras Praxis y Validación humana, MotusDAO envía invitación si hay aprobación. Incluido en el Pase Motus Beta durante la beta.",
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
    "Deja de improvisar tu consulta online: encuadre, herramientas justas, ética clara y colegas que entienden el trabajo clínico. La entrada profesional directa al Portal es por invitación, con revisión y onboarding.",
  community: {
    label: "Entrada comunitaria · Bloque 02",
    title: "Membresía de Práctica Digital",
    priceMonthlyLabel: "USD 20",
    priceMonthlySuffix: "/mes",
    priceAnnual: "USD 120/año precio fundador",
    savingsBadge: "Mitad de precio · de USD 240 a USD 120 · por tiempo limitado",
    includes: [
      "Encuadre de la consulta online.",
      "Herramientas esenciales para la práctica digital.",
      "Ética digital.",
      "Perfil profesional.",
      "Comunidad de colegas (Telegram + encuentros).",
    ],
    planLegend: "Elige tu plan",
    planMonthly: "Mensual · USD 20/mes",
    planAnnual: "Anual · USD 120/año precio fundador",
    continueLabel: "Continuar a Fundamentos",
    continueNote:
      "Precio: USD 20/mes · USD 120/año. Continuar abre Fundamentos en el Hub. Génesis (Paso 01) es onboarding de la Ruta PSM y no bloquea esta compra. El checkout público puede seguir en QA; eso no redefine la membresía como gratuita.",
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
    "Praxis se contrata aparte: cursos desde USD 15; colección completa USD 100. Escucha es recomendado para empezar. Completar Praxis no es Validación ni acceso al Portal.",
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
      "Encuadre de la consulta online, herramientas esenciales para la práctica digital, ética digital, perfil profesional y comunidad de colegas (Telegram + encuentros).",
  },
  {
    question: "¿Qué no incluye la membresía de USD 20?",
    answer:
      "No incluye cursos de Praxis, supervisión humana, supervisor virtual, agentes autónomos, Validación, Pase/PSM activo ni Portal Clínico. Praxis se paga aparte; el Portal requiere validación humana e invitación.",
  },
  {
    question: "¿Membresía y pase son lo mismo?",
    answer:
      "Son productos distintos. La membresía corresponde a Fundamentos. El Pase Motus Beta habilita el Portal Clínico tras la revisión de requisitos y se paga aparte.",
  },
  {
    question: "¿Los cursos de Praxis están incluidos?",
    answer:
      "No. Praxis es una colección progresiva aparte: cursos individuales desde USD 15; colección completa USD 100. Escucha es recomendado para empezar. Completar la colección no es Validación ni acceso al Portal.",
  },
  {
    question: "¿Puedo entrar directamente al Portal?",
    answer:
      "No hay compra pública del Portal. La vía profesional directa es por invitación y requiere validación humana, revisión y onboarding. Su precio beta es USD 79/mes o USD 790/año.",
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
  label: "Prompt para tu asistente",
  helper:
    "¿Dudas antes de decidir? Pégalo en ChatGPT o Claude para contrastar la membresía con fuentes oficiales.",
  expandHint: "Haz clic aquí para ver y copiar el prompt",
  collapseHint: "Ocultar prompt",
  prompt:
    "Lee https://academia.motusdao.org/SKILL.md y síguelo antes de explicar MotusDAO, la membresía, la ruta profesional o el Portal Clínico. Si necesitas más detalle, consulta también https://academia.motusdao.org/llms.txt y https://academia.motusdao.org/guia-membresia.",
  copyLabel: "Copiar prompt",
  copiedLabel: "Copiado",
  note: "Por sesión. Pensado para pegar en ChatGPT, Claude u otro chat.",
  skillHref: "/SKILL.md",
  skillLabel: "Brief oficial",
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
    { label: "Brief para asistentes", href: "/SKILL.md", external: false },
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
