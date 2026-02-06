import { useState } from 'react';
import { Heart, Gift } from 'lucide-react';
import CheckoutModalWithTerms, { CheckoutFormData } from './CheckoutModalWithTerms';
import { openWhatsApp } from '@/lib/whatsapp';

/**
 * ProductCard Component - Enhanced Version
 * 
 * Design Philosophy: Elegancia Minimalista Moderna con Animaciones
 * - Modern card design with soft shadows and rounded corners
 * - Left border accent in passion red (#E63946)
 * - Hover effect: card elevates with enhanced shadow and glow
 * - Reveals complementary items on hover
 * - "Best Seller" or "Limited Edition" floating badges
 * - Smooth 300ms transitions
 * - Improved image handling with fallback
 * - Enhanced description visibility (read-only)
 * - Decorative flower emoji in description
 */

interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  price: string;
  description?: string;
  badge?: 'best-seller' | 'limited-edition';
  complements: string[];
  onAddToCart?: () => void;
  whatsappNumber?: string;
}

export default function ProductCard({
  id,
  title,
  image,
  price,
  description = '',
  badge,
  complements,
  onAddToCart,
  whatsappNumber = '51987654321'
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const badgeText = {
    'best-seller': '⭐ Best Seller',
    'limited-edition': '✨ Edición Limitada'
  };

  const handleCheckoutSubmit = (formData: CheckoutFormData) => {
    openWhatsApp(title, price, formData, whatsappNumber);
  };

  // Manejo de error de imagen con fallback
  const handleImageError = () => {
    setImageError(true);
  };

  const displayImage = imageError
    ? 'https://via.placeholder.com/400x300?text=Producto+No+Disponible'
    : image;

  return (
    <>
      <div
        className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-2 border-l-4 border-primary transform"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badge con animación */}
        {badge && (
          <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300">
            {badgeText[badge]}
          </div>
        )}

        {/* Image Container con overlay mejorado */}
        <div className="relative h-72 overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
          {/* Overlay oscuro en hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Imagen con manejo de errores */}
          <img
            src={displayImage}
            alt={title}
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Floating Heart Icon con animación */}
          <div className="absolute top-4 left-4 text-primary/30 text-4xl animate-pulse group-hover:text-primary/60 transition-colors duration-300">
            ♥
          </div>

          {/* Precio flotante mejorado */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm text-pink-600 font-bold px-4 py-2 rounded-full shadow-lg transform group-hover:scale-105 transition-transform duration-300">
            {price}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title con efecto de color en hover */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors duration-300">
              {title}
            </h3>
          </div>

          {/* Descripción mejorada - Solo lectura */}
          {description && (
            <div className="py-3 border-t border-b border-pink-100">
              <p className="text-gray-700 text-sm leading-relaxed font-medium group-hover:text-gray-900 transition-colors duration-300">
                {description}
              </p>
            </div>
          )}

          {/* Complements Section - Revealed on Hover */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              isHovered ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pt-4 border-t border-pink-100 space-y-2">
              <p className="text-sm font-semibold text-foreground/70 uppercase tracking-wide">
                ✨ Incluye:
              </p>
              <ul className="space-y-2">
                {complements.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-sm text-foreground/80 transform transition-transform duration-300 hover:translate-x-1"
                  >
                    <Gift size={16} className="text-pink-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA Button con animaciones mejoradas */}
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold rounded-xl transition-all duration-300 hover:from-pink-600 hover:to-red-600 hover:shadow-lg hover:shadow-pink-500/40 active:scale-95 shadow-md flex items-center justify-center gap-2 transform hover:scale-105"
          >
            <Heart size={18} className="animate-pulse" />
            Enviar este regalo ✨
          </button>
        </div>

        {/* Decorative Line con animación mejorada */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </div>

      {/* Checkout Modal */}
      <CheckoutModalWithTerms
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        productName={title}
        productPrice={price}
        onSubmit={handleCheckoutSubmit}
      />
    </>
  );
}
