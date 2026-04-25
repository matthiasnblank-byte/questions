import type { SessionStore } from "./session-store";
import type { Session } from "./types";

const globalForSessions = globalThis as typeof globalThis & {
  __quizSessions?: Map<string, Session>;
};

const sessions = globalForSessions.__quizSessions ?? new Map<string, Session>();
globalForSessions.__quizSessions = sessions;

function cloneSession(session: Session): Session {
  return structuredClone(session);
}

function isExpired(session: Session): boolean {
  return session.expiresAt <= Date.now();
}

export const memorySessionStore: SessionStore = {
  async createSession(session) {
    sessions.set(session.code, cloneSession(session));
  },

  async getSession(code) {
    const session = sessions.get(code);
    if (!session) {
      return null;
    }

    if (isExpired(session)) {
      sessions.delete(code);
      return null;
    }

    return cloneSession(session);
  },

  async updateSession(code, updater) {
    const current = sessions.get(code);
    if (!current) {
      throw new Error("Session nicht gefunden oder abgelaufen.");
    }

    if (isExpired(current)) {
      sessions.delete(code);
      throw new Error("Session nicht gefunden oder abgelaufen.");
    }

    const next = updater(cloneSession(current));
    next.updatedAt = Date.now();
    next.version = current.version + 1;
    sessions.set(code, cloneSession(next));
    return cloneSession(next);
  },

  async deleteSession(code) {
    sessions.delete(code);
  }
};
