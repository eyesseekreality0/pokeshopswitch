import React from 'react';
import { Zap } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
  onViewGames: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopNow, onViewGames }) => {
  return (
    <section className="relative py-8 md:py-12 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-pokemon-yellow 
                        rounded-full animate-float opacity-20"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 border-4 border-white 
                        rounded-full animate-bounce opacity-30"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-pokemon-yellow 
                        rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-20 right-1/4 w-8 h-8 bg-white 
                        rounded-full animate-ping opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Hero Content */}
          <div className="speech-bubble inline-block bounce-in mb-4 bg-opacity-90 backdrop-blur-sm">
            <h1 className="comic-font text-3xl md:text-5xl text-pokemon-red mb-3 
                         transform hover:scale-105 transition-transform duration-300">
              NINTENDO SWITCH POKEMON!
            </h1>
            <p className="comic-text text-lg md:text-xl text-white font-bold">
              The Ultimate Pokemon Game Collection for Nintendo Switch!
            </p>
          </div>

          {/* Lightning Bolt Logo */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Zap className="w-20 h-20 md:w-24 md:h-24 text-pokemon-yellow lightning-animation 
                           drop-shadow-2xl" />
              <div className="absolute inset-0 bg-pokemon-yellow rounded-full blur-xl opacity-30 
                            animate-pulse"></div>
            </div>
          </div>

          {/* Hero Description */}
          <div className="bg-gray-800 bg-opacity-90 comic-border rounded-2xl p-4 md:p-6 mb-6 comic-shadow 
                          transform hover:rotate-1 transition-transform duration-300 backdrop-blur-sm">
            <p className="comic-text text-base md:text-lg text-white font-bold leading-relaxed">
              Authentic Pokemon Games for Nintendo Switch! 
              From classic remakes to the latest adventures. 
              <span className="text-pokemon-yellow"> Choose your own prices</span>, 
              <span className="text-pokemon-red"> authentic products</span>, and 
              <span className="text-pokemon-yellow"> instant digital delivery!</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button 
              onClick={onShopNow}
              className="bg-pokemon-yellow hover:bg-yellow-400 text-black font-bold 
                       py-3 px-6 rounded-full comic-border comic-text text-lg 
                       transform hover:scale-105 transition-all duration-300 
                       comic-button comic-shadow"
            >
              START SHOPPING NOW!
            </button>
            <button 
              onClick={onViewGames}
              className="bg-gray-800 bg-opacity-90 hover:bg-gray-700 text-white font-bold 
                       py-3 px-6 rounded-full comic-border comic-text text-lg 
                       transform hover:scale-105 transition-all duration-300 
                       comic-button backdrop-blur-sm"
            >
              VIEW ALL GAMES
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;