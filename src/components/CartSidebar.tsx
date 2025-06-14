import React from 'react';
import { X, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalPrice: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  cartItems,
  totalPrice,
  onUpdateQuantity,
  onRemoveItem
}) => {
  const handleCheckout = () => {
    alert('Redirecting to secure checkout! In a real implementation, this would integrate with your payment processor.');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-gray-800 bg-opacity-95
                      comic-border border-l-8 z-50 transform transition-transform duration-300 
                      backdrop-blur-sm
                      ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="bg-pokemon-red bg-opacity-95 text-white p-4 comic-border border-b-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              <h2 className="comic-font text-2xl">YOUR CART</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-pokemon-yellow transition-colors duration-300 
                       p-1 rounded-full hover:bg-red-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <p className="comic-text mt-1 text-pokemon-yellow">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
          </p>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 max-h-96">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="speech-bubble bg-opacity-90 backdrop-blur-sm">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="comic-text text-lg text-white font-bold">
                  Your cart is empty!
                </p>
                <p className="comic-text text-gray-300 mt-2">
                  Start catching some Pokemon games!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-gray-700 bg-opacity-90 p-4 rounded-2xl comic-border backdrop-blur-sm">
                  <div className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg comic-border"
                    />
                    
                    <div className="flex-1">
                      <h3 className="comic-text font-bold text-pokemon-yellow text-sm mb-1">
                        {item.name}
                      </h3>
                      <p className="comic-text text-xs text-gray-300 mb-2">
                        {item.console} • Gen {item.generation}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-pokemon-red text-white rounded-full 
                                     flex items-center justify-center hover:bg-red-600 
                                     transition-colors duration-300"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <span className="comic-text font-bold text-lg w-8 text-center text-white">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-pokemon-red text-white rounded-full 
                                     flex items-center justify-center hover:bg-red-600 
                                     transition-colors duration-300"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="comic-font text-lg text-pokemon-yellow">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-xs text-red-400 hover:text-red-300 
                                     comic-text underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Total and Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t-4 border-pokemon-yellow p-4 space-y-4 bg-gray-800 bg-opacity-95 backdrop-blur-sm">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="comic-font text-2xl text-white">TOTAL:</span>
              <span className="comic-font text-3xl text-pokemon-yellow">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-pokemon-yellow hover:bg-yellow-400 text-black 
                       font-bold py-4 px-6 rounded-full comic-border comic-text 
                       text-xl transform hover:scale-105 transition-all duration-300 
                       comic-button comic-shadow flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              SECURE CHECKOUT
            </button>

            <p className="text-xs text-gray-400 text-center comic-text">
              SSL Secured • Digital Delivery • Authentic Games
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;