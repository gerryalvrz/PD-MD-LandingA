import { internalMutation, internalQuery } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";

export const dueQueueItems = internalQuery({
  args: { now: v.number(), limit: v.number() },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("followupQueue")
      .withIndex("by_status_and_scheduledAt", (q) =>
        q.eq("status", "queued").lte("scheduledAt", args.now)
      )
      .take(args.limit);

    const enriched: Array<{
      queueId: Id<"followupQueue">;
      leadId: Id<"leads">;
      step: number;
      email: string;
      nombre: string;
      etapa: "lead_only" | "booked_call" | "purchased";
    }> = [];

    for (const item of items) {
      const lead = await ctx.db.get(item.leadId);
      if (!lead) continue;
      enriched.push({
        queueId: item._id,
        leadId: item.leadId,
        step: item.step,
        email: lead.email,
        nombre: lead.nombre,
        // Legacy leads may miss etapa before backfill; treat as active lead_only.
        etapa: lead.etapa ?? "lead_only",
      });
    }
    return enriched;
  },
});

export const markQueueStatus = internalMutation({
  args: {
    queueId: v.id("followupQueue"),
    status: v.union(v.literal("sent"), v.literal("cancelled")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.queueId, { status: args.status });
    return null;
  },
});
