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
    description:
      "Encuadre, herramientas esenciales, ética digital, perfil profesional y comunidad de colegas (Telegram + encuentros).",
  },
  {
    id: "herramientas",
    label: "Herramientas",
    name: "Herramientas del hub",
    description:
      "Pagos y otras herramientas de la app. Su acceso depende de cuenta y permisos; no están incluidas en la membresía de USD 20.",
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
    title: "Encuadre",
    line: "Encuadre de la consulta online: orden y criterios para ejercer sin improvisar.",
    href: "https://motusdao.gitbook.io/motusdao-para-psicologos/",
    frameSrc: "/embed/gitbook/motusdao-para-psicologos",
    status: "Incluido",
    icon: "book",
    linkLabel: "Abrir recursos de encuadre",
  },
  {
    id: "biblioteca",
    group: "recursos",
    title: "Herramientas esenciales",
    line: "Herramientas esenciales para la práctica digital — no incluyen pagos del Hub ni Portal Clínico.",
    href: "https://metaverso.motusdao.org/~/motusdao/biblioteca.wam",
    frameSrc: "https://metaverso.motusdao.org/~/motusdao/biblioteca.wam",
    status: "Incluido",
    icon: "library",
    linkLabel: "Abrir herramientas",
  },
  {
    id: "formacion",
    group: "recursos",
    title: "Ética digital",
    line: "Ética digital para la consulta online: límites, cuidados y criterio profesional.",
    href: "https://app.motusdao.org/academia",
    frameSrc: "/embed/app/academia",
    status: "Incluido",
    icon: "academy",
    linkLabel: "Abrir Academia",
  },
  {
    id: "psychat",
    group: "recursos",
    title: "Perfil profesional",
    line: "Perfil profesional para presentarte con claridad en tu práctica digital.",
    href: "https://app.motusdao.org",
    frameSrc: "/embed/app/academia",
    status: "Incluido",
    icon: "ai",
    linkLabel: "Abrir el Hub",
  },
  {
    id: "comunidad",
    group: "recursos",
    title: "Comunidad de colegas",
    line: "Telegram y encuentros con colegas que entienden el trabajo clínico.",
    href: "https://t.me/motusdaoresearch",
    frameSrc: null,
    status: "Incluido",
    icon: "community",
    linkLabel: "Abrir Telegram",
  },
  {
    id: "acompanamiento",
    group: "recursos",
    title: "Encuentros",
    line: "Encuentros de comunidad según calendario (parte de la comunidad de colegas).",
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
    line: "Pagos y wallet del Hub. Requiere cuenta y permisos; no está incluido en la membresía de USD 20.",
    href: "https://app.motusdao.org/pagos",
    frameSrc: "/embed/app/pagos",
    status: "Herramienta",
    icon: "payments",
    linkLabel: "Abrir pagos",
  },
]
