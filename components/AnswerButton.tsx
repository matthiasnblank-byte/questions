"use client";

import type { QuestionOption } from "@/lib/types";

export function AnswerButton({
  option,
  disabled,
  selected,
  correct,
  onClick
}: {
  option: QuestionOption;
  disabled?: boolean;
  selected?: boolean;
  correct?: boolean;
  onClick?: () => void;
}) {
  const state = correct ? "border-green-600 bg-green-50" : selected ? "border-accent bg-teal-50" : "border-slateLine bg-white hover:bg-slate-50";

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`focus-ring min-h-20 w-full rounded-2xl border px-5 py-4 text-left text-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-80 ${state}`}
    >
      {option.label}
    </button>
  );
}
