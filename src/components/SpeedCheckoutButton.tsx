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
        onError?.('Speed Checkout is not configured');
        return;
      }

      if (cartItems.length === 0) {
        onError?.('Cart is empty');
        return;
      }

      setShowQRCode(true);
      setPaymentStatus('pending');

      // Create payment session
      const checkoutData = {
        amount: totalAmount,
        currency: 'USD',
        items: convertCartItems(cartItems),
        customer: {
          email: 'customer@pokeshop.com',
          firstName: 'Pokemon',
          lastName: 'Trainer'
        },
        metadata: {
          source: 'pokemon-ecommerce-qr',
          cartItemCount: cartItems.length,
          timestamp: new Date().toISOString()
        }
      };

      const qrData = await speedCheckoutService.createPaymentSession(checkoutData);
      setQRCodeData(qrData);

      // Calculate time remaining (15 minutes)
      const expiresAt = new Date(qrData.expiresAt).getTime();
      const now = new Date().getTime();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setTimeRemaining(remaining);

      // Start checking payment status
      startStatusChecking(qrData.orderId);

    } catch (error) {
      console.error('QR Code generation error:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to generate QR code');
      setShowQRCode(false);
    }
  };

  const startStatusChecking = (orderId: string) => {
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
    }

    const interval = setInterval(async () => {
      try {
        setPaymentStatus('checking');
        const status = await speedCheckoutService.checkPaymentStatus(orderId);
        
        if (status.success && status.status === 'completed') {
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
          setPaymentStatus('failed');
          clearInterval(interval);
          setStatusCheckInterval(null);
          onError?.(status.error?.message || 'Payment failed');
        } else {
          setPaymentStatus('pending');
        }
      } catch (error) {
        console.error('Status check error:', error);
        setPaymentStatus('pending');
      }
    }, 3000); // Check every 3 seconds

    setStatusCheckInterval(interval);
  };

  const handleCloseQRCode = () => {
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
      notification.textContent = 'Payment URL copied!';
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

  // Show configuration error if Speed is not configured
  if (!speedStatus.configured) {
    return (
      <div className="bg-gray-700 bg-opacity-80 rounded-lg p-4 text-center">
        <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-400" />
        <p className="comic-text text-sm text-red-400 font-bold">Speed Checkout Not Configured</p>
        <p className="comic-text text-xs text-gray-300 mt-1">
          Set VITE_SPEED_API_KEY and VITE_SPEED_STORE_ID in your environment
        </p>
        <div className="mt-2 text-xs text-gray-400">
          <div>API Key: {speedStatus.apiKey ? '✅' : '❌'}</div>
          <div>Store ID: {speedStatus.storeId ? '✅' : '❌'}</div>
        </div>
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
          <div>✅ API Key: {speedStatus.apiKey ? 'Configured' : 'Missing'}</div>
          <div>✅ Store ID: {speedStatus.storeId ? 'Configured' : 'Missing'}</div>
          <div>✅ Amount: ${totalAmount.toFixed(2)} ({cartItems.length} items)</div>
        </div>
      </div>

      {/* QR Code Checkout Button */}
      <button
        onClick={handleGenerateQRCode}
        disabled={disabled || !speedStatus.configured || cartItems.length === 0}
        className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
                   text-white font-bold py-4 px-6 rounded-full comic-border comic-text text-lg 
                   transform hover:scale-105 transition-all duration-300 comic-button comic-shadow 
                   flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed
                   ${className}`}
      >
        <QrCode className="w-6 h-6" />
        SPEED QR CHECKOUT - ${totalAmount.toFixed(2)}
      </button>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl comic-border border-4 border-pokemon-yellow p-6 max-w-md w-full">
            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="comic-font text-2xl text-pokemon-yellow mb-2">Speed QR Checkout</h3>
              <p className="comic-text text-white">Scan to pay ${totalAmount.toFixed(2)}</p>
              {timeRemaining > 0 && (
                <p className="comic-text text-sm text-gray-300 mt-1">
                  Expires in: {formatTime(timeRemaining)}
                </p>
              )}
            </div>

            {/* QR Code Display */}
            {qrCodeData ? (
              <div className="text-center space-y-4">
                {/* QR Code */}
                <div className="bg-white p-4 rounded-lg mx-auto inline-block">
                  <img 
                    src={qrCodeData.qrCode} 
                    alt="Speed Checkout QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>

                {/* Payment Status */}
                <div className="space-y-2">
                  {paymentStatus === 'pending' && (
                    <div className="flex items-center justify-center gap-2 text-pokemon-yellow">
                      <QrCode className="w-5 h-5" />
                      <span className="comic-text">Waiting for payment...</span>
                    </div>
                  )}
                  
                  {paymentStatus === 'checking' && (
                    <div className="flex items-center justify-center gap-2 text-blue-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="comic-text">Checking payment status...</span>
                    </div>
                  )}
                  
                  {paymentStatus === 'completed' && (
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="comic-text font-bold">Payment Successful!</span>
                    </div>
                  )}
                  
                  {paymentStatus === 'failed' && (
                    <div className="flex items-center justify-center gap-2 text-red-400">
                      <AlertCircle className="w-5 h-5" />
                      <span className="comic-text">Payment Failed</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleCopyPaymentUrl}
                    className="w-full bg-pokemon-yellow hover:bg-yellow-400 text-black font-bold 
                             py-2 px-4 rounded-lg comic-border comic-text 
                             transform hover:scale-105 transition-all duration-300 
                             flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Payment Link
                  </button>

                  <button
                    onClick={() => window.open(qrCodeData.paymentUrl, '_blank')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold 
                             py-2 px-4 rounded-lg comic-border comic-text 
                             transform hover:scale-105 transition-all duration-300 
                             flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Payment Page
                  </button>
                </div>

                {/* Order Info */}
                <div className="bg-gray-700 rounded-lg p-3 text-left">
                  <div className="text-xs text-gray-300 space-y-1">
                    <div>Order ID: {qrCodeData.orderId}</div>
                    <div>Amount: ${qrCodeData.amount.toFixed(2)} {qrCodeData.currency}</div>
                    <div>Items: {cartItems.length} Pokemon games</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-pokemon-yellow" />
                <p className="comic-text text-white">Generating QR code...</p>
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

      {/* Speed Checkout Info */}
      <div className="text-center">
        <p className="comic-text text-xs text-gray-400">
          ⚡ Powered by Speed Commerce • QR Code & Mobile Payments
        </p>
      </div>
    </div>
  );
};

export default SpeedCheckoutButton;