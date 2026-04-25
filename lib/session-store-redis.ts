import { Redis } from "@upstash/redis";
import type { SessionStore } from "./session-store";
import type { Session } from "./types";

let redis: Redis | null = null;

function getRedis(): Redis {
  if (redis) {
    return redis;
  }

  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error("Redis Store benötigt KV_REST_API_URL und KV_REST_API_TOKEN.");
  }

  redis = new Redis({ url, token });
  return redis;
}

function key(code: string): string {
  return `quiz:session:${code}`;
}

function getSessionTtlSeconds(): number {
  const parsed = Number(process.env.SESSION_TTL_SECONDS ?? "7200");
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 7200;
}

function cloneSession(session: Session): Session {
  return structuredClone(session);
}

export const redisSessionStore: SessionStore = {
  async createSession(session) {
    await getRedis().set(key(session.code), session, { ex: getSessionTtlSeconds() });
  },

  async getSession(code) {
    return await getRedis().get<Session>(key(code));
  },

  async updateSession(code, updater) {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const current = await this.getSession(code);
      if (!current) {
        throw new Error("Session nicht gefunden oder abgelaufen.");
      }

      const next = updater(cloneSession(current));
      next.updatedAt = Date.now();
      next.version = current.version + 1;

      const script = `
        local key = KEYS[1]
        local expected = tonumber(ARGV[1])
        local ttl = tonumber(ARGV[2])
        local value = ARGV[3]
        local current = redis.call("GET", key)
        if not current then return 0 end
        local decoded = cjson.decode(current)
        if tonumber(decoded.version) ~= expected then return -1 end
        redis.call("SET", key, value, "EX", ttl)
        return 1
      `;
      const result = await getRedis().eval(script, [key(code)], [current.version, getSessionTtlSeconds(), JSON.stringify(next)]);

      if (result === 1) {
        return next;
      }
    }

    throw new Error("Session konnte wegen gleichzeitiger Änderungen nicht aktualisiert werden. Bitte erneut versuchen.");
  },

  async deleteSession(code) {
    await getRedis().del(key(code));
  }
};
