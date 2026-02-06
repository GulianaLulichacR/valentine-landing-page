import { useState, useEffect } from 'react';
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

const defaultProducts = [
  {
    id: '1',
    title: 'Rosas Premium Rojas',
    description: 'Rosas rojas de la más alta calidad, perfectas para expresar tu amor y pasión. Cada pétalo es seleccionado cuidadosamente para garantizar belleza y frescura.',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663314340523/ejtgptjSpVyoErAv.jpg',
    price: 'S/. 89.99',
    badge: 'best-seller' as const,
    complements: ['Trufas Belgas', 'Peluche de Lujo', 'Carta Manuscrita', 'Globos Decorativos']
  },
  {
    id: '2',
    title: 'Arreglo Floral Romántico',
    description: 'Un hermoso arreglo que combina rosas, lirios y flores complementarias. Diseñado para crear un ambiente romántico y elegante en cualquier espacio.',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663314340523/XNQuAftRgmyTXNre.jpg',
    price: 'S/. 129.99',
    badge: 'limited-edition' as const,
    complements: ['Chocolates Premium', 'Peluche Blanco', 'Tarjeta Personalizada', 'Cinta de Seda']
  },
  {
    id: '3',
    title: 'Ramo Mixto Elegante',
    description: 'Una mezcla exquisita de flores variadas que crean una composición armoniosa y sofisticada. Perfecto para cualquier ocasión especial.',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663314340523/DUbQRMNVyfIwobBi.jpg',
    price: 'S/. 99.99',
    complements: ['Trufas Gourmet', 'Peluche Mediano', 'Carta de Amor', 'Papel de Seda']
  },
  {
    id: '4',
    title: 'Rosas Blancas Sofisticadas',
    description: 'Rosas blancas que simbolizan la pureza y la elegancia. Un regalo clásico que nunca pasa de moda para expresar tus sentimientos más profundos.',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663314340523/kAAuZMNUooUnnysS.jpg',
    price: 'S/. 109.99',
    complements: ['Chocolates Artesanales', 'Peluche Premium', 'Sobre Decorado', 'Cinta Dorada']
  },
  {
    id: '5',
    title: 'Arreglo Floral Pasional',
    description: 'Una composición apasionada de flores rojas y púrpuras que transmiten intensidad y romance. Ideal para los momentos más importantes.',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663314340523/ejtgptjSpVyoErAv.jpg',
    price: 'S/. 149.99',
    badge: 'limited-edition' as const,
    complements: ['Bombones Franceses', 'Peluche Gigante', 'Tarjeta Manuscrita', 'Globos de Helio']
  },
  {
    id: '6',
    title: 'Ramo Delicado Romántico',
    description: 'Un ramo delicado pero impactante que combina flores suaves con toques de color. Perfecto para demostrar tu amor de manera sutil y elegante.',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663314340523/XNQuAftRgmyTXNre.jpg',
    price: 'S/. 119.99',
    complements: ['Trufas Suizas', 'Peluche Pequeño', 'Carta Personalizada', 'Cinta de Terciopelo']
  }
];

export default function Home() {
  const [products, setProducts] = useState(defaultProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        // Transformar datos de la API al formato esperado
        const transformedProducts = data.map((p: any) => ({
          id: p.id.toString(),
          title: p.name,
          image: p.imageUrl || '/images/hero-carousel-1.jpg',
          price: `S/. ${p.price}`,
          complements: Array.isArray(p.complements) ? p.complements : [],
          badge: p.featured === 1 ? 'best-seller' : undefined,
        }));
        setProducts(transformedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(defaultProducts);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Collection Section */}
      {!loading && <CollectionSection products={products} />}

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <CTASection />

      {/* WhatsApp Button */}
      <WhatsAppButton />
      
      {loading && <div className="text-center py-8">Cargando productos...</div>}
    </div>
  );
}
