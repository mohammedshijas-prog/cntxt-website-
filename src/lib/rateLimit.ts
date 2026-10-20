/*
 * A small per-IP limiter for public form endpoints. It lives in memory, so on
 * serverless it only slows a burst from one client on one instance; the honeypot
 * and validation do the rest. Good enough to stop casual flooding.
 */
const hits = new Map<string, number[]>();

export function limited(request: Request, max = 5, windowMs = 10 * 60 * 1000) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}
