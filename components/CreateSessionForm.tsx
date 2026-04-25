"use client";

import { useMemo, useState } from "react";
import type { Game } from "@/lib/types";
import { AdminLinksPanel } from "./AdminLinksPanel";
import { Button } from "./Button";
import { Card } from "./Card";
import { GameSelector } from "./GameSelector";

export function CreateSessionForm({ games }: { games: Game[] }) {
  const [adminPassword, setAdminPassword] = useState("");
  const [gameId, setGameId] = useState(games[0]?.id ?? "");
  const [joinPassword, setJoinPassword] = useState("");
  const [created, setCreated] = useState<{ code: string; adminToken: string; joinPassword?: string } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const links = useMemo(() => {
    if (!created || typeof window === "undefined") {
      return null;
    }

    const origin = window.location.origin;
    return {
      adminLink: `${origin}/host/${created.code}?token=${created.adminToken}`,
      joinLink: `${origin}/join/${created.code}`
    };
  }, [created]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    const response = await fetch("/api/sessions/create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ adminPassword, gameId, joinPassword })
    });
    const payload = await response.json();
    setBusy(false);

    if (!response.ok) {
      setError(payload.error ?? "Session konnte nicht erstellt werden.");
      return;
    }

    setCreated(payload);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <Card>
        <form className="space-y-5" onSubmit={submit}>
          <GameSelector games={games} value={gameId} onChange={setGameId} />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Admin-Erstellungspasswort</span>
            <input
              className="focus-ring w-full rounded-xl border border-slateLine px-4 py-3"
              type="password"
              value={adminPassword}
              onChange={(event) => setAdminPassword(event.target.value)}
              placeholder="ADMIN_CREATE_PASSWORD"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Teilnehmerpasswort optional</span>
            <input
              className="focus-ring w-full rounded-xl border border-slateLine px-4 py-3"
              value={joinPassword}
              onChange={(event) => setJoinPassword(event.target.value)}
              maxLength={40}
              placeholder="Leer lassen für offenen Beitritt"
            />
          </label>
          {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
          <Button type="submit" disabled={busy}>{busy ? "Erstelle..." : "Session erstellen"}</Button>
        </form>
      </Card>
      {created && links ? <AdminLinksPanel adminLink={links.adminLink} joinLink={links.joinLink} code={created.code} joinPassword={created.joinPassword} /> : null}
    </div>
  );
}
