"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPageContent } from "@/lib/queries/page-contents";

type ContentMap = Record<string, unknown>;

export function usePageContent<T extends ContentMap>(
  pageKey: string,
  defaults: T
): { content: T; loading: boolean } {
  const { data, isLoading } = useQuery({
    queryKey: ["page-contents", pageKey],
    queryFn: () => fetchPageContent(pageKey, defaults),
    staleTime: 5 * 60 * 1000,
  });

  return { content: data ?? defaults, loading: isLoading };
}
