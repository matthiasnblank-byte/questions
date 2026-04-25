export function calculateScore(remainingTimeMs: number, totalTimeMs: number, isCorrect: boolean): number {
  if (!isCorrect) {
    return 0;
  }

  if (totalTimeMs <= 0) {
    return 500;
  }

  const remainingRatio = Math.max(0, Math.min(1, remainingTimeMs / totalTimeMs));
  return Math.round(1000 * (0.5 + 0.5 * remainingRatio));
}
