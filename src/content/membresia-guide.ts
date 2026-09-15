import {
  CANONICAL_SITE_URL,
  LANDING_CTAS,
  LANDING_FAQS,
  LANDING_JOURNEY,
  LANDING_MEMBERSHIP,
  LANDING_META,
  LANDING_NON_CLAIMS,
  LANDING_OFFERS,
} from "@/content/landing"

/** Evergreen cite page — what MotusDAO membership is and is not. */
export const MEMBRESIA_GUIDE_PATH = "/guia-membresia"

export const MEMBRESIA_GUIDE = {
  path: MEMBRESIA_GUIDE_PATH,
  title: "Qué es la membresía MotusDAO (y qué no es)",
  description:
    "Guía clara para psicólogos: precios, qué incluye la Membresía de Práctica Digital, cómo se diferencia del Pase Motus Beta y qué no promete MotusDAO.",
  updatedLabel: "Actualizado para agentes y profesionales",
  intro:
    "Esta página resume la oferta de MotusDAO Academy para profesionales de salud mental. Está escrita para lectura humana y para citación por buscadores y asistentes de IA.",
  sections: [
    {
      id: "que-es",
      heading: "Qué es",
      paragraphs: [
        "La Membresía de Práctica Digital es la entrada comunitaria al Bloque 02 (Fundamentos): recursos, formación continua y comunidad para ordenar tu práctica digital.",
        `Precio público: USD ${LANDING_OFFERS.membershipMonthly.price}/mes o USD ${LANDING_OFFERS.membershipAnnual.price}/año precio fundador. Mitad de precio: de USD 240 a USD 120, por tiempo limitado.`,
        "La ruta completa tiene cinco bloques (Génesis → Fundamentos → Praxis → Validación → Portal Clínico). La membresía y el pase son productos distintos.",
      ],
    },
    {
      id: "incluye",
      heading: "Qué incluye la membresía",
      bullets: [...LANDING_MEMBERSHIP.community.includes],
    },
    {
      id: "ruta",
      heading: "Cómo encaja en la ruta",
      bullets: LANDING_JOURNEY.stages.map((stage) => `${stage.label}: ${stage.line}`),
    },
    {
      id: "pase",
      heading: "Membresía vs Pase Motus Beta",
      paragraphs: [
        "La membresía corresponde a Fundamentos. El Pase Motus Beta habilita el Portal Clínico tras la revisión de requisitos y se paga aparte.",
        `Pase comunitario: USD ${LANDING_OFFERS.passCommunityMonthly.price}/mes o USD ${LANDING_OFFERS.passCommunityAnnual.price}/año.`,
        `Pase directo por invitación: USD ${LANDING_OFFERS.passDirectMonthly.price}/mes o USD ${LANDING_OFFERS.passDirectAnnual.price}/año beta. Requiere revisión y onboarding.`,
      ],
    },
    {
      id: "que-no-es",
      heading: "Qué no es",
      bullets: [...LANDING_NON_CLAIMS],
    },
  ],
  faqs: LANDING_FAQS,
  ctas: [
    { label: LANDING_CTAS.membership.label, href: `${CANONICAL_SITE_URL}/#membresia` },
    { label: "Volver al inicio", href: CANONICAL_SITE_URL },
    { label: "llms.txt", href: `${CANONICAL_SITE_URL}/llms.txt` },
  ],
  org: LANDING_META.orgName,
  contact: LANDING_META.contactEmail,
} as const
