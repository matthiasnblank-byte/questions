import { Card } from "./Card";

export function AdminLinksPanel({ adminLink, joinLink, code, joinPassword }: { adminLink: string; joinLink: string; code: string; joinPassword?: string }) {
  return (
    <Card className="space-y-4">
      <h2 className="text-xl font-semibold">Session erstellt</h2>
      <Info label="Spielcode" value={code} />
      <Info label="Admin-Link" value={adminLink} />
      <Info label="Teilnehmer-Link" value={joinLink} />
      {joinPassword ? <Info label="Teilnehmerpasswort" value={joinPassword} /> : null}
      <p className="text-sm text-slate-600">Den Admin-Link nicht an Teilnehmer weitergeben. Er enthält den geheimen Token.</p>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-all rounded-xl bg-slate-50 px-3 py-2 text-sm">{value}</p>
    </div>
  );
}
