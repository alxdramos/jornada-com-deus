/**
 * Rate limiting distribuído com Upstash Redis.
 * Fallback gracioso para in-memory quando UPSTASH_REDIS_REST_URL não está configurado.
 * Isso garante que o app funcione em desenvolvimento sem Redis.
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp (ms) de quando a janela reinicia
}

// ─── Fallback in-memory ───────────────────────────────────────────────────────

interface InMemoryEntry {
  count: number;
  resetAt: number;
}

const inMemoryStore = new Map<string, InMemoryEntry>();

function inMemoryRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();

  // Lazy cleanup
  if (inMemoryStore.size > 500) {
    for (const [key, entry] of inMemoryStore) {
      if (now > entry.resetAt) inMemoryStore.delete(key);
    }
  }

  const entry = inMemoryStore.get(identifier);
  const resetAt = entry && now <= entry.resetAt ? entry.resetAt : now + windowMs;
  const count = entry && now <= entry.resetAt ? entry.count + 1 : 1;

  inMemoryStore.set(identifier, { count, resetAt });

  return {
    success: count <= maxRequests,
    limit: maxRequests,
    remaining: Math.max(0, maxRequests - count),
    reset: resetAt,
  };
}

// ─── Upstash rate limiter factory ────────────────────────────────────────────

/**
 * Cria um rate limiter. Se UPSTASH_REDIS_REST_URL estiver configurado, usa Redis
 * distribuído (persiste entre deploys e instâncias). Caso contrário, usa in-memory
 * (funciona em desenvolvimento, mas reinicia a cada deploy).
 *
 * @param maxRequests - Número máximo de requisições por janela
 * @param windowSeconds - Tamanho da janela em segundos
 * @param prefix - Prefixo para as chaves no Redis
 */
export function createRateLimiter(
  maxRequests: number,
  windowSeconds: number,
  prefix: string
) {
  const isUpstashConfigured =
    !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!isUpstashConfigured) {
    console.warn(`[rate-limit] Upstash não configurado (${prefix}). Usando fallback in-memory.`);
  }

  const redis = isUpstashConfigured
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      })
    : null;

  const upstashLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds}s`),
        prefix,
        analytics: false,
      })
    : null;

  return {
    isDistributed: isUpstashConfigured,

    async check(identifier: string): Promise<RateLimitResult> {
      if (upstashLimiter) {
        try {
          const result = await upstashLimiter.limit(identifier);
          return {
            success: result.success,
            limit: result.limit,
            remaining: result.remaining,
            reset: result.reset,
          };
        } catch (err) {
          // Se o Redis falhar, fallback para in-memory para não bloquear
          console.error(`[rate-limit] Upstash erro (${prefix}), usando fallback:`, err);
        }
      }

      return inMemoryRateLimit(identifier, maxRequests, windowSeconds * 1000);
    },
  };
}

// ─── Rate limiters pré-configurados ──────────────────────────────────────────

/** Webhook Herospark: 30 req/min por IP (distribuído via Upstash) */
export const herosparkWebhookLimiter = createRateLimiter(30, 60, '@jornada/herospark');

/** API pública genérica: 100 req/min por IP */
export const apiLimiter = createRateLimiter(100, 60, '@jornada/api');

/** Admin: 20 req/min por IP */
export const adminLimiter = createRateLimiter(20, 60, '@jornada/admin');
