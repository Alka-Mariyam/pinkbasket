import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('pb_user');
    return stored ? JSON.parse(stored) : null;
  }); // Persisted user
  const [loyaltyPoints, setLoyaltyPoints] = useState(() => {
    const saved = localStorage.getItem('pb_loyalty_points');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('pb_orders');
    return saved ? JSON.parse(saved) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('pb_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('pb_loyalty_points', loyaltyPoints);
  }, [loyaltyPoints]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'pb_orders' && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const [spinAvailable, setSpinAvailable] = useState(true);
  const [rewardsHistory, setRewardsHistory] = useState([]);
  const [hasPinkPass, setHasPinkPass] = useState(false);
  const [addresses, setAddresses] = useState([
    { id: 'a1', label: 'Home', text: '123 Pink Ave, Fashion City, NY 10001' }
  ]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('pb_user', JSON.stringify(userData));
    // If it's a new login and points are 0, we can give a welcome bonus if needed, but we'll leave it as is to preserve saved points.
    if (loyaltyPoints === 0) setLoyaltyPoints(1250); 
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pb_user');
    setHasPinkPass(false);
  };

  const togglePinkPass = () => {
    setHasPinkPass(prev => !prev);
  };

  const addOrder = (order, pointsEarned = 0) => {
    setOrders(prev => [{ ...order, status: 'Processing' }, ...prev]);
    if (pointsEarned > 0) {
      addLoyaltyPoints(pointsEarned, 'Order Purchase');
    }
  };

  const cancelOrder = (orderId, reason) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled', cancellationReason: reason } : o));
    addLoyaltyPoints(-1000, `Order Cancelled`);
  };

  const returnOrder = (orderId, reason) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Returned', returnReason: reason } : o));
    addLoyaltyPoints(-1000, `Order Returned`);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const addLoyaltyPoints = (points, reason) => {
    setLoyaltyPoints(prev => prev + points);
    setRewardsHistory(prev => [{ points, reason, date: new Date().toISOString() }, ...prev]);
  };

  const useSpin = () => {
    setSpinAvailable(false);
  };

  const addAddress = (address) => {
    setAddresses(prev => [...prev, { id: 'a' + Date.now(), ...address }]);
  };

  return (
    <UserContext.Provider value={{
      user,
      login,
      logout,
      loyaltyPoints,
      addLoyaltyPoints,
      orders,
      addOrder,
      cancelOrder,
      returnOrder,
      updateOrderStatus,
      spinAvailable,
      useSpin,
      rewardsHistory,
      addresses,
      addAddress,
      hasPinkPass,
      togglePinkPass
    }}>
      {children}
    </UserContext.Provider>
  );
};
