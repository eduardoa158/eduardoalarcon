import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui/card";
import { CTAButton } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";

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
      <Section>
        <SectionHeader title="Planes y Precios" />
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const recommended = plan.name.includes("Recomendado");
            return (
              <Card
                key={plan.name}
                className={recommended ? "border-blue-400/40 bg-gradient-to-b from-blue-500/10 to-transparent" : ""}
              >
                {recommended ? (
                  <span className="mb-3 inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200">
                    Recomendado
                  </span>
                ) : null}
                <h2 className="text-xl font-bold">{plan.name}</h2>
                <p className="mt-2 text-blue-300">{plan.price}</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
                  {plan.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="mt-5">
                  <CTAButton href="/contacto" full>
                    Agendar Demo Estratégica
                  </CTAButton>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section className="bg-white/[0.02]">
        <SectionHeader title="Comparativa rápida" />

        <div className="hidden overflow-hidden rounded-2xl border border-white/10 md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="p-4">Plan</th>
                <th className="p-4">Implementación y mensualidad</th>
                <th className="p-4">Incluye</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.name} className="border-t border-white/10 align-top">
                  <td className="p-4 font-semibold">{plan.name}</td>
                  <td className="p-4 text-slate-300">{plan.price}</td>
                  <td className="p-4 text-slate-300">{plan.items.join(" · ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 md:hidden">
          {plans.map((plan) => (
            <details key={plan.name} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <summary className="cursor-pointer font-semibold">{plan.name}</summary>
              <p className="mt-2 text-blue-300">{plan.price}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </Section>

      <Section>
        <Card>
          <h2 className="text-2xl font-bold">Solución a medida</h2>
          <p className="mt-2 text-slate-300">Si su operación requiere flujos especiales, diseñamos un plan personalizado.</p>
          <div className="mt-5">
            <CTAButton href="/contacto">Cotizar</CTAButton>
          </div>
        </Card>
      </Section>
    </SiteShell>
  );
}
