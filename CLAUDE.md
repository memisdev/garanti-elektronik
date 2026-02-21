# Garanti Elektronik — Next.js Migration

## Migration Phase Tracker

- [x] Phase 0: Project skeleton (Vite → Next.js 15 in-place conversion)
- [x] Phase 1: Providers & shared layout (QueryClient, ThemeProvider, Toaster)
- [x] Phase 2: Supabase client migration (VITE_ → NEXT_PUBLIC_, @supabase/ssr)
- [x] Phase 3: Routing migration (react-router-dom → App Router file routes)
- [x] Phase 4: Page-by-page migration (server components, metadata, loading states)
- [x] Phase 5: Image optimization (next/image), fonts (next/font), SEO
- [x] Phase 6: Cleanup & production readiness
- [x] Phase 7: Admin panel (API routes, middleware protection, error/loading states)

## Decisions Log

| Decision | Rationale |
|----------|-----------|
| In-place conversion (not create-next-app) | 48 shadcn/ui components already in position, DAL layer extracted, git history preserved |
| Keep React 18.3.1 (not 19) | Radix UI, react-hook-form, recharts all validated against React 18 |
| Removed react-router-dom (Phase 3) | All routing via App Router file conventions; views stay in `src/views/` as client components |
| `.env` uses `NEXT_PUBLIC_` vars (Phase 2) | All source files migrated to `process.env.NEXT_PUBLIC_*` |
| Rename `src/pages/` → `src/views/` | Prevent Next.js from treating legacy Vite page components as Pages Router routes |
| `src/env.d.ts` shim for `import.meta.env` | Removed in Phase 2 — all env refs now use `process.env.NEXT_PUBLIC_*` |
| Cookie-based auth via `@supabase/ssr` | Replaces `localStorage` auth; enables SSR-compatible sessions for future phases |
| Middleware refreshes auth session | `supabase.auth.getUser()` on every non-static request keeps cookies fresh |
| Next.js Metadata API replaces usePageMeta (Phase 4) | Server-side `<head>` via `export const metadata` / `generateMetadata`; deleted `usePageMeta` hook |
| `next/font/google` for Inter with CSS variable (Phase 5) | `--font-inter` variable on `<html>`, referenced in Tailwind and globals.css; self-hosted by Next.js |
| Default Next.js image optimization for `next/image` (Phase 5) | Remote patterns already configured; deleted `optimizeImageUrl` utility |
| Dynamic sitemap/robots via App Router conventions (Phase 5) | `src/app/sitemap.ts` fetches products+brands from Supabase; `src/app/robots.ts` disallows `/admin/` |
| OG metadata on root + dynamic pages (Phase 5) | Root layout has `openGraph` + `twitter` defaults; product/brand pages include OG images |
| `error.tsx` replaces class ErrorBoundary (Phase 6) | Next.js App Router convention; deleted unused `ErrorBoundary.tsx` class component |
| `poweredByHeader: false` + `reactStrictMode: true` (Phase 6) | Production hardening — hide framework fingerprint, catch React issues early |
| Admin API routes replace Edge Functions (Phase 7) | `list-users` + `invite-user` ported to `src/app/api/admin/`; service_role client in `src/lib/supabase/admin.ts` |
| Middleware blocks unauthenticated `/admin/` + `/api/admin/` (Phase 7) | Session-only check (no DB query); role verification stays client-side via `useAdminAuth` |
| Admin `loading.tsx` + `error.tsx` (Phase 7) | App Router conventions for skeleton loading and error boundary in admin panel route group |

## Key Directories

```
src/
├── app/            # Next.js App Router (layout, pages, globals.css)
├── components/     # React components (48 shadcn/ui in ui/)
├── hooks/          # Custom React hooks
├── lib/
│   ├── queries/    # DAL layer (framework-agnostic Supabase queries)
│   └── utils.ts    # Utility functions (cn, etc.)
├── integrations/   # Supabase client config
├── views/          # Legacy Vite page components (renamed from src/pages/ to avoid Next.js Pages Router)
└── types/          # TypeScript type definitions
```

## Design Fidelity Checklist

- [x] Inter font loaded via next/font/google
- [ ] CSS design tokens preserved in globals.css (351 lines)
- [ ] Dark mode variables intact
- [ ] All custom animations (marquee, kenBurns, fadeIn, etc.)
- [ ] Card hover effects, glass effects, grain overlays
- [ ] Mobile GPU optimizations (reduced motion, disabled effects)
- [ ] 48 shadcn/ui components functional

## Commands

```bash
npm run dev      # Start dev server (Turbopack) — http://localhost:3000
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```

## Source Reference

Original Lovable/Vite source is permanently available via:
```bash
git show lovable-source-final:<path>
```
