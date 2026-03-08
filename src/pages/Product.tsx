import { useParams, Navigate } from "react-router-dom";
import { Header, Footer } from "@/components/ui/custom";
import { getProductBySlug, products } from "@/data/products";
import { Check, Star, ArrowRight, ShieldCheck, Truck, Clock, Leaf, Award, Sparkles, MessageCircle, Gift, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export function Product() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!product) {
    return <Navigate to="/" />;
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className={`pt-28 pb-20 bg-gradient-to-br ${product.bgGradient} relative overflow-hidden`}>
          {/* Decoración */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
          <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          
          <div className="container-site relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Product Image */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl scale-75 animate-pulse" />
                <div className="relative z-10">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="relative w-72 md:w-96 h-auto drop-shadow-2xl animate-float"
                  />
                </div>
                {/* Badge flotante - fuera del contenedor de la imagen para estar siempre visible */}
                <div className="absolute -top-4 right-4 md:right-10 bg-white text-gray-900 px-4 py-2 rounded-full font-bold shadow-xl flex items-center gap-2 z-20">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  5g Premium
                </div>
              </div>

              {/* Product Info */}
              <div className="text-white">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold mb-6 border border-white/20">
                  {product.category}
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  {product.name}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-white/90 font-medium">4.9/5 (150+ reseñas)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-8">
                  <span className="text-5xl md:text-6xl font-bold">${product.price.toFixed(2)}</span>
                  <span className="text-white/80 text-xl">/ frasco</span>
                </div>

                {/* Promo */}
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Gift className="w-6 h-6 text-amber-300" />
                    <p className="font-bold text-xl">Promoción Especial</p>
                  </div>
                  <p className="text-lg">3 frascos por <span className="font-bold text-2xl text-amber-300">$49.99</span></p>
                  <p className="text-white/80">¡Ahorras $10 en tu compra!</p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={`https://wa.me/593998482560?text=${encodeURIComponent(product.ctaMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Comprar Ahora
                  </a>
                  <a
                    href="https://wa.me/593998482560?text=Hola%20Healthy%20Leben%20%F0%9F%8E%81%20Vengo%20desde%20la%20web%20y%20me%20interesa%20la%20promoción%20de%203%20frascos%20por%20%2449.99."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 bg-white/20 backdrop-blur-md text-white border-2 border-white/30 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all"
                  >
                    Ver Promoción
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
          <div className="container-site">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-bold mb-6">
                <Sparkles className="w-4 h-4" />
                Beneficios Comprobados
              </div>
              <h2 className="section-title mb-6">
                ¿Por qué elegir <span className="text-gradient">{product.name}</span>?
              </h2>
              <p className="section-subtitle mx-auto">
                Descubre por qué miles de personas en Ecuador eligieron esta fórmula para su bienestar diario.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                    style={{ background: `linear-gradient(135deg, ${product.color}20, ${product.color}10)` }}
                  >
                    <Check className="w-8 h-8" style={{ color: product.color }} />
                  </div>
                  <p className="font-bold text-xl text-gray-900">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Details */}
        <section className="section-padding bg-white">
          <div className="container-site">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Description */}
              <div>
                <h2 className="section-title mb-8">
                  Sobre el <span className="text-gradient">Producto</span>
                </h2>
                <p className="text-gray-600 text-xl leading-relaxed mb-8">
                  {product.fullDescription}
                </p>

                {/* Ingredients */}
                <div className="mb-8">
                  <h3 className="font-bold text-xl text-gray-900 mb-4">Ingredientes principales</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-full text-sm font-semibold text-gray-700 transition-colors"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dosage */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8">
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Modo de uso</h3>
                  <p className="text-gray-600 text-lg">{product.dosage}</p>
                </div>
              </div>

              {/* Product Info Cards */}
              <div className="space-y-5">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Leaf className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900">100% Natural</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Producto elaborado con ingredientes naturales de la más alta calidad, cuidadosamente seleccionados.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Award className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900">5g por Gomita</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Cada gomita contiene 5g de fórmula concentrada para máxima efectividad.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900">Sabor: {product.flavor}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Delicioso sabor que hará que tomar tus vitaminas sea un verdadero placer.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-3xl p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <ShieldCheck className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900">Certificado</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Producto registrado y aprobado por las autoridades sanitarias competentes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Purchase Benefits */}
        <section className="section-padding bg-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
          
          <div className="container-site relative z-10">
            <div className="grid md:grid-cols-3 gap-10 text-center">
              <div className="group">
                <div className="w-20 h-20 bg-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500/30 transition-colors">
                  <Truck className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="font-bold text-2xl mb-3">Envío Gratis</h3>
                <p className="text-gray-400">A todo el territorio nacional sin costo adicional</p>
              </div>
              <div className="group">
                <div className="w-20 h-20 bg-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500/30 transition-colors">
                  <ShieldCheck className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="font-bold text-2xl mb-3">Pago Contra Entrega</h3>
                <p className="text-gray-400">Solo $2 de recargo. También transferencias</p>
              </div>
              <div className="group">
                <div className="w-20 h-20 bg-amber-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-500/30 transition-colors">
                  <Award className="w-10 h-10 text-amber-400" />
                </div>
                <h3 className="font-bold text-2xl mb-3">Garantía de Calidad</h3>
                <p className="text-gray-400">Producto certificado y respaldado</p>
              </div>
            </div>
          </div>
        </section>

        {/* Lifestyle Image Section */}
        <section className="section-padding bg-gradient-to-b from-white to-gray-50">
          <div className="container-site">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={product.lifestyleImage} 
                alt={`${product.name} - Lifestyle`}
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                <div className="p-8 md:p-16 max-w-xl">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Transforma tu bienestar
                  </h3>
                  <p className="text-white/90 text-lg mb-6">
                    Únete a miles de personas que ya disfrutan de los beneficios de {product.name} en su día a día.
                  </p>
                  <a
                    href={`https://wa.me/593998482560?text=${encodeURIComponent(product.ctaMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Comprar Ahora
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-white">
          <div className="container-site">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-5 py-2 rounded-full text-sm font-bold mb-6">
                <Sparkles className="w-4 h-4" />
                Preguntas Frecuentes
              </div>
              <h2 className="section-title mb-6">
                Todo lo que necesitas saber sobre <span className="text-gradient">{product.name}</span>
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {product.faq.map((item, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-bold text-lg text-gray-900 pr-4">{item.question}</span>
                    <ChevronDown 
                      className={`w-6 h-6 text-gray-500 flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
            <div className="container-site">
              <h2 className="section-title text-center mb-12">
                Productos <span className="text-gradient">Relacionados</span>
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedProducts.map((related) => (
                  <Link
                    key={related.id}
                    to={`/product/${related.slug}`}
                    className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-gray-100"
                  >
                    <div className={`h-40 bg-gradient-to-br ${related.bgGradient} rounded-2xl mb-6 flex items-center justify-center overflow-hidden`}>
                      <img
                        src={related.image}
                        alt={related.name}
                        className="w-28 h-auto group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{related.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {related.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-2xl text-gray-900">${related.price.toFixed(2)}</span>
                      <span className="text-green-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Ver más <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="section-padding bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
          
          <div className="container-site relative z-10 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Listo para probar<br /><span className="text-amber-300">{product.name}</span>?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Haz tu pedido ahora y recíbelo en la puerta de tu casa con envío gratis a nivel nacional.
            </p>
            <a
              href={`https://wa.me/593998482560?text=${encodeURIComponent(product.ctaMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white text-green-600 px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              <MessageCircle className="w-6 h-6" />
              Comprar Ahora
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
