const BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/openai";

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

export function getChatConfig(): AIConfig {
  return {
    url: `${BASE_URL}/chat/completions`,
    apiKey: getApiKey(),
    model: (process.env.AI_CHAT_MODEL ?? "gemini-2.5-flash").trim(),
  };
}

export function getImageConfig(): AIConfig {
  return {
    url: `${BASE_URL}/chat/completions`,
    apiKey: getApiKey(),
    model: (process.env.AI_IMAGE_MODEL ?? "gemini-2.5-flash-image").trim(),
  };
}

export function getIconGenerationConfig(): AIConfig {
  return {
    url: `${BASE_URL}/chat/completions`,
    apiKey: getApiKey(),
    model: (process.env.AI_ICON_MODEL ?? "gemini-2.5-flash-image").trim(),
  };
}
