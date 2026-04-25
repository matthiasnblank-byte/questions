import type { Player } from "@/lib/types";

export function LobbyList({ players }: { players: Player[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slateLine">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Nickname</th>
            <th className="px-4 py-3 text-right">Punkte</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={player.id} className="border-t border-slateLine">
              <td className="px-4 py-3 text-slate-500">{index + 1}</td>
              <td className="px-4 py-3 font-medium">{player.nickname}</td>
              <td className="px-4 py-3 text-right tabular-nums">{player.score}</td>
            </tr>
          ))}
          {players.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-slate-500" colSpan={3}>
                Noch keine Teilnehmer in der Lobby.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
