import Client from 'shopify-buy';

// Shopify client configuration
const client = Client.buildClient({
  domain: import.meta.env.VITE_SHOPIFY_DOMAIN || '',
  storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
});

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: Array<{
    id: string;
    src: string;
    altText?: string;
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    compareAtPrice?: {
      amount: string;
      currencyCode: string;
    };
    available: boolean;
  }>;
  tags: string[];
  productType: string;
  vendor: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyCart {
  id: string;
  webUrl: string;
  lineItems: Array<{
    id: string;
    title: string;
    quantity: number;
    variant: {
      id: string;
      title: string;
      price: {
        amount: string;
        currencyCode: string;
      };
      image?: {
        src: string;
        altText?: string;
      };
    };
  }>;
  subtotalPrice: {
    amount: string;
    currencyCode: string;
  };
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  totalTax: {
    amount: string;
    currencyCode: string;
  };
}

class ShopifyService {
  private client = client;
  private cart: any = null;

  // Initialize or get existing cart
  async getCart(): Promise<ShopifyCart | null> {
    try {
      if (!this.cart) {
        // Try to get cart from localStorage
        const cartId = localStorage.getItem('shopify-cart-id');
        if (cartId) {
          this.cart = await this.client.checkout.fetch(cartId);
        } else {
          // Create new cart
          this.cart = await this.client.checkout.create();
          localStorage.setItem('shopify-cart-id', this.cart.id);
        }
      }
      return this.cart;
    } catch (error) {
      console.error('Error getting cart:', error);
      return null;
    }
  }

  // Fetch all products
  async getProducts(limit: number = 50): Promise<ShopifyProduct[]> {
    try {
      const products = await this.client.product.fetchAll(limit);
      return products.map(this.transformProduct);
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Fetch single product by handle
  async getProduct(handle: string): Promise<ShopifyProduct | null> {
    try {
      const product = await this.client.product.fetchByHandle(handle);
      return product ? this.transformProduct(product) : null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  // Add item to cart
  async addToCart(variantId: string, quantity: number = 1): Promise<ShopifyCart | null> {
    try {
      const cart = await this.getCart();
      if (!cart) return null;

      const lineItemsToAdd = [{
        variantId,
        quantity
      }];

      this.cart = await this.client.checkout.addLineItems(cart.id, lineItemsToAdd);
      return this.cart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return null;
    }
  }

  // Update cart item quantity
  async updateCartItem(lineItemId: string, quantity: number): Promise<ShopifyCart | null> {
    try {
      const cart = await this.getCart();
      if (!cart) return null;

      const lineItemsToUpdate = [{
        id: lineItemId,
        quantity
      }];

      this.cart = await this.client.checkout.updateLineItems(cart.id, lineItemsToUpdate);
      return this.cart;
    } catch (error) {
      console.error('Error updating cart item:', error);
      return null;
    }
  }

  // Remove item from cart
  async removeFromCart(lineItemId: string): Promise<ShopifyCart | null> {
    try {
      const cart = await this.getCart();
      if (!cart) return null;

      this.cart = await this.client.checkout.removeLineItems(cart.id, [lineItemId]);
      return this.cart;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return null;
    }
  }

  // Get checkout URL for payment
  async getCheckoutUrl(): Promise<string | null> {
    try {
      const cart = await this.getCart();
      return cart?.webUrl || null;
    } catch (error) {
      console.error('Error getting checkout URL:', error);
      return null;
    }
  }

  // Clear cart
  async clearCart(): Promise<void> {
    try {
      localStorage.removeItem('shopify-cart-id');
      this.cart = null;
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }

  // Transform Shopify product to our format
  private transformProduct(shopifyProduct: any): ShopifyProduct {
    return {
      id: shopifyProduct.id,
      title: shopifyProduct.title,
      description: shopifyProduct.description,
      handle: shopifyProduct.handle,
      images: shopifyProduct.images.map((img: any) => ({
        id: img.id,
        src: img.src,
        altText: img.altText
      })),
      variants: shopifyProduct.variants.map((variant: any) => ({
        id: variant.id,
        title: variant.title,
        price: {
          amount: variant.price.amount,
          currencyCode: variant.price.currencyCode
        },
        compareAtPrice: variant.compareAtPrice ? {
          amount: variant.compareAtPrice.amount,
          currencyCode: variant.compareAtPrice.currencyCode
        } : undefined,
        available: variant.available
      })),
      tags: shopifyProduct.tags,
      productType: shopifyProduct.productType,
      vendor: shopifyProduct.vendor,
      createdAt: shopifyProduct.createdAt,
      updatedAt: shopifyProduct.updatedAt
    };
  }

  // Check if Shopify is configured
  isConfigured(): boolean {
    return !!(import.meta.env.VITE_SHOPIFY_DOMAIN && import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN);
  }
}

export const shopifyService = new ShopifyService();
export default shopifyService;