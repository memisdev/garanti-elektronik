"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPageContent } from "@/lib/queries/page-contents";

type ContentMap = Record<string, unknown>;

export interface UsePageContentOptions {
  /** Server-prefetched content overrides — merged with defaults and used as TanStack Query initialData */
  initialData?: ContentMap;
}

export function usePageContent<T extends ContentMap>(
  pageKey: string,
  defaults: T,
  options?: UsePageContentOptions
): { content: T; loading: boolean } {
  // Merge server-prefetched overrides with defaults for initialData
  const mergedInitial = options?.initialData
    ? mergeWithDefaults(defaults, options.initialData)
    : undefined;

  const { data, isLoading } = useQuery({
    queryKey: ["page-contents", pageKey],
    queryFn: () => fetchPageContent(pageKey, defaults),
    staleTime: 5 * 60 * 1000,
    ...(mergedInitial ? { initialData: mergedInitial } : {}),
  });

  return { content: data ?? defaults, loading: isLoading };
}

/** Merge DB overrides into defaults — only for keys that exist in defaults */
function mergeWithDefaults<T extends ContentMap>(defaults: T, overrides: ContentMap): T {
  const merged = { ...defaults } as Record<string, unknown>;
  for (const key of Object.keys(defaults)) {
    if (key in overrides) {
      merged[key] = overrides[key];
    }
  }
  return merged as T;
}
