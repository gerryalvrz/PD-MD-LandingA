import { NextResponse } from "next/server";
import { runPublicMottyTurn } from "@/lib/motty/agent-loop";
import { mottyConfig } from "@/lib/motty/config";
import { getPublicMottyRuntime } from "@/lib/motty/runtime";
import {
  appendTurn,
  readMottySession,
  writeMottySession,
} from "@/lib/motty/session";
import type { MottyLocale } from "@/lib/motty/types";

export const runtime = "nodejs";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 24;
const hits = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  if (getPublicMottyRuntime() !== "in-process-loop") {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  let body: { message?: unknown; locale?: unknown };
  try {
    body = (await request.json()) as { message?: unknown; locale?: unknown };
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const message =
    typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "empty_message" }, { status: 400 });
  }

  const { maxMessageChars } = mottyConfig();
  if (message.length > maxMessageChars) {
    return NextResponse.json({ error: "message_too_long" }, { status: 400 });
  }

  const locale: MottyLocale = body.locale === "en" ? "en" : "es";
  const session = await readMottySession(locale);
  session.locale = locale;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(`${session.id}:${ip}`)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  try {
    const turn = await runPublicMottyTurn({
      session,
      userMessage: message,
    });
    const next = appendTurn(turn.session, message, turn.reply);
    await writeMottySession(next);

    return NextResponse.json({
      reply: turn.reply,
      sessionId: next.id,
    });
  } catch {
    const fallback =
      locale === "en"
        ? "I could not answer just now. Try again in a moment."
        : "No pude responder ahora. Intenta de nuevo en un momento.";
    const next = appendTurn(session, message, fallback);
    await writeMottySession(next);
    return NextResponse.json({ reply: fallback, sessionId: next.id, degraded: true });
  }
}

function rateLimited(key: string): boolean {
  const now = Date.now();
  const current = hits.get(key);
  if (!current || current.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_HITS;
}
