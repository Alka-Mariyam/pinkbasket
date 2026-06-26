import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [savedForLater, setSavedForLater] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id 
          ? { ...item, quantity: item.quantity + quantity } 
          : item);
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const saveForLater = (productId) => {
    const item = cartItems.find(i => i.product.id === productId);
    if (item) {
      removeFromCart(productId);
      setSavedForLater(prev => [...prev, item]);
    }
  };

  const moveToCart = (productId) => {
    const item = savedForLater.find(i => i.product.id === productId);
    if (item) {
      setSavedForLater(prev => prev.filter(i => i.product.id !== productId));
      addToCart(item.product, item.quantity);
    }
  };

  const applyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getDiscount = () => {
    const subtotal = getSubtotal();
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountPercent) return subtotal * (appliedCoupon.discountPercent / 100);
    if (appliedCoupon.discountFlat) return appliedCoupon.discountFlat;
    return 0;
  };

  const getTotal = () => {
    return getSubtotal() - getDiscount(); // Ignoring tax/delivery for simple logic here
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      savedForLater,
      addToCart,
      removeFromCart,
      updateQuantity,
      saveForLater,
      moveToCart,
      appliedCoupon,
      applyCoupon,
      clearCart,
      getSubtotal,
      getDiscount,
      getTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
