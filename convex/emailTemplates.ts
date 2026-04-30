import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { marked } from "marked";
import {
  EMAIL_TEMPLATE_DEFAULTS,
  renderTemplate,
  type EmailTemplateKey,
} from "./emailTemplateDefaults";

function isTemplateKey(value: string): value is EmailTemplateKey {
  return Object.prototype.hasOwnProperty.call(EMAIL_TEMPLATE_DEFAULTS, value);
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("emailTemplates").take(100);
    const byKey = new Map(docs.map((doc) => [doc.key, doc]));

    return Object.entries(EMAIL_TEMPLATE_DEFAULTS).map(([key, fallback]) => {
      const saved = byKey.get(key);
      return {
        key,
        subject: saved?.subject ?? fallback.subject,
        text: saved?.text ?? fallback.text ?? "",
        html: saved?.html ?? fallback.html ?? "",
        markdown: saved?.markdown ?? fallback.markdown ?? "",
        updatedAt: saved?.updatedAt ?? null,
        source: saved ? "db" : "default",
      };
    });
  },
});

export const getRenderedTemplate = query({
  args: {
    key: v.string(),
    vars: v.optional(v.record(v.string(), v.string())),
  },
  handler: async (ctx, args) => {
    if (!isTemplateKey(args.key)) {
      throw new Error(`Unknown email template key: ${args.key}`);
    }

    const fallback = EMAIL_TEMPLATE_DEFAULTS[args.key];
    const saved = await ctx.db
      .query("emailTemplates")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();

    const merged = {
      subject: saved?.subject ?? fallback.subject,
      text: saved?.text ?? fallback.text,
      html: saved?.html ?? fallback.html,
      markdown: saved?.markdown ?? fallback.markdown,
    };

    const rendered = renderTemplate(merged, args.vars ?? {});
    const renderedMarkdown = rendered.markdown?.trim();
    if (renderedMarkdown) {
      const markdownHtml = await marked.parse(renderedMarkdown);
      return {
        subject: rendered.subject,
        text: rendered.text,
        html: rendered.html?.trim() ? rendered.html : markdownHtml,
        markdown: rendered.markdown,
      };
    }

    return rendered;
  },
});

export const upsert = mutation({
  args: {
    key: v.string(),
    subject: v.optional(v.string()),
    text: v.optional(v.string()),
    html: v.optional(v.string()),
    markdown: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!isTemplateKey(args.key)) {
      throw new Error(`Unknown email template key: ${args.key}`);
    }

    const fallback = EMAIL_TEMPLATE_DEFAULTS[args.key];
    const doc = await ctx.db
      .query("emailTemplates")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();

    const subject = args.subject ?? doc?.subject ?? fallback.subject;
    const text = args.text ?? doc?.text ?? fallback.text ?? "";
    const html = args.html ?? doc?.html ?? fallback.html ?? "";
    const markdown = args.markdown ?? doc?.markdown ?? fallback.markdown ?? "";

    if (doc) {
      await ctx.db.patch(doc._id, {
        subject,
        text,
        html,
        markdown,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("emailTemplates", {
        key: args.key,
        subject,
        text,
        html,
        markdown,
        updatedAt: Date.now(),
      });
    }

    return { ok: true };
  },
});
