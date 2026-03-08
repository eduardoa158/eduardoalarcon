import { useParams, Navigate, Link } from "react-router-dom";
import { Header, Footer, WhatsAppFloating } from "@/components/ui/custom";
import { getBlogPostBySlug } from "@/data/blog";
import { getProductBySlug } from "@/data/products";
import { ArrowLeft, Clock, Calendar, Check, MessageCircle, Sparkles, ArrowRight } from "lucide-react";

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPostBySlug(slug || "");

  if (!post) {
    return <Navigate to="/blog" />;
  }

  const relatedProducts = post.relatedProducts
    .map((slug) => getProductBySlug(slug))
    .filter(Boolean);

  // Convert markdown-like content to HTML
  const formatContent = (content: string) => {
    return content
      .split("\n\n")
      .map((paragraph) => {
        if (paragraph.startsWith("# ")) {
          return `<h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-8">${paragraph.replace("# ", "")}</h1>`;
        }
        if (paragraph.startsWith("## ")) {
          return `<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6">${paragraph.replace("## ", "")}</h2>`;
        }
        if (paragraph.startsWith("### ")) {
          return `<h3 class="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-4">${paragraph.replace("### ", "")}</h3>`;
        }
        if (paragraph.startsWith("- ")) {
          const items = paragraph.split("\n").map((item) =>
            item.replace("- ", "")
          );
          return `<ul class="list-disc list-inside space-y-3 text-gray-700 mb-8 text-lg">${items
            .map((item) => `<li>${item}</li>`)
            .join("")}</ul>`;
        }
        if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
          return `<p class="font-bold text-gray-900 mb-6 text-lg">${paragraph.replace(/\*\*/g, "")}</p>`;
        }
        if (paragraph.startsWith("---")) {
          return `<hr class="my-10 border-gray-200" />`;
        }
        return `<p class="text-gray-700 mb-6 leading-relaxed text-lg">${paragraph}</p>`;
      })
      .join("");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero con imagen */}
        <section className="relative pt-28 pb-20">
          {/* Imagen de fondo */}
          <div className="absolute inset-0">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white" />
          </div>
          
          <div className="container-site relative z-10">
            {/* Back Link */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al blog
            </Link>

            {/* Category */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-bold mb-6 border border-white/20">
              <Sparkles className="w-4 h-4" />
              {post.category}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 max-w-4xl leading-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">{new Date(post.date).toLocaleDateString("es-ES")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{post.readTime} de lectura</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="section-padding">
          <div className="container-site">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <article
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                />

                {/* CTA */}
                <div className="mt-16 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl p-10 text-white relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                  }} />
                  <div className="relative z-10">
                    <h3 className="text-3xl font-bold mb-4">
                      ¿Listo para comenzar tu viaje de bienestar?
                    </h3>
                    <p className="text-white/90 mb-8 text-lg">
                      Escríbenos por WhatsApp y te ayudaremos a elegir la gomita perfecta para ti.
                    </p>
                    <a
                      href="https://wa.me/593998482560?text=Hola%20Healthy%20Leben%20%E2%9C%A8%20Vengo%20desde%20el%20blog%20y%20quiero%20ayuda%20para%20elegir%20la%20gomita%20ideal."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Hablar con un asesor
                    </a>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-8">
                {/* Related Products */}
                {relatedProducts.length > 0 && (
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                    <h3 className="font-bold text-xl text-gray-900 mb-6">
                      Productos relacionados
                    </h3>
                    <div className="space-y-5">
                      {relatedProducts.map((product) => (
                        <Link
                          key={product!.id}
                          to={`/product/${product!.slug}`}
                          className="flex items-center gap-4 group"
                        >
                          <div className={`w-20 h-20 bg-gradient-to-br ${product!.bgGradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow`}>
                            <img
                              src={product!.image}
                              alt={product!.name}
                              className="w-14 h-auto group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-1">
                              {product!.name}
                            </h4>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {product!.description}
                            </p>
                            <span className="text-green-600 font-bold text-sm mt-1 inline-flex items-center gap-1">
                              Ver producto <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Benefits */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8">
                  <h3 className="font-bold text-xl text-gray-900 mb-6">
                    ¿Por qué elegir Healthy Leben?
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Envío gratis a nivel nacional",
                      "Pago contra entrega disponible",
                      "Productos 100% naturales",
                      "Certificación sanitaria",
                      "5g por gomita",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact CTA */}
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                  }} />
                  <div className="relative z-10">
                    <h3 className="font-bold text-2xl mb-3">
                      ¿Tienes dudas?
                    </h3>
                    <p className="text-white/90 mb-6">
                      Nuestro equipo está listo para ayudarte a elegir el producto ideal.
                    </p>
                    <a
                      href="https://wa.me/593998482560?text=Hola%20Healthy%20Leben%20%E2%9C%A8%20Vengo%20desde%20el%20blog%20y%20tengo%20una%20pregunta."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Escríbenos
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
