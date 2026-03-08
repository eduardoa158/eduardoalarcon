import { Link } from "react-router-dom";
import { ArrowRight, Check, Star } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link 
      to={`/product/${product.slug}`}
      className="group block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
    >
      {/* Image Container con gradiente premium */}
      <div className={`relative h-56 bg-gradient-to-br ${product.bgGradient} p-6 flex items-center justify-center overflow-hidden`}>
        {/* Patrón de fondo animado */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/20 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl" />
        </div>
        
        {/* Círculos decorativos */}
        <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white/20 rounded-full" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-white/20 rounded-full" />
        
        {/* Product Image con efecto hover */}
        <div className="relative z-10 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl scale-150" />
          <img
            src={product.image}
            alt={product.name}
            className="relative w-32 h-auto object-contain drop-shadow-2xl"
          />
        </div>
        
        {/* Badge de calidad - posición fija */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 shadow-lg flex items-center gap-1 z-20">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          5g
        </div>
        
        {/* Badge de categoría - posición fija */}
        <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full z-20">
          <span className="text-xs font-medium text-white">{product.category}</span>
        </div>
      </div>

      {/* Content - Altura fija para simetría */}
      <div className="p-6 flex flex-col min-h-[320px]">
        {/* Title - Altura fija */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors leading-tight min-h-[3.25rem]">
          {product.name}
        </h3>

        {/* Description - Altura fija */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed min-h-12">
          {product.description}
        </p>

        {/* Benefits - Altura fija */}
        <div className="space-y-2 mb-4 h-14 overflow-hidden">
          {product.benefits.slice(0, 2).map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${product.color}20` }}
              >
                <Check className="w-3 h-3" style={{ color: product.color }} />
              </div>
              <span className="truncate">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Price section - Altura fija */}
        <div className="flex items-baseline gap-2 mb-2 h-8">
          <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <span className="text-sm text-gray-500">/ frasco</span>
        </div>

        {/* Promo badge - Altura fija */}
        <div 
          className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full mb-4 h-8"
          style={{ 
            background: `linear-gradient(135deg, ${product.color}20, ${product.color}10)`,
            color: product.color 
          }}
        >
          <span>🎁</span>
          <span className="truncate">3 frascos $49.99</span>
        </div>

        {/* CTA premium - Siempre al final */}
        <div 
          className="mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 group-hover:shadow-lg"
          style={{ backgroundColor: product.color }}
        >
          <span>Ver Producto</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
