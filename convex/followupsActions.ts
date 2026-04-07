"use node";

import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.RESEND_FROM_EMAIL || "MotusDAO <onboarding@motusdao.org>";
const replyTo = process.env.RESEND_REPLY_TO || "motusdao@gmail.com";

type DueItem = {
  queueId: Id<"followupQueue">;
  leadId: Id<"leads">;
  step: number;
  email: string;
  nombre: string;
  etapa: "lead_only" | "booked_call" | "purchased";
};

function templateFor(step: number, nombre: string) {
  if (step === 0) {
    return {
      subject: "Recibimos tu registro en MotusDAO",
      html: `<p>Hola ${nombre},</p><p>Gracias por registrarte. Tu solicitud fue recibida correctamente.</p><p>Si quieres avanzar hoy, puedes <a href="${process.env.NEXT_PUBLIC_CHECKOUT_URL || "https://www.motusdao.org/"}">completar tu inscripción</a> o <a href="${process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/"}">agendar una llamada</a>.</p>`,
    };
  }
  if (step === 1) {
    return {
      subject: "Tu lugar en MotusDAO sigue disponible",
      html: `<p>Hola ${nombre},</p><p>Gracias por registrarte. Tu lugar sigue disponible por tiempo limitado.</p><p><a href="${process.env.NEXT_PUBLIC_CHECKOUT_URL || "https://www.motusdao.org/"}">Pagar ahora</a> o <a href="${process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/"}">agendar llamada</a>.</p>`,
    };
  }
  if (step === 2) {
    return {
      subject: "Seguimos disponibles para ayudarte a decidir",
      html: `<p>Hola ${nombre},</p><p>Si tienes dudas sobre tiempo, ROI o aplicabilidad clínica, responde este correo y te ayudamos.</p><p>También puedes <a href="${process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/"}">agendar una llamada</a>.</p>`,
    };
  }
  return {
    subject: "Casos reales y siguientes pasos",
    html: `<p>Hola ${nombre},</p><p>En breve publicaremos más testimonios clínicos verificados. Si quieres entrar en esta cohorte, puedes asegurar tu lugar hoy.</p><p><a href="${process.env.NEXT_PUBLIC_CHECKOUT_URL || "https://www.motusdao.org/"}">Completar inscripción</a>.</p>`,
  };
}

export const processQueue = internalAction({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args): Promise<{ ok: true; processed: number }> => {
    const items: DueItem[] = await ctx.runQuery(internal.followups.dueQueueItems, {
      now: Date.now(),
      limit: args.limit ?? 20,
    });

    for (const item of items) {
      if (item.etapa !== "lead_only") {
        await ctx.runMutation(internal.followups.markQueueStatus, {
          queueId: item.queueId,
          status: "cancelled",
        });
        continue;
      }
      const tpl = templateFor(item.step, item.nombre);
      try {
        await resend.emails.send({
          from,
          replyTo,
          to: item.email,
          subject: tpl.subject,
          html: tpl.html,
        });
        await ctx.runMutation(internal.followups.markQueueStatus, {
          queueId: item.queueId,
          status: "sent",
        });
      } catch {
        // keep queued to retry
      }
    }
    return { ok: true, processed: items.length };
  },
});
