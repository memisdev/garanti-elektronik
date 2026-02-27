/**
 * Strips markdown formatting, HTML tags, code fences, and other
 * artifacts from AI-generated text. Preserves paragraph breaks
 * (double newlines) which are valid in product descriptions.
 */
export function sanitizeAIOutput(text: string): string {
  return (
    text
      // Remove code fences
      .replace(/```[\s\S]*?```/g, "")
      // Remove inline code
      .replace(/`([^`]+)`/g, "$1")
      // Remove HTML tags
      .replace(/<[^>]+>/g, "")
      // Remove markdown headings
      .replace(/^#{1,6}\s+/gm, "")
      // Remove bold/italic markers
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
      .replace(/_{1,3}([^_]+)_{1,3}/g, "$1")
      // Remove markdown links, keep text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Remove markdown images
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
      // Remove horizontal rules
      .replace(/^[-*_]{3,}$/gm, "")
      // Remove markdown list markers
      .replace(/^[\s]*[-*+]\s+/gm, "")
      .replace(/^[\s]*\d+\.\s+/gm, "")
      // Collapse multiple spaces into one
      .replace(/ {2,}/g, " ")
      // Collapse 3+ newlines into double newline (paragraph break)
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}
