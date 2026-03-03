import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui/card";
import { CTAButton } from "@/components/ui/button";
import { company } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contacto | Agendar Demo Estratégica",
  description: "Agende su demo estratégica con Digital Vision por formulario, WhatsApp o email.",
};

export default function ContactoPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-4xl font-bold">Agendar Demo Estratégica</h1>
        <p className="mt-2 text-slate-300">Cuéntenos su reto y le proponemos un plan de implementación.</p>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-14 md:grid-cols-2">
        <Card>
          <form className="space-y-3" aria-label="Formulario de contacto">
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3" placeholder="Nombre" />
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3" placeholder="Email" type="email" />
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3" placeholder="WhatsApp" />
            <textarea className="h-28 w-full rounded-lg border border-slate-700 bg-slate-950 p-3" placeholder="¿Qué proceso desea automatizar primero?" />
            <CTAButton href="#">Enviar solicitud</CTAButton>
          </form>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Canales directos</h2>
          <p className="mt-3">WhatsApp: {company.whatsapp}</p>
          <p>Email: {company.email}</p>
          <div className="mt-4 flex gap-3">
            <CTAButton href={company.whatsappHref}>Escribir por WhatsApp</CTAButton>
            <CTAButton href={`mailto:${company.email}`} variant="secondary">
              Enviar Email
            </CTAButton>
          </div>
        </Card>
      </section>
    </SiteShell>
  );
}
