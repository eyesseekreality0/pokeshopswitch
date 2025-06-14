import React from 'react';
import { 
  Facebook, 
  Mail, 
  Phone, 
  MapPin, 
  Zap
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const quickLinks = [
    { label: 'Pokemon History', action: () => onNavigate('pokemon-history') },
    { label: 'Game Generations', action: () => onNavigate('game-generations') }, 
    { label: 'Nintendo Switch Info', action: () => onNavigate('nintendo-switch') },
    { label: 'Pokemon Trading', action: () => onNavigate('pokemon-trading') },
    { label: 'Game Reviews', action: () => onNavigate('game-reviews') },
    { label: 'Pokemon Community', action: () => onNavigate('pokemon-community') }
  ];

  const handleContactClick = (type: string) => {
    switch (type) {
      case 'phone':
        window.open('tel:1-800-POKEMON');
        break;
      case 'email':
        window.open('mailto:support@pokeshop.com');
        break;
      default:
        break;
    }
  };

  return (
    <footer className="bg-pokemon-red bg-opacity-95 text-white backdrop-blur-sm">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300"
            >
              <Zap className="w-8 h-8 text-pokemon-yellow lightning-animation" />
              <h3 className="comic-font text-3xl text-pokemon-yellow">POKESHOP</h3>
            </button>
            <p className="comic-text text-pokemon-yellow font-bold">
              Nintendo Switch Pokemon Games!
            </p>
            <p className="comic-text text-sm leading-relaxed">
              Your ultimate destination for authentic Pokemon games for Nintendo Switch. 
              We specialize in digital and physical Pokemon game sales with competitive pricing!
            </p>
            
            {/* Social Media - Facebook Only */}
            <div className="flex space-x-4 pt-4">
              <button
                onClick={() => window.open('https://facebook.com', '_blank', 'noopener,noreferrer')}
                className="bg-pokemon-yellow text-black p-2 rounded-full 
                         hover:bg-yellow-400 transition-all duration-300 
                         transform hover:scale-110 comic-border group"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5 group-hover:animate-bounce" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="comic-font text-xl text-pokemon-yellow">POKEMON INFO</h4>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="block comic-text hover:text-pokemon-yellow 
                           transition-all duration-300 hover:translate-x-2 
                           transform text-left w-full"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="comic-font text-xl text-pokemon-yellow">CONTACT INFO</h4>
            
            <div className="space-y-3">
              <button
                onClick={() => handleContactClick('phone')}
                className="flex items-center space-x-3 hover:text-pokemon-yellow 
                         transition-colors duration-300 group w-full text-left"
              >
                <Phone className="w-5 h-5 text-pokemon-yellow group-hover:animate-bounce" />
                <div>
                  <p className="comic-text font-bold">1-800-POKEMON</p>
                  <p className="comic-text text-sm">Mon-Fri 9AM-9PM EST</p>
                </div>
              </button>
              
              <button
                onClick={() => handleContactClick('email')}
                className="flex items-center space-x-3 hover:text-pokemon-yellow 
                         transition-colors duration-300 group w-full text-left"
              >
                <Mail className="w-5 h-5 text-pokemon-yellow group-hover:animate-bounce" />
                <div>
                  <p className="comic-text font-bold">support@pokeshop.com</p>
                  <p className="comic-text text-sm">24/7 Email Support</p>
                </div>
              </button>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-pokemon-yellow" />
                <div>
                  <p className="comic-text font-bold">Digital Store</p>
                  <p className="comic-text text-sm">Worldwide Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-black bg-opacity-30 py-4 border-t-2 border-pokemon-yellow">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="comic-text text-sm">
              © 2025 PokeShop. All rights reserved. Independent game retailer.
            </p>
            
            <div className="flex items-center space-x-4 text-sm comic-text">
              <button 
                onClick={() => alert('Privacy Policy - This would open the privacy policy page')}
                className="hover:text-pokemon-yellow transition-colors duration-300"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button 
                onClick={() => alert('Terms of Service - This would open the terms page')}
                className="hover:text-pokemon-yellow transition-colors duration-300"
              >
                Terms of Service
              </button>
              <span>•</span>
              <button 
                onClick={() => handleContactClick('email')}
                className="hover:text-pokemon-yellow transition-colors duration-300"
              >
                Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;