import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  full?: boolean;
};

export function CTAButton({ href, children, variant = "primary", full = false }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-900/30 hover:scale-[1.02] hover:from-blue-400 hover:to-indigo-400"
      : "border border-white/15 bg-white/5 text-slate-100 hover:bg-white/10";

  return (
    <Link href={href} className={`${base} ${styles} ${full ? "w-full sm:w-auto" : ""}`}>
      {children}
    </Link>
  );
}
