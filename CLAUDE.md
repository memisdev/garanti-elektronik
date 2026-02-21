# Garanti Elektronik — Next.js Migration

## Migration Phase Tracker

- [x] Phase 0: Project skeleton (Vite → Next.js 15 in-place conversion)
- [x] Phase 1: Providers & shared layout (QueryClient, ThemeProvider, Toaster)
- [x] Phase 2: Supabase client migration (VITE_ → NEXT_PUBLIC_, @supabase/ssr)
- [ ] Phase 3: Routing migration (react-router-dom → App Router file routes)
- [ ] Phase 4: Page-by-page migration (server components, metadata, loading states)
- [ ] Phase 5: Image optimization (next/image), fonts (next/font), SEO
- [ ] Phase 6: Cleanup & production readiness

## Decisions Log

| Decision | Rationale |
|----------|-----------|
| In-place conversion (not create-next-app) | 48 shadcn/ui components already in position, DAL layer extracted, git history preserved |
| Keep React 18.3.1 (not 19) | Radix UI, react-hook-form, recharts all validated against React 18 |
| Keep react-router-dom until Phase 3 | Avoid breaking all navigation at once |
| `.env` uses `NEXT_PUBLIC_` vars (Phase 2) | All source files migrated to `process.env.NEXT_PUBLIC_*` |
| Rename `src/pages/` → `src/views/` | Prevent Next.js from treating legacy Vite page components as Pages Router routes |
| `src/env.d.ts` shim for `import.meta.env` | Removed in Phase 2 — all env refs now use `process.env.NEXT_PUBLIC_*` |
| Cookie-based auth via `@supabase/ssr` | Replaces `localStorage` auth; enables SSR-compatible sessions for future phases |
| Middleware refreshes auth session | `supabase.auth.getUser()` on every non-static request keeps cookies fresh |

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

- [ ] Inter font loaded (currently via HTML link, will move to next/font)
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
