import { formatCurrency } from '../../utils/currencyUtils';
import { useUser } from '../../context/UserContext';
import { useManager } from '../../context/ManagerContext';

const OrdersManager = () => {
  const { orders, updateOrderStatus } = useUser();
  const { agents, orderAssignments, assignAgent } = useManager();

  // Filter out cancelled/returned from this view if we want, or just show all.
  // We'll show all but indicate status.
  const displayOrders = [...orders].reverse();

  return (
    <div>
      <div className="manager-header">
        <h1>Orders Management</h1>
      </div>

      <div className="manager-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="manager-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Delivery Agent</th>
            </tr>
          </thead>
          <tbody>
            {displayOrders.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No orders found.</td></tr>
            ) : displayOrders.map(order => (
              <tr key={order.id}>
                <td><strong>#{order.id}</strong></td>
                <td>{new Date(order.date || Date.now()).toLocaleDateString()}</td>
                <td>{formatCurrency(order.total)}</td>
                <td>
                  {order.status === 'Cancelled' || order.status === 'Returned' ? (
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      backgroundColor: order.status === 'Cancelled' ? '#ffebee' : '#f3e5f5',
                      color: order.status === 'Cancelled' ? '#d32f2f' : '#9C27B0'
                    }}>
                      {order.status}
                    </span>
                  ) : (
                    <select 
                      value={order.status || 'Processing'} 
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: '#e8f5e9', color: '#2e7d32', fontWeight: 'bold' }}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  )}
                </td>
                <td>
                  {order.status === 'Cancelled' || order.status === 'Returned' ? (
                    <span style={{ color: '#aaa' }}>N/A</span>
                  ) : (
                    <select 
                      value={orderAssignments[order.id] || ''} 
                      onChange={(e) => assignAgent(order.id, e.target.value)}
                      style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                      <option value="" disabled>Assign Agent...</option>
                      {agents.map(agent => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name} ({agent.status})
                        </option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersManager;
