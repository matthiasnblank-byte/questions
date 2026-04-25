"use client";

import type { Game } from "@/lib/types";

export function GameSelector({ games, value, onChange }: { games: Game[]; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">Spiel auswählen</span>
      <select className="focus-ring w-full rounded-xl border border-slateLine bg-white px-4 py-3" value={value} onChange={(event) => onChange(event.target.value)}>
        {games.map((game) => (
          <option key={game.id} value={game.id}>
            {game.title}
          </option>
        ))}
      </select>
    </label>
  );
}
