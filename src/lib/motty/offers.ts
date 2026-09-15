import type { MottyOffer } from "./types";

const SITE = "https://academia.motusdao.org";

/** PSM funnel CTAs — aligned with public/SKILL.md and landing sections. */
export const MOTTY_OFFERS: MottyOffer[] = [
  {
    id: "genesis",
    label: "Génesis",
    summary:
      "Entrada gratuita a la comunidad MotusDAO: acceso a recursos abiertos y primer contacto con la ruta PSM.",
    href: `${SITE}/#genesis`,
    cta: "Explorar Génesis",
  },
  {
    id: "membership",
    label: "Membresía de Práctica Digital",
    summary:
      "Fundamentos del PSM: USD 20/mes o USD 120/año precio fundador (mitad de precio: de USD 240 a USD 120, por tiempo limitado). Incluye comunidad, recursos y estructura de práctica digital.",
    href: `${SITE}/#membresia`,
    cta: "Ver membresía",
  },
  {
    id: "praxis",
    label: "Praxis",
    summary:
      "Talleres (USD 15 por taller) y supervisión clínica digital (USD 50 por sesión). Complemento opcional a la membresía.",
    href: `${SITE}/#praxis`,
    cta: "Conocer Praxis",
  },
  {
    id: "assessment",
    label: "Autoevaluación de práctica",
    summary:
      "Diagnóstico opcional de madurez digital clínica. No es requisito para membresía ni registro en la app.",
    href: `${SITE}/diagnostico`,
    cta: "Hacer autoevaluación",
  },
  {
    id: "app",
    label: "App MotusDAO",
    summary:
      "Registro en app.motusdao.org (proceso separado de esta landing). Bitácora, wallet y herramientas clínicas.",
    href: "https://app.motusdao.org",
    cta: "Ir a la app",
  },
  {
    id: "guide",
    label: "Guía de membresía",
    summary: "Documento citeable con precios, bloques PSM y preguntas frecuentes.",
    href: `${SITE}/guia-membresia`,
    cta: "Leer guía",
  },
  {
    id: "skill",
    label: "Brief para asistentes",
    summary: "Resumen oficial para pegar en ChatGPT/Claude sobre esta landing y la ruta PSM.",
    href: `${SITE}/SKILL.md`,
    cta: "Ver brief",
  },
];

export function formatOffersForPrompt(): string {
  return MOTTY_OFFERS.map(
    (o) => `- **${o.label}** (${o.id}): ${o.summary} → ${o.href}`,
  ).join("\n");
}
