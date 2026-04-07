import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  leads: defineTable({
    nombre: v.string(),
    email: v.string(),
    interes: v.union(v.literal("programa"), v.literal("llamada")),
    certificado: v.boolean(),
    etapa: v.union(v.literal("lead_only"), v.literal("booked_call"), v.literal("purchased")),
    seguimientoEstado: v.union(v.literal("active"), v.literal("paused"), v.literal("completed")),
    sessionId: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    utmContent: v.optional(v.string()),
    utmTerm: v.optional(v.string()),
    referrer: v.optional(v.string()),
    ultimoEventoEn: v.number(),
    creadoEn: v.number(), // timestamp
  }).index("by_email", ["email"]),
  funnelEvents: defineTable({
    eventName: v.union(
      v.literal("page_view"),
      v.literal("cta_click"),
      v.literal("modal_open"),
      v.literal("form_started"),
      v.literal("form_submitted"),
      v.literal("checkout_click"),
      v.literal("checkout_complete"),
      v.literal("calendly_booked")
    ),
    sessionId: v.string(),
    leadId: v.optional(v.id("leads")),
    email: v.optional(v.string()),
    page: v.optional(v.string()),
    section: v.optional(v.string()),
    ctaLabel: v.optional(v.string()),
    intent: v.optional(v.union(v.literal("pay"), v.literal("lead"), v.literal("call"))),
    metadata: v.optional(v.record(v.string(), v.string())),
    createdAt: v.number(),
  })
    .index("by_eventName_and_createdAt", ["eventName", "createdAt"])
    .index("by_sessionId_and_createdAt", ["sessionId", "createdAt"])
    .index("by_leadId_and_createdAt", ["leadId", "createdAt"]),
  followupQueue: defineTable({
    leadId: v.id("leads"),
    channel: v.union(v.literal("email"), v.literal("whatsapp")),
    step: v.number(),
    status: v.union(v.literal("queued"), v.literal("sent"), v.literal("cancelled")),
    templateKey: v.string(),
    scheduledAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_leadId_and_scheduledAt", ["leadId", "scheduledAt"])
    .index("by_status_and_scheduledAt", ["status", "scheduledAt"]),
})
