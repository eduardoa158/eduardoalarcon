import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function CTAButton({ href, children, variant = "primary" }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";
  const styles =
    variant === "primary"
      ? "bg-brand-500 text-white hover:bg-brand-700"
      : "border border-slate-600 bg-slate-900 text-slate-100 hover:bg-slate-800";

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}
