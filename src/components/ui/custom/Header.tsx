import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, Leaf, MessageCircle } from "lucide-react";

const navLinks = [
  { name: "Inicio", href: "/" },
  { name: "Productos", href: "#productos", isAnchor: true },
  { name: "Blog", href: "/blog", isBlog: true },
  { name: "Contacto", href: "https://wa.me/593998482560?text=Hola%20Healthy%20Leben%20%F0%9F%8C%BF", isExternal: true },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAnchorClick = (e: React.MouseEvent, anchor: string) => {
    e.preventDefault();
    const element = document.querySelector(anchor);
    if (element) {
      const offset = 100; // Altura del header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsMobileMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href.startsWith("#")) {
      return location.pathname === "/";
    }
    return location.pathname === href;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container-site">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl leading-tight text-gray-900">
                Healthy
              </span>
              <span className="font-bold text-xl leading-tight -mt-1 text-green-600">
                Leben
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => {
              if (link.isExternal) {
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-gray-700 hover:text-green-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-green-500 after:transition-all hover:after:w-full"
                  >
                    {link.name}
                  </a>
                );
              }
              if (link.isAnchor) {
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className={`font-semibold transition-colors hover:text-green-600 cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-green-500 after:transition-all hover:after:w-full ${
                      isActive(link.href) ? "text-green-600" : "text-gray-700"
                    }`}
                  >
                    {link.name}
                  </a>
                );
              }
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`font-semibold transition-colors hover:text-green-600 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-green-500 after:transition-all hover:after:w-full ${
                    isActive(link.href)
                      ? "text-green-600 after:w-full"
                      : "text-gray-700"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="https://wa.me/593998482560?text=Hola%20Healthy%20Leben%20%F0%9F%8C%BF%20Vengo%20desde%20la%20web%20y%20quiero%20hacer%20un%20pedido."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Comprar
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-6 border-t border-gray-100 pt-6 bg-white/95 backdrop-blur-xl rounded-2xl mt-2 shadow-xl">
            <nav className="flex flex-col gap-2 px-4">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-semibold py-3 px-4 rounded-xl transition-colors ${
                  location.pathname === "/"
                    ? "bg-green-50 text-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Inicio
              </Link>
              <a
                href="#productos"
                onClick={(e) => handleAnchorClick(e, "#productos")}
                className="font-semibold py-3 px-4 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Productos
              </a>
              <Link
                to="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-semibold py-3 px-4 rounded-xl transition-colors ${
                  location.pathname.includes("blog")
                    ? "bg-green-50 text-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Blog
              </Link>
              <a
                href="https://wa.me/593998482560?text=Hola%20Healthy%20Leben%20%F0%9F%8C%BF"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-semibold py-3 px-4 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Contacto
              </a>
              <a
                href="https://wa.me/593998482560?text=Hola%20Healthy%20Leben%20%F0%9F%8C%BF%20Vengo%20desde%20la%20web%20y%20quiero%20hacer%20un%20pedido."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-full font-bold mt-4 shadow-lg"
              >
                <ShoppingBag className="w-5 h-5" />
                Comprar Ahora
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
