import { Link } from "react-router-dom";
import { Leaf, Instagram, Facebook, Youtube, Phone, Mail, MapPin, MessageCircle, ArrowRight } from "lucide-react";

const footerLinks = {
  productos: [
    { name: "Biotin Gummies", href: "#/product/biotin-gummies" },
    { name: "Multi-Vit Gummies", href: "#/product/multi-vit-gummies" },
    { name: "Energy Gummies", href: "#/product/energy-gummies" },
    { name: "Balance Gummies", href: "#/product/balance-gummies" },
    { name: "Probiotic Gummies", href: "#/product/probiotic-gummies" },
    { name: "Relax Gummies", href: "#/product/relax-gummies" },
  ],
  empresa: [
    { name: "Sobre Nosotros", href: "#" },
    { name: "Blog", href: "/blog" },
    { name: "Contacto", href: "https://wa.me/593998482560" },
  ],
  soporte: [
    { name: "Preguntas Frecuentes", href: "#" },
    { name: "Envíos", href: "#" },
    { name: "Métodos de Pago", href: "#" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/healthyleben_nutricion" },
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/healthyleben1" },
  { name: "YouTube", icon: Youtube, href: "https://www.youtube.com/channel/UCJcRUGoi8luEn8-QK2n3UzQ" },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />
      
      <div className="container-site relative z-10 py-16">
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">¿Listo para comenzar?</h3>
              <p className="text-white/80">Escríbenos por WhatsApp y recibe asesoría personalizada</p>
            </div>
            <a
              href="https://wa.me/593998482560?text=Hola%20Healthy%20Leben%20%F0%9F%8C%BF%20Vengo%20desde%20la%20web%20y%20quiero%20hacer%20un%20pedido."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-green-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              Escribir por WhatsApp
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-tight text-white">Healthy</span>
                <span className="font-bold text-xl leading-tight -mt-1 text-green-400">Leben</span>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Gomitas nutritivas premium para tu bienestar diario. 
              Salud que sabe bien, resultados que se sienten.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-gray-800 hover:bg-green-500 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Productos</h3>
            <ul className="space-y-3">
              {footerLinks.productos.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-green-400 transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-green-400 transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-green-400" />
                </div>
                <a href="tel:+593998482560" className="hover:text-green-400 transition-colors font-medium">
                  +593 998 482 560
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-green-400" />
                </div>
                <span>info@healthyleben.net</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-green-400" />
                </div>
                <span>Ecuador<br />Envío a nivel nacional</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © 2024 Healthy Leben. Todos los derechos reservados.
            </p>
            <div className="flex gap-8 text-sm text-gray-500">
              <Link to="#" className="hover:text-green-400 transition-colors">
                Términos y Condiciones
              </Link>
              <Link to="#" className="hover:text-green-400 transition-colors">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
