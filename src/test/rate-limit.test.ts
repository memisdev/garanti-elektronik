import { describe, it, expect, beforeEach, vi } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("allows requests within the limit", () => {
    const result = rateLimit("test-rl", "ip1", { windowMs: 60_000, maxRequests: 3 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("blocks after maxRequests is reached", () => {
    for (let i = 0; i < 3; i++) {
      rateLimit("test-block", "ip2", { windowMs: 60_000, maxRequests: 3 });
    }
    const result = rateLimit("test-block", "ip2", { windowMs: 60_000, maxRequests: 3 });
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resets after the window expires", () => {
    for (let i = 0; i < 3; i++) {
      rateLimit("test-reset", "ip3", { windowMs: 10_000, maxRequests: 3 });
    }
    expect(rateLimit("test-reset", "ip3", { windowMs: 10_000, maxRequests: 3 }).success).toBe(false);

    vi.advanceTimersByTime(11_000);

    const result = rateLimit("test-reset", "ip3", { windowMs: 10_000, maxRequests: 3 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("tracks different keys independently", () => {
    for (let i = 0; i < 3; i++) {
      rateLimit("test-keys", "ipA", { windowMs: 60_000, maxRequests: 3 });
    }
    expect(rateLimit("test-keys", "ipA", { windowMs: 60_000, maxRequests: 3 }).success).toBe(false);
    expect(rateLimit("test-keys", "ipB", { windowMs: 60_000, maxRequests: 3 }).success).toBe(true);
  });

  it("returns correct resetIn value", () => {
    vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
    const result = rateLimit("test-resetin", "ip4", { windowMs: 30_000, maxRequests: 5 });
    expect(result.resetIn).toBe(30_000);
  });
});
