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
  if (process.env.SESSION_STORE === "memory" || (!process.env.SESSION_STORE && process.env.NODE_ENV !== "production")) {
    return memorySessionStore;
  }

  return redisSessionStore;
}

export function getSessionTtlSeconds(): number {
  const parsed = Number(process.env.SESSION_TTL_SECONDS ?? "7200");
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 7200;
}
