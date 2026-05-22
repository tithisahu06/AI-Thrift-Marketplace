import { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const toggleWish = (product) => {
    const id = product._id || product.id;
    setWishlist(prev => {
      const exists = prev.find(p => (p._id || p.id) === id);
      if (exists) {
        toast('Removed from wishlist');
        return prev.filter(p => (p._id || p.id) !== id);
      }
      toast.success('❤️ Added to wishlist!');
      return [...prev, product];
    });
  };

  const isWished = (productId) => wishlist.some(p => (p._id || p.id) === productId);
  const wishCount = wishlist.length;

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWish, isWished, wishCount }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
