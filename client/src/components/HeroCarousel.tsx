import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * HeroCarousel Component
 * 
 * Design Philosophy: Elegancia Minimalista Moderna
 * - Full-width carousel with smooth transitions (800ms)
 * - Overlay gradient (white to transparent) for text readability
 * - Auto-advance every 5 seconds with pause on hover
 * - Navigation arrows for manual control
 * - Responsive design with mobile-first approach
 */

const slides = [
  {
    id: 1,
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663314340523/ejtgptjSpVyoErAv.jpg',
    title: 'Regala Amor',
    subtitle: 'Rosas Premium de Lujo',
    description: 'Arreglos florales exclusivos que expresan tus sentimientos'
  },
  {
    id: 2,
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663314340523/kAAuZMNUooUnnysS.jpg',
    title: 'Regala Amor',
    subtitle: 'Momentos Inolvidables',
    description: 'Sorprende a quien amas con nuestros regalos exclusivos'
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 8000);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-background"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-800 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />

          {/* Overlay Gradient - White to Transparent */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-start px-8 md:px-16 lg:px-24">
            <div className="max-w-2xl space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                {slide.title}
                <br />
                <span className="text-primary">Inolvidable</span>
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 font-light">
                {slide.description}
              </p>
              <button className="inline-block px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl">
                Enviar este regalo
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/80 hover:bg-white text-foreground rounded-full transition-all duration-300 hover:shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/80 hover:bg-white text-foreground rounded-full transition-all duration-300 hover:shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'bg-primary w-8 h-2'
                : 'bg-white/50 hover:bg-white/70 w-2 h-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute text-primary/10 text-6xl animate-float"
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
              animationDelay: `${i * 1.5}s`,
            }}
          >
            ♥
          </div>
        ))}
      </div>
    </div>
  );
}
