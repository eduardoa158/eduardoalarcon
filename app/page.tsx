import { AnimatedSection } from "@/components/section";
import { FAQJsonLd, OrganizationJsonLd, ServiceJsonLd } from "@/components/seo-jsonld";
import { SiteShell } from "@/components/site-shell";
import { CTAButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/ui/section";
import { company, testimonials } from "@/lib/site-data";
import {
  BadgeCheck,
  Bot,
  ChartNoAxesCombined,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

const features = [
  { icon: Workflow, text: "Motor de Automatización (Make)" },
  { icon: MessageCircle, text: "CRM y Chatbot Centralizado" },
  { icon: PhoneCall, text: "Agente de Voz con IA" },
  { icon: Sparkles, text: "Procesos Internos Optimizados" },
];

export default function HomePage() {
  return (
    <SiteShell>
      <OrganizationJsonLd />
      <ServiceJsonLd />
      <FAQJsonLd />

      <Section className="pt-14 md:pt-20">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
              Deje de ser el cuello de botella. Le instalamos un Sistema que Vende para usted.
            </h1>
            <p className="mt-5 text-lg text-slate-300 md:text-xl">
              Transformamos su caos operativo en una máquina de ventas predecible con nuestra solución integral
              “DigitalSuite”.
            </p>
            <ul className="mt-6 grid gap-2 text-slate-200 md:grid-cols-1">
              <li>• Tiempo perdido en tareas manuales</li>
              <li>• Prospectos que se enfrían y se pierden</li>
              <li>• Procesos internos caóticos</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTAButton href={company.demoHref}>Agendar Demo Estratégica</CTAButton>
              <CTAButton href="/precios" variant="secondary">
                Ver Planes
              </CTAButton>
            </div>
          </div>

          <Card className="relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-blue-500/20 blur-2xl" />
            <p className="text-sm text-slate-400">DigitalSuite</p>
            <div className="mt-4 space-y-3">
              <div className="panel p-3 text-sm">Implementación Completa: $997 pago único</div>
              <div className="panel p-3 text-sm">Mantenimiento y Herramientas: $250 mensuales (a partir del segundo mes)</div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  "Ahorre 20+ horas a la semana",
                  "Incremente la conversión un 40%",
                  "Retorno de Inversión (ROI) Medible",
                ].map((stat) => (
                  <div key={stat} className="rounded-xl border border-white/10 bg-slate-900/50 p-3 text-xs text-slate-200">
                    {stat}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <Section className="py-8 md:py-10">
        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-2 lg:grid-cols-4">
          {["LOGO CLIENTE", "LOGO CLIENTE", "LOGO CLIENTE", "LOGO CLIENTE"].map((logo, idx) => (
            <div key={idx} className="rounded-lg border border-dashed border-slate-600 py-4 text-center text-xs tracking-[0.2em] text-slate-500">
              {logo}
            </div>
          ))}
        </div>
      </Section>

      <AnimatedSection>
        <Section className="bg-white/[0.02]">
          <SectionHeader title="Solución DigitalSuite" subtitle="Sistema integral para acelerar ventas y operación." />
          <div className="grid gap-5 md:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.text}>
                <feature.icon className="mb-4 h-6 w-6 text-blue-300" />
                <p className="text-lg font-semibold">{feature.text}</p>
              </Card>
            ))}
          </div>
        </Section>
      </AnimatedSection>

      <Section>
        <SectionHeader title="¿Por qué confiar en Digital Vision?" />
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <BadgeCheck className="mb-3 text-blue-300" />
            <p>Proceso en 3 pasos: diagnóstico, implementación y optimización.</p>
          </Card>
          <Card>
            <ShieldCheck className="mb-3 text-blue-300" />
            <p>Soporte 24/7 y control de acceso para un entorno seguro.</p>
          </Card>
          <Card>
            <ChartNoAxesCombined className="mb-3 text-blue-300" />
            <p>Indicadores de ROI medible con reportes periódicos.</p>
          </Card>
        </div>
      </Section>

      <Section className="bg-white/[0.02]">
        <SectionHeader title="Testimonios" />
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.author}>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-700" />
                <span className="text-xs text-slate-400">Cliente verificado</span>
              </div>
              <p className="italic">“{t.quote}”</p>
              <p className="mt-3 text-sm text-slate-400">{t.author}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader title="Preguntas frecuentes" />
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["¿El precio incluye soporte?", "Sí, todos los planes incluyen acompañamiento y mejoras continuas."],
            ["¿Cuánto tarda la implementación?", "Entre 7 y 21 días según complejidad e integraciones."],
            ["¿Pueden integrarse con mis sistemas actuales?", "Sí, trabajamos con Make, CRM y APIs para conectar su operación."],
            ["¿Qué garantía tengo?", "Definimos KPIs claros y una hoja de ruta para objetivos medibles."],
          ].map(([q, a]) => (
            <Card key={q}>
              <p className="font-semibold">{q}</p>
              <p className="mt-1 text-slate-300">{a}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="rounded-3xl border border-blue-400/30 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 p-8 text-center md:p-12">
          <h2 className="text-3xl font-bold md:text-4xl">Transforme su operación en un sistema comercial escalable</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            Agende una demo estratégica y definamos el plan para su empresa.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <CTAButton href={company.demoHref}>Agendar Demo Estratégica</CTAButton>
            <CTAButton href={`mailto:${company.email}`} variant="secondary">
              Escribir por Email
            </CTAButton>
          </div>
          <div className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-slate-900/50 p-5 text-left md:grid-cols-3">
            <div className="flex items-center gap-2 text-slate-200">
              <Workflow className="h-4 w-4 text-blue-300" /> Integraciones
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <Bot className="h-4 w-4 text-blue-300" /> IA aplicada al negocio
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <PhoneCall className="h-4 w-4 text-blue-300" /> Conversión por voz y WhatsApp
            </div>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
