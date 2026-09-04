export type ExperienceStage = "membership" | "praxis" | "portal"
export type ExperienceStatus = "Contenido publicado" | "Incluido en la ruta" | "Beta" | "Próximamente"

export const EXPERIENCE_STAGES: { id: ExperienceStage; label: string; stage: string; description: string }[] = [
  { id: "membership", label: "Tu membresía", stage: "02 — Fundamentos", description: "Empieza con formación, recursos y acompañamiento para ordenar tu práctica digital." },
  { id: "praxis", label: "Formación aplicada", stage: "03 — Praxis", description: "Profundiza en habilidades concretas. Cursos, talleres y supervisión se contratan por separado." },
  { id: "portal", label: "Tu consultorio", stage: "04 — Validación → 05 — Portal Clínico", description: "Conoce las herramientas del recorrido profesional. Su acceso depende de invitación, revisión y permisos; no está incluido automáticamente en la membresía." },
]

export type ExperienceFeature = {
  id: string
  stage: ExperienceStage
  icon: "academy" | "library" | "community" | "ai" | "course" | "supervision" | "profile" | "calendar" | "video" | "payments" | "users" | "journal"
  title: string
  benefit: string
  examples: string[]
  access: string
  status: ExperienceStatus
  href: string
  linkLabel: string
}

const HUB = "https://app.motusdao.org"
export const EXPERIENCE_FEATURES: ExperienceFeature[] = [
  { id: "academy", stage: "membership", icon: "academy", title: "Aprende con una ruta clara", benefit: "Pasa de la teoría a tareas concretas para tu consulta online.", examples: ["Encuadre, herramientas y ética digital", "Lecciones y seguimiento de tu avance"], access: "Fundamentos · Membresía", status: "Contenido publicado", href: `${HUB}/academia/02-fundamentos`, linkLabel: "Ver Fundamentos" },
  { id: "library", stage: "membership", icon: "library", title: "Ten recursos a mano", benefit: "Consulta el manual y los materiales que acompañan tu formación.", examples: ["Manual clínico-operativo y biblioteca", "Recursos organizados por etapa"], access: "Fundamentos · Según el recurso", status: "Incluido en la ruta", href: `${HUB}/academia/02-fundamentos`, linkLabel: "Conocer los recursos" },
  { id: "community", stage: "membership", icon: "community", title: "Avanza con colegas", benefit: "Encuentra un espacio de intercambio para acompañar tu desarrollo profesional.", examples: ["Comunidad de práctica", "Encuentros según calendario y plan de avance"], access: "Génesis · Comunidad / Fundamentos · Acompañamiento", status: "Incluido en la ruta", href: `${HUB}/academia/01-genesis`, linkLabel: "Conocer la comunidad" },
  { id: "ai", stage: "membership", icon: "ai", title: "Acércate a la IA con criterio", benefit: "Conoce PsyChat y cómo revisar el uso de herramientas de apoyo en tu práctica.", examples: ["Introducción a PsyChat en la membresía", "Revisión humana y límites de uso"], access: "Fundamentos · Introducción; acceso progresivo", status: "Incluido en la ruta", href: `${HUB}/academia/02-fundamentos/leccion/membresia-activa-plan-7-dias`, linkLabel: "Ver la introducción" },
  { id: "praxis", stage: "praxis", icon: "course", title: "Profundiza en tu práctica", benefit: "Elige formación aplicada a las preguntas que aparecen en tu trabajo profesional.", examples: ["Cursos y talleres de Praxis", "Primera colección de formación de Benjamín Buzali"], access: "Praxis · Compra por curso o taller", status: "Contenido publicado", href: `${HUB}/academia/03-praxis#catalogo`, linkLabel: "Explorar Praxis" },
  { id: "supervision", stage: "praxis", icon: "supervision", title: "Revisa tu práctica con supervisión", benefit: "Conoce el acompañamiento clínico de la ruta y los requisitos para participar.", examples: ["Supervisión como servicio separado", "La pantalla de seguimiento está en preparación"], access: "Praxis · Encuadre y credenciales documentados", status: "Próximamente", href: `${HUB}/academia/03-praxis`, linkLabel: "Conocer la ruta de supervisión" },
  { id: "profile", stage: "portal", icon: "profile", title: "Presenta tu práctica", benefit: "Reúne tu enfoque, formación y forma de trabajar en un perfil profesional.", examples: ["Perfil y documentación profesional", "Visibilidad pública sujeta a aprobación"], access: "Validación / Portal · Según aprobación", status: "Beta", href: `${HUB}/perfil`, linkLabel: "Ver perfil en la app" },
  { id: "calendar", stage: "portal", icon: "calendar", title: "Organiza tu disponibilidad", benefit: "Define los horarios en los que puedes recibir reservas de sesión.", examples: ["Horarios de atención", "Disponibilidad vinculada a Psicoterapia"], access: "Portal · Perfil profesional y permisos", status: "Beta", href: `${HUB}/disponibilidad`, linkLabel: "Ver disponibilidad" },
  { id: "video", stage: "portal", icon: "video", title: "Encuéntrate por videollamada", benefit: "Conoce el espacio de videollamada integrado en el recorrido de atención.", examples: ["Sala de video para la sesión", "Entrada según sesión y permisos"], access: "Portal · Acceso autorizado a la sesión", status: "Beta", href: `${HUB}/videochat`, linkLabel: "Conocer el videochat" },
  { id: "payments", stage: "portal", icon: "payments", title: "Explora las opciones de pago", benefit: "Conoce las herramientas de pagos y wallet disponibles en el hub.", examples: ["Pagos y wallet en una misma sección", "Algunas integraciones siguen en demostración"], access: "Herramientas del hub · Según cuenta e integración", status: "Beta", href: `${HUB}/pagos`, linkLabel: "Ver opciones de pago" },
  { id: "users", stage: "portal", icon: "users", title: "Organiza el seguimiento", benefit: "Una vista de Mis usuarios está en preparación para el espacio profesional.", examples: ["Seguimiento desde el consultorio", "Función pendiente de habilitación"], access: "Portal · Próxima función profesional", status: "Próximamente", href: `${HUB}/academia/05-portal-clinico`, linkLabel: "Conocer el Portal Clínico" },
  { id: "journal", stage: "portal", icon: "journal", title: "Conoce la bitácora", benefit: "La app contempla un espacio de registro personal, distinto de un expediente clínico.", examples: ["Registro personal y estado de ánimo", "Uso profesional pendiente de habilitación"], access: "Etapa y permisos profesionales por confirmar", status: "Próximamente", href: `${HUB}/academia/05-portal-clinico`, linkLabel: "Consultar el alcance del Portal" },
]
