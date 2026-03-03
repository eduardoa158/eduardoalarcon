import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui/card";
import { CTAButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Precios de chatbot WhatsApp IA y CRM con IA",
  description: "Planes Esencial, Crecimiento e Integral DigitalSuite con implementación y soporte continuo.",
};

const plans = [
  {
    name: "Esencial",
    price: "$200 implementación + $75/mes desde el 2do mes",
    items: [
      "Bot IA solo WhatsApp",
      "Incluye Combo plus PREMIUM ($14.90/mes)",
      "Calendario de publicaciones 3 meses",
    ],
  },
  {
    name: "Crecimiento",
    price: "$350 implementación + $150/mes desde el 2do mes",
    items: [
      "Bot IA WhatsApp + RRSS + Web",
      "Asistente telefónico IA (300 min/mes; $0.21/min extra)",
      "CRM DigitalSuite, automatizaciones RRSS, 1 automatización extra, email marketing",
      "Regalos: combo SEO/marketing, optimización web con IA, automatización blog semanal",
    ],
  },
  {
    name: "Integral (DigitalSuite) — Recomendado",
    price: "$997 implementación + $250/mes desde el 2do mes",
    items: [
      "Todo lo de Crecimiento + 1000 min/mes agente telefónico IA (0.21/min extra)",
      "Automatizaciones internas ilimitadas",
      "Creación de página web personalizada (no incluye dominio/certificados)",
      "Atención prioritaria",
      "Gratis: Combo Ultra IA (+300 herramientas)",
    ],
  },
];

export default function PreciosPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-4xl font-bold">Planes y Precios</h1>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-10 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name}>
            <h2 className="text-xl font-bold">{plan.name}</h2>
            <p className="mt-2 text-brand-500">{plan.price}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
              {plan.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="mt-4">
              <CTAButton href="/contacto">Agendar Demo Estratégica</CTAButton>
            </div>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <Card>
          <h2 className="text-2xl font-bold">Solución a medida</h2>
          <p className="mt-2 text-slate-300">Si su operación requiere flujos especiales, diseñamos un plan personalizado.</p>
          <div className="mt-4">
            <CTAButton href="/contacto">Cotizar</CTAButton>
          </div>
        </Card>
      </section>
    </SiteShell>
  );
}
