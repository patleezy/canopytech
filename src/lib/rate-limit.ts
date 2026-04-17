/**
 * In-process rate limiter. Works in dev and single-instance deployments.
 * On Vercel (serverless), each cold start gets a fresh Map — use Vercel KV
 * or Upstash Redis in Sprint 3 for global rate limiting.
 *
 * Defense-in-depth: even without global state, this limits abuse within
 * a single warm instance window and deters casual hammering.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

// Prune stale entries every 5 minutes to avoid memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of store.entries()) {
      if (now > bucket.resetAt) store.delete(key);
    }
  }, 5 * 60 * 1000);
}

/**
 * Returns true if the request is allowed, false if rate limited.
 * @param key      Identifier (IP address, session ID, etc.)
 * @param limit    Max requests per window
 * @param windowMs Window duration in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || now > existing.resetAt) {
    const bucket: Bucket = { count: 1, resetAt: now + windowMs };
    store.set(key, bucket);
    return { allowed: true, remaining: limit - 1, resetAt: bucket.resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count++;
  return {
    allowed: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}
