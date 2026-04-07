import { mutation } from "./_generated/server"
import { v } from "convex/values"

export const registrar = mutation({
  args: {
    nombre: v.string(),
    email: v.string(),
    interes: v.union(v.literal("programa"), v.literal("llamada")),
    certificado: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Evitar duplicados por email
    const existente = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()

    if (existente) {
      return { ok: true, duplicate: true }
    }

    await ctx.db.insert("leads", {
      ...args,
      creadoEn: Date.now(),
    })

    return { ok: true, duplicate: false }
  },
})
