import { useEffect, useRef, useState } from 'react';
import { Truck, Star, Heart } from 'lucide-react';

/**
 * FeaturesSection Component
 * 
 * Design Philosophy: Elegancia Minimalista Moderna
 * - Three feature cards with icons
 * - Fade-in animation on scroll (Intersection Observer)
 * - Responsive grid layout
 * - Subtle hover effects
 */

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Truck size={48} />,
    title: 'Envío Rápido',
    description: 'Entrega en 24-48 horas en toda la ciudad. Sorprende a tu amor a tiempo.'
  },
  {
    icon: <Star size={48} />,
    title: 'Calidad Premium',
    description: 'Flores frescas, complementos de lujo y atención al detalle en cada regalo.'
  },
  {
    icon: <Heart size={48} />,
    title: 'Personalización',
    description: 'Personaliza tu regalo con mensajes, colores y complementos a tu gusto.'
  }
];

export default function FeaturesSection() {
  const [visibleItems, setVisibleItems] = useState<boolean[]>([false, false, false]);
  const refs = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  useEffect(() => {
    const observers = refs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => {
        if (observer) observer.disconnect();
      });
    };
  }, []);

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => {
                refs.current[index] = el;
              }}
              className={`text-center space-y-4 transition-all duration-700 ${
                visibleItems[index]
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex justify-center text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="text-foreground/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
