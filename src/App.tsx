import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import CartSidebar from './components/CartSidebar';
import Footer from './components/Footer';
import InfoPage from './components/InfoPage';
import ShopifyIntegration from './components/ShopifyIntegration';
import { useCart } from './hooks/useCart';
import { useShopifyProducts } from './hooks/useShopify';
import { products, debugImagePaths } from './data/products';
import { debugProductImages } from './utils/imageUtils';
import { Product } from './types';
import { shopifyService } from './services/shopify';

function App() {
  const cart = useCart();
  const [currentView, setCurrentView] = useState('home');
  const [currentInfoPage, setCurrentInfoPage] = useState<string | null>(null);
  
  // Shopify integration
  const { products: shopifyProducts, loading: shopifyLoading, error: shopifyError } = useShopifyProducts();
  const isShopifyConfigured = shopifyService.isConfigured();

  // Debug images in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      debugImagePaths();
      debugProductImages(products);
    }
  }, []);

  // Add visual feedback for cart additions and checkout events
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

    const handleCheckoutSuccess = (event: CustomEvent) => {
      const { provider, transactionId, amount } = event.detail;
      
      // Create success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg comic-border comic-text font-bold z-50 animate-bounce-in';
      notification.innerHTML = `
        <div class="text-center">
          <div class="text-lg">✅ Payment Successful!</div>
          <div class="text-sm mt-1">via ${provider.toUpperCase()}</div>
          ${amount ? `<div class="text-xs mt-1">$${amount}</div>` : ''}
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 5000);

      // Clear cart after successful checkout
      cart.clearCart();
    };

    const handleCheckoutError = (event: CustomEvent) => {
      const { provider, error } = event.detail;
      
      // Create error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-4 bg-red-500 text-white px-6 py-3 rounded-lg comic-border comic-text font-bold z-50 animate-bounce-in';
      notification.innerHTML = `
        <div class="text-center">
          <div class="text-lg">❌ Payment Failed</div>
          <div class="text-sm mt-1">via ${provider.toUpperCase()}</div>
          <div class="text-xs mt-1">${error}</div>
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 4000);
    };

    window.addEventListener('cartItemAdded', handleCartItemAdded as EventListener);
    window.addEventListener('checkoutSuccess', handleCheckoutSuccess as EventListener);
    window.addEventListener('checkoutError', handleCheckoutError as EventListener);
    
    return () => {
      window.removeEventListener('cartItemAdded', handleCartItemAdded as EventListener);
      window.removeEventListener('checkoutSuccess', handleCheckoutSuccess as EventListener);
      window.removeEventListener('checkoutError', handleCheckoutError as EventListener);
    };
  }, [cart]);

  // Scroll to top when view changes
  useEffect(() => {
    if (currentView !== 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentView]);

  // Use Shopify products if available, otherwise fall back to local products
  const activeProducts = useMemo(() => {
    if (isShopifyConfigured && shopifyProducts.length > 0) {
      // Transform Shopify products to our format
      return shopifyProducts.map(shopifyProduct => ({
        id: shopifyProduct.id,
        name: shopifyProduct.title,
        price: parseFloat(shopifyProduct.variants[0]?.price.amount || '0'),
        image: shopifyProduct.images[0]?.src || '/placeholder-pokemon.jpg',
        description: shopifyProduct.description,
        console: 'Nintendo Switch',
        generation: parseInt(shopifyProduct.tags.find(tag => tag.startsWith('gen-'))?.replace('gen-', '') || '8'),
        releaseDate: shopifyProduct.createdAt,
        category: shopifyProduct.tags.includes('new') ? 'new' as const : 'popular' as const,
        inStock: shopifyProduct.variants[0]?.available || false,
        rating: 4.5, // Default rating
        features: shopifyProduct.tags.filter(tag => !tag.startsWith('gen-')),
        priceCategory: `$${Math.floor(parseFloat(shopifyProduct.variants[0]?.price.amount || '0') / 10) * 10}-$${Math.floor(parseFloat(shopifyProduct.variants[0]?.price.amount || '0') / 10) * 10 + 10}`
      }));
    }
    return products;
  }, [isShopifyConfigured, shopifyProducts]);

  // Filter and sort products based on current view
  const filteredProducts = useMemo(() => {
    let filtered = [...activeProducts];

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
  }, [currentView, activeProducts]);

  // Organize all products by category, sorted by price
  const organizedProducts = useMemo(() => {
    const allSorted = [...activeProducts].sort((a, b) => a.price - b.price);
    
    return {
      all: allSorted,
      new: allSorted.filter(p => p.category === 'new'),
      popular: allSorted.filter(p => p.category === 'popular'),
      gen4: allSorted.filter(p => p.generation === 4),
      gen7: allSorted.filter(p => p.generation === 7),
      gen8: allSorted.filter(p => p.generation === 8),
      gen9: allSorted.filter(p => p.generation === 9)
    };
  }, [activeProducts]);

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
    const source = isShopifyConfigured && shopifyProducts.length > 0 ? 'Shopify' : 'Local';
    switch (currentView) {
      case 'new':
        return `NEW POKEMON GAMES (${filteredProducts.length} games) - ${source}`;
      case 'popular':
        return `POPULAR POKEMON GAMES (${filteredProducts.length} games) - ${source}`;
      case 'gen4':
        return `GENERATION 4 GAMES (${filteredProducts.length} games) - ${source}`;
      case 'gen7':
        return `GENERATION 7 GAMES (${filteredProducts.length} games) - ${source}`;
      case 'gen8':
        return `GENERATION 8 GAMES (${filteredProducts.length} games) - ${source}`;
      case 'gen9':
        return `GENERATION 9 GAMES (${filteredProducts.length} games) - ${source}`;
      case 'all':
        return `ALL POKEMON GAMES (${filteredProducts.length} games) - ${source}`;
      default:
        return `ALL POKEMON GAMES (${activeProducts.length} games) - ${source}`;
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
        <>
          <Hero 
            onShopNow={handleShopNow}
            onViewGames={handleViewGames}
          />
          
          {/* Shopify Integration Status */}
          <div className="container mx-auto px-4 py-8 relative z-10">
            <ShopifyIntegration />
          </div>
        </>
      )}

      {/* Main Content - Only show games when NOT on home page */}
      {currentView !== 'home' && (
        <main id="products-section" className="container mx-auto px-4 py-4 relative z-10">
          {/* Shopify Loading State */}
          {shopifyLoading && isShopifyConfigured && (
            <div className="text-center py-8">
              <div className="speech-bubble inline-block bg-opacity-90 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="animate-spin w-6 h-6 border-2 border-pokemon-yellow border-t-transparent rounded-full"></div>
                  <p className="comic-text text-lg text-white">Loading products from Shopify...</p>
                </div>
              </div>
            </div>
          )}

          {/* Shopify Error State */}
          {shopifyError && isShopifyConfigured && (
            <div className="text-center py-8">
              <div className="speech-bubble inline-block bg-opacity-90 backdrop-blur-sm">
                <p className="comic-text text-lg text-red-400 font-bold mb-2">Shopify Error</p>
                <p className="comic-text text-white">{shopifyError}</p>
                <p className="comic-text text-gray-300 text-sm mt-2">Showing local products instead</p>
              </div>
            </div>
          )}

          {/* Show single grid for "All Games" page, single category for filtered */}
          <ProductGrid
            products={currentView === 'all' ? organizedProducts.all : filteredProducts}
            title={currentView === 'all' ? `ALL POKEMON GAMES (${organizedProducts.all.length} games)` : getPageTitle()}
            onAddToCart={handleAddToCart}
          />

          {/* Show message if no products found */}
          {currentView !== 'all' && filteredProducts.length === 0 && !shopifyLoading && (
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