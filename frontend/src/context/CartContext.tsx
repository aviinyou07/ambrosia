"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice: number;
  image: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  promoCode: string | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  shippingFee: number;
  freeShippingThreshold: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 2000;
const SHIPPING_COST = 150;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('avyara_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedPromo = localStorage.getItem('avyara_promo');
      if (savedPromo) {
        setPromoCode(savedPromo);
      }
    } catch {
      // ignore JSON errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('avyara_cart', JSON.stringify(items));
      } catch {
        // ignore storage errors
      }
    }
  }, [items, isLoaded]);

  // Recalculate promo discount
  useEffect(() => {
    const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (promoCode === 'AVYARA10') {
      setDiscount(Math.round(rawSubtotal * 0.1));
    } else if (promoCode === 'BUY3' && items.reduce((sum, i) => sum + i.quantity, 0) >= 3) {
      setDiscount(500);
    } else {
      setDiscount(0);
    }
  }, [items, promoCode]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.id === item.id && i.size === item.size
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }

      return [...prev, { ...item, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  };

  const updateQuantity = (id: string, size: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id && i.size === size) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter((i): i is CartItem => i !== null)
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode(null);
    setDiscount(0);
    localStorage.removeItem('avyara_cart');
    localStorage.removeItem('avyara_promo');
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'AVYARA10') {
      setPromoCode('AVYARA10');
      localStorage.setItem('avyara_promo', 'AVYARA10');
      return { success: true, message: '10% discount applied!' };
    }
    if (cleanCode === 'BUY3') {
      setPromoCode('BUY3');
      localStorage.setItem('avyara_promo', 'BUY3');
      return { success: true, message: 'Special bundle ₹500 discount applied!' };
    }
    return { success: false, message: 'Invalid or expired coupon code' };
  };

  const removePromoCode = () => {
    setPromoCode(null);
    setDiscount(0);
    localStorage.removeItem('avyara_promo');
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const total = Math.max(0, subtotal - discount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        cartCount,
        subtotal,
        discount,
        promoCode,
        applyPromoCode,
        removePromoCode,
        shippingFee,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
