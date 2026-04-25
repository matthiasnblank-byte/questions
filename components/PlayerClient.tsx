"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PlayerView } from "@/lib/types";
import { AnswerButton } from "./AnswerButton";
import { Card } from "./Card";
import { CountdownBar } from "./CountdownBar";
import { PlayerStatus } from "./PlayerStatus";
import { QuestionCard } from "./QuestionCard";
import { ResultChart } from "./ResultChart";
import { Scoreboard } from "./Scoreboard";

export function PlayerClient({ code }: { code: string }) {
  const [playerId, setPlayerId] = useState("");
  const [data, setData] = useState<PlayerView | null>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [error, setError] = useState("");
  const isRefreshing = useRef(false);

  async function refresh(currentPlayerId = playerId) {
    if (isRefreshing.current) {
      return;
    }

    isRefreshing.current = true;
    try {
      const response = await fetch(`/api/sessions/${code}/player?playerId=${encodeURIComponent(currentPlayerId)}`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Spielstand konnte nicht geladen werden.");
        return;
      }
      setError("");
      setData(payload);
    } finally {
      isRefreshing.current = false;
    }
  }

  async function answer(optionId: string) {
    if (!playerId || data?.hasAnswered) {
      return;
    }

    setSelectedOption(optionId);
    const response = await fetch(`/api/sessions/${code}/answer`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ playerId, optionId })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload.error ?? "Antwort konnte nicht gespeichert werden.");
      setSelectedOption("");
      return;
    }
    await refresh();
  }

  useEffect(() => {
    const stored = window.localStorage.getItem(`quiz-player-${code}`) ?? "";
    setPlayerId(stored);
    refresh(stored);
    const timer = window.setInterval(() => refresh(stored), 1000);
    return () => window.clearInterval(timer);
  }, [code]);

  useEffect(() => {
    setSelectedOption("");
  }, [data?.question?.id]);

  if (!playerId) {
    return (
      <Card className="mx-auto max-w-xl text-center">
        <h1 className="font-serif text-3xl font-bold">Beitritt erforderlich</h1>
        <p className="mt-3 text-slate-600">Für diesen Browser ist kein Teilnehmer gespeichert.</p>
        <Link className="mt-6 inline-flex rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white" href={`/join/${code}`}>Jetzt beitreten</Link>
      </Card>
    );
  }

  if (!data) {
    return <Card><p>Spiel wird geladen...</p></Card>;
  }

  const isWithinCountdown = !data.questionEndsAt || Date.now() <= data.questionEndsAt;
  const canAnswer = data.status === "question_active" && !data.hasAnswered && isWithinCountdown;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <Card className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{data.gameTitle}</p>
            <h1 className="text-xl font-bold">{data.player?.nickname}</h1>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold">{data.player?.score ?? 0} Punkte</span>
        </div>
        {data.status === "lobby" ? <PlayerStatus message={`Lobby: ${data.playersCount} Teilnehmer angemeldet. Bitte auf den Start warten.`} /> : null}
        {data.status === "finished" ? <PlayerStatus message="Das Quiz ist beendet." /> : null}
        {data.question ? (
          <div className="space-y-5">
            <QuestionCard question={data.question} index={data.currentQuestionIndex} total={data.totalQuestions} />
            <CountdownBar startedAt={data.questionStartedAt} endsAt={data.questionEndsAt} />
            <div className="grid gap-3">
              {data.question.options.map((option) => (
                <AnswerButton
                  key={option.id}
                  option={option}
                  disabled={!canAnswer}
                  selected={selectedOption === option.id}
                  correct={data.question?.correctOptionId === option.id}
                  onClick={() => answer(option.id)}
                />
              ))}
            </div>
            {data.hasAnswered ? <PlayerStatus message="Antwort gespeichert. Bitte auf die Auswertung warten." /> : null}
            {data.status === "question_closed" ? <PlayerStatus message="Die Frage ist geschlossen." /> : null}
          </div>
        ) : null}
      </Card>
      {(data.status === "showing_results" || data.status === "finished") && data.question && data.answerCounts ? (
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold">Auswertung</h2>
          <ResultChart options={data.question.options} counts={data.answerCounts} correctOptionId={data.question.correctOptionId ?? ""} />
        </Card>
      ) : null}
      {data.scoreboard ? (
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold">Rangliste</h2>
          <Scoreboard players={data.scoreboard} />
        </Card>
      ) : null}
    </div>
  );
}
