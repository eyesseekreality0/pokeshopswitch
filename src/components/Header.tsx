import React, { useState } from 'react';
import { ShoppingCart, Menu, Zap, Star, X } from 'lucide-react';

interface HeaderProps {
  onCartToggle: () => void;
  cartItemCount: number;
  onNavigate: (category: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onCartToggle, cartItemCount, onNavigate }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigationItems = [
    { label: 'All Games', action: () => onNavigate('all') },
    { label: 'New Releases', action: () => onNavigate('new') },
    { label: 'Popular Games', action: () => onNavigate('popular') },
    { label: 'Generation 4', action: () => onNavigate('gen4') },
    { label: 'Generation 7', action: () => onNavigate('gen7') },
    { label: 'Generation 8', action: () => onNavigate('gen8') },
    { label: 'Generation 9', action: () => onNavigate('gen9') }
  ];

  return (
    <header className="bg-pokemon-red comic-border border-b-8 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 neon-border">
      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 group cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <div className="relative">
              <Zap className="w-8 h-8 text-pokemon-yellow lightning-animation neon-glow" />
              <Star className="w-4 h-4 text-white absolute -top-1 -right-1 animate-pulse neon-glow" />
            </div>
            <div className="text-white">
              <h1 className="comic-font text-2xl md:text-3xl text-pokemon-yellow 
                           transform group-hover:scale-105 transition-transform duration-300 neon-text">
                POKESHOP
              </h1>
              <p className="comic-text text-xs -mt-1 text-white">
                Nintendo Switch Games!
              </p>
            </div>
          </button>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-white hover:text-pokemon-yellow 
                       transition-colors duration-300 hover:scale-110 transform neon-hover"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Cart */}
            <button
              onClick={onCartToggle}
              className="relative text-white hover:text-pokemon-yellow 
                       transition-all duration-300 transform hover:scale-110 
                       comic-button neon-hover"
            >
              <ShoppingCart className="w-7 h-7" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pokemon-yellow 
                               text-black text-xs font-bold rounded-full w-6 h-6 
                               flex items-center justify-center comic-border 
                               animate-bounce neon-glow">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-black bg-opacity-50 border-t-2 border-pokemon-yellow backdrop-blur-sm">
        <div className="container mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-6 py-2">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="text-white hover:text-pokemon-yellow whitespace-nowrap
                         comic-text font-bold transition-all duration-300 
                         hover:transform hover:scale-110 px-2 py-1 rounded-lg
                         hover:bg-pokemon-yellow hover:bg-opacity-20 neon-hover text-sm"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="md:hidden py-3 animate-bounce-in">
              <div className="grid grid-cols-2 gap-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.action();
                      setShowMobileMenu(false);
                    }}
                    className="text-white hover:text-pokemon-yellow text-center
                             comic-text font-bold transition-all duration-300 
                             hover:transform hover:scale-105 px-2 py-1 rounded-lg
                             hover:bg-pokemon-yellow hover:bg-opacity-20 text-xs neon-hover"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;