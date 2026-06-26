import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { useManager } from '../../context/ManagerContext';
import { Star, CheckCircle, Shield, Truck, ChevronDown } from 'lucide-react';
import './ProductDetails.css';

const ReviewsSection = ({ initialReviews = [] }) => {
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, text: '', images: [] });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewReview(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.text.trim()) return;
    
    const reviewObj = {
      id: 'r' + Date.now(),
      author: 'You',
      rating: newReview.rating,
      date: new Date().toISOString().split('T')[0],
      text: newReview.text,
      images: newReview.images
    };
    
    setReviews([reviewObj, ...reviews]);
    setNewReview({ rating: 5, text: '', images: [] });
    setShowForm(false);
  };

  return (
    <div className="pd-reviews section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>Customer Reviews</h2>
        <button className="btn btn-outline" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {showForm && (
        <form className="review-form card" onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid var(--color-primary)' }}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Rating</label>
            <select value={newReview.rating} onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value={5}>5 Stars - Excellent</option>
              <option value={4}>4 Stars - Good</option>
              <option value={3}>3 Stars - Average</option>
              <option value={2}>2 Stars - Poor</option>
              <option value={1}>1 Star - Terrible</option>
            </select>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Review</label>
            <textarea 
              value={newReview.text}
              onChange={e => setNewReview({...newReview, text: e.target.value})}
              placeholder="What did you like or dislike?"
              style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Add Photos</label>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
            {newReview.images.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                {newReview.images.map((img, i) => (
                  <img key={i} src={img} alt="preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary">Submit Review</button>
        </form>
      )}

      <div className="reviews-list">
        {reviews.length > 0 ? reviews.map(r => (
          <div key={r.id} className="review-card card" style={{ marginBottom: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div className="avatar" style={{ width: '32px', height: '32px', background: 'var(--color-primary)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {r.author.charAt(0)}
              </div>
              <div>
                <strong>{r.author}</strong>
                <span style={{ color: '#888', fontSize: '0.85rem', marginLeft: '10px' }}>{r.date}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
              {[1,2,3,4,5].map(star => (
                <Star key={star} size={14} fill={star <= r.rating ? "#FFD700" : "none"} color="#FFD700" />
              ))}
            </div>
            <p style={{ lineHeight: '1.5', color: '#333' }}>{r.text}</p>
            {r.images && r.images.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                {r.images.map((img, i) => (
                  <img key={i} src={img} alt="review attachment" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} />
                ))}
              </div>
            )}
          </div>
        )) : <p>No reviews yet. Be the first to review!</p>}
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, getProductByIds } = useShop();
  const { addToCart } = useCart();
  const { user } = useUser();
  const { addNotification } = useManager();
  
  const product = getProductById(id);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});

  if (!product) {
    return <div className="container loading-state"><h2>Product not found</h2></div>;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    if (!user) {
      addNotification("Please sign in to place an order.", "info");
      navigate('/auth');
    } else {
      navigate('/checkout');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[1,2,3,4,5].map(star => (
          <Star key={star} size={16} fill={star <= rating ? "var(--color-secondary-dark)" : "none"} color="var(--color-secondary-dark)"/>
        ))}
      </div>
    );
  };

  return (
    <div className="product-details-page container animate-fade-in">
      {/* Top Section: Images, Info, Buy Box */}
      <div className="pd-main-grid">
        
        {/* Left: Image Gallery */}
        <div className="pd-gallery">
          <div className="pd-thumbnails">
            {product.images?.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt="thumbnail" 
                className={activeImage === idx ? 'active' : ''}
                onMouseEnter={() => setActiveImage(idx)}
              />
            ))}
          </div>
          <div className="pd-main-image card">
            <img src={product.images?.[activeImage]} alt={product.name} />
          </div>
        </div>

        {/* Center: Product Info */}
        <div className="pd-info">
          <h1 className="pd-title">{product.name}</h1>
          <div className="pd-rating-row">
            {renderStars(product.rating)}
            <span className="pd-reviews-link">{product.reviews} ratings</span>
            <span className="separator">|</span>
            <span className="pd-answered-q">4 answered questions</span>
          </div>
          
          <hr />

          <div className="pd-price-block">
            {product.discount > 0 && <span className="pd-discount-badge">-{product.discount}%</span>}
            <span className="pd-price">₹{product.price.toFixed(2)}</span>
            {product.discount > 0 && <span className="pd-original-price">List Price: ₹{product.originalPrice.toFixed(2)}</span>}
          </div>

          {product.loyaltyPoints > 0 && (
            <div style={{ padding: '8px 12px', backgroundColor: '#fdf2f8', color: '#d81b60', display: 'inline-block', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '16px' }}>
              🎁 Earn {product.loyaltyPoints} PinkBasket Points with this purchase!
            </div>
          )}

          <p className="pd-description">{product.description}</p>

          {/* Variants */}
          {product.variants && product.variants.map((v, i) => (
            <div key={i} className="pd-variant">
              <h4>{v.type}: <span>{selectedVariants[v.type] || 'Select one'}</span></h4>
              <div className="variant-options">
                {v.options.map(opt => (
                  <button 
                    key={opt} 
                    className={`variant-btn ${selectedVariants[v.type] === opt ? 'active' : ''}`}
                    onClick={() => setSelectedVariants({...selectedVariants, [v.type]: opt})}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <hr />

          <ul className="pd-bullets">
            <li><Shield size={16}/> 1 Year Brand Warranty</li>
            <li><CheckCircle size={16}/> 10 Days Return Policy</li>
            <li><Truck size={16}/> PinkBasket Delivered</li>
          </ul>
        </div>

        {/* Right: Buy Box */}
        <div className="pd-buy-box card">
          <span className="buy-box-price">₹{product.price.toFixed(2)}</span>
          
          {product.pinkPassEligible && (
            <div className="pink-pass-badge">
              <span className="logo">PinkPass</span> 
              <span>Free Delivery Tomorrow</span>
            </div>
          )}

          <div className="stock-status">
            {product.stockStatus === 'In Stock' ? <span className="in-stock">In Stock</span> : <span className="low-stock">Only a few left</span>}
          </div>

          <div className="quantity-selector">
            <label>Qty:</label>
            <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <button className="btn btn-secondary w-full mb-2" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button className="btn btn-primary w-full" onClick={handleBuyNow}>
            Buy Now
          </button>

          <div className="secure-transaction">
            <Shield size={14}/> Secure transaction
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {/* Frequently Bought Together */}
      {product.frequentlyBoughtTogether && (
        <div className="pd-fbt section">
          <h2>Frequently bought together</h2>
          <div className="fbt-container card">
            <p>Bundle items will be displayed here...</p>
          </div>
        </div>
      )}

      {/* Customer Q&A */}
      <div className="pd-qa section">
        <h2>Customer questions & answers</h2>
        <div className="qa-list card">
          {product.questions?.length > 0 ? product.questions.map((q, i) => (
            <div key={i} className="qa-item">
              <p className="question"><strong>Q:</strong> {q.q}</p>
              <p className="answer"><strong>A:</strong> {q.a}</p>
            </div>
          )) : <p>No questions asked yet.</p>}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ReviewsSection initialReviews={product.reviewsList || []} />

    </div>
  );
};

export default ProductDetails;
