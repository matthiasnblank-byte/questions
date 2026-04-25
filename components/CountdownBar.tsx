"use client";

import { useEffect, useState } from "react";

export function CountdownBar({ startedAt, endsAt }: { startedAt: number | null; endsAt: number | null }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  if (!startedAt || !endsAt) {
    return null;
  }

  const total = Math.max(1, endsAt - startedAt);
  const remaining = Math.max(0, endsAt - now);
  const percent = Math.max(0, Math.min(100, (remaining / total) * 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
        <span>Countdown</span>
        <span className="tabular-nums">{Math.ceil(remaining / 1000)} s</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-accent transition-all duration-200" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
