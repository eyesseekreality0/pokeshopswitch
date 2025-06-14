// Strike Lightning Payment Service Integration with QR Code Support
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
  private apiUrl: string;
  private isInitialized = false;

  constructor() {
    this.apiKey = import.meta.env.VITE_STRIKE_API_KEY || '';
    this.apiUrl = import.meta.env.VITE_STRIKE_API_URL || 'https://api.strike.me/v1';
  }

  // Check if Strike is configured
  isConfigured(): boolean {
    return !!(this.apiKey && this.apiUrl);
  }

  // Initialize Strike SDK
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    if (!this.isConfigured()) {
      throw new Error('Strike is not configured. Please set VITE_STRIKE_API_KEY');
    }

    this.isInitialized = true;
    console.log('✅ Strike Lightning Payment initialized successfully');
  }

  // Create Lightning invoice and get QR code
  async createPaymentSession(checkoutData: SpeedCheckoutData): Promise<SpeedQRCodeData> {
    try {
      await this.initialize();

      // Validate checkout data
      this.validateCheckoutData(checkoutData);

      // Convert USD to satoshis (Strike handles conversion)
      const amountUsd = Number(checkoutData.amount.toFixed(2));

      const payload = {
        handle: 'pokemon-ecommerce', // Your Strike handle
        amount: {
          currency: 'USD',
          amount: amountUsd.toString()
        },
        description: `Pokemon Games Purchase - ${checkoutData.items.length} items`,
        metadata: {
          ...checkoutData.metadata,
          source: 'pokemon-ecommerce',
          timestamp: new Date().toISOString(),
          items: checkoutData.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          }))
        }
      };

      console.log('🚀 Creating Strike Lightning invoice...', {
        amount: payload.amount,
        description: payload.description,
        itemCount: checkoutData.items.length
      });

      const response = await fetch(`${this.apiUrl}/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'Pokemon-Ecommerce/1.0'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Strike API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Use default error message if JSON parsing fails
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Strike Lightning invoice created:', data);

      // Generate QR code for the Lightning invoice
      const lightningUri = data.lnInvoice || data.paymentRequest;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(lightningUri)}`;

      // Create expiration time (15 minutes from now)
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      return {
        qrCode: qrCodeUrl,
        paymentUrl: lightningUri,
        orderId: data.invoiceId || data.id,
        amount: checkoutData.amount,
        currency: checkoutData.currency,
        expiresAt: expiresAt
      };
    } catch (error) {
      console.error('❌ Strike Lightning invoice creation error:', error);
      throw error;
    }
  }

  // Check Lightning payment status
  async checkPaymentStatus(orderId: string): Promise<SpeedCheckoutResponse> {
    try {
      console.log('🔍 Checking Lightning payment status for invoice:', orderId);
      
      const response = await fetch(`${this.apiUrl}/invoices/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'Pokemon-Ecommerce/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📊 Lightning payment status:', data);

      // Strike invoice states: 'UNPAID', 'PENDING', 'PAID', 'CANCELLED'
      const status = data.state || data.status;
      let mappedStatus: 'completed' | 'pending' | 'failed';
      
      switch (status) {
        case 'PAID':
          mappedStatus = 'completed';
          break;
        case 'PENDING':
        case 'UNPAID':
          mappedStatus = 'pending';
          break;
        case 'CANCELLED':
        case 'EXPIRED':
          mappedStatus = 'failed';
          break;
        default:
          mappedStatus = 'pending';
      }

      return {
        success: mappedStatus === 'completed',
        transactionId: data.paymentId || data.transactionId,
        orderId: data.invoiceId || data.id,
        paymentMethod: 'lightning',
        amount: data.amount?.amount ? parseFloat(data.amount.amount) : 0,
        currency: data.amount?.currency || 'USD',
        status: mappedStatus,
        error: mappedStatus === 'failed' ? {
          code: 'PAYMENT_FAILED',
          message: `Payment ${status.toLowerCase()}`
        } : undefined
      };
    } catch (error) {
      console.error('❌ Strike payment status check error:', error);
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
      
      // For direct checkout, we'll return the Lightning payment URI
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
      console.error('❌ Strike checkout error:', error);
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
      apiKey: this.apiKey ? `${this.apiKey.substring(0, 12)}...` : 'Not set',
      apiUrl: this.apiUrl,
      configured: this.isConfigured(),
      provider: 'Strike Lightning'
    };
  }

  // Get status
  getStatus() {
    return {
      configured: this.isConfigured(),
      initialized: this.isInitialized,
      apiKey: !!this.apiKey,
      apiUrl: !!this.apiUrl,
      provider: 'Strike Lightning Network'
    };
  }
}

export const speedCheckoutService = new SpeedCheckoutService();
export default speedCheckoutService;