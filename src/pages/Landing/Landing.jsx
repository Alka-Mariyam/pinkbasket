import React from 'react';
import { ArrowRight, Star, ShieldCheck, Truck, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="landing animate-fade-in">
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-badge">New Summer Collection 2024</span>
            <h1 className="hero-title">
              Discover Fashion That <span className="gradient-text">Speaks</span> To You
            </h1>
            <p className="hero-subtitle">
              Explore our curated collection of premium clothing, accessories, and lifestyle products designed for the modern trendsetter.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => navigate('/shop')}>
                Shop Now <ArrowRight size={20} />
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/shop?category=c6')}>
                View Offers
              </button>
            </div>
          </div>
          <div className="hero-image-container">
            <div className="hero-shape-bg"></div>
            <div className="hero-image-mockup card">
              <div className="mockup-content">
                <h2>Trending Offers</h2>
                <div className="mockup-product" onClick={() => navigate('/product/p4')}>
                  <img src="/images/mystery_box.png" alt="Trending Mystery Box" />
                  <span className="offer-badge">-70%</span>
                  <div className="mockup-info">
                    <h4>Mystery Box</h4>
                    <p>₹2399</p>
                  </div>
                </div>
                <div className="mockup-product" onClick={() => navigate('/product/p1')}>
                  <img src="/images/floral_dress.png" alt="Trending Floral Dress" />
                  <span className="offer-badge">-25%</span>
                  <div className="mockup-info">
                    <h4>Floral Dress</h4>
                    <p>₹3600</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features bg-soft">
        <div className="container features-container">
          <div className="feature-card card">
            <div className="feature-icon"><Truck size={32} /></div>
            <h3>Free Shipping</h3>
            <p>On all orders over ₹4000</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon"><ShieldCheck size={32} /></div>
            <h3>Secure Payment</h3>
            <p>100% secure payment</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon"><Clock size={32} /></div>
            <h3>24/7 Support</h3>
            <p>Dedicated support</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
