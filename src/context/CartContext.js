'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getStoredCustomer } from '@/lib/auth-client';

const CartContext = createContext();

const LOCAL_STORAGE_CART_KEY = 'creators-kit-cart';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null); // null indicates initial hydrating
  const [isClient, setIsClient] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const currentUserEmailRef = useRef(currentUserEmail);
  useEffect(() => {
    currentUserEmailRef.current = currentUserEmail;
  }, [currentUserEmail]);
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const isFetchingRef = useRef(false);
  const hasInitializedRef = useRef(false);

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

  // Read saved cart from localStorage safely
  const loadLocalCart = useCallback((email) => {
    if (typeof window === 'undefined') return [];
    try {
      // First try user-specific key if email is available
      if (email) {
        const userSaved = localStorage.getItem(`creators-kit-cart-${email}`);
        if (userSaved) {
          const parsed = JSON.parse(userSaved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
      // Fallback to primary local cart key
      const mainSaved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (mainSaved) {
        const parsed = JSON.parse(mainSaved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('[CartContext] Error reading localStorage cart:', e);
    }
    return [];
  }, []);

  // Write cart to localStorage safely
  const saveLocalCart = useCallback((items, email) => {
    if (typeof window === 'undefined') return;
    try {
      const serialized = JSON.stringify(items || []);
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, serialized);
      const targetEmail = email || currentUserEmailRef.current || getActiveUserEmail();
      const userKey = getStorageKey(targetEmail);
      if (userKey) {
        localStorage.setItem(userKey, serialized);
      }
    } catch (e) {
      console.warn('[CartContext] Error saving cart to localStorage:', e);
    }
  }, [getActiveUserEmail]);

  // Persist cart changes to MongoDB and user-scoped localStorage
  const syncCartToBackend = useCallback(async (newItems, action = 'sync', payload = {}) => {
    const activeEmail = currentUserEmailRef.current || getActiveUserEmail();
    saveLocalCart(newItems, activeEmail);

    if (!activeEmail) return;

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
  }, [getActiveUserEmail, saveLocalCart]);

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
        if (data.items.length > 0) {
          setCart(data.items);
          saveLocalCart(data.items, userEmail);
        } else {
          // If server cart is empty, check if we have local items to push to server
          const localItems = loadLocalCart(userEmail);
          if (localItems.length > 0) {
            setCart(localItems);
            fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'sync', items: localItems }),
            }).catch(() => {});
          } else {
            setCart([]);
          }
        }
      }
      // If not authenticated or error, NEVER wipe out local items!
    } catch (err) {
      console.error('[CartContext] Error loading user cart from DB:', err);
    } finally {
      isFetchingRef.current = false;
    }
  }, [loadLocalCart, saveLocalCart]);

  // Sync authentication state and initialize cart from localStorage immediately
  useEffect(() => {
    setIsClient(true);

    const activeEmail = getActiveUserEmail();
    setCurrentUserEmail((prev) => (prev !== activeEmail ? activeEmail : prev));

    // Initial load: Read local storage immediately on mount so cart never starts empty
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      const cachedItems = loadLocalCart(activeEmail);
      setCart(cachedItems);
    }

    if (activeEmail) {
      fetchCartFromDB(activeEmail);
    }

    const syncAuthState = () => {
      const email = getActiveUserEmail();
      setCurrentUserEmail((prev) => (prev !== email ? email : prev));
      if (email) {
        fetchCartFromDB(email);
      }
    };

    window.addEventListener('storage', syncAuthState);
    window.addEventListener('creatorskit-auth-change', syncAuthState);

    return () => {
      window.removeEventListener('storage', syncAuthState);
      window.removeEventListener('creatorskit-auth-change', syncAuthState);
    };
  }, [getActiveUserEmail, fetchCartFromDB, loadLocalCart, sessionStatus]);

  // -------------------------------------------------------------
  // Cart Actions
  // -------------------------------------------------------------
  const addToCart = useCallback((product) => {
    if (!product || !product.id) return false;

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
      const current = Array.isArray(prevCart) ? prevCart : loadLocalCart();
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

      saveLocalCart(updated);
      syncCartToBackend(updated, 'sync');
      return updated;
    });

    return true;
  }, [loadLocalCart, saveLocalCart, syncCartToBackend]);

  const buyNow = useCallback((product, redirectUrl = '/checkout') => {
    if (!product || !product.id) return false;

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
    saveLocalCart(newCart);
    syncCartToBackend(newCart, 'sync');

    // If user is not logged in, open login modal on current page with return URL
    const activeEmail = currentUserEmail || getActiveUserEmail();
    if (!activeEmail) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('creatorskit-open-auth', {
            detail: { mode: 'login', redirectUrl },
          })
        );
      }
    } else {
      router.push(redirectUrl);
    }
    return true;
  }, [currentUserEmail, getActiveUserEmail, router, saveLocalCart, syncCartToBackend]);

  const updateQuantity = useCallback((id, quantity) => {
    setCart((prevCart) => {
      const current = Array.isArray(prevCart) ? prevCart : loadLocalCart();
      const targetQty = Number(quantity);
      let updated;
      if (targetQty <= 0) {
        updated = current.filter((item) => String(item.id) !== String(id));
      } else {
        updated = current.map((item) =>
          String(item.id) === String(id) ? { ...item, quantity: targetQty } : item
        );
      }

      saveLocalCart(updated);
      syncCartToBackend(updated, 'sync');
      return updated;
    });
  }, [loadLocalCart, saveLocalCart, syncCartToBackend]);

  const removeFromCart = useCallback((id) => {
    setCart((prevCart) => {
      const current = Array.isArray(prevCart) ? prevCart : loadLocalCart();
      const updated = current.filter((item) => String(item.id) !== String(id));
      saveLocalCart(updated);
      syncCartToBackend(updated, 'sync');
      return updated;
    });
  }, [loadLocalCart, saveLocalCart, syncCartToBackend]);

  const clearCart = useCallback(() => {
    setCart([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
      const activeEmail = currentUserEmail || getActiveUserEmail();
      if (activeEmail) {
        const userKey = getStorageKey(activeEmail);
        if (userKey) localStorage.removeItem(userKey);
        fetch('/api/cart', { method: 'DELETE' }).catch(() => {});
      }
    } catch (e) {}
  }, [currentUserEmail, getActiveUserEmail]);

  const isAuthenticated = Boolean(currentUserEmail);
  const cartTotal = Array.isArray(cart)
    ? cart.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0)
    : 0;

  // Real-time counter strictly tied to items in cart - never resets on reload
  const cartCount = Array.isArray(cart)
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
