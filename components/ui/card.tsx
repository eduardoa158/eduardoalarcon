import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <article
      className={`rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_50px_rgba(2,8,23,0.45)] backdrop-blur-sm transition hover:-translate-y-1 hover:border-blue-400/40 ${className}`}
    >
      {children}
    </article>
  );
}
