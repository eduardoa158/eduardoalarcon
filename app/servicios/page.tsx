import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui/card";
import { CTAButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Servicios de automatización con IA y Make",
  description:
    "Servicios de Digital Vision: DigitalSuite, chatbot WhatsApp IA, agente de voz IA y automatizaciones Make para escalar ventas.",
};

export default function ServiciosPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-4xl font-bold">Servicios</h1>
        <p className="mt-3 text-slate-300">Diseñamos soluciones escalables para ventas, operación y crecimiento.</p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-8 md:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold">DigitalSuite premium</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
            <li>Implementación de IA con Make</li>
            <li>Automatizaciones personalizadas</li>
            <li>Chatbot y CRM centralizado</li>
            <li>Agente IA para llamadas: 1000 min/mes</li>
          </ul>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Ofertas escalables</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
            <li>Tu Vendedor Incansable 24/7</li>
            <li>Elimina tu peor cuello de botella</li>
            <li>Tu propio equipo de telemarketing con IA</li>
          </ul>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <h2 className="mb-4 text-2xl font-bold">Casos de uso Make</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "Monitoreo de competencia",
            "Contabilidad en piloto automático",
            "Asistente de correo inteligente",
            "Agente de negocios virtual",
            "Onboarding de clientes 5 estrellas",
            "Máquina de contenido para redes",
          ].map((u) => (
            <Card key={u}>{u}</Card>
          ))}
        </div>
        <div className="mt-6">
          <CTAButton href="/contacto">Agendar Demo Estratégica</CTAButton>
        </div>
      </section>
    </SiteShell>
  );
}
