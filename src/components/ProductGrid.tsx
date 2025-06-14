import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title: string;
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, title, onAddToCart }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="speech-bubble inline-block">
          <p className="comic-text text-xl text-gray-600">
            No Pokemon games found! Try adjusting your search.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-4 md:py-8">
      <div className="container mx-auto px-2 md:px-4">
        <div className="text-center mb-4 md:mb-8">
          <h2 className="comic-font text-2xl md:text-3xl lg:text-4xl text-pokemon-red mb-2 md:mb-4 
                       transform hover:scale-105 transition-transform duration-300">
            {title}
          </h2>
          <div className="w-16 md:w-24 h-1 bg-pokemon-yellow mx-auto rounded-full"></div>
        </div>

        {/* Optimized Grid - More games visible on all screen sizes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8
                        gap-2 md:gap-3 lg:gap-4 auto-rows-fr">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;