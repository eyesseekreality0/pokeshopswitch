import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { featuredProducts } from '../data/products';

interface FeaturedCarouselProps {
  onAddToCart: (product: Product) => void;
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ onAddToCart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const currentProduct = featuredProducts[currentIndex];

  const handleAddToCart = () => {
    if (currentProduct) {
      onAddToCart(currentProduct);
    }
  };

  if (!currentProduct) return null;

  return (
    <section className="py-12 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-pokemon-yellow 
                        rounded-full animate-float opacity-30 neon-glow"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 border-4 border-white 
                        rounded-full animate-bounce opacity-40 neon-glow"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-pokemon-yellow 
                        rounded-full animate-pulse opacity-50 neon-glow"></div>
        <div className="absolute top-20 right-1/4 w-8 h-8 bg-pokemon-red 
                        rounded-full animate-ping opacity-60 neon-glow"></div>
        <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-white 
                        rounded-full floating-particles opacity-70 neon-glow"></div>
        <div className="absolute top-1/3 right-1/3 w-10 h-10 border-2 border-pokemon-yellow 
                        rounded-full animate-spin opacity-40 neon-glow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="comic-font text-3xl md:text-4xl text-white mb-3 
                       transform hover:scale-105 transition-transform duration-300 animate-bounce-in neon-text">
            FEATURED POKEMON GAMES
          </h2>
          <p className="comic-text text-lg text-pokemon-yellow font-bold animate-pulse neon-text">
            Premium collection of Nintendo Switch games!
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Enhanced Main Carousel */}
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 bg-opacity-95 comic-border rounded-3xl overflow-hidden 
                          comic-shadow transform hover:scale-105 transition-all duration-500
                          border-4 border-pokemon-yellow shadow-2xl shadow-pokemon-yellow/20 backdrop-blur-sm neon-border">
            <div className="grid md:grid-cols-2">
              {/* Enhanced Product Image */}
              <div className="relative group overflow-hidden">
                <img
                  src={currentProduct.image}
                  alt={`${currentProduct.name} - Featured Pokemon Game`}
                  className="w-full h-48 md:h-64 object-cover transition-transform duration-700 
                           group-hover:scale-110"
                />
                
                {/* Enhanced Floating Elements */}
                <div className="absolute top-4 left-4 w-6 h-6 bg-pokemon-yellow rounded-full 
                               animate-bounce opacity-80 neon-glow"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 bg-pokemon-red rounded-full 
                               animate-ping opacity-70 neon-glow"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Sparkles className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 
                                     transition-opacity duration-500 animate-pulse neon-glow" />
                </div>
                
                {/* Enhanced Category Badge */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 
                               bg-gradient-to-r from-pokemon-red to-red-600 text-white px-4 py-2 rounded-full 
                               comic-text font-bold text-sm transform rotate-12 
                               animate-pulse shadow-lg neon-glow">
                  FEATURED GAME
                </div>

                {/* Holographic Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent
                               opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Enhanced Product Details */}
              <div className="p-4 md:p-6 flex flex-col justify-center bg-gradient-to-br from-gray-800 to-gray-900 bg-opacity-95 backdrop-blur-sm">
                <div className="mb-3">
                  <h3 className="comic-font text-2xl md:text-3xl text-pokemon-yellow mb-2 
                               animate-bounce-in neon-text">
                    {currentProduct.name}
                  </h3>
                  
                  {/* Enhanced Rating with Stagger Animation */}
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 transition-all duration-300 delay-${i * 100}
                          ${i < Math.floor(currentProduct.rating) 
                            ? 'text-pokemon-yellow fill-current animate-pulse neon-glow' 
                            : 'text-gray-500'}`}
                      />
                    ))}
                    <span className="ml-2 comic-text font-bold text-gray-300 text-lg">
                      ({currentProduct.rating})
                    </span>
                  </div>
                </div>

                <p className="comic-text text-gray-300 mb-4 text-base leading-relaxed">
                  {currentProduct.description}
                </p>

                {/* Enhanced Features with Animation */}
                <div className="mb-4">
                  <h4 className="comic-text font-bold text-white mb-2 text-base">Key Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentProduct.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={feature}
                        className={`bg-gradient-to-r from-pokemon-yellow to-yellow-400 text-black px-3 py-1 rounded-full 
                                 text-sm comic-text font-bold transition-all duration-300
                                 hover:scale-110 delay-${index * 100} shadow-lg neon-hover`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Enhanced Price and Action */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="comic-font text-4xl text-pokemon-yellow animate-pulse neon-text">
                        ${currentProduct.price}
                      </span>
                    </div>
                    <span className="comic-text text-sm text-gray-400">
                      {currentProduct.console} • Generation {currentProduct.generation}
                    </span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="bg-gradient-to-r from-pokemon-red to-red-600 hover:from-red-600 hover:to-red-700 
                             text-white font-bold py-3 px-6 rounded-full comic-border comic-text text-lg 
                             transform hover:scale-110 transition-all duration-300 
                             comic-button comic-shadow animate-bounce flex items-center gap-2 shadow-2xl neon-hover"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 
                     bg-gradient-to-r from-pokemon-yellow to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 
                     p-3 rounded-full comic-border transition-all duration-300 hover:scale-125 comic-shadow
                     animate-pulse hover:animate-none shadow-2xl neon-hover"
          >
            <ChevronLeft className="w-6 h-6 text-black" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 
                     bg-gradient-to-r from-pokemon-yellow to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 
                     p-3 rounded-full comic-border transition-all duration-300 hover:scale-125 comic-shadow
                     animate-pulse hover:animate-none shadow-2xl neon-hover"
          >
            <ChevronRight className="w-6 h-6 text-black" />
          </button>

          {/* Enhanced Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 border-2
                           ${index === currentIndex 
                             ? 'bg-pokemon-yellow border-pokemon-yellow scale-125 animate-pulse shadow-lg shadow-yellow-400/50 neon-glow' 
                             : 'bg-transparent border-white hover:bg-gray-200 hover:scale-110 neon-hover'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCarousel;