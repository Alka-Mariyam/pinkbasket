import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useManager } from '../../context/ManagerContext';
import { Package, Truck, MapPin, CheckCircle, ArrowLeft, XCircle, AlertTriangle } from 'lucide-react';
import './TrackOrder.css';

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, cancelOrder, returnOrder } = useUser();
  const { addNotification, agents, orderAssignments } = useManager();
  const order = orders.find(o => o.id === orderId);

  const assignedAgentId = orderAssignments[orderId];
  const assignedAgent = agents.find(a => a.id === assignedAgentId);

  // States to simulate real-time tracking
  const statusToStage = {
    'Processing': 1,
    'Shipped': 2,
    'Out for Delivery': 3,
    'Delivered': 4
  };

  const currentStage = statusToStage[order?.status] || 1;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Ordered by mistake');
  const [returnReason, setReturnReason] = useState('Defective/Damaged');
  const [cancelDetails, setCancelDetails] = useState('');
  const [returnDetails, setReturnDetails] = useState('');
  const [showPolicy, setShowPolicy] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const eta = order?.eta || 'Standard Delivery';

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);
  }, []);

  if (!order) {
    return (
      <div className="container track-order-empty">
        <h2>Order Not Found</h2>
        <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  const stages = [
    { id: 1, label: 'Order Placed', icon: <Package size={24} /> },
    { id: 2, label: 'Shipped', icon: <Truck size={24} /> },
    { id: 3, label: 'Out for Delivery', icon: <MapPin size={24} /> },
    { id: 4, label: 'Delivered', icon: <CheckCircle size={24} /> }
  ];

  return (
    <div className="track-order-page container animate-fade-in">
      <button className="back-link" onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="track-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Track Your Order</h1>
          <p>Order #{order.id} • Placed on {new Date(order.date || Date.now()).toLocaleDateString()}</p>
        </div>
        {order.status !== 'Cancelled' && order.status !== 'Returned' && currentStage < 4 && (
          <button className="btn btn-outline" style={{ borderColor: '#ff4444', color: '#ff4444' }} onClick={() => setShowCancelModal(true)}>
            Cancel Order
          </button>
        )}
        {order.status !== 'Returned' && order.status !== 'Cancelled' && currentStage === 4 && (
          <button className="btn btn-outline" style={{ borderColor: '#9C27B0', color: '#9C27B0' }} onClick={() => setShowReturnModal(true)}>
            Return Item(s)
          </button>
        )}
      </div>

      <div className="track-layout">
        <div className="track-main card">
          
          <div className="status-overview">
            <div className="status-badge" style={{ backgroundColor: order.status === 'Cancelled' ? '#ff4444' : order.status === 'Returned' ? '#9C27B0' : '' }}>
              {order.status === 'Cancelled' ? 'CANCELLED' : order.status === 'Returned' ? 'RETURN INITIATED' : currentStage === 4 ? 'DELIVERED' : currentStage === 3 ? 'OUT FOR DELIVERY' : currentStage === 2 ? 'SHIPPED' : 'PREPARING'}
            </div>
            <h2>{order.status === 'Cancelled' ? 'Order Cancelled' : order.status === 'Returned' ? 'Return Initiated' : `Estimated Delivery: ${currentStage === 4 ? 'Completed' : eta}`}</h2>
            {order.status !== 'Cancelled' && order.status !== 'Returned' && (
              <p className="courier-info">
                {assignedAgent ? (
                  <span style={{ color: '#9C27B0', fontWeight: 'bold' }}>
                    Delivery Agent: {assignedAgent.name} • Phone: {assignedAgent.phone}
                  </span>
                ) : (
                  <span>Awaiting Agent Assignment... • Tracking ID: PK-{Math.floor(Math.random() * 10000000)}</span>
                )}
              </p>
            )}
          </div>

          {order.status === 'Cancelled' || order.status === 'Returned' ? (
            <div className="cancelled-state-block" style={{ padding: '30px', textAlign: 'center', background: order.status === 'Returned' ? '#fdfafb' : '#fff5f5', borderRadius: '12px', marginTop: '20px', border: `1px solid ${order.status === 'Returned' ? '#f3e5f5' : '#ffcccc'}` }}>
              {order.status === 'Cancelled' ? (
                <>
                  <XCircle size={64} color="#ff4444" style={{ marginBottom: '16px' }} />
                  <h3 style={{ color: '#d32f2f', marginBottom: '12px' }}>Cancellation Confirmed</h3>
                  <p style={{ color: '#555', marginBottom: '8px' }}>Your order has been successfully cancelled.</p>
                </>
              ) : (
                <>
                  <Package size={64} color="#9C27B0" style={{ marginBottom: '16px' }} />
                  <h3 style={{ color: '#7B1FA2', marginBottom: '12px' }}>Return Request Received</h3>
                  <p style={{ color: '#555', marginBottom: '8px' }}>A pickup agent will arrive <strong>tomorrow</strong> to collect the item(s).</p>
                </>
              )}
              <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #eee', display: 'inline-block', textAlign: 'left', marginTop: '12px' }}>
                <p style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px', color: order.status === 'Returned' ? '#9C27B0' : '#2e7d32', fontWeight: 'bold' }}>
                  <CheckCircle size={18} /> {order.status === 'Returned' ? 'Refund Pending Pickup' : 'Refund Initiated'}
                </p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>A refund of <strong>₹{order.total}</strong> {order.status === 'Returned' ? 'will be processed to your original payment method once the item is picked up.' : 'has been processed to your original payment method. Please allow 3-5 business days for it to appear on your statement.'}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Stepper */}
              <div className="tracking-stepper">
                {stages.map((stage, index) => (
                  <div 
                    key={stage.id} 
                    className={`stepper-item ${currentStage >= stage.id ? 'active' : ''} ${currentStage === stage.id ? 'current' : ''}`}
                  >
                    <div className="step-icon-wrapper">
                      {stage.icon}
                    </div>
                    <div className="step-label">
                      <h4>{stage.label}</h4>
                      {currentStage >= stage.id && (
                        <span className="step-time">
                          {new Date(Date.now() - (4 - stage.id) * 3600000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      )}
                    </div>
                    {index < stages.length - 1 && <div className="step-connector"></div>}
                  </div>
                ))}
              </div>

              <div className="map-container">
                <div className="live-pulse">LIVE</div>
                <img src="/images/mock_delivery_map.png" alt="Delivery Map" className="map-image" />
              </div>
            </>
          )}

        </div>

        <aside className="track-sidebar card">
          <h3>Order Details</h3>
          <div className="order-items">
            {order.items.map((item, idx) => (
              <div key={idx} className="track-item">
                <img src={item.product.images[0]} alt={item.product.name} />
                <div className="track-item-info">
                  <h4>{item.product.name}</h4>
                  <p>Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <hr />
          <div className="track-summary">
            <div className="summary-row">
              <span>Total</span>
              <strong>₹{order.total}</strong>
            </div>
          </div>
        </aside>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content card animate-fade-in" style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '16px', color: '#333' }}>Cancel Order</h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>Are you sure you want to cancel Order #{order.id}? This action cannot be undone.</p>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444' }}>Reason for cancellation</label>
              <select 
                value={cancelReason} 
                onChange={(e) => setCancelReason(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '16px' }}
              >
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                <option value="Shipping takes too long">Shipping takes too long</option>
                <option value="Item no longer needed">Item no longer needed</option>
                <option value="Other">Other</option>
              </select>
              
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444' }}>Additional Comments (Optional)</label>
              <textarea 
                value={cancelDetails}
                onChange={(e) => setCancelDetails(e.target.value)}
                style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '16px' }}
                placeholder="Tell us more..."
              />

              <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '6px', border: '1px solid #eee' }}>
                <button 
                  onClick={() => setShowPolicy(!showPolicy)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 'bold', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  View Refund Policy {showPolicy ? '▲' : '▼'}
                </button>
                {showPolicy && (
                  <div style={{ marginTop: '12px', fontSize: '0.9rem', color: '#555', lineHeight: '1.5' }}>
                    <p style={{ margin: '0 0 8px 0' }}><strong>10-Day Cancellation & Return:</strong> You can cancel your order anytime before it is delivered for a full refund. If delivered, you have 10 days to initiate a return.</p>
                    <p style={{ margin: 0 }}><strong>Refund Timeline:</strong> Refunds are processed immediately upon cancellation and credited back to your original payment method within <strong>3-5 business days</strong>.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowCancelModal(false)} disabled={isCancelling}>Keep Order</button>
              <button 
                className="btn btn-primary" 
                style={{ backgroundColor: '#ff4444', borderColor: '#ff4444' }}
                disabled={isCancelling}
                onClick={async () => {
                  setIsCancelling(true);
                  // Fire off API request to send email
                  try {
                    await fetch('http://localhost:3001/api/refund-success', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        userEmail: 'alka70552@gmail.com', // Always send to the user's real email for testing
                        orderId: order.id,
                        refundAmount: order.total
                      })
                    });
                  } catch (e) {
                    console.error('Failed to send refund email', e);
                  }
                  
                  // Update local state
                  cancelOrder(order.id, cancelReason);
                  addNotification(`Order #${order.id} was cancelled by user`, 'alert');
                  setShowCancelModal(false);
                  setIsCancelling(false);
                }}
              >
                {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Return Modal */}
      {showReturnModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content card animate-fade-in" style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '16px', color: '#333' }}>Return Item(s)</h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>Are you sure you want to return items from Order #{order.id}? Please ensure they are in original condition.</p>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444' }}>Reason for return</label>
              <select 
                value={returnReason} 
                onChange={(e) => setReturnReason(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '16px' }}
              >
                <option value="Defective/Damaged">Defective/Damaged</option>
                <option value="Wrong Item Sent">Wrong Item Sent</option>
                <option value="Does not fit">Does not fit</option>
                <option value="Changed my mind">Changed my mind</option>
                <option value="Quality not as expected">Quality not as expected</option>
              </select>
              
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444' }}>Additional Comments (Optional)</label>
              <textarea 
                value={returnDetails}
                onChange={(e) => setReturnDetails(e.target.value)}
                style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '16px' }}
                placeholder="Tell us what went wrong..."
              />
            </div>
            
            <div className="modal-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowReturnModal(false)} disabled={isReturning}>Cancel</button>
              <button 
                className="btn btn-primary" 
                style={{ backgroundColor: '#9C27B0', borderColor: '#9C27B0' }}
                disabled={isReturning}
                onClick={async () => {
                  setIsReturning(true);
                  try {
                    await fetch('http://localhost:3001/api/return-success', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        userEmail: 'alka70552@gmail.com',
                        orderId: order.id,
                        refundAmount: order.total
                      })
                    });
                  } catch (e) {
                    console.error('Failed to send return email', e);
                  }
                  
                  returnOrder(order.id, returnReason);
                  addNotification(`Return requested for Order #${order.id}`, 'alert');
                  setShowReturnModal(false);
                  setIsReturning(false);
                }}
              >
                {isReturning ? 'Processing...' : 'Confirm Return'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
