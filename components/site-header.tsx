"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 md:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          Digital Vision
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map(([label, href]) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  active ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <Link
          href={company.demoHref}
          className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-900/30"
        >
          Agendar Demo
        </Link>
      </div>
    </header>
  );
}
