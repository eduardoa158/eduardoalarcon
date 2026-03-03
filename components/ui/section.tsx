import { ReactNode } from "react";
import { Container } from "@/components/ui/container";

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-base text-slate-300 md:text-lg">{subtitle}</p> : null}
    </div>
  );
}
