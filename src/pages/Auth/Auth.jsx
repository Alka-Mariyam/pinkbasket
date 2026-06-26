import React, { useState } from 'react';
import { Mail, Lock, User, Phone, CheckCircle, Shield } from 'lucide-react';
import { useManager } from '../../context/ManagerContext';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isManager, setIsManager] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();
  const { login: managerLogin } = useManager();
  
  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };

  const strength = getPasswordStrength();
  
  const handleAuth = (e) => {
    e.preventDefault();
    if (isManager) {
      // Manager login using manager context
      const success = managerLogin(email, password);
      if (!success) {
        // Could set error state, but for simplicity just alert
        alert('Invalid manager credentials');
        return;
      }
      navigate('/manager');
    } else {
      // User login / registration
      login({ 
        name: isLogin ? 'User' : (name || 'User'),
        email: email || 'user@example.com' 
      });
      navigate('/');
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card card">
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Enter your details to access your account' : 'Join PinkBasket to start shopping'}</p>
        </div>

        <div className="auth-tabs">
            <button type="button" className={`tab-btn ${isLogin && !isManager ? 'active' : ''}`} onClick={() => { setIsLogin(true); setIsManager(false); }}>Login</button>
            <button type="button" className={`tab-btn ${!isLogin && !isManager ? 'active' : ''}`} onClick={() => { setIsLogin(false); setIsManager(false); }}>Register</button>
            <button type="button" className={`tab-btn ${isManager ? 'active' : ''}`} onClick={() => { setIsLogin(true); setIsManager(true); }}>Manager Login</button>
          </div>

        <form className="auth-form" onSubmit={handleAuth}>
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  required={!isLogin} 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>{isManager ? 'Username' : (isLogin ? 'Email or Phone' : 'Email Address')}</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder={isManager ? 'Enter username' : (isLogin ? 'Enter email or phone' : 'name@example.com')} 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={20}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={20}
              />
            </div>
            {!isLogin && (
              <div className="password-strength">
                <div className="strength-bars">
                  <div className={`bar ${strength >= 1 ? 'active-weak' : ''}`}></div>
                  <div className={`bar ${strength >= 2 ? 'active-medium' : ''}`}></div>
                  <div className={`bar ${strength >= 3 ? 'active-strong' : ''}`}></div>
                </div>
                <span className="strength-text">
                  {strength === 0 ? 'Enter password' : strength === 1 ? 'Weak' : strength === 2 ? 'Medium' : 'Strong'}
                </span>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-full">
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
