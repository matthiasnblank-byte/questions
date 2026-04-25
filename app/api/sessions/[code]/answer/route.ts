import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api";
import { submitAnswer } from "@/lib/session-service";

export async function POST(request: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const body = await request.json();
    await submitAnswer(code, String(body.playerId ?? ""), String(body.optionId ?? ""));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}
