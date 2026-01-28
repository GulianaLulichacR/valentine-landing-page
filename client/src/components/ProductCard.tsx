import { useState } from 'react';
import { Heart, Gift } from 'lucide-react';
import CheckoutModalWithTerms, { CheckoutFormData } from './CheckoutModalWithTerms';
import { openWhatsApp } from '@/lib/whatsapp';

/**
 * ProductCard Component
 * 
 * Design Philosophy: Elegancia Minimalista Moderna
 * - Modern card design with soft shadows and rounded corners
 * - Left border accent in passion red (#E63946)
 * - Hover effect: card elevates 4px with enhanced shadow
 * - Reveals complementary items on hover
 * - "Best Seller" or "Limited Edition" floating badges
 * - Smooth 300ms transitions
 */

interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  price: string;
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
  badge,
  complements,
  onAddToCart,
  whatsappNumber = '51987654321'
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const badgeText = {
    'best-seller': '⭐ Best Seller',
    'limited-edition': '✨ Edición Limitada'
  };

  const handleCheckoutSubmit = (formData: CheckoutFormData) => {
    openWhatsApp(title, price, formData, whatsappNumber);
  };

  return (
    <>
      <div
        className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-l-4 border-primary"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badge */}
        {badge && (
          <div className="absolute top-4 right-4 z-10 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
            {badgeText[badge]}
          </div>
        )}

        {/* Image Container */}
        <div className="relative h-64 overflow-hidden bg-secondary">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Floating Heart Icon */}
          <div className="absolute top-4 left-4 text-primary/20 text-3xl animate-pulse">
            ♥
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title and Price */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
              {title}
            </h3>
            <p className="text-2xl font-bold text-primary">{price}</p>
          </div>

          {/* Complements Section - Revealed on Hover */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              isHovered ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pt-4 border-t border-border space-y-2">
              <p className="text-sm font-semibold text-foreground/70 uppercase tracking-wide">
                Incluye:
              </p>
              <ul className="space-y-2">
                {complements.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                    <Gift size={16} className="text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full mt-4 px-4 py-3 bg-primary text-white font-semibold rounded-lg transition-all duration-300 hover:bg-primary/90 active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Heart size={18} />
            Enviar este regalo
          </button>
        </div>

        {/* Decorative Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
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
