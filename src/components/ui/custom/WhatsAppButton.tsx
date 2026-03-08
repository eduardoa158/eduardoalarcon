import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  message: string;
  phone?: string;
  variant?: "default" | "floating" | "large" | "outline";
  className?: string;
  children?: React.ReactNode;
}

const WHATSAPP_NUMBER = "593998482560";

export function WhatsAppButton({
  message,
  phone = WHATSAPP_NUMBER,
  variant = "default",
  className = "",
  children,
}: WhatsAppButtonProps) {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300";
  
  const variants = {
    default: "bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl",
    floating: "fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl animate-bounce",
    large: "bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl w-full md:w-auto",
    outline: "border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-6 py-3 rounded-full",
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <MessageCircle className="w-5 h-5" />
      {children}
    </a>
  );
}

export function WhatsAppFloating() {
  return (
    <WhatsAppButton
      message="Hola Healthy Leben ✨ Vengo desde la web y quiero ayuda para elegir la gomita ideal según mi objetivo."
      variant="floating"
    />
  );
}
