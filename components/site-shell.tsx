import Link from "next/link";
import { ReactNode } from "react";
import { company } from "@/lib/site-data";

const links = [
  ["Inicio", "/"],
  ["Servicios", "/servicios"],
  ["Precios", "/precios"],
  ["Consultoría", "/consultoria"],
  ["Herramientas IA", "/herramientas-ia"],
  ["Nosotros", "/nosotros"],
  ["Contacto", "/contacto"],
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-bold text-white">
            Digital Vision
          </Link>
          <nav className="hidden gap-4 text-sm md:flex">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="text-slate-300 hover:text-white">
                {label}
              </Link>
            ))}
          </nav>
          <Link href={company.demoHref} className="rounded-lg bg-brand-500 px-3 py-2 text-xs font-semibold text-white">
            Agendar Demo
          </Link>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-slate-800 py-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 px-4 text-sm text-slate-400 md:flex-row">
          <p>© {new Date().getFullYear()} Digital Vision.</p>
          <p>WhatsApp: {company.whatsapp} · Email: {company.email}</p>
        </div>
      </footer>
    </div>
  );
}
