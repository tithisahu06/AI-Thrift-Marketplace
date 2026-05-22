import { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.product._id === product._id || i.product.id === product.id);
      if (exists) return prev.map(i =>
        (i.product._id === product._id || i.product.id === product.id)
          ? { ...i, qty: i.qty + 1 } : i
      );
      return [...prev, { product, qty: 1 }];
    });
    toast.success(`🛒 "${product.name || product.title}" added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => (i.product._id || i.product.id) !== productId));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + (i.product.price * i.qty), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
