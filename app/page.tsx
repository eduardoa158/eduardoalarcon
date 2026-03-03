import { AnimatedSection } from "@/components/section";
import { FAQJsonLd, OrganizationJsonLd, ServiceJsonLd } from "@/components/seo-jsonld";
import { SiteShell } from "@/components/site-shell";
import { CTAButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { company, testimonials } from "@/lib/site-data";
import { BadgeCheck, Bot, ChartNoAxesCombined, PhoneCall, ShieldCheck, Workflow } from "lucide-react";

export default function HomePage() {
  return (
    <SiteShell>
      <OrganizationJsonLd />
      <ServiceJsonLd />
      <FAQJsonLd />
      <div className="gradient-bg">
        <section className="mx-auto max-w-6xl px-4 py-20">
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Deje de ser el cuello de botella. Le instalamos un Sistema que Vende para usted.
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-300">
            Transformamos su caos operativo en una máquina de ventas predecible con nuestra solución integral
            “DigitalSuite”.
          </p>
          <ul className="mt-6 grid gap-2 text-sm text-slate-200 md:grid-cols-3">
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
        </section>
      </div>

      <AnimatedSection className="mx-auto grid max-w-6xl gap-5 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
        {["Motor de Automatización (Make)", "CRM y Chatbot Centralizado", "Agente de Voz con IA", "Procesos Internos Optimizados"].map((item) => (
          <Card key={item}>
            <p className="font-semibold">{item}</p>
          </Card>
        ))}
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-4 md:grid-cols-3">
          {["Ahorre 20+ horas a la semana", "Incremente la conversión un 40%", "Retorno de Inversión (ROI) Medible"].map((v) => (
            <Card key={v}>
              <p className="font-semibold">{v}</p>
            </Card>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-6xl px-4 py-8">
        <Card>
          <h2 className="text-2xl font-bold">Oferta destacada DigitalSuite</h2>
          <p className="mt-3">Implementación Completa: $997 pago único</p>
          <p>Mantenimiento y Herramientas: $250 mensuales (a partir del segundo mes)</p>
          <div className="mt-5 flex gap-3">
            <CTAButton href={company.whatsappHref}>WhatsApp</CTAButton>
            <CTAButton href={company.demoHref} variant="secondary">
              Agendar Demo Estratégica
            </CTAButton>
          </div>
        </Card>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-4 text-2xl font-bold">Testimonios</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.author}>
              <p className="italic">“{t.quote}”</p>
              <p className="mt-3 text-sm text-slate-400">{t.author}</p>
            </Card>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-4 text-2xl font-bold">¿Por qué confiar en Digital Vision?</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <BadgeCheck className="mb-2" />
            <p>Proceso en 3 pasos: diagnóstico, implementación y optimización.</p>
          </Card>
          <Card>
            <ShieldCheck className="mb-2" />
            <p>Soporte 24/7 y control de acceso para un entorno seguro.</p>
          </Card>
          <Card>
            <ChartNoAxesCombined className="mb-2" />
            <p>Indicadores de ROI medible con reportes periódicos.</p>
          </Card>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold">Preguntas frecuentes</h2>
        <div className="mt-4 space-y-4">
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
        <div className="mt-8 flex flex-wrap gap-3">
          <CTAButton href={company.demoHref}>Agendar Demo Estratégica</CTAButton>
          <CTAButton href={`mailto:${company.email}`} variant="secondary">
            Escribir por Email
          </CTAButton>
        </div>
      </AnimatedSection>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:grid-cols-3">
          <div><Workflow /> Integraciones</div>
          <div><Bot /> IA aplicada al negocio</div>
          <div><PhoneCall /> Conversión por voz y WhatsApp</div>
        </div>
      </section>
    </SiteShell>
  );
}
