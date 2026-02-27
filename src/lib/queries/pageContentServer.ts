import { createStaticClient } from "@/lib/supabase/static";

type ContentMap = Record<string, unknown>;

/**
 * Server-side page content fetching.
 * Fetches all content for a page_key from the `page_contents` table.
 * Uses cookie-free Supabase client (safe for both runtime and build-time).
 *
 * Unlike the client-side version, this does NOT require defaults — it returns
 * all section_key/content pairs found for the page. The client-side usePageContent
 * hook merges these with its own defaults.
 */
export async function fetchPageContentServer(
    pageKey: string,
): Promise<ContentMap> {
    const supabase = createStaticClient();
    const { data, error } = await supabase
        .from("page_contents")
        .select("section_key, content")
        .eq("page_key", pageKey);

    if (error) {
        console.error(`[pageContentServer] Error fetching "${pageKey}":`, error.message);
        return {};
    }

    const result: ContentMap = {};
    if (data) {
        for (const row of data) {
            result[row.section_key] = row.content;
        }
    }

    return result;
}
