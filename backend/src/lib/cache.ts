import { Redis } from "@upstash/redis"

let redis: Redis | null = null

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null
  if (!redis) {
    redis = new Redis({
      url:   process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return redis
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const r = getRedis()
    if (!r) return null
    const val = await r.get<T>(key)
    return val ?? null
  } catch { return null }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
  try {
    const r = getRedis()
    if (!r) return
    await r.set(key, value, { ex: ttlSeconds })
  } catch { /* silent */ }
}

export async function cacheDel(pattern: string): Promise<void> {
  try {
    const r = getRedis()
    if (!r) return
    // Delete by prefix pattern
    const keys = await r.keys(`${pattern}*`)
    if (keys.length > 0) await r.del(...keys)
  } catch { /* silent */ }
}

// Cache TTL constants (seconds)
export const TTL = {
  SEARCH:   300,  // 5 min — search results
  VET:      300,  // 5 min — vet profile
  VETS:     300,  // 5 min — vet list
  CLINICS:  600,  // 10 min — clinics for map
  CONTENT:  3600, // 1 hour — static content
}
