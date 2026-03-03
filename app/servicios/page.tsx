import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui/card";
import { CTAButton } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";
import { Bot, PhoneCall, Workflow } from "lucide-react";

export const metadata: Metadata = {
  title: "Servicios de automatización con IA y Make",
  description:
    "Servicios de Digital Vision: DigitalSuite, chatbot WhatsApp IA, agente de voz IA y automatizaciones Make para escalar ventas.",
};

export default function ServiciosPage() {
  return (
    <SiteShell>
      <Section>
        <SectionHeader title="Servicios" subtitle="Diseñamos soluciones escalables para ventas, operación y crecimiento." />
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <Workflow className="mb-3 text-blue-300" />
            <h2 className="text-xl font-semibold">DigitalSuite premium</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
              <li>Implementación de IA con Make</li>
              <li>Automatizaciones personalizadas</li>
              <li>Chatbot y CRM centralizado</li>
              <li>Agente IA para llamadas: 1000 min/mes</li>
            </ul>
          </Card>
          <Card>
            <Bot className="mb-3 text-blue-300" />
            <h2 className="text-xl font-semibold">Ofertas escalables</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
              <li>Tu Vendedor Incansable 24/7</li>
              <li>Elimina tu peor cuello de botella</li>
              <li>Tu propio equipo de telemarketing con IA</li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section className="bg-white/[0.02]">
        <SectionHeader title="Casos de uso Make" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            "Monitoreo de competencia",
            "Contabilidad en piloto automático",
            "Asistente de correo inteligente",
            "Agente de negocios virtual",
            "Onboarding de clientes 5 estrellas",
            "Máquina de contenido para redes",
          ].map((u) => (
            <Card key={u} className="flex items-start gap-2">
              <PhoneCall className="mt-1 h-4 w-4 text-blue-300" />
              <span>{u}</span>
            </Card>
          ))}
        </div>
        <div className="mt-8">
          <CTAButton href="/contacto">Agendar Demo Estratégica</CTAButton>
        </div>
      </Section>
    </SiteShell>
  );
}
