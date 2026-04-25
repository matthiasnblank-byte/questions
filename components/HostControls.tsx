"use client";

import { Button } from "./Button";

export function HostControls({
  status,
  isLastQuestion,
  onStart,
  onCloseQuestion,
  onShowResults,
  onNextQuestion,
  onFinish,
  onDelete,
  busy
}: {
  status: string;
  isLastQuestion: boolean;
  onStart: () => void;
  onCloseQuestion: () => void;
  onShowResults: () => void;
  onNextQuestion: () => void;
  onFinish: () => void;
  onDelete: () => void;
  busy?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {status === "lobby" ? <Button onClick={onStart} disabled={busy}>Quiz starten</Button> : null}
      {status === "question_active" ? (
        <>
          <Button variant="secondary" onClick={onCloseQuestion} disabled={busy}>Frage schließen</Button>
          <Button onClick={onShowResults} disabled={busy}>Auswertung zeigen</Button>
        </>
      ) : null}
      {status === "question_closed" ? <Button onClick={onShowResults} disabled={busy}>Auswertung zeigen</Button> : null}
      {status === "showing_results" ? (
        <Button onClick={isLastQuestion ? onFinish : onNextQuestion} disabled={busy}>
          {isLastQuestion ? "Quiz beenden" : "Nächste Frage"}
        </Button>
      ) : null}
      {status !== "finished" ? <Button variant="secondary" onClick={onFinish} disabled={busy}>Finale Rangliste</Button> : null}
      <Button variant="danger" onClick={onDelete} disabled={busy}>Session löschen</Button>
    </div>
  );
}
