import { useState } from "react";
import { HelpCircle, ArrowRight, Sparkles, Moon, Heart, Zap, Dumbbell, Leaf, MessageCircle, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const objectives = [
  {
    id: "energy",
    title: "Más Energía",
    description: "Combatiendo la fatiga y necesitas vitalidad para el día",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    product: "energy-gummies",
    productName: "Energy Gummies",
  },
  {
    id: "sleep",
    title: "Mejor Descanso",
    description: "Dificultad para dormir o despertar cansado",
    icon: Moon,
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50",
    product: "sleeping-gummies",
    productName: "Sleeping Gummies",
  },
  {
    id: "beauty",
    title: "Belleza Natural",
    description: "Piel radiante, cabello fuerte y uñas sanas",
    icon: Sparkles,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50",
    product: "biotin-gummies",
    productName: "Biotin Gummies",
  },
  {
    id: "wellness",
    title: "Bienestar General",
    description: "Mantener tu salud en óptimas condiciones",
    icon: Heart,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    product: "multi-vit-gummies",
    productName: "Multi-Vit Gummies",
  },
  {
    id: "fitness",
    title: "Control de Peso",
    description: "Complementar tu rutina fitness y metabolismo",
    icon: Dumbbell,
    color: "from-red-500 to-rose-500",
    bgColor: "bg-red-50",
    product: "apple-fit-gummies",
    productName: "Apple Fit Gummies",
  },
  {
    id: "digestion",
    title: "Salud Digestiva",
    description: "Mejorar digestión y fortalecer inmunidad",
    icon: Leaf,
    color: "from-lime-500 to-green-500",
    bgColor: "bg-lime-50",
    product: "probiotic-gummies",
    productName: "Probiotic Gummies",
  },
  {
    id: "relax",
    title: "Relajación Profunda",
    description: "Reducir estrés y ansiedad diaria",
    icon: Brain,
    color: "from-emerald-600 to-teal-500",
    bgColor: "bg-emerald-50",
    product: "relax-gummies",
    productName: "Relax Gummies",
  },
  {
    id: "balance",
    title: "Equilibrio Femenino",
    description: "Equilibrio hormonal y bienestar femenino",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50",
    product: "balance-gummies",
    productName: "Balance Gummies",
  },
];

export function HelpChooser() {
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);

  return (
    <section className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container-site">
        {/* Header premium */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-5 py-2 rounded-full text-sm font-bold mb-6">
            <HelpCircle className="w-4 h-4" />
            Asesor Personalizado
          </div>
          <h2 className="section-title mb-6">
            ¿No sabes cuál <span className="text-gradient">elegir?</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Selecciona tu objetivo principal y te recomendaremos la fórmula perfecta 
            para tus necesidades específicas de bienestar.
          </p>
        </div>

        {/* Objectives Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {objectives.map((objective) => (
            <button
              key={objective.id}
              onClick={() => setSelectedObjective(objective.id)}
              className={`group relative p-6 rounded-2xl text-left transition-all duration-300 border-2 ${
                selectedObjective === objective.id
                  ? `border-transparent ring-2 ring-offset-4 ring-green-500 scale-[1.02] ${objective.bgColor}`
                  : "border-gray-100 hover:border-gray-200 hover:scale-[1.02] bg-white"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${objective.color} opacity-0 rounded-2xl group-hover:opacity-5 transition-opacity`} />
              <div className="relative">
                <div className={`w-14 h-14 bg-gradient-to-br ${objective.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <objective.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{objective.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{objective.description}</p>
              </div>
              
              {/* Indicador de selección */}
              {selectedObjective === objective.id && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Selected Product CTA */}
        {selectedObjective && (
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <p className="text-gray-500 font-medium mb-2 uppercase tracking-wide text-sm">Recomendación personalizada</p>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {objectives.find((o) => o.id === selectedObjective)?.productName}
                </h3>
                <p className="text-gray-600 max-w-md">
                  {objectives.find((o) => o.id === selectedObjective)?.description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={`/product/${objectives.find((o) => o.id === selectedObjective)?.product}`}
                  className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
                >
                  Ver Producto
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Help CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col items-center">
            <p className="text-gray-600 mb-4 text-lg">¿Sigues con dudas? ¡Nuestro equipo te ayuda!</p>
            <a
              href="https://wa.me/593998482560?text=Hola%20Healthy%20Leben%20%F0%9F%8C%BF%20Vengo%20desde%20la%20web%20y%20quiero%20ayuda%20para%20elegir%20la%20gomita%20ideal%20según%20mi%20objetivo."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-full font-bold hover:bg-green-600 transition-all hover:scale-105 shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Hablar con un asesor
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
