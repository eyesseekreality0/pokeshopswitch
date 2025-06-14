import { useState, useEffect, useCallback } from 'react';
import { shopifyService, ShopifyProduct, ShopifyCart } from '../services/shopify';

export const useShopifyProducts = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!shopifyService.isConfigured()) {
          setError('Shopify not configured. Using local products.');
          setLoading(false);
          return;
        }

        const shopifyProducts = await shopifyService.getProducts();
        setProducts(shopifyProducts);
      } catch (err) {
        setError('Failed to fetch products from Shopify');
        console.error('Shopify products error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error, refetch: () => window.location.reload() };
};

export const useShopifyCart = () => {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!shopifyService.isConfigured()) {
        setError('Shopify not configured');
        return;
      }

      const shopifyCart = await shopifyService.getCart();
      setCart(shopifyCart);
    } catch (err) {
      setError('Failed to fetch cart');
      console.error('Shopify cart error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (variantId: string, quantity: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedCart = await shopifyService.addToCart(variantId, quantity);
      setCart(updatedCart);
      
      // Show success notification
      const event = new CustomEvent('cartItemAdded', { 
        detail: { variantId, quantity } 
      });
      window.dispatchEvent(event);
      
      return updatedCart;
    } catch (err) {
      setError('Failed to add item to cart');
      console.error('Add to cart error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCartItem = useCallback(async (lineItemId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedCart = await shopifyService.updateCartItem(lineItemId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      setError('Failed to update cart item');
      console.error('Update cart error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(async (lineItemId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedCart = await shopifyService.removeFromCart(lineItemId);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      setError('Failed to remove item from cart');
      console.error('Remove from cart error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const checkoutUrl = await shopifyService.getCheckoutUrl();
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
      } else {
        setError('Failed to get checkout URL');
      }
    } catch (err) {
      setError('Failed to proceed to checkout');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await shopifyService.clearCart();
      setCart(null);
    } catch (err) {
      setError('Failed to clear cart');
      console.error('Clear cart error:', err);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    checkout,
    clearCart,
    refetch: fetchCart
  };
};