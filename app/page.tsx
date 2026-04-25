import Link from "next/link";
import { Card } from "@/components/Card";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
      <header className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Live Quiz</p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-tight sm:text-7xl">Questions für Lehrveranstaltungen</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
          Sachlicher Kahoot-ähnlicher Monolith mit Next.js, Polling und temporären Sessiondaten.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="text-2xl font-semibold">Session erstellen</h2>
          <p className="text-slate-600">Für Hosts: Spiel auswählen, Session erzeugen und den Spielcode im Raum teilen.</p>
          <Link className="inline-flex rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accentDark" href="/admin/create">
            Zur Admin-Erstellung
          </Link>
        </Card>
        <Card className="space-y-4">
          <h2 className="text-2xl font-semibold">Als Teilnehmer beitreten</h2>
          <p className="text-slate-600">Mit Spielcode und Nickname beitreten. Es ist kein Login erforderlich.</p>
          <Link className="inline-flex rounded-xl border border-slateLine bg-white px-5 py-3 text-sm font-semibold hover:bg-slate-50" href="/join">
            Beitreten
          </Link>
        </Card>
      </div>
      <Card className="mt-6 grid gap-4 border-accent/20 bg-[#f8fbfb] md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold">Datenschutz-Hinweis</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Teilnehmer sollen keine Klarnamen, Matrikelnummern, E-Mail-Adressen oder andere personenbezogene Daten eingeben.
            Empfohlen sind neutrale Alias- oder Avatar-Namen wie <span className="font-semibold">Eule-17</span>, <span className="font-semibold">Tafelstern</span> oder <span className="font-semibold">Gruppe Blau</span>.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Betrieb</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Für Livebetrieb mit ca. 30 Teilnehmern Redis/Vercel KV verwenden. Die App nutzt bewusst einfaches Polling im Sekundenrhythmus und hält Sessiondaten nur temporär.
          </p>
        </div>
      </Card>
    </main>
  );
}
