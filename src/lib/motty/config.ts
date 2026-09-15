export function mottyConfig() {
  const aiApiKey =
    process.env.MOTTY_AI_API_KEY ||
    process.env.VENICE_API_KEY ||
    process.env.OPENAI_API_KEY ||
    "";

  return {
    aiBaseUrl: (
      process.env.MOTTY_AI_BASE_URL ||
      process.env.OPENAI_BASE_URL ||
      "https://api.venice.ai/api/v1"
    ).replace(/\/$/, ""),
    aiApiKey,
    aiModel: process.env.MOTTY_AI_MODEL || "deepseek-v4-flash-0731",
    /** Motus Knowledge MCP — https://github.com/Motus-DAO/MotusContextProtocol-MCP */
    mcpUrl: process.env.MOTTY_MCP_URL || "https://mcp.motusdao.org/mcp",
    sessionSecret: process.env.MOTTY_SESSION_SECRET || "",
    maxToolRounds: 3,
    maxHistory: 8,
    maxMessageChars: 2000,
    maxStoredChars: 360,
    /** Isolated from LandingMotus (`motty_session`). Same API keys, different visitor store. */
    cookieName: "motty_academy_session",
    cookieMaxAgeSec: 60 * 60 * 24 * 7,
  };
}

export function hasMottyInference(): boolean {
  return Boolean(mottyConfig().aiApiKey);
}
