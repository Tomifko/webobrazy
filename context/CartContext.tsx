'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Obraz } from '@/types';

interface CartItem {
  obraz: Obraz;
  mnozstvo: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (obraz: Obraz) => void;
  removeFromCart: (obrazId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // Lazy initialization - načíta z localStorage len raz pri vytvorení
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Uložiť košík do localStorage pri zmene
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (obraz: Obraz) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.obraz.id === obraz.id);
      
      if (existingItem) {
        // Obraz už je v košíku - nezvyšujeme množstvo (každý obraz je unikát)
        return prevItems;
      }
      
      return [...prevItems, { obraz, mnozstvo: 1 }];
    });
  };

  const removeFromCart = (obrazId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.obraz.id !== obrazId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.obraz.cena * item.mnozstvo, 0);
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.mnozstvo, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalPrice,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart musí byť použitý v CartProvider');
  }
  return context;
}