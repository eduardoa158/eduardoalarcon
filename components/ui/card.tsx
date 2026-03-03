import { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/30">
      {children}
    </article>
  );
}
