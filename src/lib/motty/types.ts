export type MottyLocale = "es" | "en";

export type MottyRole = "user" | "assistant" | "system";

export type MottyMessage = {
  role: MottyRole;
  content: string;
};

export type MottyOfferId =
  | "genesis"
  | "membership"
  | "assessment"
  | "app"
  | "guide"
  | "skill"
  | "praxis";

export type MottyOffer = {
  id: MottyOfferId;
  label: string;
  summary: string;
  href: string;
  cta: string;
};

export type MottySession = {
  id: string;
  locale: MottyLocale;
  createdAt: string;
  updatedAt: string;
  messages: MottyMessage[];
};

export type ToolResult = {
  ok: boolean;
  tool: string;
  data?: Record<string, unknown>;
  error?: string;
};
