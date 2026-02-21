import { supabase } from "@/integrations/supabase/client";

type ContentMap = Record<string, any>;

export async function fetchPageContent<T extends ContentMap>(
  pageKey: string,
  defaults: T
): Promise<T> {
  const { data, error } = await supabase
    .from("page_contents")
    .select("section_key, content")
    .eq("page_key", pageKey);

  if (error) throw error;

  const merged = { ...defaults } as T;
  if (data) {
    for (const row of data) {
      if (row.section_key in defaults) {
        (merged as any)[row.section_key] = row.content;
      }
    }
  }

  return merged;
}
