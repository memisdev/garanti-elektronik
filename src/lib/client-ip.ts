type HeaderReader = Pick<Headers, "get">;

function normalizeIp(value: string | null): string | null {
  if (!value) return null;

  const first = value.split(",")[0]?.trim();
  if (!first) return null;

  const forwardedMatch = /for="?([^;,"]+)"?/i.exec(first);
  if (forwardedMatch?.[1]) {
    return forwardedMatch[1].replace(/^\[|\]$/g, "");
  }

  // Strip port from IPv4 values like "1.2.3.4:12345"
  if (/^\d{1,3}(\.\d{1,3}){3}:\d+$/.test(first)) {
    return first.slice(0, first.lastIndexOf(":"));
  }

  return first;
}

export function getClientIpFromHeaders(headers: HeaderReader): string {
  const candidates = [
    headers.get("x-vercel-forwarded-for"),
    headers.get("cf-connecting-ip"),
    headers.get("x-real-ip"),
    headers.get("x-forwarded-for"),
    headers.get("forwarded"),
  ];

  for (const candidate of candidates) {
    const ip = normalizeIp(candidate);
    if (ip) return ip;
  }

  return "unknown";
}

export function buildRateLimitKey(headers: HeaderReader, suffix?: string): string {
  const ip = getClientIpFromHeaders(headers);
  const ua = headers.get("user-agent")?.slice(0, 128) ?? "unknown-ua";
  return suffix ? `${ip}:${ua}:${suffix}` : `${ip}:${ua}`;
}
