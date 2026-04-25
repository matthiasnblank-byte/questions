import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api";
import { joinSession } from "@/lib/session-service";
import { normalizeJoinPassword } from "@/lib/validation";

export async function POST(request: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const body = await request.json();
    const player = await joinSession(code, String(body.nickname ?? ""), normalizeJoinPassword(body.joinPassword));
    return NextResponse.json({ player });
  } catch (error) {
    return jsonError(error);
  }
}
