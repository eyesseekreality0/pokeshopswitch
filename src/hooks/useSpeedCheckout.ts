import { useState, useCallback, useEffect } from 'react';
import { CartItem } from '../types';
import { 
  speedCheckoutService, 
  SpeedCheckoutData, 
  SpeedCheckoutResponse,
  SpeedCheckoutItem 
} from '../services/speedCheckout';

export interface CheckoutState {
  loading: boolean;
  error: string | null;
  success: boolean;
  response: SpeedCheckoutResponse | null;
}

export interface CustomerInfo {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface ShippingInfo {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export const useSpeedCheckout = () => {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    loading: false,
    error: null,
    success: false,
    response: null
  });

  const [isSpeedReady, setIsSpeedReady] = useState(false);

  // Initialize Speed SDK on mount
  useEffect(() => {
    const initializeSpeed = async () => {
      try {
        await speedCheckoutService.initialize();
        setIsSpeedReady(speedCheckoutService.isAvailable());
      } catch (error) {
        console.error('Failed to initialize Speed Checkout:', error);
        setCheckoutState(prev => ({
          ...prev,
          error: 'Failed to initialize payment system'
        }));
      }
    };

    initializeSpeed();

    // Listen for Speed SDK events
    const handleSpeedEvent = (event: CustomEvent) => {
      console.log('Speed Checkout Event:', event.detail);
    };

    window.addEventListener('speedCheckoutEvent', handleSpeedEvent as EventListener);

    return () => {
      window.removeEventListener('speedCheckoutEvent', handleSpeedEvent as EventListener);
    };
  }, []);

  // Convert cart items to Speed format
  const convertCartItems = useCallback((cartItems: CartItem[]): SpeedCheckoutItem[] => {
    return cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      description: item.description,
      image: item.image,
      category: `Generation ${item.generation}`
    }));
  }, []);

  // Calculate total amount
  const calculateTotal = useCallback((cartItems: CartItem[]): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, []);

  // Process checkout
  const processCheckout = useCallback(async (
    cartItems: CartItem[],
    customerInfo?: CustomerInfo,
    shippingInfo?: ShippingInfo,
    metadata?: Record<string, any>
  ): Promise<SpeedCheckoutResponse> => {
    setCheckoutState({
      loading: true,
      error: null,
      success: false,
      response: null
    });

    try {
      if (!isSpeedReady) {
        throw new Error('Speed Checkout is not ready. Please try again.');
      }

      if (!cartItems || cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      const checkoutData: SpeedCheckoutData = {
        amount: calculateTotal(cartItems),
        currency: 'USD',
        items: convertCartItems(cartItems),
        customer: customerInfo,
        shipping: shippingInfo,
        metadata: {
          source: 'pokemon-ecommerce',
          timestamp: new Date().toISOString(),
          itemCount: cartItems.length,
          ...metadata
        }
      };

      const response = await speedCheckoutService.processCheckout(checkoutData);

      setCheckoutState({
        loading: false,
        error: response.success ? null : response.error?.message || 'Checkout failed',
        success: response.success,
        response
      });

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setCheckoutState({
        loading: false,
        error: errorMessage,
        success: false,
        response: null
      });

      return {
        success: false,
        error: {
          code: 'CHECKOUT_ERROR',
          message: errorMessage
        }
      };
    }
  }, [isSpeedReady, calculateTotal, convertCartItems]);

  // Reset checkout state
  const resetCheckout = useCallback(() => {
    setCheckoutState({
      loading: false,
      error: null,
      success: false,
      response: null
    });
  }, []);

  // Get Speed status
  const getSpeedStatus = useCallback(() => {
    return speedCheckoutService.getStatus();
  }, []);

  return {
    // State
    checkoutState,
    isSpeedReady,
    
    // Actions
    processCheckout,
    resetCheckout,
    
    // Utilities
    calculateTotal,
    convertCartItems,
    getSpeedStatus,
    
    // Service access
    speedService: speedCheckoutService
  };
};