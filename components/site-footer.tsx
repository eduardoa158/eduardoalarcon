import { company } from "@/lib/site-data";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-white/10 py-8">
      <Container className="flex flex-col gap-2 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Digital Vision.</p>
        <p>
          WhatsApp: {company.whatsapp} · Email: {company.email}
        </p>
      </Container>
    </footer>
  );
}
