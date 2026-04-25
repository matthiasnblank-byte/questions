import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Questions Live Quiz",
  description: "Sachliche Live-Quiz-Anwendung für Lehrveranstaltungen"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body className="font-sans text-ink">{children}</body>
    </html>
  );
}
