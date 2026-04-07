import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  leads: defineTable({
    nombre: v.string(),
    email: v.string(),
    interes: v.union(v.literal("programa"), v.literal("llamada")),
    certificado: v.boolean(),
    creadoEn: v.number(), // timestamp
  }).index("by_email", ["email"]),
})
