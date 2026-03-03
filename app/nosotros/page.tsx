import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui/card";
import { CTAButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Nosotros | Excelencia académica e innovación tecnológica",
  description:
    "Conozca el génesis de Digital Vision: rigor analítico, ROI medible y automatización escalable para empresas en Ecuador y LatAm.",
};

export default function NosotrosPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-4xl font-bold">Nuestro Génesis: Excelencia Académica e Innovación Tecnológica</h1>
        <p className="mt-4 max-w-4xl text-slate-300">
          Fundada por estudiante de Ing. en Ciencias Económicas y Financieras (EPN, Ecuador), en colaboración con
          estudiantes de Ingeniería en Sistemas (EPN). Esta combinación une visión financiera, ingeniería aplicada y
          pensamiento estratégico para construir soluciones con ROI medible.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-8 md:grid-cols-2 lg:grid-cols-3">
        <Card><h2 className="font-bold">Misión</h2><p className="mt-2 text-slate-300">Escalar negocios con automatización e IA de forma rentable y sostenible.</p></Card>
        <Card><h2 className="font-bold">Visión</h2><p className="mt-2 text-slate-300">Ser referente LatAm en sistemas de ventas predecibles basados en datos.</p></Card>
        <Card><h2 className="font-bold">Valores</h2><p className="mt-2 text-slate-300">Rigor, transparencia, velocidad de ejecución y enfoque en resultados.</p></Card>
        <Card><h2 className="font-bold">Enfoque</h2><p className="mt-2 text-slate-300">ROI + automatización: cada flujo y herramienta se justifica por impacto económico.</p></Card>
        <Card><h2 className="font-bold">Qué nos hace diferentes</h2><p className="mt-2 text-slate-300">Modelo híbrido financiero-tecnológico para decisiones más inteligentes y escalables.</p></Card>
        <Card><h2 className="font-bold">Stack / partners</h2><p className="mt-2 text-slate-300">Make, CRM, chatbots, agentes de voz IA y analítica para control total del embudo.</p></Card>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <Card>
          <h2 className="text-2xl font-bold">¿Listo para el siguiente nivel?</h2>
          <p className="mt-2 text-slate-300">Convirtamos su operación en un sistema comercial escalable.</p>
          <div className="mt-4">
            <CTAButton href="/contacto">Agendar Demo Estratégica</CTAButton>
          </div>
        </Card>
      </section>
    </SiteShell>
  );
}
