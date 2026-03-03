import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://digitalvision.lat";
  const routes = ["", "/servicios", "/precios", "/consultoria", "/herramientas-ia", "/nosotros", "/contacto", "/prueba-gratis"];
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
