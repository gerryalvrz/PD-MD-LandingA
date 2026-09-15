/** Shared marketing copy for UI, SEO, GEO (/llms.txt), and JSON-LD. */

export const CANONICAL_SITE_URL = "https://academia.motusdao.org"

export const LANDING_META = {
  title: "MotusDAO — Membresía y ruta profesional para psicólogos",
  description:
    "Recursos, formación y comunidad para tu práctica digital. Conoce la membresía desde USD 20/mes y la ruta de cinco bloques hacia el Portal Clínico de MotusDAO.",
  headline: "Dale estructura a tu práctica digital y avanza con MotusDAO",
  headlineAccent: "MotusDAO",
  lede:
    "Empieza con recursos, formación y comunidad global. Continúa por una ruta de cinco bloques hacia el Portal Clínico, según tus objetivos y requisitos profesionales.",
  audience: "Profesionales de salud mental",
  priceLine: "Membresía desde USD 20/mes · USD 120/año fundador",
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

export const LANDING_JOURNEY = {
  label: "Una ruta progresiva",
  heading: "Cinco bloques para avanzar contigo",
  lede:
    "Empieza en Génesis y continúa con Fundamentos y Praxis. La revisión en Validación habilita el acceso al Portal Clínico mediante el pase, según los requisitos profesionales. La membresía y el pase son productos distintos.",
  stages: [
    { label: "01 — Génesis", line: "Conoce MotusDAO y entra a la comunidad global. Acceso gratuito." },
    {
      label: "02 — Fundamentos",
      line: "Ordena tu práctica con la Membresía de Práctica Digital: USD 20/mes o USD 120/año fundador.",
    },
    {
      label: "03 — Praxis",
      line: "Profundiza con talleres, cursos y supervisión. Taller: USD 15; supervisión: USD 50/sesión. Cursos con precio propio.",
    },
    {
      label: "04 — Validación",
      line: "Revisión interna de requisitos para el Pase Motus Beta. Pase comunitario: USD 29/mes o USD 290/año. Pase directo por invitación: USD 79/mes o USD 790/año beta.",
    },
    {
      label: "05 — Portal Clínico",
      line: "Opera con herramientas profesionales según aprobación y permisos. Incluido en el Pase Motus Beta durante la beta.",
    },
  ],
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
    priceAnnual: "USD 120/año fundador",
    includes: [
      "Manual clínico-operativo y biblioteca virtual.",
      "Actividades de formación continua e introducción a PsyChat.",
      "Comunidad de práctica, recordatorios y encuentros según calendario.",
    ],
    planLegend: "Elige tu plan",
    planMonthly: "Mensual · USD 20/mes",
    planAnnual: "Anual fundador · USD 120/año",
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
    "Praxis se contrata aparte: taller USD 15 y supervisión USD 50 por sesión. Cada curso tiene su propio precio.",
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
  priceLine: "USD 20/mes · USD 120/año fundador",
} as const

export const LANDING_FAQS: ReadonlyArray<{ question: string; answer: string }> = [
  {
    question: "¿Qué incluye la membresía?",
    answer:
      "Manual clínico-operativo, biblioteca virtual, actividades de formación continua, introducción a PsyChat, comunidad de práctica, recordatorios y encuentros según calendario.",
  },
  {
    question: "¿Membresía y pase son lo mismo?",
    answer:
      "Son productos distintos. La membresía corresponde a Fundamentos. El Pase Motus Beta habilita el Portal Clínico tras la revisión de requisitos y se paga aparte.",
  },
  {
    question: "¿Los talleres y la supervisión están incluidos?",
    answer:
      "Se contratan aparte en Praxis: taller USD 15 y supervisión USD 50 por sesión. Los cursos tienen precios propios.",
  },
  {
    question: "¿Puedo entrar directamente al Portal?",
    answer:
      "La vía profesional directa es por invitación y requiere revisión y onboarding. Su precio beta es USD 79/mes o USD 790/año.",
  },
  {
    question: "¿Tengo que hacer el diagnóstico para incorporarme?",
    answer:
      "No. La autoevaluación de práctica digital es gratuita y opcional. Su resultado no otorga invitación, validación ni acceso al Portal.",
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
  membership: { label: "Elegir mi membresía", href: "/#membresia" },
  membershipSticky: { label: "Elegir mi membresía · USD 20/mes", href: "/#membresia" },
  assessment: { label: "Evaluar mi práctica", href: "/diagnostico" },
  invitation: { label: "Consultar sobre la invitación", href: "mailto:contact@motusdao.org" },
} as const

export const LANDING_NAV = {
  beneficios: { label: "Beneficios", href: "#beneficios" },
  ruta: { label: "Ruta", href: "#recorrido" },
  membresia: { label: "Membresía", href: "#membresia" },
} as const
