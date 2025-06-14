import React, { useState } from 'react';
import { ShoppingCart, ExternalLink, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { useShopifyProducts, useShopifyCart } from '../hooks/useShopify';
import { shopifyService } from '../services/shopify';

const ShopifyIntegration: React.FC = () => {
  const { products, loading: productsLoading, error: productsError } = useShopifyProducts();
  const { cart, loading: cartLoading, error: cartError, addToCart, checkout } = useShopifyCart();
  const [showSetup, setShowSetup] = useState(false);

  const isConfigured = shopifyService.isConfigured();

  if (!isConfigured) {
    return (
      <div className="bg-gray-800 bg-opacity-95 comic-border rounded-2xl p-6 backdrop-blur-sm">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-pokemon-yellow" />
            <h3 className="comic-font text-2xl text-pokemon-yellow">Shopify Setup Required</h3>
          </div>
          
          <div className="bg-gray-700 bg-opacity-80 rounded-xl p-4 mb-6">
            <p className="comic-text text-white mb-4">
              To enable real payments and inventory management, connect your Shopify store:
            </p>
            
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pokemon-yellow text-black rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="comic-text text-white font-bold">Create a Shopify Store</p>
                  <p className="comic-text text-gray-300 text-sm">Sign up at shopify.com and set up your store</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pokemon-yellow text-black rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="comic-text text-white font-bold">Get Storefront Access Token</p>
                  <p className="comic-text text-gray-300 text-sm">Go to Apps → Manage private apps → Create private app</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pokemon-yellow text-black rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="comic-text text-white font-bold">Add Environment Variables</p>
                  <p className="comic-text text-gray-300 text-sm">Create .env file with your Shopify credentials</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSetup(!showSetup)}
            className="bg-pokemon-yellow hover:bg-yellow-400 text-black font-bold 
                     py-3 px-6 rounded-full comic-border comic-text text-lg 
                     transform hover:scale-105 transition-all duration-300 comic-button"
          >
            {showSetup ? 'Hide Setup' : 'Show Setup Instructions'}
          </button>

          {showSetup && (
            <div className="mt-6 bg-gray-700 bg-opacity-80 rounded-xl p-4 text-left">
              <h4 className="comic-text font-bold text-white mb-3">Environment Variables (.env file):</h4>
              <div className="bg-black bg-opacity-50 rounded-lg p-3 font-mono text-sm">
                <div className="text-gray-300">
                  <div className="text-pokemon-yellow"># Add these to your .env file</div>
                  <div>VITE_SHOPIFY_DOMAIN=your-shop-name.myshopify.com</div>
                  <div>VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_access_token</div>
                </div>
              </div>
              <p className="comic-text text-gray-300 text-sm mt-2">
                Replace with your actual Shopify domain and storefront access token
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Shopify Status */}
      <div className="bg-gray-800 bg-opacity-95 comic-border rounded-2xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <div>
            <h3 className="comic-font text-lg text-pokemon-yellow">Shopify Connected</h3>
            <p className="comic-text text-gray-300 text-sm">
              Real payments and inventory management enabled
            </p>
          </div>
        </div>
      </div>

      {/* Products Status */}
      {productsLoading && (
        <div className="bg-gray-800 bg-opacity-95 comic-border rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="animate-spin w-6 h-6 border-2 border-pokemon-yellow border-t-transparent rounded-full"></div>
            <p className="comic-text text-white">Loading Shopify products...</p>
          </div>
        </div>
      )}

      {productsError && (
        <div className="bg-gray-800 bg-opacity-95 comic-border rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <div>
              <p className="comic-text text-red-400 font-bold">Shopify Error</p>
              <p className="comic-text text-gray-300 text-sm">{productsError}</p>
            </div>
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div className="bg-gray-800 bg-opacity-95 comic-border rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-pokemon-yellow" />
              <div>
                <h3 className="comic-font text-lg text-pokemon-yellow">
                  {products.length} Products Synced
                </h3>
                <p className="comic-text text-gray-300 text-sm">
                  Products loaded from your Shopify store
                </p>
              </div>
            </div>
            
            {cart && (
              <button
                onClick={checkout}
                disabled={cartLoading || !cart.lineItems.length}
                className="bg-pokemon-red hover:bg-red-600 text-white font-bold 
                         py-2 px-4 rounded-full comic-border comic-text 
                         transform hover:scale-105 transition-all duration-300 
                         comic-button flex items-center gap-2 disabled:opacity-50"
              >
                <ExternalLink className="w-4 h-4" />
                Shopify Checkout
              </button>
            )}
          </div>
        </div>
      )}

      {/* Cart Status */}
      {cart && (
        <div className="bg-gray-800 bg-opacity-95 comic-border rounded-2xl p-4 backdrop-blur-sm">
          <h4 className="comic-font text-lg text-pokemon-yellow mb-3">Shopify Cart Status</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="comic-text text-gray-300">Items:</span>
              <span className="comic-text text-white font-bold">{cart.lineItems.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="comic-text text-gray-300">Subtotal:</span>
              <span className="comic-text text-pokemon-yellow font-bold">
                ${cart.subtotalPrice.amount} {cart.subtotalPrice.currencyCode}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="comic-text text-gray-300">Total:</span>
              <span className="comic-text text-pokemon-yellow font-bold text-lg">
                ${cart.totalPrice.amount} {cart.totalPrice.currencyCode}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopifyIntegration;