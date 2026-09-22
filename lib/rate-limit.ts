type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;
let calls = 0;

export function getTrustedClientIp(request: { headers: Headers }) {
  if (process.env.VERCEL === "1") {
    const vercel = request.headers.get("x-vercel-forwarded-for");
    if (vercel) return vercel.split(",")[0].trim();
  }
  if (process.env.TRUST_CLOUDFLARE_PROXY === "true") {
    const cloudflare = request.headers.get("cf-connecting-ip");
    if (cloudflare) return cloudflare.trim();
  }
  if (process.env.TRUST_X_REAL_IP === "true") {
    return request.headers.get("x-real-ip")?.trim() || "unknown";
  }
  return "unknown";
}

export function rateLimit(key: string, limit = 5, windowMs = 15 * 60_000) {
  const now = Date.now();
  calls += 1;
  if (calls % 256 === 0 || buckets.size >= MAX_BUCKETS) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
    if (buckets.size >= MAX_BUCKETS && !buckets.has(key)) return false;
  }
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}
