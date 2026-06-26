import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, RotateCcw, Bell, MessageSquare } from 'lucide-react';
import { useManager } from '../../context/ManagerContext';
import ManagerOverview from './ManagerOverview';
import ProductsManager from './ProductsManager';
import OrdersManager from './OrdersManager';
import ReturnsManager from './ReturnsManager';
import NotificationsManager from './NotificationsManager';
import ChatManager from './ChatManager';
import Auth from '../Auth/Auth';
import './ManagerLayout.css';

const ManagerLayout = () => {
  const location = useLocation();
  const { unreadCount, isAuthenticated, logout } = useManager();

  if (!isAuthenticated) {
    return <Auth />;
  }

  const navLinks = [
    { path: '/manager', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { path: '/manager/products', label: 'Products', icon: <Package size={20} /> },
    { path: '/manager/orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    { path: '/manager/returns', label: 'Returns', icon: <RotateCcw size={20} /> },
    { path: '/manager/support', label: 'Support', icon: <MessageSquare size={20} /> },
    { path: '/manager/notifications', label: 'Notifications', icon: (
      <div style={{ position: 'relative' }}>
        <Bell size={20} />
        {unreadCount > 0 && <span className="notification-badge" style={{ position: 'absolute', top: -8, right: -8, background: 'red', color: 'white', borderRadius: '50%', fontSize: '10px', padding: '2px 6px' }}>{unreadCount}</span>}
      </div>
    ) },
  ];

  return (
    <div className="manager-layout">
      <aside className="manager-sidebar">
        <div className="sidebar-header">
          <h2>Manager Portal</h2>
        </div>
        <nav className="manager-nav">
          {navLinks.map((link, index) => (
            <Link 
              key={index} 
              to={link.path} 
              className={`manager-nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', padding: '20px', borderTop: '1px solid var(--color-border)' }}>
          <button 
            onClick={logout} 
            className="manager-btn secondary" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="manager-content">
        <Routes>
          <Route path="/" element={<ManagerOverview />} />
          <Route path="/products" element={<ProductsManager />} />
          <Route path="/orders" element={<OrdersManager />} />
          <Route path="/returns" element={<ReturnsManager />} />
          <Route path="/support" element={<ChatManager />} />
          <Route path="/notifications" element={<NotificationsManager />} />
        </Routes>
      </main>
    </div>
  );
};

export default ManagerLayout;
