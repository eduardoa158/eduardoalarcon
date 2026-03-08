import { Header, Footer, WhatsAppFloating } from "@/components/ui/custom";
import { Hero, Products, HelpChooser, Benefits, Testimonials, BlogPreview, FinalCTA } from "@/sections";

export function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Products />
        <HelpChooser />
        <Benefits />
        <Testimonials />
        <BlogPreview />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
