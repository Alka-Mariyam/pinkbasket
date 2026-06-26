import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import ProductCard from '../../components/Product/ProductCard';
import { Filter, ChevronDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import './Shop.css';

const Shop = () => {
  const { products, categories } = useShop();
  const location = useLocation();
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get('category');
    if (catParam) {
      setActiveCategory(catParam);
    }
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery('');
    }
  }, [location]);

  // Apply Search Filter
  let filteredProducts = searchQuery
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;

  // Apply Category Filter
  filteredProducts = activeCategory === 'All' 
    ? filteredProducts 
    : filteredProducts.filter(p => p.categoryId === activeCategory);

  // Apply Max Price Filter
  filteredProducts = filteredProducts.filter(p => p.price <= maxPrice);

  // Apply In Stock Filter
  if (inStockOnly) {
    filteredProducts = filteredProducts.filter(p => p.stockStatus === 'In Stock');
  }

  // Apply Sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured / default
  });

  return (
    <div className="shop-page container animate-fade-in">
      {/* Category Header / Filters */}
      <div className="shop-header card">
        <div className="shop-header-title">
          <h1>Shop All Products</h1>
          {searchQuery && <p style={{ color: 'var(--color-primary)', fontWeight: 'bold', marginBottom: '4px' }}>Showing search results for "{searchQuery}"</p>}
          <p>Showing {filteredProducts.length} results</p>
        </div>
        
        <div className="shop-filters">
          <button className={`filter-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
            <Filter size={18} /> Filters
          </button>
          <div className="sort-dropdown">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expanded Filters Panel */}
      {showFilters && (
        <div className="expanded-filters card animate-fade-in">
          <div className="filter-group">
            <label>Max Price: ₹{maxPrice}</label>
            <input 
              type="range" 
              min="100" max="200000" step="100" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))} 
              className="price-slider"
            />
            <div className="slider-labels">
              <span>₹100</span>
              <span>₹200000</span>
            </div>
          </div>
          <div className="filter-group checkbox-group">
            <input 
              type="checkbox" 
              id="inStock" 
              checked={inStockOnly} 
              onChange={(e) => setInStockOnly(e.target.checked)} 
            />
            <label htmlFor="inStock">In Stock Only</label>
          </div>
        </div>
      )}

      <div className="shop-layout">
        {/* Sidebar */}
        <aside className="shop-sidebar card">
          <h3>Categories</h3>
          <ul className="category-list">
            <li 
              className={activeCategory === 'All' ? 'active' : ''} 
              onClick={() => setActiveCategory('All')}
            >
              All Products
            </li>
            {categories.map(cat => (
              <li 
                key={cat.id} 
                className={activeCategory === cat.id ? 'active' : ''}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Product Grid */}
        <main className="shop-grid">
          {products.length === 0 ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading premium products...</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
