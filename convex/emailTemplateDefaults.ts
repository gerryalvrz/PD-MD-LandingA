export type EmailTemplateKey =
  | "lead_confirmation_user"
  | "lead_confirmation_internal"
  | "followup_step_0"
  | "followup_step_1"
  | "followup_step_2"
  | "followup_step_3";

export type EmailTemplateContent = {
  subject: string;
  text?: string;
  html?: string;
  markdown?: string;
};

export const EMAIL_TEMPLATE_DEFAULTS: Record<EmailTemplateKey, EmailTemplateContent> = {
  lead_confirmation_user: {
    subject: "Tu registro en MotusDAO fue recibido",
    text:
      "Hola {{nombre}},\n\n" +
      "Gracias por registrarte. Para asegurar tu lugar en la masterclass gratuita, confirma aqui: {{lumaUrl}}\n\n" +
      "Equipo MotusDAO",
    html:
      "<p>Hola {{nombre}},</p>" +
      '<p>Gracias por registrarte. Para asegurar tu lugar en la masterclass gratuita, confirma aqui: <a href="{{lumaUrl}}">Confirmar en Luma</a>.</p>' +
      "<p>Equipo MotusDAO</p>",
  },
  lead_confirmation_internal: {
    subject: "Nuevo lead: {{nombre}}",
    text:
      "Nombre: {{nombre}}\n" +
      "Email: {{email}}\n" +
      "WhatsApp: {{whatsapp}}\n" +
      "Interes: {{interes}}\n" +
      "Session ID: {{sessionId}}\n" +
      "Lead ID: {{leadId}}\n" +
      "UTM Source: {{utmSource}}\n" +
      "UTM Medium: {{utmMedium}}\n" +
      "UTM Campaign: {{utmCampaign}}\n" +
      "UTM Content: {{utmContent}}\n" +
      "UTM Term: {{utmTerm}}\n" +
      "Referrer: {{referrer}}",
  },
  followup_step_0: {
    subject: "Recibimos tu registro en MotusDAO",
    html:
      "<p>Hola {{nombre}},</p>" +
      "<p>Gracias por registrarte. Tu solicitud fue recibida correctamente.</p>" +
      '<p>Paso final: confirma tu asistencia en Luma para recibir el acceso y recordatorios: <a href="{{lumaUrl}}">Confirmar en Luma</a>.</p>',
  },
  followup_step_1: {
    subject: "Confirma tu lugar para la masterclass",
    html:
      "<p>Hola {{nombre}},</p>" +
      "<p>Tu lugar sigue disponible en esta edicion de la masterclass gratuita.</p>" +
      '<p><a href="{{lumaUrl}}">Confirmar en Luma</a> o <a href="{{calendlyUrl}}">agendar llamada</a>.</p>',
  },
  followup_step_2: {
    subject: "Seguimos disponibles para ayudarte a decidir",
    html:
      "<p>Hola {{nombre}},</p>" +
      "<p>Si tienes dudas sobre tiempo, ROI o aplicabilidad clínica, responde este correo y te ayudamos.</p>" +
      '<p>También puedes <a href="{{calendlyUrl}}">agendar una llamada</a>.</p>',
  },
  followup_step_3: {
    subject: "Ultimo recordatorio para esta edicion",
    html:
      "<p>Hola {{nombre}},</p>" +
      "<p>Si quieres participar en esta masterclass en vivo, confirma ahora para recibir acceso y recordatorios.</p>" +
      '<p><a href="{{lumaUrl}}">Confirmar en Luma</a>.</p>',
  },
};

export function renderTemplateString(template: string, vars: Record<string, string>) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key: string) => {
    return vars[key] ?? "";
  });
}

export function renderTemplate(
  template: EmailTemplateContent,
  vars: Record<string, string>
): EmailTemplateContent {
  return {
    subject: renderTemplateString(template.subject, vars),
    text: template.text ? renderTemplateString(template.text, vars) : undefined,
    html: template.html ? renderTemplateString(template.html, vars) : undefined,
    markdown: template.markdown ? renderTemplateString(template.markdown, vars) : undefined,
  };
}
