import React, { useState } from 'react';
import { Zap, CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { CartItem } from '../types';
import { useSpeedCheckout, CustomerInfo, ShippingInfo } from '../hooks/useSpeedCheckout';

interface SpeedCheckoutButtonProps {
  cartItems: CartItem[];
  totalAmount: number;
  onSuccess?: (response: any) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

const SpeedCheckoutButton: React.FC<SpeedCheckoutButtonProps> = ({
  cartItems,
  totalAmount,
  onSuccess,
  onError,
  disabled = false,
  className = ''
}) => {
  const { 
    checkoutState, 
    isSpeedReady, 
    processCheckout, 
    resetCheckout,
    getSpeedStatus 
  } = useSpeedCheckout();

  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({});
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    address1: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });

  const handleSpeedCheckout = async () => {
    if (!isSpeedReady) {
      onError?.('Speed Checkout is not available');
      return;
    }

    if (cartItems.length === 0) {
      onError?.('Cart is empty');
      return;
    }

    // For demo purposes, we'll use minimal customer info
    // In production, you'd collect this from a form
    const demoCustomerInfo: CustomerInfo = {
      email: customerInfo.email || 'customer@example.com',
      firstName: customerInfo.firstName || 'Pokemon',
      lastName: customerInfo.lastName || 'Trainer'
    };

    const demoShippingInfo: ShippingInfo = {
      address1: shippingInfo.address1 || '123 Pokemon Center',
      city: shippingInfo.city || 'Pallet Town',
      state: shippingInfo.state || 'Kanto',
      zip: shippingInfo.zip || '12345',
      country: shippingInfo.country || 'US'
    };

    try {
      const response = await processCheckout(
        cartItems,
        demoCustomerInfo,
        demoShippingInfo,
        {
          orderType: 'pokemon-games',
          platform: 'web'
        }
      );

      if (response.success) {
        onSuccess?.(response);
      } else {
        onError?.(response.error?.message || 'Checkout failed');
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Checkout error');
    }
  };

  const speedStatus = getSpeedStatus();

  // Show status indicator if Speed is not ready
  if (!speedStatus.sdkLoaded) {
    return (
      <div className="bg-gray-700 bg-opacity-80 rounded-lg p-4 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-pokemon-yellow" />
        <p className="comic-text text-sm text-gray-300">Loading Speed Checkout...</p>
      </div>
    );
  }

  if (!speedStatus.configLoaded || !speedStatus.initialized) {
    return (
      <div className="bg-gray-700 bg-opacity-80 rounded-lg p-4 text-center">
        <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-400" />
        <p className="comic-text text-sm text-red-400 font-bold">Speed Checkout Unavailable</p>
        <p className="comic-text text-xs text-gray-300 mt-1">
          Configure VITE_SPEED_API_KEY in environment variables
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Speed Checkout Status */}
      <div className="bg-gray-700 bg-opacity-80 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="comic-text text-sm text-green-400 font-bold">Speed Checkout Ready</span>
        </div>
        <div className="text-xs text-gray-300 space-y-1">
          <div>✅ SDK Loaded: {speedStatus.sdkLoaded ? 'Yes' : 'No'}</div>
          <div>✅ Configured: {speedStatus.configLoaded ? 'Yes' : 'No'}</div>
          <div>✅ Initialized: {speedStatus.initialized ? 'Yes' : 'No'}</div>
        </div>
      </div>

      {/* Customer Info Form (Optional) */}
      {showCustomerForm && (
        <div className="bg-gray-700 bg-opacity-80 rounded-lg p-4 space-y-3">
          <h4 className="comic-text font-bold text-white">Customer Information</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="First Name"
              value={customerInfo.firstName || ''}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-gray-600 text-white comic-text text-sm"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={customerInfo.lastName || ''}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-gray-600 text-white comic-text text-sm"
            />
          </div>
          
          <input
            type="email"
            placeholder="Email Address"
            value={customerInfo.email || ''}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg bg-gray-600 text-white comic-text text-sm"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="City"
              value={shippingInfo.city}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-gray-600 text-white comic-text text-sm"
            />
            <input
              type="text"
              placeholder="State"
              value={shippingInfo.state}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-gray-600 text-white comic-text text-sm"
            />
          </div>
        </div>
      )}

      {/* Toggle Customer Form */}
      <button
        onClick={() => setShowCustomerForm(!showCustomerForm)}
        className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold 
                 py-2 px-4 rounded-lg comic-border comic-text text-sm 
                 transform hover:scale-105 transition-all duration-300"
      >
        {showCustomerForm ? 'Hide' : 'Add'} Customer Info
      </button>

      {/* Main Speed Checkout Button */}
      <button
        onClick={handleSpeedCheckout}
        disabled={disabled || checkoutState.loading || !isSpeedReady || cartItems.length === 0}
        className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
                   text-white font-bold py-4 px-6 rounded-full comic-border comic-text text-lg 
                   transform hover:scale-105 transition-all duration-300 comic-button comic-shadow 
                   flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed
                   ${className}`}
      >
        {checkoutState.loading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            PROCESSING...
          </>
        ) : (
          <>
            <Zap className="w-6 h-6" />
            SPEED CHECKOUT - ${totalAmount.toFixed(2)}
          </>
        )}
      </button>

      {/* Checkout Status Messages */}
      {checkoutState.error && (
        <div className="bg-red-600 bg-opacity-80 rounded-lg p-3 text-center">
          <AlertCircle className="w-5 h-5 mx-auto mb-2 text-white" />
          <p className="comic-text text-sm text-white font-bold">Checkout Error</p>
          <p className="comic-text text-xs text-red-200 mt-1">{checkoutState.error}</p>
          <button
            onClick={resetCheckout}
            className="mt-2 bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded-lg 
                     comic-text text-xs transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      )}

      {checkoutState.success && checkoutState.response && (
        <div className="bg-green-600 bg-opacity-80 rounded-lg p-3 text-center">
          <CheckCircle className="w-5 h-5 mx-auto mb-2 text-white" />
          <p className="comic-text text-sm text-white font-bold">Payment Successful!</p>
          {checkoutState.response.transactionId && (
            <p className="comic-text text-xs text-green-200 mt-1">
              Transaction ID: {checkoutState.response.transactionId}
            </p>
          )}
        </div>
      )}

      {/* Speed Checkout Info */}
      <div className="text-center">
        <p className="comic-text text-xs text-gray-400">
          ⚡ Powered by Speed Commerce • Secure & Fast Checkout
        </p>
      </div>
    </div>
  );
};

export default SpeedCheckoutButton;