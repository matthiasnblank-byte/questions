import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-slateLine bg-panel p-6 shadow-card ${className}`}>{children}</section>;
}
