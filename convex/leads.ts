import { internalMutation, mutation } from "./_generated/server"
import { internal } from "./_generated/api"
import { v } from "convex/values"

export const registrar = mutation({
  args: {
    nombre: v.string(),
    email: v.string(),
    interes: v.union(v.literal("programa"), v.literal("llamada")),
    certificado: v.boolean(),
    sessionId: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    utmContent: v.optional(v.string()),
    utmTerm: v.optional(v.string()),
    referrer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Evitar duplicados por email
    const existente = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()

    if (existente) {
      await ctx.db.patch(existente._id, {
        nombre: args.nombre,
        interes: args.interes,
        certificado: args.certificado,
        sessionId: args.sessionId,
        utmSource: args.utmSource,
        utmMedium: args.utmMedium,
        utmCampaign: args.utmCampaign,
        utmContent: args.utmContent,
        utmTerm: args.utmTerm,
        referrer: args.referrer,
        ultimoEventoEn: Date.now(),
      })
      // Send welcome immediately after each registration attempt, including re-registrations.
      await ctx.scheduler.runAfter(0, internal.leads.programarSeguimiento, {
        leadId: existente._id,
        step: 0,
      })
      await ctx.scheduler.runAfter(1000 * 60 * 60 * 24, internal.leads.programarSeguimiento, {
        leadId: existente._id,
        step: 1,
      })
      return { ok: true, duplicate: true, leadId: existente._id }
    }

    const leadId = await ctx.db.insert("leads", {
      ...args,
      etapa: "lead_only",
      seguimientoEstado: "active",
      ultimoEventoEn: Date.now(),
      creadoEn: Date.now(),
    })
    await ctx.scheduler.runAfter(0, internal.leads.programarSeguimiento, {
      leadId,
      step: 0,
    })
    await ctx.scheduler.runAfter(1000 * 60 * 60 * 24, internal.leads.programarSeguimiento, {
      leadId,
      step: 1,
    })

    return { ok: true, duplicate: false, leadId }
  },
})

export const marcarEtapa = mutation({
  args: {
    leadId: v.optional(v.id("leads")),
    email: v.optional(v.string()),
    etapa: v.union(v.literal("lead_only"), v.literal("booked_call"), v.literal("purchased")),
  },
  handler: async (ctx, args) => {
    let leadId = args.leadId ?? null
    if (!leadId && args.email) {
      const lead = await ctx.db
        .query("leads")
        .withIndex("by_email", (q) => q.eq("email", args.email!))
        .first()
      if (lead) leadId = lead._id
    }
    if (!leadId) return { ok: false }
    const seguimientoEstado = args.etapa === "lead_only" ? "active" : "completed"
    await ctx.db.patch(leadId, {
      etapa: args.etapa,
      seguimientoEstado,
      ultimoEventoEn: Date.now(),
    })
    return { ok: true, leadId }
  },
})

export const programarSeguimiento = internalMutation({
  args: {
    leadId: v.id("leads"),
    step: v.number(),
  },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.leadId)
    if (!lead) return null
    if (lead.etapa !== "lead_only" || lead.seguimientoEstado !== "active") return null

    const templateMap: Record<number, string> = {
      0: "welcome_immediate",
      1: "followup_reminder_24h",
      2: "followup_objection_78h",
    }
    const templateKey = templateMap[args.step]
    if (!templateKey) return null

    await ctx.db.insert("followupQueue", {
      leadId: args.leadId,
      channel: "email",
      step: args.step,
      status: "queued",
      templateKey,
      scheduledAt: Date.now(),
      createdAt: Date.now(),
    })

    if (args.step === 1) {
      // 78h total from registration => 54h after the 24h follow-up.
      await ctx.scheduler.runAfter(1000 * 60 * 60 * 54, internal.leads.programarSeguimiento, {
        leadId: args.leadId,
        step: 2,
      })
    }
    if (args.step === 0) {
      // Trigger processing immediately so the welcome email goes out right away.
      await ctx.scheduler.runAfter(0, internal.followupsActions.processQueue, { limit: 20 })
    }
    return null
  },
})

export const trackEvent = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const createdAt = Date.now()
    await ctx.db.insert("funnelEvents", {
      ...args,
      createdAt,
    })
    if (args.leadId) {
      const lead = await ctx.db.get(args.leadId)
      if (lead) {
        await ctx.db.patch(args.leadId, { ultimoEventoEn: createdAt })
      }
    }
    return { ok: true }
  },
})

export const resetLeadForTesting = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const lead = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()

    if (!lead) {
      return { ok: true, deletedLead: false, deletedQueueItems: 0, deletedEvents: 0 }
    }

    let deletedQueueItems = 0
    while (true) {
      const queueBatch = await ctx.db
        .query("followupQueue")
        .withIndex("by_leadId_and_scheduledAt", (q) => q.eq("leadId", lead._id))
        .take(100)
      if (queueBatch.length === 0) break
      for (const item of queueBatch) {
        await ctx.db.delete(item._id)
        deletedQueueItems += 1
      }
    }

    let deletedEvents = 0
    while (true) {
      const eventsBatch = await ctx.db
        .query("funnelEvents")
        .withIndex("by_leadId_and_createdAt", (q) => q.eq("leadId", lead._id))
        .take(100)
      if (eventsBatch.length === 0) break
      for (const event of eventsBatch) {
        await ctx.db.delete(event._id)
        deletedEvents += 1
      }
    }

    await ctx.db.delete(lead._id)

    return {
      ok: true,
      deletedLead: true,
      deletedQueueItems,
      deletedEvents,
      leadId: lead._id,
      email: lead.email,
    }
  },
})
