import { NextResponse } from "next/server";
import { AppError } from "./session-service";

export function jsonError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  const message = error instanceof Error ? error.message : "Unbekannter Fehler.";
  return NextResponse.json({ error: message }, { status: 500 });
}

export function tokenFromRequest(request: Request): string {
  const url = new URL(request.url);
  return request.headers.get("x-admin-token") ?? url.searchParams.get("token") ?? "";
}

export function playerIdFromRequest(request: Request): string {
  const url = new URL(request.url);
  return request.headers.get("x-player-id") ?? url.searchParams.get("playerId") ?? "";
}
