import Link from "next/link";
import { HostClient } from "@/components/HostClient";

export default async function HostPage({
  params,
  searchParams
}: {
  params: Promise<{ sessionCode: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { sessionCode } = await params;
  const { token = "" } = await searchParams;

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <Link className="mb-6 inline-flex text-sm font-semibold text-accent" href="/">Startseite</Link>
        <HostClient code={sessionCode} token={token} />
      </div>
    </main>
  );
}
