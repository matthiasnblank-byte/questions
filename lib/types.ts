export type QuestionType = "single_choice" | "yes_no";

export type SessionStatus = "lobby" | "question_active" | "question_closed" | "showing_results" | "finished";

export interface QuestionOption {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options: QuestionOption[];
  correctOptionId: string;
  timeLimitSeconds: number;
}

export interface Game {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface Player {
  id: string;
  nickname: string;
  score: number;
  joinedAt: number;
}

export interface Answer {
  playerId: string;
  questionId: string;
  optionId: string;
  answeredAt: number;
  responseTimeMs: number;
  isCorrect: boolean;
  scoreAwarded: number;
}

export interface Session {
  code: string;
  adminTokenHash: string;
  joinPassword?: string;
  gameId: string;
  status: SessionStatus;
  currentQuestionIndex: number;
  questionStartedAt: number | null;
  questionEndsAt: number | null;
  players: Player[];
  answers: Answer[];
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
  version: number;
}

export interface PublicQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options: QuestionOption[];
  timeLimitSeconds: number;
  correctOptionId?: string;
}

export interface HostView {
  session: Omit<Session, "adminTokenHash">;
  game: Game;
}

export interface PlayerView {
  code: string;
  gameTitle: string;
  status: SessionStatus;
  currentQuestionIndex: number;
  totalQuestions: number;
  questionStartedAt: number | null;
  questionEndsAt: number | null;
  version: number;
  player: Player | null;
  playersCount: number;
  question: PublicQuestion | null;
  hasAnswered: boolean;
  answerCounts?: Record<string, number>;
  scoreboard?: Player[];
}
