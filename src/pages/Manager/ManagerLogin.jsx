import React, { useState } from 'react';
import { useManager } from '../../context/ManagerContext';
import { Lock } from 'lucide-react';

const ManagerLogin = () => {
  const { login } = useManager();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)' }}>
      <div className="manager-card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f3e5f5', color: '#9C27B0', marginBottom: '16px' }}>
            <Lock size={32} />
          </div>
          <h2 style={{ margin: '0 0 8px 0', color: '#333' }}>Manager Portal</h2>
          <p style={{ margin: 0, color: '#666' }}>Secure Login Required</p>
        </div>

        {error && (
          <div style={{ padding: '12px', backgroundColor: '#ffebee', color: '#d32f2f', borderRadius: '6px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444' }}>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} 
              placeholder="admin"
              required
              maxLength={20}
            />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} 
              placeholder="••••••••"
              required
              maxLength={20}
            />
          </div>
          <button type="submit" className="manager-btn" style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
            Login to Portal
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManagerLogin;
