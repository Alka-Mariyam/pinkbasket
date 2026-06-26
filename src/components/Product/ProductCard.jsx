import React from 'react';
import { Heart, ShoppingCart, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    // Could add a toast notification here
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const outOfStock = product.stockStatus === 'Out of Stock';

  return (
    <div className="product-card card animate-fade-in" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="product-image-container">
        <img src={product.images[0]} alt={product.name} className="product-image" loading="lazy" />
        
        {/* Badges */}
        <div className="product-badges">
          {product.discount > 0 && <span className="badge-discount">-{product.discount}%</span>}
          {product.isMystery && <span className="badge-mystery"><Zap size={12} /> Mystery</span>}
        </div>

        {/* Hover Actions */}
        <div className="product-hover-actions">
          <button 
            className={`action-btn ${isInWishlist(product.id) ? 'active' : ''}`} 
            onClick={handleWishlist}
            aria-label="Wishlist"
          >
            <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <div className="product-info">
        <div className="product-rating">
          <Star size={14} fill="var(--color-secondary-dark)" color="var(--color-secondary-dark)" />
          <span>{product.rating} ({product.reviews})</span>
        </div>
        
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-info-footer">
          <div className="product-price">
            <span className="current-price">₹{product.price.toFixed(2)}</span>
            {product.discount > 0 && <span className="original-price">₹{product.originalPrice.toFixed(2)}</span>}
          </div>
          {product.loyaltyPoints > 0 && (
            <div style={{ fontSize: '0.8rem', color: '#d81b60', fontWeight: 'bold', marginTop: '4px' }}>
              Earn {product.loyaltyPoints} pts
            </div>
          )}
        </div>

        <button 
          className="btn btn-primary add-to-cart-btn" 
          onClick={handleAddToCart}
          disabled={outOfStock}
        >
          <ShoppingCart size={18} /> {outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
