"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./Button";
import { Card } from "./Card";

export function JoinForm({ initialCode = "" }: { initialCode?: string }) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode);
  const [nickname, setNickname] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const normalizedCode = code.replace(/\D/g, "").slice(0, 6);

    const response = await fetch(`/api/sessions/${normalizedCode}/join`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nickname, joinPassword })
    });
    const payload = await response.json();
    setBusy(false);

    if (!response.ok) {
      setError(payload.error ?? "Beitritt fehlgeschlagen.");
      return;
    }

    window.localStorage.setItem(`quiz-player-${normalizedCode}`, payload.player.id);
    router.push(`/play/${normalizedCode}`);
  }

  return (
    <Card className="mx-auto max-w-xl">
      <form className="space-y-5" onSubmit={submit}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Spielcode</span>
          <input
            className="focus-ring w-full rounded-xl border border-slateLine px-4 py-3 text-lg tracking-[0.2em]"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            required
            minLength={6}
            maxLength={6}
            placeholder="123456"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Nickname</span>
          <input
            className="focus-ring w-full rounded-xl border border-slateLine px-4 py-3"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            maxLength={30}
            required
            placeholder="Max"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Teilnehmerpasswort optional</span>
          <input className="focus-ring w-full rounded-xl border border-slateLine px-4 py-3" value={joinPassword} onChange={(event) => setJoinPassword(event.target.value)} />
        </label>
        {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
        <Button className="w-full" type="submit" disabled={busy}>{busy ? "Trete bei..." : "Beitreten"}</Button>
      </form>
    </Card>
  );
}
