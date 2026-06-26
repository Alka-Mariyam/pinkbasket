import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Mail, Award } from 'lucide-react';
import './OrderConfirmed.css';

const OrderConfirmed = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const emailUrl = location.state?.emailUrl;
  const pointsEarned = location.state?.pointsEarned;

  useEffect(() => {
    // Scroll to top when loaded
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="order-confirmed-page container animate-fade-in">
      <div className="success-card card">
        <div className="success-icon-wrapper">
          <CheckCircle size={80} className="success-icon" />
        </div>
        
        <h1 className="success-title">Order Confirmed!</h1>
        <p className="success-message">
          Thank you for your purchase! Your order <strong>#{orderId}</strong> has been successfully placed.
          We've sent a confirmation email with your order details and tracking link.
        </p>

        {pointsEarned > 0 && (
          <div className="points-earned-card" style={{ background: 'linear-gradient(135deg, #FFD70022 0%, #FF2E9322 100%)', padding: '16px', borderRadius: '12px', margin: '20px 0', border: '1px solid #FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Award size={32} color="#FFD700" />
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ margin: 0, color: '#333' }}>You earned {pointsEarned} Pink Points!</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>These have been added to your PinkBasket rewards.</p>
            </div>
          </div>
        )}

        <div className="action-buttons">
          {emailUrl && (
            <a 
              href={emailUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn" 
              style={{ backgroundColor: '#fff', border: '1px solid #FF2E93', color: '#FF2E93', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Mail size={20} />
              Open Email Receipt
            </a>
          )}
          
          <button 
            className="btn btn-primary track-btn" 
            onClick={() => navigate(`/track-order/${orderId}`)}
          >
            <Package size={20} />
            Track My Order
            <ArrowRight size={20} />
          </button>
          
          <button 
            className="btn btn-outline" 
            onClick={() => navigate('/shop')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmed;
