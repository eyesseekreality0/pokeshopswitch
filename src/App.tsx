import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import CartSidebar from './components/CartSidebar';
import Footer from './components/Footer';
import InfoPage from './components/InfoPage';
import { useCart } from './hooks/useCart';
import { products } from './data/products';
import { Product } from './types';

function App() {
  const cart = useCart();
  const [currentView, setCurrentView] = useState('home');
  const [currentInfoPage, setCurrentInfoPage] = useState<string | null>(null);

  // Add visual feedback for cart additions
  useEffect(() => {
    const handleCartItemAdded = (event: CustomEvent) => {
      // Create floating notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-4 bg-pokemon-yellow text-black px-4 py-2 rounded-full comic-border comic-text font-bold z-50 animate-bounce-in';
      notification.textContent = 'Added to cart!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 2000);
    };

    window.addEventListener('cartItemAdded', handleCartItemAdded as EventListener);
    return () => {
      window.removeEventListener('cartItemAdded', handleCartItemAdded as EventListener);
    };
  }, []);

  // Scroll to top when view changes
  useEffect(() => {
    if (currentView !== 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentView]);

  // Filter and sort products based on current view
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply view-specific filtering
    switch (currentView) {
      case 'new':
        filtered = filtered.filter(p => p.category === 'new');
        break;
      case 'popular':
        filtered = filtered.filter(p => p.category === 'popular');
        break;
      case 'gen4':
        filtered = filtered.filter(p => p.generation === 4);
        break;
      case 'gen7':
        filtered = filtered.filter(p => p.generation === 7);
        break;
      case 'gen8':
        filtered = filtered.filter(p => p.generation === 8);
        break;
      case 'gen9':
        filtered = filtered.filter(p => p.generation === 9);
        break;
      default:
        // 'all' or 'home' - show all products
        break;
    }

    // Sort by price (lowest to highest)
    return filtered.sort((a, b) => a.price - b.price);
  }, [currentView]);

  // Organize all products by category, sorted by price
  const organizedProducts = useMemo(() => {
    const allSorted = [...products].sort((a, b) => a.price - b.price);
    
    return {
      all: allSorted,
      new: allSorted.filter(p => p.category === 'new'),
      popular: allSorted.filter(p => p.category === 'popular'),
      gen4: allSorted.filter(p => p.generation === 4),
      gen7: allSorted.filter(p => p.generation === 7),
      gen8: allSorted.filter(p => p.generation === 8),
      gen9: allSorted.filter(p => p.generation === 9)
    };
  }, []);

  const handleNavigate = (category: string) => {
    setCurrentView(category);
    setCurrentInfoPage(null);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInfoPageNavigate = (page: string) => {
    setCurrentInfoPage(page);
    setCurrentView('info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentInfoPage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShopNow = () => {
    setCurrentView('all');
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewGames = () => {
    setCurrentView('all');
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = (product: Product) => {
    cart.addToCart(product, 1);
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'new':
        return `NEW POKEMON GAMES (${filteredProducts.length} games)`;
      case 'popular':
        return `POPULAR POKEMON GAMES (${filteredProducts.length} games)`;
      case 'gen4':
        return `GENERATION 4 GAMES (${filteredProducts.length} games)`;
      case 'gen7':
        return `GENERATION 7 GAMES (${filteredProducts.length} games)`;
      case 'gen8':
        return `GENERATION 8 GAMES (${filteredProducts.length} games)`;
      case 'gen9':
        return `GENERATION 9 GAMES (${filteredProducts.length} games)`;
      case 'all':
        return `ALL POKEMON GAMES (${filteredProducts.length} games)`;
      default:
        return `ALL POKEMON GAMES (${products.length} games)`;
    }
  };

  // If we're on an info page, show that instead
  if (currentView === 'info' && currentInfoPage) {
    return (
      <div className="min-h-screen relative overflow-x-hidden">
        {/* Animated Background */}
        <div 
          className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat animate-background-drift"
          style={{
            backgroundImage: `url('/background.png')`,
            backgroundSize: '120%',
            animation: 'background-drift 30s ease-in-out infinite'
          }}
        />
        
        {/* Background Overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-[1px]" />

        {/* Header */}
        <Header 
          onCartToggle={cart.toggleCart}
          cartItemCount={cart.totalItems}
          onNavigate={handleNavigate}
        />

        {/* Info Page Content */}
        <InfoPage 
          page={currentInfoPage} 
          onBackToHome={handleBackToHome}
        />

        {/* Cart Sidebar */}
        <CartSidebar
          isOpen={cart.isOpen}
          onClose={() => cart.setIsOpen(false)}
          cartItems={cart.cartItems}
          totalPrice={cart.totalPrice}
          onUpdateQuantity={cart.updateQuantity}
          onRemoveItem={cart.removeFromCart}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Animated Background */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat animate-background-drift"
        style={{
          backgroundImage: `url('/background.png')`,
          backgroundSize: '120%',
          animation: 'background-drift 30s ease-in-out infinite'
        }}
      />
      
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-[1px]" />

      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-pokemon-yellow rounded-full floating-particles opacity-30"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-pokemon-red rounded-full floating-particles opacity-40 delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-5 h-5 bg-pokemon-blue rounded-full floating-particles opacity-35 delay-2000"></div>
        <div className="absolute top-60 right-1/3 w-2 h-2 bg-white rounded-full floating-particles opacity-50 delay-1500"></div>
        <div className="absolute bottom-20 right-10 w-6 h-6 border-2 border-pokemon-yellow rounded-full floating-particles opacity-40 delay-500"></div>
        <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-purple-500 rounded-full floating-particles opacity-45 delay-800"></div>
      </div>

      {/* Header */}
      <Header 
        onCartToggle={cart.toggleCart}
        cartItemCount={cart.totalItems}
        onNavigate={handleNavigate}
      />

      {/* Hero Section - Only show on home view */}
      {currentView === 'home' && (
        <Hero 
          onShopNow={handleShopNow}
          onViewGames={handleViewGames}
        />
      )}

      {/* Main Content - Only show games when NOT on home page */}
      {currentView !== 'home' && (
        <main id="products-section" className="container mx-auto px-4 py-4 relative z-10">
          {/* Show single grid for "All Games" page, single category for filtered */}
          <ProductGrid
            products={currentView === 'all' ? organizedProducts.all : filteredProducts}
            title={currentView === 'all' ? `ALL POKEMON GAMES (${organizedProducts.all.length} games)` : getPageTitle()}
            onAddToCart={handleAddToCart}
          />

          {/* Show message if no products found */}
          {currentView !== 'all' && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="speech-bubble inline-block epic-entrance bg-opacity-90 backdrop-blur-sm">
                <h3 className="comic-font text-3xl text-pokemon-red mb-4">
                  No Pokemon Games Found!
                </h3>
                <p className="comic-text text-lg text-white mb-4">
                  Try selecting a different category to find more games.
                </p>
                <button
                  onClick={() => {
                    setCurrentView('all');
                  }}
                  className="bg-pokemon-yellow hover:bg-yellow-400 text-black font-bold 
                           py-3 px-6 rounded-full comic-border comic-text text-lg 
                           transform hover:scale-105 transition-all duration-300 comic-button"
                >
                  Reset & Show All Games
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <Footer onNavigate={handleInfoPageNavigate} />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={cart.isOpen}
        onClose={() => cart.setIsOpen(false)}
        cartItems={cart.cartItems}
        totalPrice={cart.totalPrice}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeFromCart}
      />
    </div>
  );
}

export default App;