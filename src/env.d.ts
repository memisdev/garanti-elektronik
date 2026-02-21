/**
 * Temporary shim for import.meta.env used by legacy Vite source files.
 * Will be removed in Phase 2 when env vars are migrated to process.env.NEXT_PUBLIC_*.
 */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_SUPABASE_PROJECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
