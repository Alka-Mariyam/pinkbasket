import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { useManager } from '../../context/ManagerContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Plus, Lock, Award } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CheckoutPage.css';

// Initialize Stripe with a test publishable key
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const StripePaymentForm = ({ onPaymentSuccess, isProcessing, setIsProcessing }) => {
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
    <div className="stripe-modal-overlay animate-fade-in">
      <div className="stripe-modal card">
        <div className="stripe-modal-header">
          <h3>Complete your Payment</h3>
          <p>Please enter your card details to finalize your order.</p>
        </div>
        <form id="stripe-form" onSubmit={handleSubmit} className="stripe-form">
          <div className="card-element-container">
            <CardElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#333',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#FF2E93',
                },
              },
            }} />
          </div>
          <p className="secure-payment-text"><Lock size={14} /> Securely encrypted by Stripe</p>
          <div className="stripe-modal-actions">
            <button type="button" className="btn btn-outline" onClick={() => setIsProcessing(false)} disabled={isProcessing}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!stripe || isProcessing}>
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const { cartItems, getSubtotal, clearCart } = useCart();
  const { user, addresses, addOrder, hasPinkPass, loyaltyPoints, addLoyaltyPoints } = useUser();
  const { addNotification } = useManager();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]?.id);
  const [selectedSpeed, setSelectedSpeed] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (!user) {
      addNotification("Please sign in to place an order.", "info");
      navigate('/auth');
    }
  }, [user, navigate, addNotification]);

  if (!user) {
    return (
      <div className="checkout-page container animate-fade-in" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Please sign in to place an order</h2>
        <p style={{ marginBottom: '20px', color: 'var(--color-text-light)' }}>You must have an account to proceed with checkout.</p>
        <button className="btn btn-primary" onClick={() => navigate('/auth')}>Go to Sign In</button>
      </div>
    );
  }

  const subtotal = getSubtotal();
  
  // Loyalty points reward logic
  const isEligibleForReward = loyaltyPoints >= 5000;
  const rewardDiscount = isEligibleForReward ? 400 : 0;
  
  const shippingCost = isEligibleForReward ? 0 : (selectedSpeed === 'prime' ? 0 : 499);
  const pinkPassDiscount = hasPinkPass ? subtotal * 0.10 : 0;
  
  const total = Math.max(0, subtotal + shippingCost - pinkPassDiscount - rewardDiscount);
  
  // Calculate total points earned from cart items
  const pointsToEarn = cartItems.reduce((total, item) => total + ((item.product.loyaltyPoints || 0) * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty container">
        <h2>Your cart is empty!</h2>
        <button className="btn btn-primary" onClick={() => navigate('/shop')}>Continue Shopping</button>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    // If it's a digital payment method, show the Stripe modal
    if (selectedPayment === 'card' || selectedPayment === 'upi') {
      setShowPaymentModal(true);
    } else {
      executeOrder(); // COD bypasses Stripe
    }
  };

  const executeOrder = async () => {
    const orderId = `ORD${Date.now()}`;
    const deliveryDays = selectedSpeed === 'prime' ? 1 : 3;
    const etaDate = new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000);
    const formattedEta = etaDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

    const orderDetails = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      total,
      items: cartItems,
      shippingAddress: addresses.find(a => a.id === selectedAddress),
      shippingSpeed: selectedSpeed,
      paymentMethod: selectedPayment,
      pointsEarned: pointsToEarn,
      rewardApplied: isEligibleForReward,
      status: 'Placed',
      eta: formattedEta
    };

    addOrder(orderDetails, pointsToEarn);
    
    // Reset points to 0 if reward was used
    if (isEligibleForReward) {
      addLoyaltyPoints(-loyaltyPoints, 'Reward Redemption (Reset to 0)');
    }

    addNotification(`New order placed: ${orderId} (₹${total.toFixed(2)})`, 'success');
    
    let emailPreviewUrl = null;
    
    // Send SMTP email via backend
    try {
      const response = await fetch('http://127.0.0.1:3001/api/checkout-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user?.email || 'user@example.com',
          orderId: orderId,
          total: total.toFixed(2),
          items: cartItems,
          trackingUrl: `http://localhost:5173/track-order/${orderId}`,
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        emailPreviewUrl = data.previewUrl;
      }
    } catch (error) {
      console.error("Failed to send email: ", error);
    }

    clearCart();
    setIsProcessing(false);
    setShowPaymentModal(false);
    navigate(`/order-confirmed/${orderId}`, { state: { emailUrl: emailPreviewUrl, pointsEarned: pointsToEarn } });
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="checkout-page container animate-fade-in">
        {showPaymentModal && (
          <StripePaymentForm 
            onPaymentSuccess={executeOrder} 
            isProcessing={isProcessing} 
            setIsProcessing={(processing) => {
              setIsProcessing(processing);
              if(!processing) setShowPaymentModal(false); // Handle cancel
            }} 
          />
        )}
        <h1 className="checkout-title">Checkout ({cartItems.length} items)</h1>
      
      <div className="checkout-layout">
        <div className="checkout-accordion">
          
          {/* Step 1: Shipping Address */}
          <div className={`accordion-step card ${activeStep === 1 ? 'active' : ''}`}>
            <div className="step-header">
              <h3>1. Shipping address</h3>
              {activeStep > 1 && <span className="step-summary">{addresses.find(a => a.id === selectedAddress)?.text}</span>}
              {activeStep > 1 && <button className="change-btn" onClick={() => setActiveStep(1)}>Change</button>}
            </div>
            
            {activeStep === 1 && (
              <div className="step-body">
                {addresses.map(addr => (
                  <div key={addr.id} className="address-option">
                    <input 
                      type="radio" 
                      id={addr.id} 
                      name="address" 
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                    />
                    <label htmlFor={addr.id}><strong>{addr.label}</strong>: {addr.text}</label>
                  </div>
                ))}
                <button className="add-new-btn"><Plus size={16}/> Add a new address</button>
                <button className="btn btn-primary use-this-btn" onClick={() => setActiveStep(2)}>Use this address</button>
              </div>
            )}
          </div>

          {/* Step 2: Shipping Speed */}
          <div className={`accordion-step card ${activeStep === 2 ? 'active' : ''}`}>
            <div className="step-header">
              <h3>2. Choose a delivery option</h3>
              {activeStep > 2 && <span className="step-summary">{selectedSpeed === 'prime' ? 'Tomorrow by 9 PM' : 'Standard Delivery'}</span>}
              {activeStep > 2 && <button className="change-btn" onClick={() => setActiveStep(2)}>Change</button>}
            </div>
            
            {activeStep === 2 && (
              <div className="step-body">
                <div className="delivery-option">
                  <input 
                    type="radio" 
                    id="prime" 
                    name="speed" 
                    checked={selectedSpeed === 'prime'}
                    onChange={() => setSelectedSpeed('prime')}
                  />
                  <label htmlFor="prime">
                    <strong>Tomorrow by 9 PM</strong> <span className="free-text">- FREE Delivery with PinkPass</span>
                  </label>
                </div>
                <div className="delivery-option">
                  <input 
                    type="radio" 
                    id="standard" 
                    name="speed" 
                    checked={selectedSpeed === 'standard'}
                    onChange={() => setSelectedSpeed('standard')}
                  />
                  <label htmlFor="standard">
                    <strong>Standard Delivery</strong> - ₹499
                  </label>
                </div>
                <button className="btn btn-primary use-this-btn" onClick={() => setActiveStep(3)}>Continue</button>
              </div>
            )}
          </div>

          {/* Step 3: Payment Method */}
          <div className={`accordion-step card ${activeStep === 3 ? 'active' : ''}`}>
            <div className="step-header">
              <h3>3. Payment method</h3>
              {activeStep > 3 && <span className="step-summary">{selectedPayment}</span>}
              {activeStep > 3 && <button className="change-btn" onClick={() => setActiveStep(3)}>Change</button>}
            </div>
            
            {activeStep === 3 && (
              <div className="step-body">
                <div className="payment-option">
                  <input 
                    type="radio" 
                    id="card" 
                    name="payment" 
                    checked={selectedPayment === 'card'}
                    onChange={() => setSelectedPayment('card')}
                  />
                  <label htmlFor="card">Credit or Debit Card</label>
                </div>
                <div className="payment-option">
                  <input 
                    type="radio" 
                    id="upi" 
                    name="payment" 
                    checked={selectedPayment === 'upi'}
                    onChange={() => setSelectedPayment('upi')}
                  />
                  <label htmlFor="upi">UPI / NetBanking</label>
                </div>
                <div className="payment-option">
                  <input 
                    type="radio" 
                    id="cod" 
                    name="payment" 
                    checked={selectedPayment === 'cod'}
                    onChange={() => setSelectedPayment('cod')}
                  />
                  <label htmlFor="cod">Cash on Delivery</label>
                </div>

                <button className="btn btn-primary use-this-btn" onClick={() => setActiveStep(4)}>Use this payment method</button>
              </div>
            )}
          </div>

          {/* Step 4: Review */}
          <div className={`accordion-step card ${activeStep === 4 ? 'active' : ''}`}>
            <div className="step-header">
              <h3>4. Review items and shipping</h3>
            </div>
            
            {activeStep === 4 && (
              <div className="step-body review-body">
                <div className="review-items">
                  {cartItems.map(item => (
                    <div key={item.product.id} className="review-item">
                      <img src={item.product.images[0]} alt={item.product.name} />
                      <div>
                        <h4>{item.product.name}</h4>
                        <p className="price">₹{item.product.price.toFixed(2)}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="place-order-box-mobile">
                  <button className="btn btn-primary w-full" onClick={handlePlaceOrder}>Place your order</button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Sidebar: Place Order */}
        <aside className="checkout-sidebar">
          <div className="place-order-box card">
            <button 
              className="btn btn-primary w-full" 
              onClick={handlePlaceOrder}
              disabled={activeStep < 4}
            >
              Place your order
            </button>
            <p className="terms-text">By placing your order, you agree to PinkBasket's privacy notice and conditions of use.</p>
            
            <hr />
            
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? <span style={{ color: 'var(--color-success)' }}>Free</span> : `₹${shippingCost}`}</span>
            </div>
            {hasPinkPass && (
              <div className="summary-row discount">
                <span>PinkPass Discount (10%)</span>
                <span>-₹{pinkPassDiscount.toFixed(2)}</span>
              </div>
            )}
            {isEligibleForReward && (
              <div className="summary-row discount" style={{ color: 'var(--color-primary-dark)' }}>
                <span>5000 Points Reward</span>
                <span>-₹400.00</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            
            <div className="points-preview" style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
               <Award size={16} style={{ display: 'inline', color: '#FFD700', verticalAlign: 'text-bottom' }} /> You will earn <strong>{pointsToEarn} Pink Points</strong>!
            </div>
          </div>
        </aside>

      </div>
    </div>
    </Elements>
  );
};

export default CheckoutPage;
