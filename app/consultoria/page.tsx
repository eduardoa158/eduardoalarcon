import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui/card";
import { CTAButton } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Consultoría financiera Ecuador y LatAm",
  description:
    "Consultoría financiera y empresarial: flujos de efectivo, TIR/VAN, planificación financiera y optimización operativa.",
};

export default function ConsultoriaPage() {
  return (
    <SiteShell>
      <Section>
        <SectionHeader title="Consultoría financiera y empresarial" subtitle="Rigor analítico para decisiones de alto impacto." />
        <div className="grid gap-4 md:grid-cols-2">
          {["Flujos de efectivo", "Proyectos de inversión (TIR/VAN)", "Planificación financiera", "Optimización operativa"].map(
            (s) => (
              <Card key={s}>{s}</Card>
            )
          )}
        </div>
      </Section>
      <Section className="bg-white/[0.02]">
        <Card>
          <h2 className="text-2xl font-bold">Metodología</h2>
          <p className="mt-3 text-slate-300">Diagnóstico → Análisis → Plan de acción → Implementación.</p>
          <div className="mt-5">
            <CTAButton href="/contacto">Agendar Demo Estratégica</CTAButton>
          </div>
        </Card>
      </Section>
    </SiteShell>
  );
}
