import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { ConvexHttpClient } from "convex/browser"
import { api } from "../../../../convex/_generated/api"
import {
  EMAIL_TEMPLATE_DEFAULTS,
  renderTemplate,
  type EmailTemplateKey,
} from "../../../../convex/emailTemplateDefaults"

const INTERNAL_NOTIFICATION_EMAIL = "contact@motusdao.org"
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type LeadSubmitPayload = {
  nombre?: string
  email?: string
  whatsapp?: string
  interes?: string
  sessionId?: string
  leadId?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  referrer?: string
}

function clean(value?: string) {
  if (!value) return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function fallbackTemplate(
  key: EmailTemplateKey,
  vars: Record<string, string>
): { subject: string; text?: string; html?: string } {
  return renderTemplate(EMAIL_TEMPLATE_DEFAULTS[key], vars)
}

async function loadTemplate(
  convex: ConvexHttpClient | null,
  key: EmailTemplateKey,
  vars: Record<string, string>
) {
  if (!convex) return fallbackTemplate(key, vars)
  try {
    return await convex.query(api.emailTemplates.getRenderedTemplate, { key, vars })
  } catch (error) {
    console.warn("[/api/leads] Falling back to default template", { key, error })
    return fallbackTemplate(key, vars)
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadSubmitPayload
    const nombre = clean(body.nombre)
    const email = clean(body.email)

    if (!nombre || !email) {
      return NextResponse.json({ error: "Nombre y email son obligatorios." }, { status: 400 })
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Email invalido." }, { status: 400 })
    }

    const smtpHost = process.env.SMTP_HOST
    const smtpPort = Number(process.env.SMTP_PORT ?? "465")
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn("[/api/leads] SMTP no configurado; lead guardado en Convex sin correo inmediato.")
      return NextResponse.json({ ok: true, emailSent: false, reason: "smtp_not_configured" })
    }
    const mailFrom = process.env.MAIL_FROM ?? "MotusDAO <contact@motusdao.org>"
    const mailReplyTo = process.env.MAIL_REPLY_TO ?? "contact@motusdao.org"
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    const normalizedPayload = {
      ...body,
      nombre,
      email,
      whatsapp: clean(body.whatsapp),
      interes: clean(body.interes),
      sessionId: clean(body.sessionId),
      leadId: clean(body.leadId),
      utmSource: clean(body.utmSource),
      utmMedium: clean(body.utmMedium),
      utmCampaign: clean(body.utmCampaign),
      utmContent: clean(body.utmContent),
      utmTerm: clean(body.utmTerm),
      referrer: clean(body.referrer),
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
    const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null
    const templateVars = {
      nombre: normalizedPayload.nombre,
      email: normalizedPayload.email,
      whatsapp: normalizedPayload.whatsapp ?? "No proporcionado",
      interes: normalizedPayload.interes ?? "No especificado",
      sessionId: normalizedPayload.sessionId ?? "No disponible",
      leadId: normalizedPayload.leadId ?? "No disponible",
      utmSource: normalizedPayload.utmSource ?? "-",
      utmMedium: normalizedPayload.utmMedium ?? "-",
      utmCampaign: normalizedPayload.utmCampaign ?? "-",
      utmContent: normalizedPayload.utmContent ?? "-",
      utmTerm: normalizedPayload.utmTerm ?? "-",
      referrer: normalizedPayload.referrer ?? "-",
      checkoutUrl: process.env.NEXT_PUBLIC_CHECKOUT_URL ?? "https://www.motusdao.org/",
      calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/",
      lumaUrl: process.env.NEXT_PUBLIC_LUMA_MASTERCLASS_URL ?? "https://luma.com/1sc5em2c?tk=7YOKk3",
    }
    const [userTemplate, internalTemplate] = await Promise.all([
      loadTemplate(convex, "lead_confirmation_user", templateVars),
      loadTemplate(convex, "lead_confirmation_internal", templateVars),
    ])

    const sendResults = await Promise.allSettled([
      transporter.sendMail({
        from: mailFrom,
        replyTo: mailReplyTo,
        to: normalizedPayload.email,
        subject: userTemplate.subject,
        text: userTemplate.text,
        html: userTemplate.html,
      }),
      transporter.sendMail({
        from: mailFrom,
        replyTo: mailReplyTo,
        to: INTERNAL_NOTIFICATION_EMAIL,
        subject: internalTemplate.subject,
        text: internalTemplate.text,
        html: internalTemplate.html,
      }),
    ])

    const hadSendFailure = sendResults.some((result) => {
      return result.status === "rejected"
    })

    if (hadSendFailure) {
      console.warn("[/api/leads] Lead saved but one or more emails failed to send", {
        email: normalizedPayload.email,
        sendResults,
      })
    }

    return NextResponse.json({ ok: true, emailSent: !hadSendFailure })
  } catch (error) {
    console.error("[/api/leads] Error processing lead submit:", error)
    return NextResponse.json({ error: "No se pudo procesar el lead." }, { status: 500 })
  }
}
