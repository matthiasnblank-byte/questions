import type { PublicQuestion, Question } from "@/lib/types";

export function QuestionCard({ question, index, total }: { question: Question | PublicQuestion; index: number; total: number }) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Frage {index + 1} von {total}
      </p>
      <h1 className="font-serif text-3xl font-bold leading-tight text-ink sm:text-5xl">{question.question}</h1>
    </div>
  );
}
