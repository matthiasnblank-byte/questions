import { NextResponse } from "next/server";
import { assertCreatePassword } from "@/lib/auth";
import { jsonError } from "@/lib/api";
import { AppError, createSession } from "@/lib/session-service";
import { normalizeJoinPassword } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!assertCreatePassword(body.adminPassword)) {
      throw new AppError("Admin-Erstellungspasswort ist ungültig.", 401);
    }

    const { session, token } = await createSession(String(body.gameId ?? ""), normalizeJoinPassword(body.joinPassword));

    return NextResponse.json({
      code: session.code,
      adminToken: token,
      joinPassword: session.joinPassword,
      expiresAt: session.expiresAt
    });
  } catch (error) {
    return jsonError(error);
  }
}
