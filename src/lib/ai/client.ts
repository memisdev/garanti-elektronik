const BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/openai";

interface AIConfig {
  url: string;
  apiKey: string;
  model: string;
}

export function getChatConfig(): AIConfig {
  return {
    url: `${BASE_URL}/chat/completions`,
    apiKey: process.env.AI_API_KEY!,
    model: process.env.AI_CHAT_MODEL ?? "gemini-2.0-flash",
  };
}

export function getImageConfig(): AIConfig {
  return {
    url: `${BASE_URL}/chat/completions`,
    apiKey: process.env.AI_API_KEY!,
    model: process.env.AI_IMAGE_MODEL ?? "gemini-2.0-flash",
  };
}
