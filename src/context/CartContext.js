'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getStoredCustomer } from '@/lib/auth-client';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null); // null indicates hydrating
  const [isClient, setIsClient] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const isFetchingRef = useRef(false);

  // Helper to determine the active logged-in customer's identifier
  const getActiveUserEmail = useCallback(() => {
    if (typeof window === 'undefined') return null;

    // 1. NextAuth Session (Google Sign-In)
    if (session?.user?.email) {
      return session.user.email.toLowerCase().trim();
    }

    // 2. Custom credentials customer stored in sessionStorage/localStorage/cookies
    const stored = getStoredCustomer();
    if (stored?.email) {
      return stored.email.toLowerCase().trim();
    }

    return null;
  }, [session]);

  const getStorageKey = (email) => {
    return email ? `creators-kit-cart-${email}` : null;
  };

  // Fetch cart directly from MongoDB for the active authenticated user
  const fetchCartFromDB = useCallback(async (userEmail) => {
    if (!userEmail || isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const res = await fetch('/api/cart', {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (!res.ok) throw new Error('Failed to fetch cart');
      const data = await res.json();

      if (data.authenticated && Array.isArray(data.items)) {
        setCart(data.items);
        const storageKey = getStorageKey(userEmail);
        if (storageKey) {
          try {
            localStorage.setItem(storageKey, JSON.stringify(data.items));
          } catch (e) {}
        }
      } else {
        // Not authenticated on server side: reset to empty
        setCart([]);
      }
    } catch (err) {
      console.error('[CartContext] Error loading user cart from DB:', err);
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  // Sync authentication state and initialize or reset cart
  useEffect(() => {
    setIsClient(true);

    // Purge any lingering anonymous guest cart keys from localStorage
    try {
      localStorage.removeItem('creators-kit-cart-guest');
      localStorage.removeItem('creators-kit-cart-null');
      localStorage.removeItem('creators-kit-cart-undefined');
    } catch (e) {}

    const syncAuthState = () => {
      const activeEmail = getActiveUserEmail();
      setCurrentUserEmail(activeEmail);

      if (!activeEmail) {
        // No authenticated user: cart is strictly empty and guest-restricted
        setCart([]);
        return;
      }

      // Fast optimistic load from user-scoped localStorage
      const storageKey = getStorageKey(activeEmail);
      if (storageKey) {
        try {
          const cached = localStorage.getItem(storageKey);
          if (cached) {
            setCart(JSON.parse(cached));
          }
        } catch (e) {}
      }

      // Sync fresh authoritative cart from MongoDB
      fetchCartFromDB(activeEmail);
    };

    syncAuthState();

    window.addEventListener('storage', syncAuthState);
    window.addEventListener('creatorskit-auth-change', syncAuthState);

    return () => {
      window.removeEventListener('storage', syncAuthState);
      window.removeEventListener('creatorskit-auth-change', syncAuthState);
    };
  }, [getActiveUserEmail, fetchCartFromDB, sessionStatus]);

  // Persist optimistic cart changes to MongoDB and user-scoped localStorage
  const syncCartToBackend = async (newItems, action = 'sync', payload = {}) => {
    const activeEmail = currentUserEmail || getActiveUserEmail();
    if (!activeEmail) return;

    const storageKey = getStorageKey(activeEmail);
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(newItems));
      } catch (e) {}
    }

    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          items: newItems,
          ...payload,
        }),
      });
    } catch (err) {
      console.error('[CartContext] Error syncing cart to MongoDB:', err);
    }
  };

  // -------------------------------------------------------------
  // Cart Actions
  // -------------------------------------------------------------
  const addToCart = (product) => {
    if (!product || !product.id) return false;

    const activeEmail = currentUserEmail || getActiveUserEmail();
    if (!activeEmail) {
      // User is not logged in: redirect to login page with return URL
      if (typeof window !== 'undefined') {
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        router.push(`/login?redirect=${returnUrl}`);
      }
      return false;
    }

    const itemImg = product.img || product.image || '';
    const itemImages = Array.isArray(product.images) && product.images.length > 0 ? product.images : [];
    const itemPrice = typeof product.price === 'number'
      ? product.price
      : (parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0);
    const qtyToAdd = Math.max(1, Number(product.quantity) || 1);

    const formattedItem = {
      ...product,
      id: String(product.id),
      name: product.name,
      price: itemPrice,
      img: itemImg,
      image: itemImg,
      images: itemImages,
      quantity: qtyToAdd,
    };

    setCart((prevCart) => {
      const current = prevCart || [];
      const existingIndex = current.findIndex((item) => String(item.id) === String(product.id));

      let updated;
      if (existingIndex > -1) {
        updated = current.map((item, idx) =>
          idx === existingIndex
            ? {
                ...item,
                ...formattedItem,
                quantity: (Number(item.quantity) || 1) + qtyToAdd,
              }
            : item
        );
      } else {
        updated = [...current, formattedItem];
      }

      syncCartToBackend(updated, 'sync');
      return updated;
    });

    return true;
  };

  const buyNow = (product) => {
    if (!product || !product.id) return false;

    const activeEmail = currentUserEmail || getActiveUserEmail();
    if (!activeEmail) {
      if (typeof window !== 'undefined') {
        const returnUrl = encodeURIComponent('/cart');
        router.push(`/login?redirect=${returnUrl}`);
      }
      return false;
    }

    const itemImg = product.img || product.image || '';
    const itemImages = Array.isArray(product.images) && product.images.length > 0 ? product.images : [];
    const itemPrice = typeof product.price === 'number'
      ? product.price
      : (parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0);
    const qty = Math.max(1, Number(product.quantity) || 1);

    const buyNowItem = {
      ...product,
      id: String(product.id),
      name: product.name,
      price: itemPrice,
      img: itemImg,
      image: itemImg,
      images: itemImages,
      quantity: qty,
    };

    const newCart = [buyNowItem];
    setCart(newCart);
    syncCartToBackend(newCart, 'sync');
    router.push('/cart');
    return true;
  };

  const updateQuantity = (id, quantity) => {
    const activeEmail = currentUserEmail || getActiveUserEmail();
    if (!activeEmail) return;

    setCart((prevCart) => {
      if (!prevCart) return [];
      const targetQty = Number(quantity);
      let updated;
      if (targetQty <= 0) {
        updated = prevCart.filter((item) => String(item.id) !== String(id));
      } else {
        updated = prevCart.map((item) =>
          String(item.id) === String(id) ? { ...item, quantity: targetQty } : item
        );
      }

      syncCartToBackend(updated, 'sync');
      return updated;
    });
  };

  const removeFromCart = (id) => {
    const activeEmail = currentUserEmail || getActiveUserEmail();
    if (!activeEmail) return;

    setCart((prevCart) => {
      const updated = prevCart ? prevCart.filter((item) => String(item.id) !== String(id)) : [];
      syncCartToBackend(updated, 'sync');
      return updated;
    });
  };

  const clearCart = () => {
    const activeEmail = currentUserEmail || getActiveUserEmail();
    setCart([]);

    if (activeEmail) {
      const storageKey = getStorageKey(activeEmail);
      if (storageKey) {
        try {
          localStorage.removeItem(storageKey);
        } catch (e) {}
      }
      fetch('/api/cart', { method: 'DELETE' }).catch(() => {});
    }
  };

  const isAuthenticated = Boolean(currentUserEmail);
  const cartTotal = cart
    ? cart.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0)
    : 0;

  // Real-time counter strictly tied to active user items (0 for unauthenticated guests)
  const cartCount = isAuthenticated && cart
    ? cart.reduce((count, item) => count + (Number(item.quantity) || 1), 0)
    : 0;

  if (!isClient) {
    return (
      <CartContext.Provider
        value={{
          cart: [],
          cartTotal: 0,
          cartCount: 0,
          isAuthenticated: false,
          addToCart: () => false,
          buyNow: () => false,
          updateQuantity: () => {},
          removeFromCart: () => {},
          clearCart: () => {},
          refreshCart: () => {},
        }}
      >
        {children}
      </CartContext.Provider>
    );
  }

  return (
    <CartContext.Provider
      value={{
        cart: cart || [],
        cartTotal,
        cartCount,
        isAuthenticated,
        addToCart,
        buyNow,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: () => fetchCartFromDB(currentUserEmail),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
