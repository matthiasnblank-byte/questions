import { randomInt, randomUUID } from "crypto";
import { createToken, hashToken, verifyToken } from "./auth";
import { calculateScore } from "./scoring";
import { getGame } from "./games";
import { getSessionStore, getSessionTtlSeconds } from "./session-store";
import { normalizeCode, sanitizeNickname } from "./validation";
import type { Player, Session } from "./types";

export class AppError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

export function requireGame(gameId: string) {
  const game = getGame(gameId);
  if (!game) {
    throw new AppError("Spiel nicht gefunden.", 404);
  }
  return game;
}

export function assertAdmin(session: Session, token: string | null | undefined): void {
  if (!verifyToken(token, session.adminTokenHash)) {
    throw new AppError("Admin-Token ist ungültig.", 401);
  }
}

export async function createSession(gameId: string, joinPassword?: string) {
  requireGame(gameId);
  const store = getSessionStore();
  let code = "";

  for (let attempt = 0; attempt < 20; attempt += 1) {
    code = String(randomInt(100000, 999999));
    const existing = await store.getSession(code);
    if (!existing) {
      break;
    }
  }

  const token = createToken();
  const now = Date.now();
  const session: Session = {
    code,
    adminTokenHash: hashToken(token),
    ...(joinPassword ? { joinPassword } : {}),
    gameId,
    status: "lobby",
    currentQuestionIndex: 0,
    questionStartedAt: null,
    questionEndsAt: null,
    players: [],
    answers: [],
    createdAt: now,
    updatedAt: now,
    expiresAt: now + getSessionTtlSeconds() * 1000,
    version: 1
  };

  await store.createSession(session);

  return { session, token };
}

export async function joinSession(code: string, nicknameInput: string, joinPassword?: string): Promise<Player> {
  const normalizedCode = normalizeCode(code);
  const nickname = sanitizeNickname(nicknameInput);

  if (!nickname) {
    throw new AppError("Bitte einen Nickname eingeben.");
  }

  const store = getSessionStore();
  const updated = await store.updateSession(normalizedCode, (session) => {
    if (session.status !== "lobby") {
      throw new AppError("Beitritt ist nur in der Lobby möglich.");
    }

    if (session.joinPassword && session.joinPassword !== joinPassword) {
      throw new AppError("Teilnehmerpasswort ist ungültig.", 401);
    }

    if (session.players.some((player) => player.nickname.toLowerCase() === nickname.toLowerCase())) {
      throw new AppError("Dieser Nickname ist bereits vergeben.");
    }

    if (session.players.length >= 60) {
      throw new AppError("Diese Session ist voll.");
    }

    session.players.push({
      id: randomUUID(),
      nickname,
      score: 0,
      joinedAt: Date.now()
    });
    return session;
  });

  const player = updated.players.find((candidate) => candidate.nickname === nickname);
  if (!player) {
    throw new AppError("Teilnehmer konnte nicht erstellt werden.");
  }

  return player;
}

export async function startQuiz(code: string, token: string) {
  const store = getSessionStore();
  return store.updateSession(code, (session) => {
    assertAdmin(session, token);
    if (session.status !== "lobby") {
      throw new AppError("Quiz kann nur aus der Lobby gestartet werden.");
    }

    const game = requireGame(session.gameId);
    const question = game.questions[0];
    const now = Date.now();
    session.status = "question_active";
    session.currentQuestionIndex = 0;
    session.questionStartedAt = now;
    session.questionEndsAt = now + question.timeLimitSeconds * 1000;
    return session;
  });
}

export async function submitAnswer(code: string, playerId: string, optionId: string) {
  const store = getSessionStore();
  return store.updateSession(code, (session) => {
    const game = requireGame(session.gameId);
    const question = game.questions[session.currentQuestionIndex];
    const player = session.players.find((candidate) => candidate.id === playerId);
    const now = Date.now();

    if (!player) {
      throw new AppError("Teilnehmer nicht gefunden.", 404);
    }

    if (session.status !== "question_active" || !question || !session.questionStartedAt || !session.questionEndsAt) {
      throw new AppError("Aktuell ist keine Frage aktiv.");
    }

    if (now > session.questionEndsAt) {
      throw new AppError("Die Antwortzeit ist abgelaufen.");
    }

    if (!question.options.some((option) => option.id === optionId)) {
      throw new AppError("Antwortoption ist ungültig.");
    }

    if (session.answers.some((answer) => answer.playerId === playerId && answer.questionId === question.id)) {
      throw new AppError("Für diese Frage wurde bereits eine Antwort gespeichert.");
    }

    const responseTimeMs = now - session.questionStartedAt;
    const isCorrect = optionId === question.correctOptionId;
    const scoreAwarded = calculateScore(session.questionEndsAt - now, question.timeLimitSeconds * 1000, isCorrect);

    session.answers.push({
      playerId,
      questionId: question.id,
      optionId,
      answeredAt: now,
      responseTimeMs,
      isCorrect,
      scoreAwarded
    });

    player.score += scoreAwarded;
    return session;
  });
}

export async function closeQuestion(code: string, token: string) {
  const store = getSessionStore();
  return store.updateSession(code, (session) => {
    assertAdmin(session, token);
    if (session.status !== "question_active") {
      throw new AppError("Es ist keine aktive Frage vorhanden.");
    }

    session.status = "question_closed";
    session.questionEndsAt = Math.min(session.questionEndsAt ?? Date.now(), Date.now());
    return session;
  });
}

export async function showResults(code: string, token: string) {
  const store = getSessionStore();
  return store.updateSession(code, (session) => {
    assertAdmin(session, token);
    if (session.status !== "question_active" && session.status !== "question_closed") {
      throw new AppError("Auswertung kann aktuell nicht angezeigt werden.");
    }

    session.status = "showing_results";
    return session;
  });
}

export async function nextQuestion(code: string, token: string) {
  const store = getSessionStore();
  return store.updateSession(code, (session) => {
    assertAdmin(session, token);
    if (session.status !== "showing_results" && session.status !== "question_closed") {
      throw new AppError("Nächste Frage ist erst nach der Auswertung möglich.");
    }

    const game = requireGame(session.gameId);
    const nextIndex = session.currentQuestionIndex + 1;

    if (nextIndex >= game.questions.length) {
      session.status = "finished";
      session.questionStartedAt = null;
      session.questionEndsAt = null;
      return session;
    }

    const question = game.questions[nextIndex];
    const now = Date.now();
    session.status = "question_active";
    session.currentQuestionIndex = nextIndex;
    session.questionStartedAt = now;
    session.questionEndsAt = now + question.timeLimitSeconds * 1000;
    return session;
  });
}

export async function finishSession(code: string, token: string) {
  const store = getSessionStore();
  return store.updateSession(code, (session) => {
    assertAdmin(session, token);
    session.status = "finished";
    session.questionStartedAt = null;
    session.questionEndsAt = null;
    return session;
  });
}
