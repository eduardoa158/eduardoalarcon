export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  fullDescription: string;
  price: number;
  image: string;
  lifestyleImage: string;
  color: string;
  bgGradient: string;
  accentColor: string;
  benefits: string[];
  ingredients: string[];
  flavor: string;
  dosage: string;
  category: string;
  tags: string[];
  ctaMessage: string;
  faq: { question: string; answer: string }[];
}

export const products: Product[] = [
  {
    id: "1",
    slug: "biotin-gummies",
    name: "Biotin Gummies",
    shortName: "Biotin",
    description: "Gomitas de ácido hialurónico y colágeno para cabello, piel y uñas",
    fullDescription: "Deliciosas gomitas de sabor fresa azul y fresa roja que contienen colágeno hidrolizado y ácido hialurónico, ambos componentes ayudarán a que tu cabello crezca más fuerte y en menos tiempo. El ácido hialurónico ayuda a lubricar tu piel, dar más brillo y prevenir el envejecimiento prematuro.",
    price: 19.99,
    image: "/images/products/biotin.jpg",
    lifestyleImage: "/images/landings/biotin-lifestyle.jpg",
    color: "#9333EA",
    bgGradient: "from-purple-600 via-fuchsia-500 to-pink-500",
    accentColor: "#C026D3",
    benefits: [
      "Cabello más fuerte y brillante",
      "Piel hidratada y luminosa",
      "Uñas sanas y resistentes",
      "Previene el envejecimiento prematuro",
      "Articulaciones más saludables",
      "Estimula la regeneración celular"
    ],
    ingredients: ["Biotina", "Colágeno hidrolizado", "Ácido hialurónico"],
    flavor: "Fresa azul y fresa roja",
    dosage: "2 gomitas diarias por la mañana",
    category: "Belleza",
    tags: ["cabello", "piel", "uñas", "colágeno", "belleza"],
    ctaMessage: "Hola Healthy Leben ✨ Vengo desde la web y me interesa Biotin Gummies. Quisiera más información y cómo comprar.",
    faq: [
      { question: "¿Cuándo veré resultados en mi cabello?", answer: "La mayoría de nuestros clientes notan mejoras en la textura y brillo del cabello después de 3-4 semanas de uso constante. Para resultados óptimos, recomendamos usarlo durante al menos 2-3 meses." },
      { question: "¿Es seguro para el embarazo?", answer: "Siempre consulta con tu médico antes de tomar cualquier suplemento durante el embarazo o lactancia." },
      { question: "¿Puedo tomarlo con otros suplementos?", answer: "Sí, Biotin Gummies es compatible con la mayoría de suplementos. Sin embargo, si tomas medicamentos recetados, consulta a tu médico." }
    ]
  },
  {
    id: "2",
    slug: "multi-vit-gummies",
    name: "Multi-Vit Gummies",
    shortName: "Multi-Vit",
    description: "Multivitaminas completas para toda la familia",
    fullDescription: "Deliciosas gomitas multivitamínicas de sabor tutti frutti que contienen vitamina A, E, D3, C, B6, B12 y ácido fólico. Ayuda a tener huesos, músculos y nervios saludables, apoya al sistema inmunitario y ayuda a producir nuevas células en el cuerpo.",
    price: 19.99,
    image: "/images/products/multivit.jpg",
    lifestyleImage: "/images/landings/multivit-lifestyle.jpg",
    color: "#2563EB",
    bgGradient: "from-blue-500 via-cyan-500 to-teal-400",
    accentColor: "#06B6D4",
    benefits: [
      "Huesos y músculos saludables",
      "Sistema inmunitario fortalecido",
      "Energía durante todo el día",
      "Apoyo al sistema nervioso",
      "Producción de nuevas células",
      "Metabolismo de grasas y proteínas"
    ],
    ingredients: ["Vitamina A", "Vitamina E", "Vitamina D3", "Vitamina C", "Vitamina B6", "Vitamina B12", "Ácido fólico"],
    flavor: "Tutti frutti",
    dosage: "2 gomitas diarias",
    category: "Bienestar",
    tags: ["multivitaminas", "familia", "inmunidad", "energía"],
    ctaMessage: "Hola Healthy Leben 🌈 Vengo desde la web y me interesa Multi-Vit Gummies. Quisiera más información y cómo comprar.",
    faq: [
      { question: "¿Es apto para niños?", answer: "Sí, Multi-Vit Gummies es seguro para niños mayores de 4 años. La dosis recomendada es de 1 gomita diaria para niños y 2 para adultos." },
      { question: "¿Cuándo es mejor tomarlo?", answer: "Puedes tomarlo en cualquier momento del día, preferiblemente con las comidas para mejor absorción." },
      { question: "¿Tiene azúcar añadida?", answer: "Contiene una cantidad mínima de azúcar natural para darle el delicioso sabor tutti frutti." }
    ]
  },
  {
    id: "3",
    slug: "energy-gummies",
    name: "Energy Gummies",
    shortName: "Energy",
    description: "Gomitas energéticas con cafeína y maca",
    fullDescription: "Gomitas energéticas de cafeína y maca con sabor a fresa. Gracias a su cafeína estimula el sistema nervioso central, es un diurético, lo que significa que ayuda al cuerpo a deshacerse de agua y sal extra. La maca puede mejorar la resistencia física, permitiendo que las personas se sientan menos fatigadas.",
    price: 19.99,
    image: "/images/products/energy.jpg",
    lifestyleImage: "/images/landings/energy-lifestyle.jpg",
    color: "#F59E0B",
    bgGradient: "from-orange-500 via-amber-500 to-yellow-400",
    accentColor: "#FBBF24",
    benefits: [
      "Más energía durante el día",
      "Mejor concentración mental",
      "Acelera el metabolismo",
      "Mayor resistencia física",
      "Reduce la fatiga",
      "Efecto diurético natural"
    ],
    ingredients: ["Cafeína", "Maca", "Vitamina B1", "Vitamina B5", "Vitamina B12"],
    flavor: "Fresa",
    dosage: "2 gomitas cuando necesites energía",
    category: "Energía",
    tags: ["energía", "concentración", "metabolismo", "deporte"],
    ctaMessage: "Hola Healthy Leben ⚡ Vengo desde la web y me interesa Energy Gummies. Quisiera más información y cómo comprar.",
    faq: [
      { question: "¿Cuánto dura el efecto energético?", answer: "El efecto energético puede durar entre 4-6 horas, dependiendo de tu metabolismo. Te recomendamos tomarlo por la mañana o antes de actividades físicas." },
      { question: "¿Puedo tomarlo todos los días?", answer: "Sí, es seguro para uso diario. Sin embargo, si eres sensible a la cafeína, limita el consumo a 2 gomitas al día." },
      { question: "¿Es bueno para deportistas?", answer: "¡Absolutamente! Energy Gummies es ideal para deportistas y personas activas que necesitan un impulso de energía natural." }
    ]
  },
  {
    id: "4",
    slug: "balance-gummies",
    name: "Balance Gummies",
    shortName: "Balance",
    description: "Equilibrio hormonal natural para mujeres",
    fullDescription: "Gomitas multivitamínicas para mujeres a base de ashwagandha y aguaje con sabor fresa. La Ashwagandha ayuda a reducir los niveles de azúcar, combate el estrés, contribuye a nutrir y mejorar la composición muscular. El Aguaje ayuda con funciones antibióticas, analgésicas y antiinflamatorias.",
    price: 19.99,
    image: "/images/products/balance.jpg",
    lifestyleImage: "/images/landings/balance-lifestyle.jpg",
    color: "#EC4899",
    bgGradient: "from-pink-500 via-rose-500 to-red-400",
    accentColor: "#FB7185",
    benefits: [
      "Equilibrio hormonal natural",
      "Reduce dolores menstruales",
      "Alivia sofocos de menopausia",
      "Regula cambios de humor",
      "Ayuda a conciliar el sueño",
      "Reduce el estrés"
    ],
    ingredients: ["Ashwagandha", "Aguaje", "Multivitaminas"],
    flavor: "Fresa y frutos rojos",
    dosage: "2 gomitas diarias",
    category: "Bienestar Femenino",
    tags: ["hormonas", "mujer", "menopausia", "equilibrio"],
    ctaMessage: "Hola Healthy Leben 🌸 Vengo desde la web y me interesa Balance Gummies. Quisiera más información y cómo comprar.",
    faq: [
      { question: "¿Ayuda con los síntomas de menopausia?", answer: "Sí, Balance Gummies contiene ingredientes naturales que ayudan a aliviar sofocos, cambios de humor y otros síntomas de menopausia." },
      { question: "¿Cuándo debo tomarlo?", answer: "Recomendamos tomarlo durante todo el mes para mantener el equilibrio hormonal. Puedes aumentar la dosis durante la menstruación." },
      { question: "¿Tiene efectos secundarios?", answer: "Es un producto natural y generalmente bien tolerado. Si tienes alguna condición médica, consulta a tu médico." }
    ]
  },
  {
    id: "5",
    slug: "probiotic-gummies",
    name: "Probiotic Gummies",
    shortName: "Probiotic",
    description: "Salud digestiva con fibra prebiótica",
    fullDescription: "Gomitas sabor a limón con inulina y fibra prebiótica que ayudan a proteger el aparato digestivo de microorganismos nocivos, a mejorar la digestión y la función intestinal. Beneficia la producción de bacterias que naturalmente habitan en nuestro intestino formando la flora intestinal.",
    price: 19.99,
    image: "/images/products/probiotic.jpg",
    lifestyleImage: "/images/landings/probiotic-lifestyle.jpg",
    color: "#22C55E",
    bgGradient: "from-green-500 via-emerald-500 to-teal-400",
    accentColor: "#34D399",
    benefits: [
      "Salud digestiva óptima",
      "Apoyo inmunológico",
      "Aumenta las defensas",
      "Mejora la flora intestinal",
      "Sin gluten",
      "Producto 100% vegano"
    ],
    ingredients: ["Inulina", "Fibra prebiótica", "Probióticos"],
    flavor: "Limón",
    dosage: "2 gomitas diarias",
    category: "Digestión",
    tags: ["digestión", "probióticos", "inmunidad", "salud intestinal"],
    ctaMessage: "Hola Healthy Leben 🌿 Vengo desde la web y me interesa Probiotic Gummies. Quisiera más información y cómo comprar.",
    faq: [
      { question: "¿Cuándo veré mejoras en mi digestión?", answer: "La mayoría de personas notan mejoras en 1-2 semanas. Para resultados óptimos, usa consistentemente durante al menos un mes." },
      { question: "¿Es vegano?", answer: "Sí, Probiotic Gummies es 100% vegano, sin ingredientes de origen animal." },
      { question: "¿Ayuda con la hinchazón?", answer: "Sí, los probióticos ayudan a reducir la hinchazón y mejorar la digestión general." }
    ]
  },
  {
    id: "6",
    slug: "sleeping-gummies",
    name: "Sleeping Gummies",
    shortName: "Sleeping",
    description: "Gomitas relajantes con melatonina",
    fullDescription: "Gomitas de maracuyá y limón con melatonina y omegas 3,6,9. Ayuda a tener niveles de serotonina adecuados, reducir la ansiedad, el estrés y el insomnio. Esta combinación logrará la mejor versión de ti mismo con un sueño profundo y reparador.",
    price: 19.99,
    image: "/images/products/sleeping.jpg",
    lifestyleImage: "/images/landings/sleeping-lifestyle.jpg",
    color: "#8B5CF6",
    bgGradient: "from-violet-500 via-purple-500 to-indigo-400",
    accentColor: "#A78BFA",
    benefits: [
      "Sueño profundo y reparador",
      "100% relajante natural",
      "Reduce la ansiedad",
      "Contiene Omegas 3,6,9",
      "Promueve el sueño natural",
      "Estimula y relaja"
    ],
    ingredients: ["Melatonina", "Omegas 3,6,9"],
    flavor: "Maracuyá y limón",
    dosage: "1 a 2 gomitas antes de dormir",
    category: "Descanso",
    tags: ["sueño", "descanso", "relajación", "melatonina"],
    ctaMessage: "Hola Healthy Leben 🌙 Vengo desde la web y me interesa Sleeping Gummies. Quisiera más información y cómo comprar.",
    faq: [
      { question: "¿Cuánto tiempo antes de dormir debo tomarlo?", answer: "Toma 1-2 gomitas 30 minutos antes de acostarte para permitir que la melatonina haga efecto." },
      { question: "¿Es adictivo?", answer: "No, Sleeping Gummies no crea adicción. Es una fórmula natural que ayuda a regular tu ciclo de sueño." },
      { question: "¿Puedo tomarlo todas las noches?", answer: "Sí, es seguro para uso diario. Sin embargo, si tienes problemas de sueño persistentes, consulta a un médico." }
    ]
  },
  {
    id: "7",
    slug: "apple-fit-gummies",
    name: "Apple Fit Gummies",
    shortName: "Apple Fit",
    description: "Vinagre de manzana para control de peso",
    fullDescription: "Gomitas a base de sidra de manzana con sabor fresa. El vinagre de manzana es conocido por sus propiedades reguladoras de glucosa, lo que permite calmar la ansiedad, regular el apetito y quemar grasa naturalmente. Consúmelas a la hora que tu ansiedad llegue al máximo.",
    price: 19.99,
    image: "/images/products/apple-fit.png",
    lifestyleImage: "/images/landings/applefit-lifestyle.jpg",
    color: "#DC2626",
    bgGradient: "from-red-600 via-rose-500 to-pink-500",
    accentColor: "#F87171",
    benefits: [
      "Gestiona el peso corporal",
      "Regula el azúcar en sangre",
      "Corazón saludable",
      "Agente desintoxicante",
      "Acelera el metabolismo",
      "Sin gluten y vegano"
    ],
    ingredients: ["Vinagre de manzana", "Sidra de manzana"],
    flavor: "Fresa",
    dosage: "2 gomitas diarias",
    category: "Fitness",
    tags: ["peso", "metabolismo", "vinagre de manzana", "fitness"],
    ctaMessage: "Hola Healthy Leben 🍎 Vengo desde la web y me interesa Apple Fit Gummies. Quisiera más información y cómo comprar.",
    faq: [
      { question: "¿Cuándo es mejor tomarlo?", answer: "Puedes tomarlo antes de las comidas para ayudar a controlar el apetito, o por la mañana para activar el metabolismo." },
      { question: "¿Ayuda a bajar de peso?", answer: "Apple Fit Gummies ayuda a controlar el apetito y acelerar el metabolismo como parte de un estilo de vida saludable con dieta y ejercicio." },
      { question: "¿Tiene el sabor fuerte del vinagre?", answer: "No, el sabor a fresa cubre completamente el sabor del vinagre, haciéndolo delicioso y fácil de tomar." }
    ]
  },
  {
    id: "8",
    slug: "beauty-gummies",
    name: "Beauty Gummies",
    shortName: "Beauty",
    description: "Belleza integral con ácido hialurónico",
    fullDescription: "Deliciosas gomitas de sabor fresa azul y fresa roja que contienen colágeno hidrolizado y ácido hialurónico. Ambos componentes ayudarán a que tu cabello crezca más fuerte, tu piel se hidrate profundamente y prevengas el envejecimiento prematuro.",
    price: 19.99,
    image: "/images/products/beauty.jpg",
    lifestyleImage: "/images/landings/beauty-lifestyle.jpg",
    color: "#F472B6",
    bgGradient: "from-pink-400 via-rose-400 to-purple-400",
    accentColor: "#F9A8D4",
    benefits: [
      "Articulaciones más saludables",
      "Elimina y evita arrugas",
      "Suaviza e hidrata la piel",
      "Estimula regeneración celular",
      "Cabello fuerte y brillante",
      "Belleza desde el interior"
    ],
    ingredients: ["Ácido hialurónico", "Colágeno"],
    flavor: "Fresa",
    dosage: "2 gomitas diarias por la mañana",
    category: "Belleza",
    tags: ["belleza", "piel", "colágeno", "antiarrugas"],
    ctaMessage: "Hola Healthy Leben 💖 Vengo desde la web y me interesa Beauty Gummies. Quisiera más información y cómo comprar.",
    faq: [
      { question: "¿Cuándo veré resultados en mi piel?", answer: "La mayoría de clientes notan mejoras en la hidratación de la piel después de 2-3 semanas. Para reducción de líneas finas, se recomienda usarlo durante 2-3 meses." },
      { question: "¿Es diferente de Biotin Gummies?", answer: "Beauty Gummies se enfoca más en la piel y anti-envejecimiento, mientras que Biotin Gummies se enfoca en cabello y uñas. Ambos se complementan perfectamente." },
      { question: "¿Puedo tomarlo con maquillaje?", answer: "Sí, Beauty Gummies trabaja desde el interior, por lo que no afecta el uso de productos cosméticos externos." }
    ]
  },
  {
    id: "9",
    slug: "te-matcha-gummies",
    name: "Té Matcha Gummies",
    shortName: "Té Matcha",
    description: "Extracto de té matcha ceremonial",
    fullDescription: "Lo delicioso de las gomitas y el grado ceremonial del Té Matcha, un té considerado el más antioxidante del mundo. Una deliciosa manera de consumir tus dosis diarias de té quema grasas, cuida tu salud eliminando el exceso de oxidación.",
    price: 19.99,
    image: "/images/products/te-matcha.jpg",
    lifestyleImage: "/images/landings/matcha-lifestyle.jpg",
    color: "#65A30D",
    bgGradient: "from-lime-600 via-green-500 to-emerald-500",
    accentColor: "#84CC16",
    benefits: [
      "Quemador de grasa natural",
      "Promueve la pérdida de peso",
      "Potenciador del metabolismo",
      "100% orgánico",
      "Alto contenido de antioxidantes",
      "Apto para vegetarianos"
    ],
    ingredients: ["Extracto de té matcha ceremonial"],
    flavor: "Matcha",
    dosage: "2 gomitas diarias",
    category: "Fitness",
    tags: ["matcha", "antioxidantes", "peso", "metabolismo"],
    ctaMessage: "Hola Healthy Leben 🍵 Vengo desde la web y me interesa Té Matcha Gummies. Quisiera más información y cómo comprar.",
    faq: [
      { question: "¿Cuánta cafeína contiene?", answer: "Té Matcha Gummies contiene una cantidad moderada de cafeína natural del té matcha, menos que una taza de café." },
      { question: "¿Es mejor que el café?", answer: "El matcha proporciona energía limpia sin el 'crash' del café, además de potentes antioxidantes." },
      { question: "¿Cuándo es mejor tomarlo?", answer: "Por la mañana o antes del ejercicio para aprovechar su efecto energético y quemador de grasa." }
    ]
  },
  {
    id: "10",
    slug: "relax-gummies",
    name: "Relax Gummies",
    shortName: "Relax",
    description: "Gomitas relajantes premium con extracto de CBD",
    fullDescription: "Gomitas relajantes premium con 3000mg de extracto de CBD. Fórmula diseñada para promover la relajación profunda, aliviar el estrés diario y mejorar la calidad del descanso. Con Omegas 3,6,9 que estimulan la función cerebral de manera natural.",
    price: 19.99,
    image: "/images/products/relax.jpg",
    lifestyleImage: "/images/landings/relax-lifestyle.jpg",
    color: "#059669",
    bgGradient: "from-emerald-700 via-green-600 to-teal-600",
    accentColor: "#34D399",
    benefits: [
      "Relajación profunda y natural",
      "Alivia el estrés diario",
      "Mejora la calidad del descanso",
      "Estimula la función cerebral",
      "Contiene Omegas 3,6,9",
      "Fórmula premium 3000mg"
    ],
    ingredients: ["Extracto de CBD", "Omegas 3,6,9"],
    flavor: "Natural herbal",
    dosage: "1 a 2 gomitas según necesidad",
    category: "Relajación",
    tags: ["relajación", "cbd", "estrés", "descanso"],
    ctaMessage: "Hola Healthy Leben 🌿 Vengo desde la web y me interesa Relax Gummies. Quisiera más información y cómo comprar.",
    faq: [
      { question: "¿Es legal en Ecuador?", answer: "Sí, Relax Gummies cumple con todas las regulaciones legales de Ecuador. El CBD es legal para consumo." },
      { question: "¿Me hará sentir 'drogado'?", answer: "No, el CBD no produce efectos psicoactivos. Solo promueve relajación y calma sin alterar tu estado mental." },
      { question: "¿Puedo conducir después de tomarlo?", answer: "Sí, es seguro conducir después de tomar Relax Gummies ya que no produce somnolencia excesiva ni alteración." }
    ]
  }
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getRelatedProducts = (slug: string, limit: number = 3): Product[] => {
  const currentProduct = getProductBySlug(slug);
  if (!currentProduct) return [];
  
  return products
    .filter(p => p.slug !== slug && p.category === currentProduct.category)
    .slice(0, limit);
};
