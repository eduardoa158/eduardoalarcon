import { ArrowRight, Sparkles, ShieldCheck, Truck, Star, Zap } from "lucide-react";

export function Hero() {
  const scrollToProducts = () => {
    const element = document.querySelector("#productos");
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Background con gradiente premium */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 via-rose-50 to-pink-50" />
      
      {/* Elementos decorativos flotantes */}
      <div className="absolute top-32 right-20 w-72 h-72 bg-gradient-to-br from-orange-300/40 to-amber-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-green-300/30 to-emerald-300/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-pink-300/20 to-rose-300/20 rounded-full blur-3xl" />
      
      {/* Patrón de puntos sutil */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Content */}
      <div className="container-site relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Badge premium */}
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg border border-amber-100 mb-8">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-semibold text-gray-800">Fórmula Premium 2024</span>
            </div>

            {/* Title con tipografía premium */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6">
              Salud que{" "}
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                sabe bien
              </span>
            </h1>

            {/* Subtitle mejorado */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Descubre nuestras gomitas nutritivas diseñadas para transformar tu bienestar diario. 
              <span className="text-green-600 font-semibold"> 10 fórmulas especializadas</span> para cada objetivo.
            </p>

            {/* Badges de confianza */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-md border border-green-100">
                <Truck className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-gray-700">Envío Gratis</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-md border border-blue-100">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">Certificado</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-md border border-amber-100">
                <Star className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-semibold text-gray-700">5g por gomita</span>
              </div>
            </div>

            {/* CTAs premium */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <a
                href="https://wa.me/593998482560?text=Hola%20Healthy%20Leben%20%F0%9F%8C%BF%20Vengo%20desde%20la%20web%20y%20quiero%20hacer%20un%20pedido."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-lg"
              >
                <Zap className="w-5 h-5" />
                Comprar Ahora
                <ArrowRight className="w-5 h-5" />
              </a>
              <button
                onClick={scrollToProducts}
                className="btn-secondary text-lg cursor-pointer"
              >
                Explorar Productos
              </button>
            </div>

            {/* Price Promo premium */}
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 px-8 py-4 rounded-2xl shadow-lg border border-amber-200">
              <div className="text-center">
                <span className="block text-3xl font-bold text-gray-900">$19.99</span>
                <span className="text-sm text-gray-600 font-medium">cada frasco</span>
              </div>
              <div className="w-px h-14 bg-gradient-to-b from-amber-300 to-orange-300" />
              <div className="text-center">
                <span className="block text-2xl font-bold text-orange-700">3 x $49.99</span>
                <span className="text-sm text-orange-600 font-semibold">¡Ahorras $10!</span>
              </div>
            </div>
          </div>

          {/* Right Content - Product Showcase */}
          <div className="relative order-1 lg:order-2">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Glow central */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 via-amber-400/30 to-pink-400/30 rounded-full blur-3xl scale-90 animate-pulse" />
              
              {/* Círculo decorativo */}
              <div className="absolute inset-8 border-2 border-dashed border-orange-200/50 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
              
              {/* Producto central */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full blur-2xl scale-150" />
                  <img
                    src="/images/products/multivit.jpg"
                    alt="Multi-Vit Gummies"
                    className="relative w-48 h-auto drop-shadow-2xl animate-float"
                  />
                </div>
              </div>
              
              {/* Productos orbitando */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <img src="/images/products/biotin.jpg" alt="Biotin" className="w-20 h-auto drop-shadow-xl hover:scale-110 transition-transform" />
              </div>
              <div className="absolute top-1/4 right-0 translate-x-2">
                <img src="/images/products/energy.jpg" alt="Energy" className="w-20 h-auto drop-shadow-xl hover:scale-110 transition-transform" />
              </div>
              <div className="absolute bottom-1/4 right-0 translate-x-2">
                <img src="/images/products/balance.jpg" alt="Balance" className="w-20 h-auto drop-shadow-xl hover:scale-110 transition-transform" />
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <img src="/images/products/probiotic.jpg" alt="Probiotic" className="w-20 h-auto drop-shadow-xl hover:scale-110 transition-transform" />
              </div>
              <div className="absolute bottom-1/4 left-0 -translate-x-2">
                <img src="/images/products/sleeping.jpg" alt="Sleeping" className="w-20 h-auto drop-shadow-xl hover:scale-110 transition-transform" />
              </div>
              <div className="absolute top-1/4 left-0 -translate-x-2">
                <img src="/images/products/beauty.jpg" alt="Beauty" className="w-20 h-auto drop-shadow-xl hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
