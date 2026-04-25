import Link from "next/link";
import { JoinForm } from "@/components/JoinForm";

export default async function JoinCodePage({ params }: { params: Promise<{ sessionCode: string }> }) {
  const { sessionCode } = await params;

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto mb-8 max-w-xl">
        <Link className="text-sm font-semibold text-accent" href="/">Zurück</Link>
        <h1 className="mt-8 font-serif text-5xl font-bold">Beitreten</h1>
        <p className="mt-4 text-slate-700">Der Spielcode ist bereits vorausgefüllt.</p>
      </div>
      <JoinForm initialCode={sessionCode} />
    </main>
  );
}
