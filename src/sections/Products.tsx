import { products } from "@/data/products";
import { ProductCard } from "@/components/ui/custom";
import { Sparkles, ArrowRight, Gift } from "lucide-react";

export function Products() {
  return (
    <section id="productos" className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container-site">
        {/* Header premium */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-bold mb-6">
            <Sparkles className="w-4 h-4" />
            Catálogo Premium
          </div>
          <h2 className="section-title mb-6">
            Nuestras <span className="text-gradient">Fórmulas</span>
          </h2>
          <p className="section-subtitle mx-auto">
            10 fórmulas especializadas diseñadas por expertos en nutrición. 
            Cada gomita contiene 5g de ingredientes premium para tu bienestar.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Promo Banner premium */}
        <div className="mt-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 via-rose-500 to-pink-500" />
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
          
          <div className="relative px-8 py-12 md:py-16 text-white text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Gift className="w-4 h-4" />
              Oferta Limitada
            </div>
            
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Promoción Especial
            </h3>
            
            <p className="text-xl md:text-2xl mb-2 text-white/90">
              Lleva <span className="font-bold text-3xl">3 frascos</span> por solo
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-5xl md:text-6xl font-bold">$49.99</span>
              <div className="text-left">
                <span className="block text-lg line-through text-white/60">$59.97</span>
                <span className="block text-lg font-semibold text-amber-200">¡Ahorras $10!</span>
              </div>
            </div>
            
            <a
              href="https://wa.me/593998482560?text=Hola%20Healthy%20Leben%20%F0%9F%8E%81%20Vengo%20desde%20la%20web%20y%20me%20interesa%20la%20promoción%20de%203%20frascos%20por%20%2449.99."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
            >
              Aprovechar Promoción
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
