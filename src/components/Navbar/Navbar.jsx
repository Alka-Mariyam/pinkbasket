import React from 'react';
import { ShoppingBag, Search, Heart, ShoppingCart, User, Moon, Sun, Menu, Crown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useUser } from '../../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, hasPinkPass } = useUser();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <ShoppingBag className="logo-icon" size={28} />
          <span className="logo-text">Pink<span className="gradient-text">Basket</span></span>
        </Link>

        {/* Search */}
        <form className="navbar-search" onSubmit={(e) => {
          e.preventDefault();
          const query = e.target.search.value.trim();
          if (query) navigate(`/shop?search=${encodeURIComponent(query)}`);
        }}>
          <input type="text" name="search" placeholder="Search for products, brands and more..." />
          <button type="submit" className="search-btn">
            <Search size={20} />
          </button>
        </form>

        {/* Links & Icons */}
        <div className="navbar-actions">
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
          </div>

          <div className="nav-icons">
            <button className="icon-btn" onClick={() => navigate('/dashboard/wishlist')}>
              <Heart size={24} />
              {wishlistItems.length > 0 && <span className="badge">{wishlistItems.length}</span>}
            </button>
            <button className="icon-btn" onClick={() => navigate('/cart')}>
              <ShoppingCart size={24} />
              {cartItems.length > 0 && <span className="badge">{cartItems.length}</span>}
            </button>
            <button className="icon-btn profile-btn" onClick={() => navigate(user ? '/dashboard' : '/auth')}>
              {hasPinkPass ? <Crown size={24} color="#FFD700" style={{ filter: 'drop-shadow(0 2px 4px rgba(255,215,0,0.4))' }} /> : <User size={24} />}
              <span className="profile-text" style={hasPinkPass ? { color: '#FFD700', fontWeight: 'bold' } : {}}>{user ? user.name : 'Profile'}</span>
            </button>
          </div>
          
          <button className="mobile-menu-btn icon-btn">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
