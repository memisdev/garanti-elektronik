const ALLOWED_ORIGINS = new Set([
  "https://garantielektronik.net",
  "https://www.garantielektronik.net",
]);

function buildCorsHeaders(origin: string | null): Record<string, string> {
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "authorization, content-type",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Vary": "Origin",
      "Content-Type": "application/json",
    };
  }

  return {
    "Content-Type": "application/json",
  };
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const headers = buildCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    if (!origin || !ALLOWED_ORIGINS.has(origin)) {
      return new Response(JSON.stringify({ error: "Forbidden origin" }), {
        status: 403,
        headers,
      });
    }

    return new Response(null, { status: 204, headers });
  }

  return new Response(
    JSON.stringify({
      error: "This legacy endpoint is disabled. Use /api/admin/list-users.",
    }),
    {
      status: 410,
      headers,
    },
  );
});
