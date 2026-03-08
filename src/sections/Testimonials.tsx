import { Star, Quote, MessageCircle } from "lucide-react";

const testimonials = [
  {
    name: "María Fernanda L.",
    location: "Quito",
    product: "Biotin Gummies",
    rating: 5,
    text: "Después de 3 semanas noté una diferencia increíble en mi cabello. Está mucho más brillante y fuerte. ¡Las recomiendo totalmente!",
    avatar: "MF",
    color: "from-purple-500 to-fuchsia-500",
  },
  {
    name: "Carlos Andrés R.",
    location: "Guayaquil",
    product: "Energy Gummies",
    rating: 5,
    text: "Como deportista, necesito energía constante. Estas gomitas me dan el impulso perfecto sin nerviosismo. El sabor es delicioso.",
    avatar: "CA",
    color: "from-amber-500 to-orange-500",
  },
  {
    name: "Ana Patricia G.",
    location: "Cuenca",
    product: "Sleeping Gummies",
    rating: 5,
    text: "Tenía problemas para dormir desde hace años. Con Sleeping Gummies duermo profundamente y despierto renovada. ¡Un cambio de vida!",
    avatar: "AP",
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "Daniela S.",
    location: "Manta",
    product: "Balance Gummies",
    rating: 5,
    text: "Noté la diferencia en mi equilibrio hormonal desde la primera semana. Los cambios de humor disminuyeron notablemente.",
    avatar: "DS",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Roberto M.",
    location: "Ambato",
    product: "Multi-Vit Gummies",
    rating: 5,
    text: "Mi familia completa las toma. Los niños adoran el sabor tutti frutti y yo sé que están recibiendo todas las vitaminas necesarias.",
    avatar: "RM",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Laura C.",
    location: "Loja",
    product: "Apple Fit Gummies",
    rating: 5,
    text: "Me ayudaron a controlar mi ansiedad por comer. He notado cambios positivos en mi metabolismo y energía.",
    avatar: "LC",
    color: "from-red-500 to-rose-500",
  },
];

export function Testimonials() {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decoración */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-100/50 to-orange-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-green-100/50 to-emerald-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container-site relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-5 py-2 rounded-full text-sm font-bold mb-6">
            <MessageCircle className="w-4 h-4" />
            Testimonios Reales
          </div>
          <h2 className="section-title mb-6">
            Lo que dicen nuestros <span className="text-gradient">clientes</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Miles de personas en Ecuador ya han transformado su bienestar con nuestras gomitas. 
            Estas son algunas de sus historias.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-green-600 mb-1">10,000+</div>
            <div className="text-gray-600">Clientes felices</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-amber-500 mb-1">4.9</div>
            <div className="text-gray-600">Calificación promedio</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-1">98%</div>
            <div className="text-gray-600">Recomiendan</div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-gray-100 group-hover:text-amber-100 transition-colors">
                <Quote className="w-12 h-12" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 mb-6 relative z-10 leading-relaxed text-lg">
                "{testimonial.text}"
              </p>

              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-700 font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {testimonial.product}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
