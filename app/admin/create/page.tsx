import Link from "next/link";
import { CreateSessionForm } from "@/components/CreateSessionForm";
import { games } from "@/lib/games";

export default function CreatePage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <Link className="text-sm font-semibold text-accent" href="/">Zurück</Link>
      <header className="mb-8 mt-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Administration</p>
        <h1 className="mt-3 font-serif text-5xl font-bold">Session erstellen</h1>
        <p className="mt-4 max-w-2xl text-slate-700">
          Das Admin-Erstellungspasswort wird gegen <code>ADMIN_CREATE_PASSWORD</code> geprüft. Lokal ist <code>change-me</code> bewusst offen.
        </p>
      </header>
      <CreateSessionForm games={games} />
    </main>
  );
}
