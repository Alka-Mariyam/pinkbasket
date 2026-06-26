import React, { useState } from 'react';
import { Package, Heart, Star, Award, Grid, LogOut, ShoppingCart, Trash2, Crown, Lock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import './Dashboard.css';
import { formatCurrency } from '../../utils/currencyUtils';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const StripePaymentForm = ({ onPaymentSuccess, isProcessing, setIsProcessing, amount }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    
    // Simulate API delay for realistic effect since there's no backend
    setTimeout(() => {
      onPaymentSuccess();
    }, 2000);
  };

  return (
    <div className="stripe-modal-overlay animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="stripe-modal card" style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '400px', margin: '20px' }}>
        <div className="stripe-modal-header" style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Subscribe to PinkPass</h3>
          <p style={{ margin: 0, color: '#666' }}>Total: {formatCurrency(amount)}</p>
        </div>
        <form id="stripe-form" onSubmit={handleSubmit} className="stripe-form">
          <div className="card-element-container" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '16px' }}>
            <CardElement options={{
              style: {
                base: { fontSize: '16px', color: '#333', '::placeholder': { color: '#aab7c4' } },
                invalid: { color: '#FF2E93' },
              },
            }} />
          </div>
          <p className="secure-payment-text" style={{ fontSize: '0.8rem', color: '#666', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '20px' }}><Lock size={14} /> Securely encrypted by Stripe</p>
          <div className="stripe-modal-actions" style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsProcessing(false)} disabled={isProcessing}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={!stripe || isProcessing}>
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const Overview = ({ user, loyaltyPoints, orders }) => {
  // Helper to parse numeric values from order total (removes currency symbols etc.)
  const parseAmount = (val) => parseFloat((val ?? '').toString().replace(/[^0-9.-]+/g, '')) || 0;
  const refundedBalance = orders
    .filter(o => o.status === 'Cancelled' || o.status === 'Returned')
    .reduce((sum, o) => sum + parseAmount(o.total), 0);

  return (
  <>
    <div className="welcome-banner card">
      <div className="banner-content">
        <h2>Welcome back, {user.name}! 👋</h2>
        <p>You have new personalized offers waiting for you.</p>
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div className="loyalty-points">
          <Award size={32} className="loyalty-icon" />
          <div>
            <span className="points-value">{loyaltyPoints}</span>
            <span className="points-label">Pink Points</span>
          </div>
        </div>
        <div className="loyalty-points" style={{ background: '#fff5f5', color: '#ff4444' }}>
          <div style={{ padding: '8px', background: '#ffebee', borderRadius: '50%', color: '#ff4444' }}>₹</div>
          <div>
            <span className="points-value" style={{ color: '#ff4444' }}>{formatCurrency(refundedBalance)}</span>
            <span className="points-label" style={{ color: '#d32f2f' }}>Refunded Balance</span>
          </div>
        </div>
      </div>
    </div>

    <div className="dashboard-grid">
      <div className="dashboard-section card">
        <div className="section-header">
          <h3>Recent Orders</h3>
          <Link to="/dashboard/orders" className="view-all">View All</Link>
        </div>
        <div className="order-list">
          {orders.length === 0 ? <p>No recent orders.</p> : orders.slice(0, 3).map((o, i) => (
            <div className="order-item" key={i}>
              <div className="order-icon"><Package size={20} /></div>
              <div className="order-details">
                <h4>Order #{o.id || '1234'}</h4>
                <p>Total: {formatCurrency(o.total)}</p>
              </div>
              <div className="order-status status-transit">{o.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
  );
};

const WishlistView = () => {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleMoveToCart = (item) => {
    addToCart(item);
    toggleWishlist(item); // Remove from wishlist after moving
  };

  return (
    <div className="dashboard-section card">
      <div className="section-header">
        <h3>My Wishlist ({wishlistItems.length} Items)</h3>
      </div>
      
      {wishlistItems.length === 0 ? (
        <div className="empty-state">
          <Heart size={48} color="var(--color-border)" />
          <p>Your wishlist is empty.</p>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/shop')}>Explore Products</button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map(item => (
            <div key={item.id} className="wishlist-item">
              <img src={item.images[0]} alt={item.name} onClick={() => navigate(`/product/${item.id}`)} />
              <div className="wishlist-item-info">
                <h4 onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h4>
                <p className="price">₹{item.price.toFixed(2)}</p>
                <div className="wishlist-actions">
                  <button className="btn btn-primary btn-sm w-full" onClick={() => handleMoveToCart(item)}>
                    <ShoppingCart size={16} /> Move to Cart
                  </button>
                  <button className="btn btn-outline btn-sm w-full" onClick={() => toggleWishlist(item)}>
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const OrdersView = ({ orders }) => {
  return (
    <div className="dashboard-section card">
      <div className="section-header">
        <h3>Your Orders ({orders.length})</h3>
      </div>
      
      {orders.length === 0 ? (
        <div className="empty-state">
          <Package size={48} color="var(--color-border)" />
          <p>You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn btn-primary mt-4">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-full-list">
          {orders.map((o, i) => (
            <div className="order-full-item card" key={i}>
              <div className="order-full-header">
                <div>
                  <p className="order-date">Order Placed: {new Date(o.date).toLocaleDateString()}</p>
                  <h4>Order #{o.id}</h4>
                  {o.eta && <p className="order-eta" style={{ color: 'var(--color-primary)', fontSize: '0.85rem', marginTop: '4px', fontWeight: '500' }}>Expected Delivery: {o.eta}</p>}
                </div>
                <div className="order-full-total">
                  <p>Total</p>
                  <h4>₹{o.total}</h4>
                </div>
              </div>
              <div className="order-full-body">
                <div className="order-status-large status-transit">{o.status}</div>
                <div className="order-items-preview">
                  {o.items.map(item => (
                    <div key={item.product.id} className="order-item-mini">
                       <img src={item.product.images[0]} alt={item.product.name} />
                       <div className="mini-info">
                         <p className="mini-name">{item.product.name}</p>
                         <p className="mini-qty">Qty: {item.quantity}</p>
                       </div>
                    </div>
                  ))}
                </div>
                <div className="order-actions mt-3">
                  <Link to={`/track-order/${o.id}`} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
                    Track Order
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PinkPassViewContent = () => {
  const { hasPinkPass, togglePinkPass } = useUser();
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setIsProcessing(false);
    togglePinkPass();
  };

  return (
    <div className="dashboard-section card animate-fade-in">
      <div className="section-header">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Crown size={24} style={{ color: '#FFD700' }} /> PinkPass Membership
        </h3>
      </div>
      <div className="pinkpass-content" style={{ padding: '20px 0' }}>
        {hasPinkPass ? (
          <div style={{ textAlign: 'center', padding: '30px', background: 'linear-gradient(135deg, #fffafb 0%, #ffe3ec 100%)', borderRadius: '12px' }}>
            <Crown size={48} color="#FFD700" style={{ marginBottom: '16px' }} />
            <h4 style={{ fontSize: '1.2rem', color: 'var(--color-text-main)', marginBottom: '8px' }}>You are a PinkPass Member!</h4>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>Enjoy your exclusive 10% discount on all orders and priority customer support.</p>
            <button className="btn btn-outline" onClick={togglePinkPass}>Cancel Subscription</button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px', border: '1px dashed var(--color-border)', borderRadius: '12px' }}>
            <Crown size={48} color="var(--color-border)" style={{ marginBottom: '16px' }} />
            <h4 style={{ fontSize: '1.2rem', color: 'var(--color-text-main)', marginBottom: '8px' }}>Join PinkPass</h4>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>Unlock exclusive benefits, including a flat 10% discount on all your purchases!</p>
            <button className="btn btn-primary" onClick={() => setShowPayment(true)}>Subscribe for ₹5000</button>
          </div>
        )}
      </div>

      {showPayment && (
        <StripePaymentForm 
          amount={5000}
          onPaymentSuccess={handlePaymentSuccess} 
          isProcessing={isProcessing}
          setIsProcessing={(processing) => {
            setIsProcessing(processing);
            if (!processing) setShowPayment(false);
          }}
        />
      )}
    </div>
  );
};

const PinkPassView = () => (
  <Elements stripe={stripePromise}>
    <PinkPassViewContent />
  </Elements>
);

const Dashboard = () => {
  const { user, logout, loyaltyPoints, orders, hasPinkPass } = useUser();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="dashboard container animate-fade-in">
      <aside className="dashboard-sidebar">
        <div className="user-profile card">
          <div className="avatar" style={{ position: 'relative' }}>
            {user.name.charAt(0)}
            {hasPinkPass && (
              <div style={{ position: 'absolute', bottom: -5, right: -5, background: '#fff', borderRadius: '50%', padding: '4px', display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <Crown size={16} color="#FFD700" />
              </div>
            )}
          </div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>

        <nav className="dashboard-nav card">
          <Link to="/dashboard" className={isActive('/dashboard')}><Grid size={20} /> Overview</Link>
          <Link to="/dashboard/pinkpass" className={isActive('/dashboard/pinkpass')}><Crown size={20} /> PinkPass</Link>
          <Link to="/dashboard/orders" className={isActive('/dashboard/orders')}><Package size={20} /> Orders ({orders.length})</Link>
          <Link to="/dashboard/wishlist" className={isActive('/dashboard/wishlist')}><Heart size={20} /> Wishlist ({wishlistItems.length})</Link>
          <a href="#"><Star size={20} /> Reviews</a>
          <a href="#" onClick={handleLogout} className="logout"><LogOut size={20} /> Logout</a>
        </nav>
      </aside>

      <main className="dashboard-main">
        <Routes>
          <Route path="/" element={<Overview user={user} loyaltyPoints={loyaltyPoints} orders={orders} />} />
          <Route path="/pinkpass" element={<PinkPassView />} />
          <Route path="/wishlist" element={<WishlistView />} />
          <Route path="/orders" element={<OrdersView orders={orders} />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
