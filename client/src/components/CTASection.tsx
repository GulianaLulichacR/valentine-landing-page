import { useEffect, useRef, useState } from 'react';

/**
 * CTASection Component
 * 
 * Design Philosophy: Elegancia Minimalista Moderna
 * - Call-to-action section with prominent button
 * - Fade-in animation on scroll
 * - Responsive design
 * - Decorative background elements
 */

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <section className="relative py-20 px-4 md:px-8 lg:px-16 bg-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-muted/20 rounded-full blur-3xl -z-10 opacity-50" />

      <div
        ref={ref}
        className={`max-w-4xl mx-auto text-center space-y-8 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-foreground">
          ¿Listo para regalar amor?
        </h2>
        <p className="text-xl text-foreground/70">
          Elige el regalo perfecto y sorprende a quien amas en San Valentín.
        </p>
        <button className="inline-block px-10 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl text-lg hover:-translate-y-0.5 active:scale-95">
          Explorar Colección Completa
        </button>

        {/* Decorative Hearts */}
        <div className="flex justify-center gap-4 mt-12 text-primary/20 text-4xl">
          <span className="animate-bounce" style={{ animationDelay: '0s' }}>
            ♥
          </span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>
            ♥
          </span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>
            ♥
          </span>
        </div>
      </div>
    </section>
  );
}
