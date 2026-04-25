import type { Player } from "@/lib/types";

export function Scoreboard({ players }: { players: Player[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slateLine">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">Rang</th>
            <th className="px-4 py-3">Teilnehmer</th>
            <th className="px-4 py-3 text-right">Punkte</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={player.id} className="border-t border-slateLine">
              <td className="px-4 py-3 font-semibold">{index + 1}</td>
              <td className="px-4 py-3">{player.nickname}</td>
              <td className="px-4 py-3 text-right font-semibold tabular-nums">{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
