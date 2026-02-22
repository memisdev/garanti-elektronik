/**
 * Extracts a base64 image from a Gemini/OpenAI-compatible chat completion response.
 * Shared by process-image and generate-category-icon routes.
 */
export function extractImageFromResponse(
  aiData: Record<string, unknown>,
): string | null {
  const choices = (aiData.choices as Array<Record<string, unknown>>) || [];
  let base64Image: string | null = null;

  for (const choice of choices) {
    const message = choice.message as Record<string, unknown> | undefined;
    const content = message?.content;
    if (Array.isArray(content)) {
      for (const part of content) {
        if (part.type === "image_url" && part.image_url?.url) {
          const imgUrl: string = part.image_url.url;
          if (imgUrl.startsWith("data:")) {
            base64Image = imgUrl.split(",")[1];
          } else {
            base64Image = imgUrl;
          }
          break;
        }
      }
    }
    if (base64Image) break;
  }

  return base64Image;
}
