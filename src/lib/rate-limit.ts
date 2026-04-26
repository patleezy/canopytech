/**
 * Rate limiter with optional Upstash Redis backend.
 * If UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set, uses Redis for
 * persistent limits across serverless instances. Falls back to in-process Map.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of store.entries()) {
      if (now > bucket.resetAt) store.delete(key);
    }
  }, 5 * 60 * 1000);
}

function inMemoryCheck(
  key: string,
  limit: number,
  windowMs: number
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
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

async function upstashCheck(
  key: string,
  limit: number,
  windowSecs: number,
  url: string,
  token: string
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const resetAt = now + windowSecs * 1000;

  try {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, windowSecs],
      ]),
    });

    if (!res.ok) return inMemoryCheck(key, limit, windowSecs * 1000);

    const data = (await res.json()) as [[null, number], [null, number]];
    const count = data[0][1];

    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      resetAt,
    };
  } catch {
    return inMemoryCheck(key, limit, windowSecs * 1000);
  }
}

export async function checkRateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    return upstashCheck(key, limit, Math.ceil(windowMs / 1000), redisUrl, redisToken);
  }

  return inMemoryCheck(key, limit, windowMs);
}
