/** Escape special characters for PostgREST ilike queries */
export function escapeIlike(str: string): string {
  return str.replace(/%/g, "\\%").replace(/_/g, "\\_");
}
