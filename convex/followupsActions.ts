"use node";

import { internal } from "./_generated/api";
import { api } from "./_generated/api";
import { internalAction } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || "465");
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const from = process.env.MAIL_FROM || "MotusDAO <contact@motusdao.org>";
const replyTo = process.env.MAIL_REPLY_TO || "contact@motusdao.org";

type DueItem = {
  queueId: Id<"followupQueue">;
  leadId: Id<"leads">;
  step: number;
  email: string;
  nombre: string;
  etapa: "lead_only" | "booked_call" | "purchased";
};

export const processQueue = internalAction({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args): Promise<{ ok: true; processed: number }> => {
    if (!smtpHost || !smtpUser || !smtpPass) {
      throw new Error("SMTP is not configured for followup emails.");
    }
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const items: DueItem[] = await ctx.runQuery(internal.followups.dueQueueItems, {
      now: Date.now(),
      limit: args.limit ?? 20,
    });

    for (const item of items) {
      // Always send the immediate confirmation email (step 0).
      // Gate only delayed follow-ups when the lead has already progressed.
      if (item.step !== 0 && item.etapa !== "lead_only") {
        console.log("Skipping follow-up for progressed lead", {
          queueId: item.queueId,
          leadId: item.leadId,
          step: item.step,
          etapa: item.etapa,
          email: item.email,
        });
        await ctx.runMutation(internal.followups.markQueueStatus, {
          queueId: item.queueId,
          status: "cancelled",
        });
        continue;
      }
      const templateKey = `followup_step_${item.step > 2 ? 3 : item.step}`;
      const tpl = await ctx.runQuery(api.emailTemplates.getRenderedTemplate, {
        key: templateKey,
        vars: {
          nombre: item.nombre,
          checkoutUrl: process.env.NEXT_PUBLIC_CHECKOUT_URL || "https://www.motusdao.org/",
          calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/",
          lumaUrl:
            process.env.NEXT_PUBLIC_LUMA_MASTERCLASS_URL || "https://luma.com/1sc5em2c?tk=7YOKk3",
        },
      });
      try {
        const result = await transporter.sendMail({
          from,
          replyTo,
          to: item.email,
          subject: tpl.subject,
          html: tpl.html,
          text: tpl.text,
        });
        console.log("Follow-up email sent via SMTP", {
          queueId: item.queueId,
          leadId: item.leadId,
          step: item.step,
          to: item.email,
          messageId: result.messageId ?? null,
        });
        await ctx.runMutation(internal.followups.markQueueStatus, {
          queueId: item.queueId,
          status: "sent",
        });
      } catch (error) {
        console.error("Follow-up email send failed via SMTP", {
          queueId: item.queueId,
          leadId: item.leadId,
          step: item.step,
          to: item.email,
          error,
        });
        // keep queued to retry
      }
    }
    return { ok: true, processed: items.length };
  },
});
