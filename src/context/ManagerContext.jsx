import React, { createContext, useContext, useState, useEffect } from 'react';

const ManagerContext = createContext();

export const useManager = () => {
  const context = useContext(ManagerContext);
  if (!context) throw new Error("useManager must be used within a ManagerProvider");
  return context;
};

export const ManagerProvider = ({ children }) => {
  const [agents, setAgents] = useState([
    { id: 'a1', name: 'Ramesh Kumar', phone: '9876543210', status: 'Available' },
    { id: 'a2', name: 'Suresh Singh', phone: '9876543211', status: 'Busy' },
    { id: 'a3', name: 'Anita Desai', phone: '9876543212', status: 'Available' },
  ]);

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('pb_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 1, type: 'alert', text: 'Low stock on Pink Matte Lipstick', date: new Date().toISOString(), read: false }
    ];
  });

  const [orderAssignments, setOrderAssignments] = useState(() => {
    const saved = localStorage.getItem('pb_assignments');
    return saved ? JSON.parse(saved) : {};
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('pb_manager_auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('pb_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('pb_assignments', JSON.stringify(orderAssignments));
  }, [orderAssignments]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'pb_notifications' && e.newValue) {
        setNotifications(JSON.parse(e.newValue));
      }
      if (e.key === 'pb_assignments' && e.newValue) {
        setOrderAssignments(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = (username, password) => {
    if (username === 'admin' && password === 'manager123') {
      setIsAuthenticated(true);
      localStorage.setItem('pb_manager_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pb_manager_auth');
  };

  const assignAgent = (orderId, agentId) => {
    setOrderAssignments(prev => ({ ...prev, [orderId]: agentId }));
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      addNotification(`Order #${orderId} assigned to ${agent.name}`, 'info');
      setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: 'Busy' } : a));
    }
  };

  const addNotification = (text, type = 'info') => {
    const newNotif = {
      id: Date.now(),
      type,
      text,
      date: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <ManagerContext.Provider value={{
      agents,
      notifications,
      orderAssignments,
      assignAgent,
      addNotification,
      markAllRead,
      unreadCount,
      isAuthenticated,
      login,
      logout
    }}>
      {children}
    </ManagerContext.Provider>
  );
};
