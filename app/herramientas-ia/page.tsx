import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui/card";
import { CTAButton } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";
import { whopLinks } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Combos de herramientas IA",
  description:
    "Acceda a herramientas IA con acceso gestionado y seguro: combos premium para productividad, SEO, marketing y más.",
};

export default function HerramientasIaPage() {
  return (
    <SiteShell>
      <Section>
        <SectionHeader title="Combos de Herramientas IA" subtitle="Acceda a las mejores herramientas de IA por una fracción de su costo." />
        <Card>
          <h2 className="text-xl font-semibold">¿Cómo funciona?</h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-slate-300">
            <li>Seleccione su combo y complete la compra en Whop.</li>
            <li>Reciba acceso automatizado con validación y soporte.</li>
            <li>Utilice sus herramientas dentro de un esquema de acceso gestionado y seguro.</li>
          </ol>
        </Card>
      </Section>
      <Section className="bg-white/[0.02]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {whopLinks.map((combo) => (
            <Card key={combo.name}>
              <h3 className="text-lg font-bold">{combo.name}</h3>
              <p className="mt-2 text-blue-300">{combo.price}</p>
              <div className="mt-4">
                <CTAButton href={combo.href}>Comprar en Whop</CTAButton>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </SiteShell>
  );
}
