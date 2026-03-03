import type { Metadata } from "next";
import { CTAButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Prueba gratis | Digital Vision",
  description: "Landing de prueba gratis para activar su demo estratégica.",
};

export default function PruebaGratisPage() {
  return (
    <main className="gradient-bg flex min-h-screen items-center justify-center px-4">
      <section className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950/70 p-8 text-center">
        <h1 className="text-4xl font-black">[PLACEHOLDER] Prueba Gratis DigitalSuite</h1>
        <p className="mt-4 text-slate-300">
          [PLACEHOLDER COPY EXACTO PENDIENTE] Describa aquí la propuesta de valor de la prueba gratis.
        </p>
        <ul className="mt-4 text-left text-slate-300">
          <li>• [PLACEHOLDER] Beneficio #1</li>
          <li>• [PLACEHOLDER] Beneficio #2</li>
          <li>• [PLACEHOLDER] Condiciones o duración</li>
        </ul>
        <div className="mt-8">
          <CTAButton href="/contacto">Agendar Demo Estratégica</CTAButton>
        </div>
      </section>
    </main>
  );
}
