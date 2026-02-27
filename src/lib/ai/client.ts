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

// ---------------------------------------------------------------------------
// Shared chat completion helper — DRY replacement for duplicated fetch logic
// ---------------------------------------------------------------------------

export interface ChatCompletionParams {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxCompletionTokens?: number;
  timeoutMs?: number;
}

interface ChatCompletionResult {
  content: string;
  finishReason: string;
  usage: { completionTokens: number; totalTokens: number };
}

/** Error subclass for AI-specific failures with HTTP status context. */
export class AIError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly retryable: boolean = false,
  ) {
    super(message);
    this.name = "AIError";
  }
}

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;

/**
 * Calls Gemini via OpenAI-compatible chat completions endpoint.
 *
 * Handles:
 * - AbortController timeout
 * - Retries on transient 429 / 5xx errors (up to MAX_RETRIES)
 * - finish_reason:"length" detection (truncated output)
 * - Structured error responses with Turkish messages
 */
export async function chatCompletion(
  params: ChatCompletionParams,
): Promise<ChatCompletionResult> {
  const {
    systemPrompt,
    userPrompt,
    temperature = 0.5,
    maxCompletionTokens = 2048,
    timeoutMs = 20_000,
  } = params;

  const config = getChatConfig();

  async function attempt(retryCount: number): Promise<ChatCompletionResult> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;
    try {
      response = await fetch(config.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature,
          max_completion_tokens: maxCompletionTokens,
        }),
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof DOMException && err.name === "AbortError") {
        throw new AIError("AI isteği zaman aşımına uğradı", 504);
      }
      // Network error — retryable
      if (retryCount < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * (retryCount + 1));
        return attempt(retryCount + 1);
      }
      throw new AIError("AI servisine bağlanılamadı", 502);
    } finally {
      clearTimeout(timer);
    }

    // Retryable status codes
    if (
      (response.status === 429 || response.status >= 500) &&
      retryCount < MAX_RETRIES
    ) {
      await sleep(RETRY_DELAY_MS * (retryCount + 1));
      return attempt(retryCount + 1);
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error(`[chatCompletion] API error ${response.status}:`, errText);

      if (response.status === 429) {
        throw new AIError(
          "AI istek limiti aşıldı. Lütfen daha sonra tekrar deneyin.",
          429,
        );
      }
      throw new AIError(`AI istek hatası (${response.status})`, response.status);
    }

    const data = await response.json();
    const choice = data?.choices?.[0];
    const content = choice?.message?.content ?? "";
    const finishReason = choice?.finish_reason ?? "unknown";
    const usage = data?.usage ?? {};

    return {
      content,
      finishReason,
      usage: {
        completionTokens: usage.completion_tokens ?? 0,
        totalTokens: usage.total_tokens ?? 0,
      },
    };
  }

  return attempt(0);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
