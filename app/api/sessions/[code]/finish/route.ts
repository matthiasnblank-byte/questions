import { NextResponse } from "next/server";
import { jsonError, tokenFromRequest } from "@/lib/api";
import { finishSession } from "@/lib/session-service";

export async function POST(request: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const session = await finishSession(code, tokenFromRequest(request));
    return NextResponse.json({ session });
  } catch (error) {
    return jsonError(error);
  }
}
