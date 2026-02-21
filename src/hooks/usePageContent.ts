import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ContentMap = Record<string, any>;

export function usePageContent<T extends ContentMap>(
  pageKey: string,
  defaults: T
): { content: T; loading: boolean } {
  const { data, isLoading } = useQuery({
    queryKey: ["page-contents", pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_contents")
        .select("section_key, content")
        .eq("page_key", pageKey);
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const merged = { ...defaults } as T;
  if (data) {
    for (const row of data) {
      if (row.section_key in defaults) {
        (merged as any)[row.section_key] = row.content;
      }
    }
  }

  return { content: merged, loading: isLoading };
}
