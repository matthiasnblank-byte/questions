export function GameCodeDisplay({ code }: { code: string }) {
  return (
    <div className="rounded-3xl border border-slateLine bg-[#f8fbfb] p-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Spielcode</p>
      <p className="mt-3 font-serif text-6xl font-bold tracking-[0.18em] text-accent sm:text-8xl">{code}</p>
    </div>
  );
}
