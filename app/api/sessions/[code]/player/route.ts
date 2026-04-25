import { NextResponse } from "next/server";
import { playerIdFromRequest, jsonError } from "@/lib/api";
import { getSessionStore } from "@/lib/session-store";
import { toPlayerView } from "@/lib/session-sanitize";
import { AppError } from "@/lib/session-service";

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const session = await getSessionStore().getSession(code);
    if (!session) {
      throw new AppError("Session nicht gefunden.", 404);
    }

    return NextResponse.json(toPlayerView(session, playerIdFromRequest(request)));
  } catch (error) {
    return jsonError(error);
  }
}
