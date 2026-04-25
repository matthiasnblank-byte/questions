import { NextResponse } from "next/server";
import { playerIdFromRequest, jsonError } from "@/lib/api";
import { toPlayerView } from "@/lib/session-sanitize";
import { AppError, getSessionForRead } from "@/lib/session-service";

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const session = await getSessionForRead(code);
    if (!session) {
      throw new AppError("Session nicht gefunden.", 404);
    }

    return NextResponse.json(toPlayerView(session, playerIdFromRequest(request)));
  } catch (error) {
    return jsonError(error);
  }
}
