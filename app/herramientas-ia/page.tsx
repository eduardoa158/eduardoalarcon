import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui/card";
import { CTAButton } from "@/components/ui/button";
import { whopLinks } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Combos de herramientas IA",
  description:
    "Acceda a herramientas IA con acceso gestionado y seguro: combos premium para productividad, SEO, marketing y más.",
};

export default function HerramientasIaPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-4xl font-bold">Combos de Herramientas IA</h1>
        <p className="mt-3 text-slate-300">Acceda a las mejores herramientas de IA por una fracción de su costo.</p>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-6">
        <Card>
          <h2 className="text-xl font-semibold">¿Cómo funciona?</h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-slate-300">
            <li>Seleccione su combo y complete la compra en Whop.</li>
            <li>Reciba acceso automatizado con validación y soporte.</li>
            <li>Utilice sus herramientas dentro de un esquema de acceso gestionado y seguro.</li>
          </ol>
        </Card>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-12 md:grid-cols-2 lg:grid-cols-3">
        {whopLinks.map((combo) => (
          <Card key={combo.name}>
            <h3 className="text-lg font-bold">{combo.name}</h3>
            <p className="mt-2 text-brand-500">{combo.price}</p>
            <div className="mt-4">
              <CTAButton href={combo.href}>Comprar en Whop</CTAButton>
            </div>
          </Card>
        ))}
      </section>
    </SiteShell>
  );
}
