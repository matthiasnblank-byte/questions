import { NextResponse } from "next/server";
import { jsonError, tokenFromRequest } from "@/lib/api";
import { getSessionStore } from "@/lib/session-store";
import { AppError, assertAdmin } from "@/lib/session-service";

export async function DELETE(request: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const store = getSessionStore();
    const session = await store.getSession(code);
    if (!session) {
      throw new AppError("Session nicht gefunden.", 404);
    }

    assertAdmin(session, tokenFromRequest(request));
    await store.deleteSession(code);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}
