import type { MottyLocale } from "./types";

const COPY = {
  es: {
    title: "Motty · Academia",
    subtitle: "Guía en la ruta PSM para profesionales de salud mental",
    greeting:
      "Hola. Soy Motty. Te ayudo a entender la ruta PSM en Academia: Génesis, membresía, Praxis, validación y Portal Clínico. ¿Por dónde quieres empezar?",
    disclaimer:
      "Orientación sobre la landing de Academia. No es terapia ni diagnóstico clínico.",
    crisis:
      "Si hay riesgo inmediato, contacta servicios de emergencia locales. MotusDAO no es atención de crisis.",
    placeholder: "Pregunta sobre la ruta PSM…",
    thinking: "Pensando…",
    send: "Enviar",
    close: "Cerrar chat",
    fab: "Abrir Motty",
    error: "No pude responder. Intenta de nuevo.",
    rateLimit: "Demasiados mensajes. Espera un momento.",
  },
  en: {
    title: "Motty · Academy",
    subtitle: "PSM route guide for mental health professionals",
    greeting:
      "Hi. I'm Motty. I help you understand the PSM route on Academy: Genesis, membership, Praxis, validation, and Clinical Portal. Where would you like to start?",
    disclaimer:
      "Guidance about the Academy landing. Not therapy or clinical diagnosis.",
    crisis:
      "If there is immediate risk, contact local emergency services. MotusDAO is not crisis care.",
    placeholder: "Ask about the PSM route…",
    thinking: "Thinking…",
    send: "Send",
    close: "Close chat",
    fab: "Open Motty",
    error: "I could not reply. Try again.",
    rateLimit: "Too many messages. Wait a moment.",
  },
} as const;

export function mottyCopy(locale: MottyLocale) {
  return COPY[locale];
}

export const MOTTY_DEFAULT_LOCALE: MottyLocale = "es";
