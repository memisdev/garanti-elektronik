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
- [x] Phase 8: API Routes & Server Actions (contact form, audit log, part-finder AI, process-image)
- [x] Phase 9: SEO & Performance (canonical URLs, ISR, generateStaticParams, image sizes, caching headers, bundle analyzer, web vitals)
- [x] Phase 10: Security, QA & Final Audit (security headers, Zod validation, rate limit cleanup, brute-force protection, CORS, env docs)
- [x] Phase 11: SEO-friendly product detail pages (drawer→page, JSON-LD fix, breadcrumbs, FAQ, related products, mobile sticky CTA)
- [x] Phase 12: AI product name & description generator (admin form AI buttons, batch processing page, system prompts, sanitizer)

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
| Google AI Studio replaces Lovable gateway (Phase 8) | Lovable gateway stops post-migration; Google AI keeps Gemini model family, OpenAI-compatible format |
| Resend for contact form notifications (Phase 8) | Admin notified via email on new contact messages |
| Server Actions for contact form + audit log (Phase 8) | Progressive enhancement, server-side validation, session-based user_id |
| In-memory rate limiting (Phase 8) | Simple Map-based, sufficient for single-instance deployment |
| Canonical URLs via `alternates` in metadata (Phase 9) | Relative paths resolve via `metadataBase`; every public page gets a canonical URL |
| ISR with `revalidate` per page (Phase 9) | Dynamic pages 30m, homepage/brands 1h, static pages 24h, cargo-tracking fully static |
| `generateStaticParams` for dynamic routes (Phase 9) | Products and brands pre-rendered at build time with ISR fallback |
| `@next/bundle-analyzer` (Phase 9) | `npm run analyze` for bundle size inspection |
| Web Vitals reporting via `useReportWebVitals` (Phase 9) | Console logging in dev, ready for analytics endpoint |
| Security headers in `next.config.ts` (Phase 10) | CSP, HSTS, X-Frame-Options, Permissions-Policy on all routes |
| Zod validation on admin API routes (Phase 10) | `invite-user` and `process-image` use Zod schemas; sanitized error messages |
| Magic-byte MIME validation for image uploads (Phase 10) | Validates JPEG, PNG, WebP magic bytes before AI processing |
| Rate limit memory leak fix (Phase 10) | Lazy cleanup every 60s per store; deletes expired entries |
| Server-side login with brute-force protection (Phase 10) | `/api/auth/login` rate limits 5 attempts per 15min per IP |
| CORS headers on API routes (Phase 10) | Restricted to `garantielektronik.com` origin |
| Cookie-free Supabase client for build-time (Phase 10) | `createStaticClient()` avoids `cookies()` call in `generateStaticParams` |
| ProductCard navigates to `/urun/[slug]` (Phase 11) | Replaced drawer with `router.push` + `<Link>` for SEO-crawlable product detail pages |
| Deleted ProductDrawer (Phase 11) | Product cards across all pages navigate to dedicated product detail page |
| Product detail page as server component (Phase 11) | Full SSR with breadcrumbs, specs, FAQ accordion, related products, mobile sticky CTA |
| Removed `generateStaticParams` from product page (Phase 11) | Scalability for 1000+ products; uses `dynamicParams = true` with ISR `revalidate = 3600` |
| Fixed Product JSON-LD: removed `price: "0"` (Phase 11) | Violates Google structured data guidelines; replaced with `itemCondition: RefurbishedCondition` + `seller` |
| BreadcrumbJsonLd + FAQPageJsonLd on product pages (Phase 11) | Rich results in Google SERPs; breadcrumb trail + template FAQ questions |
| Product meta includes twitter card + code in title (Phase 11) | `summary_large_image` card, OG image dimensions, product code in `<title>` |
| Sitemap uses `siteConfig.url` + `lastModified` on static pages (Phase 11) | Consistent URL source, better freshness signals |
| Robots.txt disallows `/api/` (Phase 11) | API routes should not be crawled by search engines |
| `safe-area-pb` CSS utility (Phase 11) | iPhone notch support for mobile sticky bar via `env(safe-area-inset-bottom)` |
| Product section components in `src/components/product/` (Phase 11) | Modular architecture: Hero, Detail, Specs, Description, Compatibility, FAQ, RelatedProducts, MobileStickyBar |
| Shared `chatCompletion()` helper with retry+fallback (Phase 12) | DRY: replaces ~200 lines of duplicated fetch boilerplate; handles retries on 429/5xx, AbortController timeout, `AIError` class |
| `finish_reason:"length"` truncation guard (Phase 12) | Rejects AI output if Gemini signals truncation; prevents half-sentences from reaching users |
| Output quality validation — missing codes/brand check (Phase 12) | Name route auto-prepends missing part codes; description route returns `qualityWarnings[]` array |
| System prompts in `src/lib/prompts/` (Phase 12) | Reusable, testable prompt files for name and description generation |
| `sanitizeAIOutput()` shared utility (Phase 12) | Strips markdown/HTML from AI output; used by both API routes |
| `max_completion_tokens` not `max_tokens` for Gemini thinking models (Phase 12) | `max_tokens` caps total budget including thinking; `max_completion_tokens` caps only visible output |
| Token budgets: 1024 for names, 4096 for descriptions (Phase 12) | Gemini thinking model uses ~200-900 thinking tokens; low budgets cause truncation |
| Temperature 0.4 for names, 0.75 for descriptions (Phase 12) | Slightly higher than initial for better name variety; slightly lower for descriptions to stay on-topic |
| Minimum output length validation: 10 chars (name), 100 chars (desc) (Phase 12) | Catches thinking-model token starvation producing ultra-short garbage |
| Client-side sequential loop for batch (Phase 12) | Avoids serverless function timeouts; supports pause/cancel; 500ms delay between requests |
| Nonce-based CSP with `strict-dynamic` (Phase 13) | Middleware generates per-request nonce; `'unsafe-inline'` + `https:` kept as fallback for older browsers (ignored when `strict-dynamic` active) |
| `Cross-Origin-Opener-Policy: same-origin` (Phase 13) | Isolates browsing context from cross-origin popups; prevents Spectre-type side-channel attacks |
| Trusted Types default policy (Phase 13) | `require-trusted-types-for 'script'` in CSP; permissive default policy in `<head>` handles React/library DOM sinks; infrastructure for future tightening |
| CSP moved from `next.config.ts` to middleware (Phase 13) | Dynamic per-request nonce requires middleware; static headers in next.config can't generate nonces |
| Root layout `async` with `headers()` (Phase 13) | Reads `x-nonce` from middleware; makes layout dynamic (fresh nonce per request); child pages still support ISR |
| Batch page admin-only via `adminOnly: true` (Phase 12) | Editors cannot run bulk AI operations; only visible for admin role |
| Uniqueness via last 20 descriptions context (Phase 12) | Appends recent description snippets to system prompt to prevent repetitive output |

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
npm run analyze  # Bundle analysis (opens browser report)
```

## Source Reference

Original Lovable/Vite source is permanently available via:
```bash
git show lovable-source-final:<path>
```
