import { Link } from "react-router-dom";
import { ArrowRight, Clock, Calendar, BookOpen } from "lucide-react";
import { blogPosts } from "@/data/blog";

export function BlogPreview() {
  const posts = blogPosts.slice(0, 3);

  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decoración */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-br from-green-100/50 to-emerald-100/50 rounded-full blur-3xl -translate-x-1/2" />
      
      <div className="container-site relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-5 py-2 rounded-full text-sm font-bold mb-6">
              <BookOpen className="w-4 h-4" />
              Blog de Bienestar
            </div>
            <h2 className="section-title">
              Consejos para tu <span className="text-gradient">bienestar</span>
            </h2>
          </div>
          <Link
            to="/#/blog"
            className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors text-lg"
          >
            Ver todos los artículos
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              {/* Image con overlay */}
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
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
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
  );
}
