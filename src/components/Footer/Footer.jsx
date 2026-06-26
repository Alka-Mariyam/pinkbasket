import React from 'react';
import { ShoppingBag, Instagram, Twitter, Facebook, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        
        <div className="footer-brand">
          <Link to="/" className="navbar-logo footer-logo">
            <ShoppingBag className="logo-icon" size={28} />
            <span className="logo-text">Pink<span className="gradient-text">Basket</span></span>
          </Link>
          <p className="footer-description">
            PinkBasket is your premium destination for curated fashion, beauty, and lifestyle products. 
            We blend modern aesthetics with an unparalleled Amazon-like shopping experience.
            Discover fashion that speaks to you.
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/shop">Shop All</Link></li>
            <li><Link to="/shop?category=c6">Today's Deals</Link></li>
            <li><Link to="/dashboard">My Account</Link></li>
            <li><Link to="/dashboard/orders">Track Order</Link></li>
            <li><Link to="/dashboard/wishlist">Wishlist</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Customer Service</h3>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Returns & Refunds</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">PinkPass Terms</a></li>
            <li><a href="#">Size Guide</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <ul>
            <li><Mail size={16} /> support@pinkbasket.com</li>
            <li><strong>Phone:</strong> 1-800-PINK-O</li>
            <li><strong>Address:</strong> 123 Pastel Avenue, Fashion District, NY 10001</li>
          </ul>
        </div>

      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PinkBasket. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
