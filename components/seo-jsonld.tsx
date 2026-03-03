export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Digital Vision",
    url: "https://digitalvision.lat",
    email: "latamdigitalvision@gmail.com",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+593959920299",
      contactType: "sales",
      areaServed: "LatAm",
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function FAQJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿En cuánto tiempo está lista la implementación?",
        acceptedAnswer: { "@type": "Answer", text: "Entre 7 y 21 días según alcance e integraciones." },
      },
      {
        "@type": "Question",
        name: "¿Puedo integrar mi CRM actual?",
        acceptedAnswer: { "@type": "Answer", text: "Sí, evaluamos su stack y conectamos herramientas clave." },
      },
      {
        "@type": "Question",
        name: "¿Qué pasa con la seguridad de mis datos?",
        acceptedAnswer: { "@type": "Answer", text: "Aplicamos accesos por rol, trazabilidad y buenas prácticas de seguridad." },
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function ServiceJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Automatización de negocios con IA",
    provider: { "@type": "Organization", name: "Digital Vision" },
    areaServed: "Ecuador, LatAm",
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: "997",
      description: "Implementación DigitalSuite",
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
