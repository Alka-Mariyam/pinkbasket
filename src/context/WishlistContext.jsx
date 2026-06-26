import React, { createContext, useContext, useState } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export default function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [priceDropAlerts, setPriceDropAlerts] = useState([]);

  const toggleWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        // Remove from wishlist without adding price drop alerts
        return prev.filter(item => item.id !== product.id);
      } else {
        // Add product to wishlist; price drop alerts can be handled elsewhere
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist, priceDropAlerts }}>
      {children}
    </WishlistContext.Provider>
  );
}


