const stores = new Map<string, Map<string, { count: number; resetAt: number }>>();
const lastCleanup = new Map<string, number>();

const CLEANUP_INTERVAL_MS = 60_000;

function cleanupStore(name: string) {
  const now = Date.now();
  const last = lastCleanup.get(name) ?? 0;
  if (now - last < CLEANUP_INTERVAL_MS) return;

  lastCleanup.set(name, now);
  const store = stores.get(name);
  if (!store) return;

  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number;
}

export function rateLimit(
  name: string,
  key: string,
  { windowMs, maxRequests }: RateLimitOptions,
): RateLimitResult {
  if (!stores.has(name)) {
    stores.set(name, new Map());
  }
  const store = stores.get(name)!;

  cleanupStore(name);

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (entry.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetIn: entry.resetAt - now,
    };
  }

  entry.count++;
  return {
    success: true,
    remaining: maxRequests - entry.count,
    resetIn: entry.resetAt - now,
  };
}
