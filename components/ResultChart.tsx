import type { QuestionOption } from "@/lib/types";

export function ResultChart({ options, counts, correctOptionId }: { options: QuestionOption[]; counts: Record<string, number>; correctOptionId: string }) {
  const max = Math.max(1, ...options.map((option) => counts[option.id] ?? 0));

  return (
    <div className="space-y-3">
      {options.map((option) => {
        const count = counts[option.id] ?? 0;
        return (
          <div key={option.id}>
            <div className="mb-1 flex justify-between text-sm">
              <span className={option.id === correctOptionId ? "font-bold text-green-700" : "font-medium"}>{option.label}</span>
              <span className="tabular-nums">{count}</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-slate-100">
              <div className={option.id === correctOptionId ? "h-full bg-green-600" : "h-full bg-accent"} style={{ width: `${(count / max) * 100}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
