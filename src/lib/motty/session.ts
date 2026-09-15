import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { mottyConfig } from "@/lib/motty/config";
import type { MottyLocale, MottyMessage, MottySession } from "@/lib/motty/types";

const SESSION_VERSION = 1;

type CookiePayload = {
  v: number;
  id: string;
  locale: MottyLocale;
  messages: MottyMessage[];
  createdAt: string;
  updatedAt: string;
};

export function createEmptySession(locale: MottyLocale): MottySession {
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    locale,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

export async function readMottySession(locale: MottyLocale): Promise<MottySession> {
  const jar = await cookies();
  const raw = jar.get(mottyConfig().cookieName)?.value;
  if (!raw) return createEmptySession(locale);

  const parsed = decodeCookie(raw);
  if (!parsed) return createEmptySession(locale);

  return {
    ...parsed,
    locale: parsed.locale === "en" || parsed.locale === "es" ? parsed.locale : locale,
    messages: capMessages(parsed.messages),
  };
}

export async function writeMottySession(session: MottySession): Promise<void> {
  const jar = await cookies();
  const next: MottySession = {
    ...session,
    messages: capMessages(session.messages),
    updatedAt: new Date().toISOString(),
  };
  const encoded = encodeCookie(next);
  const { cookieName, cookieMaxAgeSec } = mottyConfig();

  jar.set(cookieName, encoded, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: cookieMaxAgeSec,
  });
}

export function appendTurn(
  session: MottySession,
  user: string,
  assistant: string,
): MottySession {
  return {
    ...session,
    messages: capMessages([
      ...session.messages,
      { role: "user", content: user },
      { role: "assistant", content: assistant },
    ]),
  };
}

function capMessages(messages: MottyMessage[]): MottyMessage[] {
  const { maxHistory, maxStoredChars } = mottyConfig();
  return messages.slice(-maxHistory).map((message) => ({
    role: message.role === "assistant" ? "assistant" : "user",
    content: String(message.content ?? "").slice(0, maxStoredChars),
  }));
}

function encodeCookie(session: MottySession): string {
  const payload: CookiePayload = {
    v: SESSION_VERSION,
    id: session.id,
    locale: session.locale,
    messages: session.messages,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${body}.${sign(body)}`;
}

function decodeCookie(raw: string): MottySession | null {
  const dot = raw.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = raw.slice(0, dot);
  const mac = raw.slice(dot + 1);
  if (!verify(body, mac)) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as CookiePayload;
    if (parsed.v !== SESSION_VERSION || !parsed.id) return null;
    return parsed;
  } catch {
    return null;
  }
}

function secret(): string {
  const configured = mottyConfig().sessionSecret;
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") {
    throw new Error("MOTTY_SESSION_SECRET is required in production.");
  }
  return "motty-academy-dev-session-secret";
}

function sign(body: string): string {
  return createHmac("sha256", secret()).update(body).digest("base64url");
}

function verify(body: string, mac: string): boolean {
  const expected = Buffer.from(sign(body));
  const actual = Buffer.from(mac);
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}
