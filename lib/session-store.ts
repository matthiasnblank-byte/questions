import type { Session } from "./types";
import { memorySessionStore } from "./session-store-memory";
import { redisSessionStore } from "./session-store-redis";

export interface SessionStore {
  createSession(session: Session): Promise<void>;
  getSession(code: string): Promise<Session | null>;
  updateSession(code: string, updater: (session: Session) => Session): Promise<Session>;
  deleteSession(code: string): Promise<void>;
}

export function getSessionStore(): SessionStore {
  const wantsRedis = process.env.SESSION_STORE === "redis";
  const redisUrl = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "").trim();
  const redisToken = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "").trim();
  const hasRedisConfig = Boolean(redisUrl && redisToken);

  if (wantsRedis && hasRedisConfig) {
    return redisSessionStore;
  }

  return memorySessionStore;
}

export function getSessionTtlSeconds(): number {
  const parsed = Number(process.env.SESSION_TTL_SECONDS ?? "7200");
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 7200;
}
