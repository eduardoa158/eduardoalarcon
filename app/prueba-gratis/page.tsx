import type { Metadata } from "next";
import { CTAButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Prueba gratis | Digital Vision",
  description: "Landing de prueba gratis para activar su demo estratégica.",
};

export default function PruebaGratisPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-20 md:px-8">
      <section className="panel rounded-3xl p-8 text-center md:p-14">
        <h1 className="text-4xl font-black md:text-6xl">[PLACEHOLDER] Prueba Gratis DigitalSuite</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300 md:text-xl">
          [PLACEHOLDER COPY EXACTO PENDIENTE] Describa aquí la propuesta de valor de la prueba gratis.
        </p>
        <ul className="mx-auto mt-6 max-w-xl text-left text-slate-300">
          <li>• [PLACEHOLDER] Beneficio #1</li>
          <li>• [PLACEHOLDER] Beneficio #2</li>
          <li>• [PLACEHOLDER] Condiciones o duración</li>
        </ul>
        <div className="mt-8 flex justify-center">
          <CTAButton href="/contacto">Agendar Demo Estratégica</CTAButton>
        </div>
      </section>
    </main>
  );
}
