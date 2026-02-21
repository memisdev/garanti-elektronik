import { supabase } from "@/integrations/supabase/client";

type ContentMap = Record<string, unknown>;

export async function fetchPageContent<T extends ContentMap>(
  pageKey: string,
  defaults: T
): Promise<T> {
  const { data, error } = await supabase
    .from("page_contents")
    .select("section_key, content")
    .eq("page_key", pageKey);

  if (error) throw error;

  const merged = { ...defaults } as Record<string, unknown>;
  if (data) {
    for (const row of data) {
      if (row.section_key in defaults) {
        merged[row.section_key] = row.content;
      }
    }
  }

  return merged as T;
}
