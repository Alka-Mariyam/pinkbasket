import React from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useUser } from '../../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Heart, Bookmark, CheckCircle } from 'lucide-react';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, savedForLater, removeFromCart, updateQuantity, saveForLater, moveToCart, getSubtotal } = useCart();
  const { toggleWishlist } = useWishlist();
  const { user } = useUser();
  const navigate = useNavigate();

  const subtotal = getSubtotal();

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="cart-page container animate-fade-in">
      <div className="cart-layout">
        
        {/* Main Cart Area */}
        <div className="cart-main">
          <div className="cart-header card">
            <h1>Shopping Cart</h1>
            <span className="price-header">Price</span>
          </div>

          <div className="cart-items-list card">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <h2>Your PinkBasket Cart is empty.</h2>
                <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.product.id} className="cart-item">
                  <img src={item.product.images[0]} alt={item.product.name} />
                  
                  <div className="item-details">
                    <h3><Link to={`/product/${item.product.id}`}>{item.product.name}</Link></h3>
                    <p className="stock-status in-stock">In Stock</p>
                    {item.product.pinkPassEligible && <p className="pink-pass-text">PinkPass Eligible</p>}
                    
                    <div className="item-actions">
                      <select 
                        value={item.quantity} 
                        onChange={(e) => updateQuantity(item.product.id, Number(e.target.value))}
                      >
                        {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>Qty: {n}</option>)}
                      </select>
                      <span className="separator">|</span>
                      <button onClick={() => removeFromCart(item.product.id)}>Delete</button>
                      <span className="separator">|</span>
                      <button onClick={() => saveForLater(item.product.id)}>Save for later</button>
                    </div>
                  </div>
                  
                  <div className="item-price">
                    <h2>₹{(item.product.price * item.quantity).toFixed(2)}</h2>
                  </div>
                </div>
              ))
            )}
            
            {cartItems.length > 0 && (
              <div className="cart-subtotal-bottom">
                <h3>Subtotal ({cartItems.length} items): <span>₹{subtotal.toFixed(2)}</span></h3>
              </div>
            )}
          </div>

          {/* Save For Later Section */}
          {savedForLater.length > 0 && (
            <div className="saved-for-later card">
              <h2>Saved for later ({savedForLater.length} items)</h2>
              <div className="saved-grid">
                {savedForLater.map(item => (
                  <div key={item.product.id} className="saved-item">
                    <img src={item.product.images[0]} alt={item.product.name} />
                    <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                    <span className="saved-price">₹{item.product.price.toFixed(2)}</span>
                    <button className="btn btn-outline" onClick={() => moveToCart(item.product.id)}>Move to cart</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar Subtotal (Amazon Style) */}
        {cartItems.length > 0 && (
          <aside className="cart-sidebar">
            <div className="subtotal-box card">
              <div className="free-shipping-bar">
                <CheckCircle size={16} color="var(--color-success)" />
                <span>Your order qualifies for FREE Shipping.</span>
              </div>
              
              <h3>Subtotal ({cartItems.length} items): <br/><span>₹{subtotal.toFixed(2)}</span></h3>
              
              <div className="gift-checkbox">
                <input type="checkbox" id="gift" />
                <label htmlFor="gift">This order contains a gift</label>
              </div>
              
              <button className="btn btn-primary w-full" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </aside>
        )}
        
      </div>
    </div>
  );
};

export default CartPage;
