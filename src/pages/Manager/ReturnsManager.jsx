import React from 'react';
import { useUser } from '../../context/UserContext';

const ReturnsManager = () => {
  const { orders } = useUser();
  const returnedOrders = orders.filter(o => o.status === 'Returned' || o.status === 'Cancelled').reverse();

  return (
    <div>
      <div className="manager-header">
        <h1>Returns & Cancellations</h1>
      </div>

      <div className="manager-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="manager-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Type</th>
              <th>Refund Amount</th>
              <th>Reason Provided</th>
            </tr>
          </thead>
          <tbody>
            {returnedOrders.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>No returns or cancellations found.</td></tr>
            ) : returnedOrders.map(order => (
              <tr key={order.id}>
                <td><strong>#{order.id}</strong></td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    backgroundColor: order.status === 'Cancelled' ? '#ffebee' : '#f3e5f5',
                    color: order.status === 'Cancelled' ? '#d32f2f' : '#9C27B0'
                  }}>
                    {order.status === 'Cancelled' ? 'Cancellation' : 'Return'}
                  </span>
                </td>
                <td><strong style={{ color: '#d32f2f' }}>₹{order.total}</strong></td>
                <td>
                  <span style={{ color: '#555', fontStyle: 'italic' }}>
                    "{order.cancellationReason || order.returnReason || 'No reason provided'}"
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReturnsManager;
