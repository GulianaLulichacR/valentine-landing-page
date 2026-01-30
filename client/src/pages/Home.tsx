import HeroCarousel from '@/components/HeroCarousel';
import CollectionSection from '@/components/CollectionSection';
import FeaturesSection from '@/components/FeaturesSection';
import CTASection from '@/components/CTASection';
import WhatsAppButton from '@/components/WhatsAppButton';
import Navbar from '@/components/Navbar';

/**
 * Home Page - Valentine's Day Landing Page
 * 
 * Design Philosophy: Elegancia Minimalista Moderna
 * - Hero carousel with smooth transitions and overlay
 * - Product collection grid with hover effects
 * - Features section with scroll animations
 * - CTA section with call-to-action
 * - Floating WhatsApp button for immediate assistance
 * - Responsive design for all devices
 * - Subtle animations and micro-interactions
 */

const products = [
  {
    id: '1',
    title: 'Rosas Premium Rojas',
    image: '/images/hero-carousel-1.jpg',
    price: '$89.99',
    badge: 'best-seller' as const,
    complements: ['Trufas Belgas', 'Peluche de Lujo', 'Carta Manuscrita', 'Globos Decorativos']
  },
  {
    id: '2',
    title: 'Arreglo Floral Romántico',
    image: '/images/product-collection-hero.jpg',
    price: '$129.99',
    badge: 'limited-edition' as const,
    complements: ['Chocolates Premium', 'Peluche Blanco', 'Tarjeta Personalizada', 'Cinta de Seda']
  },
  {
    id: '3',
    title: 'Ramo Mixto Elegante',
    image: '/images/complementos-detail.jpg',
    price: '$99.99',
    complements: ['Trufas Gourmet', 'Peluche Mediano', 'Carta de Amor', 'Papel de Seda']
  },
  {
    id: '4',
    title: 'Rosas Blancas Sofisticadas',
    image: '/images/hero-carousel-2.jpg',
    price: '$109.99',
    complements: ['Chocolates Artesanales', 'Peluche Premium', 'Sobre Decorado', 'Cinta Dorada']
  },
  {
    id: '5',
    title: 'Arreglo Floral Pasional',
    image: '/images/hero-carousel-1.jpg',
    price: '$149.99',
    badge: 'limited-edition' as const,
    complements: ['Bombones Franceses', 'Peluche Gigante', 'Tarjeta Manuscrita', 'Globos de Helio']
  },
  {
    id: '6',
    title: 'Ramo Delicado Romántico',
    image: '/images/product-collection-hero.jpg',
    price: '$119.99',
    complements: ['Trufas Suizas', 'Peluche Pequeño', 'Carta Personalizada', 'Cinta de Terciopelo']
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Collection Section */}
      <CollectionSection products={products} />

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <CTASection />

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
