import type { Metadata } from "next";
import "./globals.css";
import { GradientBg } from "@/components/ui/gradient-bg";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://digitalvision.lat"),
  title: {
    default: "Digital Vision | Automatización de negocios con IA",
    template: "%s | Digital Vision",
  },
  description:
    "Implementamos DigitalSuite: automatización de negocios con IA, chatbot WhatsApp IA, agente de voz IA y CRM con IA para empresas en Ecuador y LatAm.",
  openGraph: {
    title: "Digital Vision",
    description: "Transforme su operación en una máquina de ventas predecible.",
    type: "website",
    url: "https://digitalvision.lat",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Vision",
    description: "Automatización con IA, Make y CRM para aumentar conversiones.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <GradientBg />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
