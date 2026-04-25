import { getGame } from "./games";
import type { HostView, Player, PlayerView, Session } from "./types";

export function sortedScoreboard(players: Player[]): Player[] {
  return [...players].sort((a, b) => b.score - a.score || a.joinedAt - b.joinedAt);
}

export function answerCountsForCurrentQuestion(session: Session): Record<string, number> {
  const game = getGame(session.gameId);
  const question = game?.questions[session.currentQuestionIndex];

  if (!question) {
    return {};
  }

  return question.options.reduce<Record<string, number>>((counts, option) => {
    counts[option.id] = session.answers.filter((answer) => answer.questionId === question.id && answer.optionId === option.id).length;
    return counts;
  }, {});
}

export function toPlayerView(session: Session, playerId?: string | null): PlayerView {
  const game = getGame(session.gameId);
  const rawQuestion = game?.questions[session.currentQuestionIndex] ?? null;
  const question = session.status === "lobby" ? null : rawQuestion;
  const player = session.players.find((candidate) => candidate.id === playerId) ?? null;
  const showCorrect = session.status === "showing_results" || session.status === "finished";
  const hasAnswered = Boolean(player && question && session.answers.some((answer) => answer.playerId === player.id && answer.questionId === question.id));

  return {
    code: session.code,
    gameTitle: game?.title ?? "Unbekanntes Spiel",
    status: session.status,
    currentQuestionIndex: session.currentQuestionIndex,
    totalQuestions: game?.questions.length ?? 0,
    questionStartedAt: session.questionStartedAt,
    questionEndsAt: session.questionEndsAt,
    version: session.version,
    player,
    playersCount: session.players.length,
    question: question
      ? {
          id: question.id,
          question: question.question,
          type: question.type,
          options: question.options,
          timeLimitSeconds: question.timeLimitSeconds,
          ...(showCorrect ? { correctOptionId: question.correctOptionId } : {})
        }
      : null,
    hasAnswered,
    ...(showCorrect ? { answerCounts: answerCountsForCurrentQuestion(session), scoreboard: sortedScoreboard(session.players) } : {})
  };
}

export function toHostView(session: Session): HostView & { answerCounts: Record<string, number>; scoreboard: Player[] } {
  const game = getGame(session.gameId);
  const { adminTokenHash: _adminTokenHash, ...safeSession } = session;

  return {
    session: safeSession,
    game: game ?? {
      id: session.gameId,
      title: "Unbekanntes Spiel",
      questions: []
    },
    answerCounts: answerCountsForCurrentQuestion(session),
    scoreboard: sortedScoreboard(session.players)
  };
}
