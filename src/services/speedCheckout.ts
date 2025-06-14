// Speed Checkout Service Integration with QR Code Support
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
  paymentMethods?: string[];
  returnUrl?: string;
  webhookUrl?: string;
}

export interface SpeedCheckoutResponse {
  success: boolean;
  transactionId?: string;
  orderId?: string;
  paymentMethod?: string;
  amount?: number;
  currency?: string;
  status?: 'completed' | 'pending' | 'failed';
  qrCode?: string;
  paymentUrl?: string;
  expiresAt?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface SpeedQRCodeData {
  qrCode: string;
  paymentUrl: string;
  orderId: string;
  amount: number;
  currency: string;
  expiresAt: string;
}

class SpeedCheckoutService {
  private apiKey: string;
  private storeId: string;
  private apiUrl: string;
  private isInitialized = false;

  constructor() {
    this.apiKey = import.meta.env.VITE_SPEED_API_KEY || '';
    this.storeId = import.meta.env.VITE_SPEED_STORE_ID || '';
    this.apiUrl = import.meta.env.VITE_SPEED_API_URL || 'https://api.tryspeed.com/v1';
  }

  // Check if Speed Checkout is configured
  isConfigured(): boolean {
    return !!(this.apiKey && this.storeId && this.apiUrl);
  }

  // Initialize Speed SDK
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    if (!this.isConfigured()) {
      throw new Error('Speed Checkout is not configured. Please set VITE_SPEED_API_KEY and VITE_SPEED_STORE_ID');
    }

    this.isInitialized = true;
  }

  // Create payment session and get QR code
  async createPaymentSession(checkoutData: SpeedCheckoutData): Promise<SpeedQRCodeData> {
    try {
      await this.initialize();

      // Validate checkout data
      this.validateCheckoutData(checkoutData);

      const payload = {
        store_id: this.storeId,
        amount: Math.round(checkoutData.amount * 100), // Convert to cents
        currency: checkoutData.currency,
        items: checkoutData.items.map(item => ({
          id: item.id,
          name: item.name,
          price: Math.round(item.price * 100), // Convert to cents
          quantity: item.quantity,
          description: item.description,
          image_url: item.image,
          category: item.category
        })),
        customer: checkoutData.customer,
        shipping_address: checkoutData.shipping,
        metadata: {
          ...checkoutData.metadata,
          source: 'pokemon-ecommerce',
          timestamp: new Date().toISOString()
        },
        payment_methods: ['qr_code', 'mobile_wallet', 'card'],
        return_url: window.location.origin + '/checkout/success',
        webhook_url: checkoutData.webhookUrl,
        expires_in: 900 // 15 minutes
      };

      const response = await fetch(`${this.apiUrl}/payments/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Store-ID': this.storeId
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        qrCode: data.qr_code,
        paymentUrl: data.payment_url,
        orderId: data.order_id,
        amount: checkoutData.amount,
        currency: checkoutData.currency,
        expiresAt: data.expires_at
      };
    } catch (error) {
      console.error('Speed payment session creation error:', error);
      throw error;
    }
  }

  // Check payment status
  async checkPaymentStatus(orderId: string): Promise<SpeedCheckoutResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/payments/sessions/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Store-ID': this.storeId
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: data.status === 'completed',
        transactionId: data.transaction_id,
        orderId: data.order_id,
        paymentMethod: data.payment_method,
        amount: data.amount / 100, // Convert from cents
        currency: data.currency,
        status: data.status,
        error: data.status === 'failed' ? {
          code: data.error_code || 'PAYMENT_FAILED',
          message: data.error_message || 'Payment failed'
        } : undefined
      };
    } catch (error) {
      console.error('Speed payment status check error:', error);
      return {
        success: false,
        error: {
          code: 'STATUS_CHECK_ERROR',
          message: error instanceof Error ? error.message : 'Failed to check payment status'
        }
      };
    }
  }

  // Process direct checkout (without QR code)
  async processCheckout(checkoutData: SpeedCheckoutData): Promise<SpeedCheckoutResponse> {
    try {
      const qrData = await this.createPaymentSession(checkoutData);
      
      // For direct checkout, we'll return the payment URL
      return {
        success: true,
        orderId: qrData.orderId,
        amount: qrData.amount,
        currency: qrData.currency,
        status: 'pending',
        paymentUrl: qrData.paymentUrl,
        qrCode: qrData.qrCode
      };
    } catch (error) {
      console.error('Speed checkout error:', error);
      return {
        success: false,
        error: {
          code: 'CHECKOUT_ERROR',
          message: error instanceof Error ? error.message : 'Checkout failed'
        }
      };
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
      throw new Error(`Total amount mismatch: expected ${calculatedTotal}, got ${data.amount}`);
    }
  }

  // Get configuration
  getConfig() {
    return {
      apiKey: this.apiKey ? `${this.apiKey.substring(0, 8)}...` : 'Not set',
      storeId: this.storeId ? `${this.storeId.substring(0, 8)}...` : 'Not set',
      apiUrl: this.apiUrl,
      configured: this.isConfigured()
    };
  }

  // Get status
  getStatus() {
    return {
      configured: this.isConfigured(),
      initialized: this.isInitialized,
      apiKey: !!this.apiKey,
      storeId: !!this.storeId,
      apiUrl: !!this.apiUrl
    };
  }
}

export const speedCheckoutService = new SpeedCheckoutService();
export default speedCheckoutService;