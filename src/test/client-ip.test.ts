import { describe, expect, it } from "vitest";
import { buildRateLimitKey, getClientIpFromHeaders } from "@/lib/client-ip";

function makeHeaders(values: Record<string, string>): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(values)) {
    headers.set(key, value);
  }
  return headers;
}

describe("getClientIpFromHeaders", () => {
  it("reads first ip from x-forwarded-for", () => {
    const headers = makeHeaders({
      "x-forwarded-for": "203.0.113.10, 10.0.0.2",
    });
    expect(getClientIpFromHeaders(headers)).toBe("203.0.113.10");
  });

  it("strips port from ipv4 values", () => {
    const headers = makeHeaders({
      "x-real-ip": "203.0.113.10:49152",
    });
    expect(getClientIpFromHeaders(headers)).toBe("203.0.113.10");
  });

  it("parses forwarded header", () => {
    const headers = makeHeaders({
      forwarded: 'for="2001:db8:cafe::17";proto=https',
    });
    expect(getClientIpFromHeaders(headers)).toBe("2001:db8:cafe::17");
  });

  it("falls back to unknown", () => {
    const headers = makeHeaders({});
    expect(getClientIpFromHeaders(headers)).toBe("unknown");
  });
});

describe("buildRateLimitKey", () => {
  it("includes ip, user-agent, and suffix", () => {
    const headers = makeHeaders({
      "x-forwarded-for": "198.51.100.5",
      "user-agent": "test-agent",
    });
    expect(buildRateLimitKey(headers, "foo@example.com")).toBe(
      "198.51.100.5:test-agent:foo@example.com",
    );
  });
});
