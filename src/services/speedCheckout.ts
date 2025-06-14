// Speed Checkout Service Integration
export interface SpeedCheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  image?: string;
  category?: string;
}

export interface SpeedCheckoutData {
  amount: number;
  currency: string;
  items: SpeedCheckoutItem[];
  customer?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  shipping?: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  metadata?: Record<string, any>;
}

export interface SpeedCheckoutResponse {
  success: boolean;
  transactionId?: string;
  orderId?: string;
  paymentMethod?: string;
  amount?: number;
  currency?: string;
  status?: 'completed' | 'pending' | 'failed';
  error?: {
    code: string;
    message: string;
  };
}

declare global {
  interface Window {
    Speed?: {
      init: (config: any) => void;
      checkout: (data: SpeedCheckoutData) => Promise<SpeedCheckoutResponse>;
      isReady: () => boolean;
    };
    speedConfig?: {
      apiKey: string;
      environment: string;
      currency: string;
      country: string;
    };
  }
}

class SpeedCheckoutService {
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  // Initialize Speed SDK
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      // Check if Speed SDK is loaded
      const checkSpeed = () => {
        if (window.Speed && window.speedConfig) {
          try {
            window.Speed.init({
              apiKey: window.speedConfig.apiKey,
              environment: window.speedConfig.environment,
              currency: window.speedConfig.currency,
              country: window.speedConfig.country,
              onReady: () => {
                this.isInitialized = true;
                resolve();
              },
              onError: (error: any) => {
                console.error('Speed SDK initialization error:', error);
                reject(error);
              }
            });
          } catch (error) {
            console.error('Speed SDK setup error:', error);
            reject(error);
          }
        } else {
          // Retry after a short delay
          setTimeout(checkSpeed, 100);
        }
      };

      checkSpeed();

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!this.isInitialized) {
          reject(new Error('Speed SDK initialization timeout'));
        }
      }, 10000);
    });

    return this.initPromise;
  }

  // Check if Speed Checkout is available
  isAvailable(): boolean {
    return !!(window.Speed && window.speedConfig?.apiKey && this.isInitialized);
  }

  // Process checkout with Speed
  async processCheckout(checkoutData: SpeedCheckoutData): Promise<SpeedCheckoutResponse> {
    try {
      await this.initialize();

      if (!this.isAvailable()) {
        throw new Error('Speed Checkout is not available');
      }

      // Validate checkout data
      this.validateCheckoutData(checkoutData);

      // Process payment with Speed
      const response = await window.Speed!.checkout(checkoutData);

      // Log successful transaction
      if (response.success) {
        console.log('Speed Checkout successful:', response);
        
        // Track analytics event
        this.trackCheckoutEvent('success', checkoutData, response);
      } else {
        console.error('Speed Checkout failed:', response.error);
        this.trackCheckoutEvent('failed', checkoutData, response);
      }

      return response;
    } catch (error) {
      console.error('Speed Checkout error:', error);
      
      const errorResponse: SpeedCheckoutResponse = {
        success: false,
        error: {
          code: 'CHECKOUT_ERROR',
          message: error instanceof Error ? error.message : 'Unknown checkout error'
        }
      };

      this.trackCheckoutEvent('error', checkoutData, errorResponse);
      return errorResponse;
    }
  }

  // Validate checkout data
  private validateCheckoutData(data: SpeedCheckoutData): void {
    if (!data.amount || data.amount <= 0) {
      throw new Error('Invalid checkout amount');
    }

    if (!data.items || data.items.length === 0) {
      throw new Error('No items in checkout');
    }

    if (!data.currency) {
      throw new Error('Currency is required');
    }

    // Validate items
    for (const item of data.items) {
      if (!item.id || !item.name || !item.price || !item.quantity) {
        throw new Error(`Invalid item data: ${JSON.stringify(item)}`);
      }
      
      if (item.price <= 0 || item.quantity <= 0) {
        throw new Error(`Invalid item price or quantity: ${item.name}`);
      }
    }

    // Validate total amount matches items
    const calculatedTotal = data.items.reduce(
      (total, item) => total + (item.price * item.quantity), 
      0
    );

    if (Math.abs(calculatedTotal - data.amount) > 0.01) {
      throw new Error('Total amount does not match item prices');
    }
  }

  // Track checkout events for analytics
  private trackCheckoutEvent(
    event: 'success' | 'failed' | 'error',
    checkoutData: SpeedCheckoutData,
    response: SpeedCheckoutResponse
  ): void {
    try {
      // Custom event for analytics
      const analyticsEvent = new CustomEvent('speedCheckoutEvent', {
        detail: {
          event,
          amount: checkoutData.amount,
          currency: checkoutData.currency,
          itemCount: checkoutData.items.length,
          transactionId: response.transactionId,
          orderId: response.orderId,
          timestamp: new Date().toISOString()
        }
      });

      window.dispatchEvent(analyticsEvent);
    } catch (error) {
      console.warn('Failed to track checkout event:', error);
    }
  }

  // Get checkout configuration
  getConfig() {
    return window.speedConfig;
  }

  // Check SDK status
  getStatus() {
    return {
      sdkLoaded: !!window.Speed,
      configLoaded: !!window.speedConfig,
      initialized: this.isInitialized,
      available: this.isAvailable()
    };
  }
}

export const speedCheckoutService = new SpeedCheckoutService();
export default speedCheckoutService;