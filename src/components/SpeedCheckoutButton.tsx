import React, { useState, useEffect } from 'react';
import { Zap, CreditCard, Loader2, CheckCircle, AlertCircle, QrCode, ExternalLink, Copy, RefreshCw } from 'lucide-react';
import { CartItem } from '../types';
import { useSpeedCheckout, CustomerInfo, ShippingInfo } from '../hooks/useSpeedCheckout';
import { speedCheckoutService, SpeedQRCodeData } from '../services/speedCheckout';

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
    getSpeedStatus,
    convertCartItems
  } = useSpeedCheckout();

  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQRCodeData] = useState<SpeedQRCodeData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'completed' | 'failed'>('pending');
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);

  // Timer for QR code expiration
  useEffect(() => {
    if (qrCodeData && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && qrCodeData) {
      // QR code expired
      handleCloseQRCode();
    }
  }, [timeRemaining, qrCodeData]);

  const handleGenerateQRCode = async () => {
    try {
      if (!speedCheckoutService.isConfigured()) {
        onError?.('Strike Lightning payment is not configured');
        return;
      }

      if (cartItems.length === 0) {
        onError?.('Cart is empty');
        return;
      }

      // Validate total amount matches cart calculation
      const calculatedTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
        console.warn('Amount mismatch detected:', { calculatedTotal, totalAmount });
      }

      console.log('⚡ Starting Strike Lightning checkout process...', {
        totalAmount: totalAmount,
        itemCount: cartItems.length,
        items: cartItems.map(item => ({ name: item.name, price: item.price, quantity: item.quantity }))
      });

      setShowQRCode(true);
      setPaymentStatus('pending');

      // Create Lightning invoice with exact cart amount
      const checkoutData = {
        amount: Number(totalAmount.toFixed(2)), // Ensure proper decimal handling
        currency: 'USD',
        items: convertCartItems(cartItems),
        customer: {
          email: 'customer@pokeshop.com',
          firstName: 'Pokemon',
          lastName: 'Trainer'
        },
        metadata: {
          source: 'pokemon-ecommerce-lightning',
          cartItemCount: cartItems.length,
          timestamp: new Date().toISOString(),
          cartTotal: totalAmount,
          itemDetails: cartItems.map(item => `${item.name} x${item.quantity}`)
        }
      };

      console.log('📦 Lightning invoice data being sent:', {
        amount: checkoutData.amount,
        currency: checkoutData.currency,
        itemCount: checkoutData.items.length,
        metadata: checkoutData.metadata
      });

      const qrData = await speedCheckoutService.createPaymentSession(checkoutData);
      setQRCodeData(qrData);

      // Calculate time remaining (15 minutes)
      const expiresAt = new Date(qrData.expiresAt).getTime();
      const now = new Date().getTime();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setTimeRemaining(remaining);

      console.log('✅ Lightning QR Code generated successfully:', {
        orderId: qrData.orderId,
        amount: qrData.amount,
        currency: qrData.currency,
        expiresIn: `${Math.floor(remaining / 60)}:${(remaining % 60).toString().padStart(2, '0')}`
      });

      // Start checking payment status
      startStatusChecking(qrData.orderId);

    } catch (error) {
      console.error('❌ Lightning QR Code generation error:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to generate Lightning invoice');
      setShowQRCode(false);
    }
  };

  const startStatusChecking = (orderId: string) => {
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
    }

    console.log('🔄 Starting Lightning payment status monitoring for invoice:', orderId);

    const interval = setInterval(async () => {
      try {
        setPaymentStatus('checking');
        const status = await speedCheckoutService.checkPaymentStatus(orderId);
        
        if (status.success && status.status === 'completed') {
          console.log('✅ Lightning payment completed successfully!', status);
          setPaymentStatus('completed');
          clearInterval(interval);
          setStatusCheckInterval(null);
          
          // Notify success
          onSuccess?.(status);
          
          // Close QR code modal after success
          setTimeout(() => {
            handleCloseQRCode();
          }, 3000);
          
        } else if (status.status === 'failed') {
          console.log('❌ Lightning payment failed', status);
          setPaymentStatus('failed');
          clearInterval(interval);
          setStatusCheckInterval(null);
          onError?.(status.error?.message || 'Lightning payment failed');
        } else {
          console.log('⏳ Lightning payment still pending...', status);
          setPaymentStatus('pending');
        }
      } catch (error) {
        console.error('❌ Lightning status check error:', error);
        setPaymentStatus('pending');
      }
    }, 3000); // Check every 3 seconds

    setStatusCheckInterval(interval);
  };

  const handleCloseQRCode = () => {
    console.log('🔒 Closing Lightning QR code modal');
    setShowQRCode(false);
    setQRCodeData(null);
    setPaymentStatus('pending');
    setTimeRemaining(0);
    
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }
  };

  const handleCopyPaymentUrl = () => {
    if (qrCodeData?.paymentUrl) {
      navigator.clipboard.writeText(qrCodeData.paymentUrl);
      
      // Show copied notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-4 bg-pokemon-yellow text-black px-4 py-2 rounded-full comic-border comic-text font-bold z-50 animate-bounce-in';
      notification.textContent = 'Lightning invoice copied!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 2000);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const speedStatus = getSpeedStatus();

  // Show configuration error if Strike is not configured
  if (!speedStatus.configured) {
    return (
      <div className="bg-gray-700 bg-opacity-80 rounded-lg p-4 text-center">
        <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-400" />
        <p className="comic-text text-sm text-red-400 font-bold">Strike Lightning Not Configured</p>
        <p className="comic-text text-xs text-gray-300 mt-1">
          Set VITE_STRIKE_API_KEY in your environment
        </p>
        <div className="mt-2 text-xs text-gray-400">
          <div>API Key: {speedStatus.apiKey ? '✅' : '❌'}</div>
          <div>Provider: Strike Lightning Network</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Strike Lightning Status */}
      <div className="bg-gray-700 bg-opacity-80 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="comic-text text-sm text-green-400 font-bold">Strike Lightning Ready</span>
        </div>
        <div className="text-xs text-gray-300 space-y-1">
          <div>✅ API Key: {speedStatus.apiKey ? 'Configured' : 'Missing'}</div>
          <div>⚡ Provider: Strike Lightning Network</div>
          <div>✅ Cart Total: ${totalAmount.toFixed(2)} ({cartItems.length} items)</div>
          <div>✅ Items: {cartItems.map(item => `${item.name} x${item.quantity}`).join(', ')}</div>
        </div>
      </div>

      {/* Lightning QR Code Checkout Button */}
      <button
        onClick={handleGenerateQRCode}
        disabled={disabled || !speedStatus.configured || cartItems.length === 0}
        className={`w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 
                   text-white font-bold py-4 px-6 rounded-full comic-border comic-text text-lg 
                   transform hover:scale-105 transition-all duration-300 comic-button comic-shadow 
                   flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed
                   ${className}`}
      >
        <Zap className="w-6 h-6" />
        ⚡ LIGHTNING PAY - ${totalAmount.toFixed(2)}
      </button>

      {/* Lightning QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl comic-border border-4 border-orange-400 p-6 max-w-md w-full">
            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="comic-font text-2xl text-orange-400 mb-2">⚡ Lightning Payment</h3>
              <p className="comic-text text-white font-bold text-xl">
                Pay ${totalAmount.toFixed(2)} USD
              </p>
              <p className="comic-text text-sm text-gray-300 mt-1">
                {cartItems.length} Pokemon game{cartItems.length !== 1 ? 's' : ''}
              </p>
              {timeRemaining > 0 && (
                <p className="comic-text text-sm text-orange-400 mt-2 font-bold">
                  ⏰ Expires in: {formatTime(timeRemaining)}
                </p>
              )}
            </div>

            {/* QR Code Display */}
            {qrCodeData ? (
              <div className="text-center space-y-4">
                {/* QR Code */}
                <div className="bg-white p-4 rounded-lg mx-auto inline-block comic-border">
                  <img 
                    src={qrCodeData.qrCode} 
                    alt="Lightning Payment QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>

                {/* Payment Status */}
                <div className="space-y-2">
                  {paymentStatus === 'pending' && (
                    <div className="flex items-center justify-center gap-2 text-orange-400">
                      <Zap className="w-5 h-5 animate-pulse" />
                      <span className="comic-text font-bold">Scan to pay ${totalAmount.toFixed(2)} via Lightning</span>
                    </div>
                  )}
                  
                  {paymentStatus === 'checking' && (
                    <div className="flex items-center justify-center gap-2 text-blue-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="comic-text">Checking Lightning payment...</span>
                    </div>
                  )}
                  
                  {paymentStatus === 'completed' && (
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="comic-text font-bold">Lightning payment of ${totalAmount.toFixed(2)} successful!</span>
                    </div>
                  )}
                  
                  {paymentStatus === 'failed' && (
                    <div className="flex items-center justify-center gap-2 text-red-400">
                      <AlertCircle className="w-5 h-5" />
                      <span className="comic-text">Lightning payment failed - Try Again</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleCopyPaymentUrl}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold 
                             py-2 px-4 rounded-lg comic-border comic-text 
                             transform hover:scale-105 transition-all duration-300 
                             flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Lightning Invoice
                  </button>

                  <button
                    onClick={() => window.open(qrCodeData.paymentUrl, '_blank')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold 
                             py-2 px-4 rounded-lg comic-border comic-text 
                             transform hover:scale-105 transition-all duration-300 
                             flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in Lightning Wallet
                  </button>
                </div>

                {/* Order Info */}
                <div className="bg-gray-700 rounded-lg p-3 text-left">
                  <div className="text-xs text-gray-300 space-y-1">
                    <div className="font-bold text-orange-400">Lightning Invoice Details:</div>
                    <div>Invoice ID: {qrCodeData.orderId}</div>
                    <div>Amount: ${qrCodeData.amount.toFixed(2)} {qrCodeData.currency}</div>
                    <div>Items: {cartItems.length} Pokemon games</div>
                    <div className="mt-2">
                      {cartItems.map((item, index) => (
                        <div key={index} className="text-xs">
                          • {item.name} x{item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-400" />
                <p className="comic-text text-white">Generating Lightning invoice for ${totalAmount.toFixed(2)}...</p>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={handleCloseQRCode}
              className="w-full mt-4 bg-gray-600 hover:bg-gray-500 text-white font-bold 
                       py-2 px-4 rounded-lg comic-border comic-text 
                       transform hover:scale-105 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Strike Lightning Info */}
      <div className="text-center">
        <p className="comic-text text-xs text-gray-400">
          ⚡ Powered by Strike • Bitcoin Lightning Network • Instant Payments
        </p>
      </div>
    </div>
  );
};

export default SpeedCheckoutButton;