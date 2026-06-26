import React from 'react';
import { useUser } from '../../context/UserContext';
import { useShop } from '../../context/ShopContext';
import { Users, ShoppingCart, DollarSign, RotateCcw } from 'lucide-react';

const ManagerOverview = () => {
  const { orders } = useUser();
  const { products } = useShop();

  // Calculate total revenue from completed orders
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled' && o.status !== 'Returned')
    .reduce((sum, o) => {
      const val = parseFloat((o.total ?? '').toString().replace(/[^0-9.-]+/g, '')) || 0;
      return sum + val;
    }, 0);

  // Total number of orders (including all statuses)
  const totalOrders = orders.length;

  // Total amount refunded or cancelled
  const totalRefunded = orders
    .filter(o => o.status === 'Cancelled' || o.status === 'Returned')
    .reduce((sum, o) => {
      const val = parseFloat((o.total ?? '').toString().replace(/[^0-9.-]+/g, '')) || 0;
      return sum + val;
    }, 0);

  // Count of returns/cancels (kept for potential other uses)
  const returnedCount = orders.filter(o => o.status === 'Returned' || o.status === 'Cancelled').length;

  // Helper to format numbers as Indian Rupee currency
  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  return (
    <div>
      <div className="manager-header">
        <h1>Dashboard Overview</h1>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="manager-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#e3f2fd', padding: '16px', borderRadius: '50%', color: '#1976d2' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px 0', color: '#666', fontSize: '0.9rem' }}>Total Revenue</h3>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(totalRevenue)}</p>
          </div>
        </div>

        <div className="manager-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#f3e5f5', padding: '16px', borderRadius: '50%', color: '#9C27B0' }}>
            <ShoppingCart size={24} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px 0', color: '#666', fontSize: '0.9rem' }}>Total Orders</h3>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{totalOrders}</p>
          </div>
        </div>

        <div className="manager-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#e8f5e9', padding: '16px', borderRadius: '50%', color: '#388e3c' }}>
            <Users size={24} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px 0', color: '#666', fontSize: '0.9rem' }}>Active Products</h3>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{products.length}</p>
          </div>
        </div>

        <div className="manager-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#ffebee', padding: '16px', borderRadius: '50%', color: '#d32f2f' }}>
            <RotateCcw size={24} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px 0', color: '#666', fontSize: '0.9rem' }}>Refunded Balance</h3>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(totalRefunded)}</p>
          </div>
        </div>
      </div>

      <div className="manager-card">
        <h3>Recent Activity</h3>
        <p style={{ color: '#666' }}>All systems operational. Check the notifications tab for recent alerts.</p>
      </div>
    </div>
  );
};

export default ManagerOverview;
