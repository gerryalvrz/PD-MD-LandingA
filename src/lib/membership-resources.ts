export type MembershipResourceGroup = "recursos" | "herramientas"
export type MembershipResourceStatus = "Incluido" | "Herramienta" | "Próximamente"

export const MEMBERSHIP_RESOURCE_GROUPS: {
  id: MembershipResourceGroup
  label: string
  name: string
  description: string
}[] = [
  {
    id: "recursos",
    label: "Recursos",
    name: "Incluido en tu membresía",
    description: "Manual, biblioteca, formación y comunidad para organizar tu práctica online. Talleres, supervisión y Pase Motus Beta se contratan aparte.",
  },
  {
    id: "herramientas",
    label: "Herramientas",
    name: "Herramientas del hub",
    description: "Pagos y otras herramientas de la app. Su acceso depende de cuenta y permisos; no están incluidas automáticamente en la membresía.",
  },
]

export type MembershipResource = {
  id: string
  group: MembershipResourceGroup
  title: string
  line: string
  href: string | null
  /** Same-origin iframe src when the live site blocks embedding. */
  frameSrc: string | null
  status: MembershipResourceStatus
  icon: "book" | "library" | "academy" | "ai" | "community" | "calendar" | "payments"
  linkLabel: string
}

export const MEMBERSHIP_RESOURCES: MembershipResource[] = [
  {
    id: "manual",
    group: "recursos",
    title: "Manual clínico-operativo",
    line: "Una referencia para estructurar tu práctica digital.",
    href: "https://motusdao.gitbook.io/motusdao-para-psicologos/",
    frameSrc: "/embed/gitbook/motusdao-para-psicologos",
    status: "Incluido",
    icon: "book",
    linkLabel: "Abrir el manual",
  },
  {
    id: "biblioteca",
    group: "recursos",
    title: "Biblioteca virtual",
    line: "Recursos para consultar y continuar aprendiendo.",
    href: "https://metaverso.motusdao.org/~/motusdao/biblioteca.wam",
    frameSrc: "https://metaverso.motusdao.org/~/motusdao/biblioteca.wam",
    status: "Incluido",
    icon: "library",
    linkLabel: "Abrir la biblioteca",
  },
  {
    id: "formacion",
    group: "recursos",
    title: "Formación continua",
    line: "Actividades para desarrollar tu práctica profesional.",
    href: "https://app.motusdao.org/academia",
    frameSrc: "/embed/app/academia",
    status: "Incluido",
    icon: "academy",
    linkLabel: "Abrir Academia",
  },
  {
    id: "psychat",
    group: "recursos",
    title: "Introducción a PsyChat",
    line: "Conoce herramientas de apoyo para tu trabajo.",
    href: "https://chat.motusdao.org/",
    frameSrc: "/embed/chat",
    status: "Incluido",
    icon: "ai",
    linkLabel: "Abrir PsyChat",
  },
  {
    id: "comunidad",
    group: "recursos",
    title: "Comunidad de práctica",
    line: "Comparte el recorrido con otros profesionales.",
    href: "https://metaverso.motusdao.org/~/motusdao/academy.wam",
    frameSrc: "https://metaverso.motusdao.org/~/motusdao/academy.wam",
    status: "Incluido",
    icon: "community",
    linkLabel: "Abrir la comunidad",
  },
  {
    id: "acompanamiento",
    group: "recursos",
    title: "Acompañamiento",
    line: "Recordatorios de avance y encuentros según calendario.",
    href: null,
    frameSrc: null,
    status: "Próximamente",
    icon: "calendar",
    linkLabel: "Próximamente",
  },
  {
    id: "pagos",
    group: "herramientas",
    title: "Pagos",
    line: "Consulta pagos y wallet en el hub. Requiere cuenta; no está incluido automáticamente en la membresía.",
    href: "https://app.motusdao.org/pagos",
    frameSrc: "/embed/app/pagos",
    status: "Herramienta",
    icon: "payments",
    linkLabel: "Abrir pagos",
  },
]
