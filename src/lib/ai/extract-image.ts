/**
 * Extracts a base64 image from a Gemini native API response.
 * Supports the native generateContent response format.
 */
export function extractImageFromResponse(
  aiData: Record<string, unknown>,
): string | null {
  // Native Gemini API format: candidates[].content.parts[].inlineData
  const candidates = aiData.candidates as Array<Record<string, unknown>> | undefined;
  if (candidates) {
    for (const candidate of candidates) {
      const content = candidate.content as Record<string, unknown> | undefined;
      const parts = content?.parts as Array<Record<string, unknown>> | undefined;
      if (parts) {
        for (const part of parts) {
          const inlineData = part.inlineData as Record<string, string> | undefined;
          if (inlineData?.data) {
            return inlineData.data;
          }
        }
      }
    }
  }

  return null;
}
