import { PlayerClient } from "@/components/PlayerClient";

export default async function PlayPage({ params }: { params: Promise<{ sessionCode: string }> }) {
  const { sessionCode } = await params;

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-10">
      <PlayerClient code={sessionCode} />
    </main>
  );
}
