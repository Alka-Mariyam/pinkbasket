import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { useManager } from '../../context/ManagerContext';
import { Plus, Edit, Trash2 } from 'lucide-react';

const ProductsManager = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useShop();
  const { addNotification } = useManager();
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [newProduct, setNewProduct] = useState({
    id: '', name: '', price: '', categoryId: 'c1', description: '', images: '', stockStatus: 'In Stock', sizes: '', loyaltyPoints: 0
  });

  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setNewProduct({ id: '', name: '', price: '', categoryId: 'c1', description: '', images: '', stockStatus: 'In Stock', sizes: '', loyaltyPoints: 0 });
    setShowModal(true);
  };

  const handleOpenEdit = (product) => {
    setIsEditing(true);
    setEditingId(product.id);
    setNewProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
      description: product.description || '',
      images: Array.isArray(product.images) ? product.images[0] : product.images || '',
      stockStatus: product.stockStatus || 'In Stock',
      sizes: product.variants ? product.variants.find(v => v.type === 'Size')?.options.join(', ') || '' : '',
      loyaltyPoints: product.loyaltyPoints || 0
    });
    setShowModal(true);
  };

  const handleDelete = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteProduct(product.id);
      addNotification(`Product deleted: ${product.name}`, 'warning');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const parsedVariants = newProduct.sizes.trim() 
      ? [{ type: 'Size', options: newProduct.sizes.split(',').map(s => s.trim()).filter(Boolean) }] 
      : [];

    if (isEditing) {
      const updatedFields = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        categoryId: newProduct.categoryId,
        description: newProduct.description,
        images: newProduct.images ? [newProduct.images] : ['/images/mystery_box.png'],
        stockStatus: newProduct.stockStatus,
        loyaltyPoints: parseInt(newProduct.loyaltyPoints) || 0,
        variants: parsedVariants.length > 0 ? parsedVariants : undefined
      };
      updateProduct(editingId, updatedFields);
      addNotification(`Product updated: ${newProduct.name}`, 'info');
    } else {
      const productToAdd = {
        ...newProduct,
        id: newProduct.id || `p${Date.now()}`,
        price: parseFloat(newProduct.price),
        images: newProduct.images ? [newProduct.images] : ['/images/mystery_box.png'],
        rating: 5.0,
        reviews: 0,
        reviewsList: [],
        stockStatus: newProduct.stockStatus,
        loyaltyPoints: parseInt(newProduct.loyaltyPoints) || 0,
        variants: parsedVariants.length > 0 ? parsedVariants : undefined,
        discount: 0
      };
      addProduct(productToAdd);
      addNotification(`New product added: ${productToAdd.name}`, 'success');
    }
    
    setShowModal(false);
  };

  return (
    <div>
      <div className="manager-header">
        <h1>Products Management</h1>
        <button className="manager-btn" onClick={handleOpenAdd}>
          <Plus size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Add New Item
        </button>
      </div>

      <div className="manager-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="manager-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={product.images && product.images[0] ? product.images[0] : '/images/mystery_box.png'} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  {product.name}
                </td>
                <td style={{ textTransform: 'capitalize' }}>{product.categoryId}</td>
                <td>₹{product.price}</td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                    backgroundColor: product.stockStatus === 'In Stock' ? '#e6f4ea' : product.stockStatus === 'Low Stock' ? '#fef7e0' : '#fce8e6',
                    color: product.stockStatus === 'In Stock' ? '#137333' : product.stockStatus === 'Low Stock' ? '#b06000' : '#c5221f'
                  }}>
                    {product.stockStatus}
                  </span>
                </td>
                <td>
                  <button className="manager-btn secondary" onClick={() => handleOpenEdit(product)} style={{ padding: '6px', marginRight: '8px' }}><Edit size={16} /></button>
                  <button className="manager-btn secondary" onClick={() => handleDelete(product)} style={{ padding: '6px', color: '#ff4444' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content card animate-fade-in" style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '20px' }}>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Product Name</label>
                <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Price (₹)</label>
                <input required type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Category</label>
                <select value={newProduct.categoryId} onChange={e => setNewProduct({...newProduct, categoryId: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                  <option value="c1">Fashion</option>
                  <option value="c2">Beauty</option>
                  <option value="c3">Home</option>
                  <option value="c4">Electronics</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px', display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Stock Status</label>
                  <select value={newProduct.stockStatus} onChange={e => setNewProduct({...newProduct, stockStatus: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Sizes (comma separated)</label>
                  <input type="text" value={newProduct.sizes} onChange={e => setNewProduct({...newProduct, sizes: e.target.value})} placeholder="e.g. S, M, L, XL" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Loyalty Points Given</label>
                <input required type="number" min="0" value={newProduct.loyaltyPoints} onChange={e => setNewProduct({...newProduct, loyaltyPoints: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Image URL</label>
                <input type="text" value={newProduct.images} onChange={e => setNewProduct({...newProduct, images: e.target.value})} placeholder="https://..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Description</label>
                <textarea required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="manager-btn secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="manager-btn">{isEditing ? 'Save Changes' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
