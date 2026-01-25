import ProductCard from './ProductCard';

/**
 * CollectionSection Component
 * 
 * Design Philosophy: Elegancia Minimalista Moderna
 * - Grid layout with generous spacing
 * - Section title with decorative gold line
 * - Product cards with hover animations
 * - Responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)
 * - Subtle parallax effect in background
 */

interface Product {
  id: string;
  title: string;
  image: string;
  price: string;
  badge?: 'best-seller' | 'limited-edition';
  complements: string[];
}

interface CollectionSectionProps {
  products: Product[];
}

export default function CollectionSection({ products }: CollectionSectionProps) {
  const handleAddToCart = (productId: string) => {
    console.log(`Added product ${productId} to cart`);
    // TODO: Implement cart functionality
  };

  return (
    <section className="relative py-20 px-4 md:px-8 lg:px-16 bg-white">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-muted/20 rounded-full blur-3xl -z-10 opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 opacity-50" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="h-1 w-12 bg-gradient-to-r from-transparent to-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              Colección Exclusiva
            </span>
            <div className="h-1 w-12 bg-gradient-to-l from-transparent to-primary" />
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Colección San Valentín
          </h2>
          
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Descubre nuestros arreglos florales premium, complementos exclusivos y regalos que expresan el amor de manera inolvidable.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={() => handleAddToCart(product.id)}
            />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center">
        <p className="text-foreground/70 mb-6">
          ¿No encuentras lo que buscas?
        </p>
        <button className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl">
          Ver más colecciones
        </button>
      </div>
    </section>
  );
}
