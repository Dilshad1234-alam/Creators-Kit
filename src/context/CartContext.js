'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(null); // null indicates not loaded yet
    const [isClient, setIsClient] = useState(false);
    const [userName, setUserName] = useState(null);

    const getCartKey = (user) => {
        return user ? `creators-kit-cart-${user}` : 'creators-kit-cart-guest';
    };

    useEffect(() => {
        setIsClient(true);
        const storedUserName = typeof window !== 'undefined' ? sessionStorage.getItem('userName') : null;
        setUserName(storedUserName);

        const key = getCartKey(storedUserName);
        const storedCart = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
        if (storedCart) {
            try {
                setCart(JSON.parse(storedCart));
            } catch (e) {
                setCart([]);
            }
        } else {
            setCart([]);
        }
    }, []);

    useEffect(() => {
        if (isClient && cart !== null) {
            const key = getCartKey(userName);
            try {
                localStorage.setItem(key, JSON.stringify(cart));
            } catch (e) {
                console.error('Error saving cart to localStorage:', e);
            }
        }
    }, [cart, isClient, userName]);

    const addToCart = (product) => {
        // Direct save to cart without any login requirement or popup alert
        if (!product || !product.id) return;

        const itemImg = product.img || product.image || '';
        const itemImages = Array.isArray(product.images) && product.images.length > 0 ? product.images : null;
        const itemPrice = typeof product.price === 'number'
            ? product.price
            : (parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0);
        const qtyToAdd = Number(product.quantity) || 1;

        setCart((prevCart) => {
            const current = prevCart || [];
            const existingIndex = current.findIndex((item) => String(item.id) === String(product.id));

            if (existingIndex > -1) {
                return current.map((item, idx) =>
                    idx === existingIndex
                        ? {
                            ...item,
                            ...product,
                            name: product.name || item.name,
                            price: itemPrice,
                            img: itemImg || item.img,
                            image: itemImg || item.image,
                            images: itemImages || item.images,
                            quantity: (Number(item.quantity) || 1) + qtyToAdd
                          }
                        : item
                );
            }

            return [
                ...current,
                {
                    ...product,
                    id: product.id,
                    name: product.name,
                    price: itemPrice,
                    img: itemImg,
                    image: itemImg,
                    images: itemImages,
                    quantity: qtyToAdd
                }
            ];
        });
    };

    const buyNow = (product) => {
        if (!product || !product.id) return;

        const itemImg = product.img || product.image || '';
        const itemImages = Array.isArray(product.images) && product.images.length > 0 ? product.images : null;
        const itemPrice = typeof product.price === 'number'
            ? product.price
            : (parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0);
        const qty = Number(product.quantity) || 1;

        const buyNowItem = {
            ...product,
            id: product.id,
            name: product.name,
            price: itemPrice,
            img: itemImg,
            image: itemImg,
            images: itemImages,
            quantity: qty
        };

        setCart([buyNowItem]);
    };

    const updateQuantity = (id, quantity) => {
        setCart((prevCart) => {
            if (!prevCart) return [];
            if (quantity <= 0) {
                return prevCart.filter((item) => String(item.id) !== String(id));
            }
            return prevCart.map((item) => (String(item.id) === String(id) ? { ...item, quantity: Number(quantity) } : item));
        });
    };

    const removeFromCart = (id) => {
        setCart((prevCart) => (prevCart ? prevCart.filter((item) => String(item.id) !== String(id)) : []));
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart ? cart.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0) : 0;
    const cartCount = cart ? cart.reduce((count, item) => count + (Number(item.quantity) || 1), 0) : 0;

    // Don't render until client side hydration is complete for cart state
    if (!isClient) {
        return (
            <CartContext.Provider value={{ cart: [], addToCart, buyNow, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount }}>
                {children}
            </CartContext.Provider>
        );
    }

    return (
        <CartContext.Provider
            value={{ cart, addToCart, buyNow, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
