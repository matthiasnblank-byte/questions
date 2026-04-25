"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { HostView, Player } from "@/lib/types";
import { Card } from "./Card";
import { CountdownBar } from "./CountdownBar";
import { GameCodeDisplay } from "./GameCodeDisplay";
import { HostControls } from "./HostControls";
import { LobbyList } from "./LobbyList";
import { QuestionCard } from "./QuestionCard";
import { ResultChart } from "./ResultChart";
import { Scoreboard } from "./Scoreboard";

interface HostPayload extends HostView {
  answerCounts: Record<string, number>;
  scoreboard: Player[];
}

export function HostClient({ code, token }: { code: string; token: string }) {
  const router = useRouter();
  const [data, setData] = useState<HostPayload | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isRefreshing = useRef(false);

  const joinLink = useMemo(() => (typeof window === "undefined" ? "" : `${window.location.origin}/join/${code}`), [code]);

  async function refresh() {
    if (isRefreshing.current) {
      return;
    }

    isRefreshing.current = true;
    try {
      const response = await fetch(`/api/sessions/${code}/host?token=${encodeURIComponent(token)}`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Host-Daten konnten nicht geladen werden.");
        return;
      }
      setError("");
      setData(payload);
    } finally {
      isRefreshing.current = false;
    }
  }

  async function action(path: string, method = "POST") {
    setBusy(true);
    const response = await fetch(`/api/sessions/${code}${path}`, {
      method,
      headers: { "x-admin-token": token }
    });
    const payload = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) {
      setError(payload.error ?? "Aktion fehlgeschlagen.");
      return;
    }
    if (method === "DELETE") {
      router.push("/");
      return;
    }
    await refresh();
  }

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (error && !data) {
    return <Card><p className="font-semibold text-red-700">{error}</p></Card>;
  }

  if (!data) {
    return <Card><p>Daten werden geladen...</p></Card>;
  }

  const { session, game, answerCounts, scoreboard } = data;
  const question = game.questions[session.currentQuestionIndex];
  const isLastQuestion = session.currentQuestionIndex >= game.questions.length - 1;

  return (
    <div className="space-y-6">
      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{game.title}</p>
              <h1 className="font-serif text-4xl font-bold">Host-Ansicht</h1>
            </div>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold">{session.status}</span>
          </div>
          {session.status === "lobby" ? (
            <>
              <GameCodeDisplay code={code} />
              <p className="break-all rounded-xl bg-slate-50 px-4 py-3 text-sm">Teilnehmer-Link: {joinLink}</p>
            </>
          ) : null}
          {question && session.status !== "lobby" ? (
            <div className="space-y-6">
              <QuestionCard question={question} index={session.currentQuestionIndex} total={game.questions.length} />
              <CountdownBar startedAt={session.questionStartedAt} endsAt={session.questionEndsAt} />
              <div className="grid gap-3 sm:grid-cols-2">
                {question.options.map((option) => (
                  <div key={option.id} className="rounded-2xl border border-slateLine bg-slate-50 p-4 text-lg font-semibold">
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {(session.status === "showing_results" || session.status === "question_closed" || session.status === "finished") && question ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Antwortverteilung</h2>
              <ResultChart options={question.options} counts={answerCounts} correctOptionId={question.correctOptionId} />
            </div>
          ) : null}
        </Card>
        <Card className="space-y-5">
          <HostControls
            status={session.status}
            isLastQuestion={isLastQuestion}
            busy={busy}
            onStart={() => action("/start")}
            onCloseQuestion={() => action("/close-question")}
            onShowResults={() => action("/show-results")}
            onNextQuestion={() => action("/next-question")}
            onFinish={() => action("/finish")}
            onDelete={() => action("", "DELETE")}
          />
          <div>
            <h2 className="mb-3 text-xl font-semibold">Lobby</h2>
            <LobbyList players={session.players} />
          </div>
          <div>
            <h2 className="mb-3 text-xl font-semibold">Rangliste</h2>
            <Scoreboard players={scoreboard} />
          </div>
        </Card>
      </div>
    </div>
  );
}
