'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null); // null indicates not loaded yet
  const [isClient, setIsClient] = useState(false);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    setIsClient(true);
    const storedUserName = sessionStorage.getItem('userName');
    setUserName(storedUserName);

    if (storedUserName) {
      const userCartKey = `creators-kit-cart-${storedUserName}`;
      const storedCart = localStorage.getItem(userCartKey);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      } else {
        setCart([]);
      }
    } else {
      setCart([]); // Guest sees empty cart
    }
  }, []);

  useEffect(() => {
    if (isClient && cart !== null && userName) {
      const userCartKey = `creators-kit-cart-${userName}`;
      localStorage.setItem(userCartKey, JSON.stringify(cart));
    }
  }, [cart, isClient, userName]);

  const addToCart = (product) => {
    if (!userName) {
      alert("Please log in to add items to your cart.");
      return;
    }
    
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
    if (!userName) return;
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id) => {
    if (!userName) return;
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    if (!userName) return;
    setCart([]);
  };

  const cartTotal = userName && cart ? cart.reduce((total, item) => total + item.price * item.quantity, 0) : 0;
  const cartCount = userName && cart ? cart.reduce((count, item) => count + item.quantity, 0) : 0;

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
