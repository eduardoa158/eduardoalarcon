import { Header, Footer, WhatsAppFloating } from "@/components/ui/custom";
import { blogPosts } from "@/data/blog";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Calendar, BookOpen, MessageCircle } from "lucide-react";

export function Blog() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-green-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
          
          <div className="container-site relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-bold mb-6">
              <BookOpen className="w-4 h-4" />
              Blog de Bienestar
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Consejos para tu <span className="text-gradient">Bienestar</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Descubre artículos, guías y consejos expertos para mejorar tu salud 
              y bienestar diario de manera natural.
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="section-padding">
          <div className="container-site">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="h-56 relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-gray-800 shadow-lg">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.date).toLocaleDateString("es-ES")}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime} de lectura</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* CTA */}
                    <Link
                      to={`/#/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-green-600 font-bold hover:gap-3 transition-all"
                    >
                      Leer artículo
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
          
          <div className="container-site relative z-10 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Tienes preguntas?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Estamos aquí para ayudarte a elegir la gomita perfecta para tus necesidades específicas.
            </p>
            <a
              href="https://wa.me/593998482560?text=Hola%20Healthy%20Leben%20%E2%9C%A8%20Vengo%20desde%20el%20blog%20y%20tengo%20preguntas%20sobre%20los%20productos."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-green-600 px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
            >
              <MessageCircle className="w-6 h-6" />
              Hablar con un asesor
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
