'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null); // null indicates not loaded yet
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedCart = localStorage.getItem('creators-kit-cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    } else {
      setCart([]);
    }
  }, []);

  useEffect(() => {
    if (isClient && cart !== null) {
      localStorage.setItem('creators-kit-cart', JSON.stringify(cart));
    }
  }, [cart, isClient]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      if (!prevCart) return [product];
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      return [...prevCart, product];
    });
  };

  const updateQuantity = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart?.reduce((total, item) => total + item.price * item.quantity, 0) || 0;
  const cartCount = cart?.reduce((count, item) => count + item.quantity, 0) || 0;

  // Don't render until client side hydration is complete for cart state
  if (!isClient) return <CartContext.Provider value={{ cart: [], addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount }}>{children}</CartContext.Provider>;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
