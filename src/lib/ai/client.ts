const OPENAI_BASE = "https://generativelanguage.googleapis.com/v1beta/openai";
const NATIVE_BASE = "https://generativelanguage.googleapis.com/v1beta";

interface AIConfig {
  url: string;
  apiKey: string;
  model: string;
}

function getApiKey(): string {
  const apiKey = process.env.AI_API_KEY?.trim();
  if (!apiKey) throw new Error("AI_API_KEY environment variable is not configured");
  return apiKey;
}

/** Chat completions (text only) — uses OpenAI-compatible endpoint */
export function getChatConfig(): AIConfig {
  return {
    url: `${OPENAI_BASE}/chat/completions`,
    apiKey: getApiKey(),
    model: (process.env.AI_CHAT_MODEL ?? "gemini-3-flash-preview").trim(),
  };
}

/** Image processing (bg removal) — uses native Gemini API */
export function getImageConfig(): AIConfig {
  const model = (process.env.AI_IMAGE_MODEL ?? "gemini-3-pro-image-preview").trim();
  return {
    url: `${NATIVE_BASE}/models/${model}:generateContent`,
    apiKey: getApiKey(),
    model,
  };
}

/** Icon generation — uses native Gemini API */
export function getIconGenerationConfig(): AIConfig {
  const model = (process.env.AI_ICON_MODEL ?? "gemini-3-pro-image-preview").trim();
  return {
    url: `${NATIVE_BASE}/models/${model}:generateContent`,
    apiKey: getApiKey(),
    model,
  };
}
