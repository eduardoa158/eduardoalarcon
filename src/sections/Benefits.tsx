import { Truck, ShieldCheck, CreditCard, Award, Clock, Leaf, Check } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Envío Gratis",
    description: "A todo el territorio nacional sin costo adicional en tu compra",
    color: "from-green-500 to-emerald-500",
    highlight: "Nacional",
  },
  {
    icon: CreditCard,
    title: "Pago Contra Entrega",
    description: "Paga cuando recibes. Solo $2 de recargo adicional",
    color: "from-blue-500 to-cyan-500",
    highlight: "+$2",
  },
  {
    icon: ShieldCheck,
    title: "Certificación Sanitaria",
    description: "Productos registrados y aprobados por las autoridades",
    color: "from-purple-500 to-violet-500",
    highlight: "Aprobado",
  },
  {
    icon: Award,
    title: "5g por Gomita",
    description: "Dosis óptima concentrada en cada gomita deliciosa",
    color: "from-amber-500 to-orange-500",
    highlight: "Premium",
  },
  {
    icon: Clock,
    title: "Entrega Rápida",
    description: "Recibe tu pedido en 24-48 horas hábiles",
    color: "from-rose-500 to-pink-500",
    highlight: "24-48h",
  },
  {
    icon: Leaf,
    title: "100% Natural",
    description: "Ingredientes naturales de la más alta calidad",
    color: "from-lime-500 to-green-500",
    highlight: "Natural",
  },
];

export function Benefits() {
  return (
    <section className="section-padding bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />
      
      <div className="container-site relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-sm font-bold mb-6 border border-white/10">
            <Check className="w-4 h-4 text-green-400" />
            Garantía de Calidad
          </div>
          <h2 className="section-title text-white mb-6">
            ¿Por qué elegir <span className="text-gradient">Healthy Leben?</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Más que gomitas, ofrecemos una experiencia de compra segura, 
            conveniente y respaldada por miles de clientes satisfechos.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-white/50 bg-white/10 px-3 py-1 rounded-full">
                  {benefit.highlight}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-3">{benefit.title}</h3>
              <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mt-16 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold mb-2">Métodos de Pago</h3>
              <p className="text-gray-400">Opciones flexibles para tu conveniencia</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 hover:bg-white/20 transition-colors px-6 py-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <span className="font-semibold block">Contra Entrega</span>
                  <span className="text-sm text-gray-400">+$2 recargo</span>
                </div>
              </div>
              <div className="bg-white/10 hover:bg-white/20 transition-colors px-6 py-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-sm">BP</span>
                </div>
                <div>
                  <span className="font-semibold block">Banco Pichincha</span>
                  <span className="text-sm text-gray-400">Transferencia</span>
                </div>
              </div>
              <div className="bg-white/10 hover:bg-white/20 transition-colors px-6 py-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <span className="text-amber-400 font-bold text-sm">BG</span>
                </div>
                <div>
                  <span className="font-semibold block">Banco Guayaquil</span>
                  <span className="text-sm text-gray-400">Transferencia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
