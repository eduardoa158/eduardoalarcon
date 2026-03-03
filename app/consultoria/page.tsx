import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui/card";
import { CTAButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Consultoría financiera Ecuador y LatAm",
  description:
    "Consultoría financiera y empresarial: flujos de efectivo, TIR/VAN, planificación financiera y optimización operativa.",
};

export default function ConsultoriaPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-4xl font-bold">Consultoría financiera y empresarial</h1>
        <p className="mt-3 text-slate-300">Rigor analítico para decisiones de alto impacto.</p>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-10 md:grid-cols-2">
        {[
          "Flujos de efectivo",
          "Proyectos de inversión (TIR/VAN)",
          "Planificación financiera",
          "Optimización operativa",
        ].map((s) => (
          <Card key={s}>{s}</Card>
        ))}
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <Card>
          <h2 className="text-2xl font-bold">Metodología</h2>
          <p className="mt-3">Diagnóstico → Análisis → Plan de acción → Implementación.</p>
          <div className="mt-4">
            <CTAButton href="/contacto">Agendar Demo Estratégica</CTAButton>
          </div>
        </Card>
      </section>
    </SiteShell>
  );
}
