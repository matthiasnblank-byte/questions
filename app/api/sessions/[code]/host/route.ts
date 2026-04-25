import { NextResponse } from "next/server";
import { tokenFromRequest, jsonError } from "@/lib/api";
import { toHostView } from "@/lib/session-sanitize";
import { AppError, assertAdmin, getSessionForRead } from "@/lib/session-service";

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const session = await getSessionForRead(code);
    if (!session) {
      throw new AppError("Session nicht gefunden.", 404);
    }

    assertAdmin(session, tokenFromRequest(request));
    return NextResponse.json(toHostView(session));
  } catch (error) {
    return jsonError(error);
  }
}
