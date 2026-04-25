import { NextResponse } from "next/server";
import { tokenFromRequest, jsonError } from "@/lib/api";
import { getGame } from "@/lib/games";
import { getSessionStore } from "@/lib/session-store";
import { answerCountsForCurrentQuestion, sortedScoreboard } from "@/lib/session-sanitize";
import { AppError, assertAdmin } from "@/lib/session-service";

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const session = await getSessionStore().getSession(code);
    if (!session) {
      throw new AppError("Session nicht gefunden.", 404);
    }

    assertAdmin(session, tokenFromRequest(request));
    const game = getGame(session.gameId);

    if (!game) {
      throw new AppError("Spiel nicht gefunden.", 404);
    }

    return NextResponse.json({
      session,
      game,
      answerCounts: answerCountsForCurrentQuestion(session),
      scoreboard: sortedScoreboard(session.players)
    });
  } catch (error) {
    return jsonError(error);
  }
}
