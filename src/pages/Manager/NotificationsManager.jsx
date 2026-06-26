import React, { useEffect } from 'react';
import { useManager } from '../../context/ManagerContext';
import { Bell, Info, AlertTriangle } from 'lucide-react';

const NotificationsManager = () => {
  const { notifications, markAllRead } = useManager();

  useEffect(() => {
    // Automatically mark as read when visiting this page after a brief delay
    const timer = setTimeout(() => {
      markAllRead();
    }, 2000);
    return () => clearTimeout(timer);
  }, [markAllRead]);

  return (
    <div>
      <div className="manager-header">
        <h1>System Notifications</h1>
        <button className="manager-btn secondary" onClick={markAllRead}>Mark All as Read</button>
      </div>

      <div className="manager-card" style={{ padding: 0, overflow: 'hidden' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#666' }}>No notifications to display.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                style={{ 
                  padding: '20px', 
                  borderBottom: '1px solid #eee',
                  backgroundColor: notif.read ? '#fff' : '#f0f7ff',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}
              >
                <div style={{ color: notif.type === 'alert' ? '#ff4444' : '#1976d2', marginTop: '2px' }}>
                  {notif.type === 'alert' ? <AlertTriangle size={24} /> : <Info size={24} />}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#333' }}>{notif.text}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>
                    {new Date(notif.date).toLocaleString()}
                  </p>
                </div>
                {!notif.read && <div style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1976d2' }}></div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsManager;
