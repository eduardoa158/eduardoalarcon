import { MessageCircle, ArrowRight, Gift, Check, Star, Truck, Shield } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="section-padding bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 relative overflow-hidden">
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />
      
      {/* Círculos decorativos */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container-site relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/20">
            <Gift className="w-5 h-5" />
            <span className="font-bold">Promoción Especial</span>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            ¿Listo para transformar<br />tu <span className="text-amber-300">bienestar</span>?
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Únete a miles de personas en Ecuador que ya disfrutan de nuestros productos premium. 
            Envío gratis a nivel nacional.
          </p>

          {/* Price Cards */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
            <div className="bg-white/15 backdrop-blur-md px-8 py-5 rounded-3xl border border-white/20">
              <span className="text-4xl md:text-5xl font-bold">$19.99</span>
              <span className="text-white/80 ml-2 text-lg">cada frasco</span>
            </div>
            <div className="text-white/60 text-2xl font-light">o</div>
            <div className="bg-white text-green-600 px-8 py-5 rounded-3xl font-bold shadow-2xl">
              <span className="text-3xl md:text-4xl">3 x $49.99</span>
              <span className="block text-base font-medium text-green-500 mt-1">¡Ahorras $10!</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="https://wa.me/593998482560?text=Hola%20Healthy%20Leben%20%F0%9F%8C%BF%20Vengo%20desde%20la%20web%20y%20quiero%20hacer%20un%20pedido."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white text-green-600 px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              <MessageCircle className="w-6 h-6" />
              Escribir por WhatsApp
            </a>
            <a
              href="https://wa.me/593998482560?text=Hola%20Healthy%20Leben%20%F0%9F%8E%81%20Vengo%20desde%20la%20web%20y%20me%20interesa%20la%20promoción%20de%203%20frascos%20por%20%2449.99."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-green-700 text-white border-2 border-white/30 px-10 py-5 rounded-full font-bold text-lg hover:bg-green-800 transition-all hover:scale-105"
            >
              Aprovechar Promoción
              <ArrowRight className="w-6 h-6" />
            </a>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <span className="font-medium">Envío gratis</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
              <span className="font-medium">Pago contra entrega</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-medium">Producto certificado</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4" />
              </div>
              <span className="font-medium">Atención personalizada</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
