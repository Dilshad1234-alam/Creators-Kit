'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(null); // null indicates not loaded yet
  const [isClient, setIsClient] = useState(false);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    setIsClient(true);
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      try {
        setWishlist(JSON.parse(storedWishlist));
      } catch(e) {
        setWishlist([]);
      }
    } else {
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    if (isClient && wishlist !== null) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isClient]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      if (!prev) return [product];
      const exists = prev.find((item) => item.id === product.id || (item._id && item._id === product._id));
      if (exists) {
        return prev.filter((item) => item.id !== product.id && item._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (id) => {
    if (!wishlist) return false;
    return wishlist.some((item) => item.id === id || (item._id && item._id === id));
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => (prev ? prev.filter((item) => item.id !== id && item._id !== id) : []));
  };

  const wishlistCount = wishlist ? wishlist.length : 0;

  if (!isClient) return <WishlistContext.Provider value={{ wishlist: [], toggleWishlist, isInWishlist, removeFromWishlist, wishlistCount }}>{children}</WishlistContext.Provider>;

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, removeFromWishlist, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
