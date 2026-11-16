import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '../types';

interface CartContextType {
  cart: Book[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  clearCart: () => void;
  isInCart: (bookId: string) => boolean;
  totalPrice: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Book[]>(() => {
    const saved = localStorage.getItem('avazas_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('avazas_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book: Book) => {
    setCart((prev) => (prev.some((b) => b.id === book.id) ? prev : [...prev, book]));
  };

  const removeFromCart = (bookId: string) => {
    setCart((prev) => prev.filter((b) => b.id !== bookId));
  };

  const clearCart = () => setCart([]);

  const isInCart = (bookId: string) => cart.some((b) => b.id === bookId);

  const totalPrice = cart.reduce((sum, item) => sum + Number(item.salePrice), 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, isInCart, totalPrice, totalAmount: totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
