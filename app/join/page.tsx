import Link from "next/link";
import { JoinForm } from "@/components/JoinForm";

export default function JoinPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto mb-8 max-w-xl">
        <Link className="text-sm font-semibold text-accent" href="/">Zurück</Link>
        <h1 className="mt-8 font-serif text-5xl font-bold">Beitreten</h1>
        <p className="mt-4 text-slate-700">Spielcode, Alias-/Avatar-Name und optional das Teilnehmerpasswort eingeben.</p>
      </div>
      <JoinForm />
    </main>
  );
}
