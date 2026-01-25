import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

/**
 * WhatsAppButton Component
 * 
 * Design Philosophy: Elegancia Minimalista Moderna
 * - Sticky floating button in bottom-right corner
 * - Prominent with shadow and hover effects
 * - Tooltip with invitation text: "¿Necesitas ayuda con tu regalo? 💘"
 * - Smooth animations and micro-interactions
 * - Responsive design
 */

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappNumber = '34123456789'; // Replace with actual number
  const message = 'Hola! Me gustaría recibir ayuda con mi regalo de San Valentín.';

  const handleClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Tooltip */}
      <div
        className={`absolute bottom-20 right-0 bg-foreground text-white px-4 py-3 rounded-lg shadow-lg transition-all duration-300 whitespace-nowrap pointer-events-none ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <p className="text-sm font-medium">¿Necesitas ayuda con tu regalo? 💘</p>
        {/* Arrow */}
        <div className="absolute -bottom-1 right-6 w-2 h-2 bg-foreground transform rotate-45" />
      </div>

      {/* Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-16 h-16 bg-gradient-to-br from-primary to-primary/90 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group"
        aria-label="Contactar por WhatsApp"
      >
        {/* Pulsing Ring Animation */}
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
        
        {/* Icon */}
        <MessageCircle size={28} className="relative z-10" />

        {/* Floating Animation */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          .animate-float-button {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </button>

      {/* Notification Badge */}
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-bounce">
        ♥
      </div>
    </div>
  );
}
