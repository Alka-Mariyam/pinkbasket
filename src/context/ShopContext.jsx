import React, { createContext, useContext, useState, useEffect } from 'react';
import { products, categories, mockCoupons } from '../mockDb/data';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState(() => {
    const savedCategories = localStorage.getItem('pb_categories');
    let parsed = savedCategories ? JSON.parse(savedCategories) : categories;
    // Deduplicate by name (case-insensitive)
    const unique = [];
    const seenNames = new Set();
    for (const cat of parsed) {
      const lowerName = cat.name.toLowerCase();
      if (!seenNames.has(lowerName)) {
        seenNames.add(lowerName);
        unique.push(cat);
      }
    }
    return unique;
  });

  useEffect(() => {
    const customReviews = {
      p1: [
        { id: 'r1', author: 'Emma W.', rating: 5, date: '2023-06-10', text: 'This dress is so breathable! The floral pattern is gorgeous for summer. True to size.', images: ['/images/floral_dress.png'] },
        { id: 'r2', author: 'Sophia L.', rating: 4, date: '2023-06-15', text: 'Lovely dress but slightly longer than expected. Had to get it hemmed.', images: [] }
      ],
      p2: [
        { id: 'r3', author: 'Olivia P.', rating: 5, date: '2023-05-22', text: 'The leather feels very premium. Perfect size for my phone and keys.', images: ['/images/crossbody_bag.png'] }
      ],
      p3: [
        { id: 'r4', author: 'Mia C.', rating: 5, date: '2023-08-01', text: 'The rose gold color matches everything. The step tracker is very accurate!', images: ['/images/smartwatch.png'] },
        { id: 'r5', author: 'Ava H.', rating: 4, date: '2023-08-10', text: 'Battery lasts about 2 days. Overall a great smartwatch for the price.', images: [] }
      ],
      p4: [
        { id: 'r6', author: 'Isabella R.', rating: 5, date: '2023-09-05', text: 'Such a fun surprise! Got 3 full-sized products and some cute samples.', images: ['/images/mystery_box.png'] }
      ],
      p5: [
        { id: 'r7', author: 'Charlotte M.', rating: 5, date: '2023-07-20', text: 'So soft and blocks out all the light. The silk feels luxurious.', images: ['/images/sleep_mask.png'] }
      ],
      p6: [
        { id: 'r8', author: 'Amelia B.', rating: 4, date: '2023-10-12', text: 'Noise cancellation is pretty good. Bass could be a bit punchier.', images: ['/images/earbuds.png'] }
      ],
      p7: [
        { id: 'r9', author: 'Harper K.', rating: 5, date: '2023-11-01', text: 'Exactly the minimalist look I wanted for my living room.', images: ['/images/vase.png'] }
      ],
      p8: [
        { id: 'r10', author: 'Evelyn J.', rating: 5, date: '2023-04-18', text: 'Smells heavenly and gives my skin a nice dewy glow.', images: ['/images/face_mist.png'] }
      ],
      p9: [
        { id: 'r11', author: 'Abigail D.', rating: 5, date: '2023-03-30', text: 'My skin has never looked better! The serum is my favorite.', images: ['/images/skincare_set.png'] }
      ],
      p10: [
        { id: 'r12', author: 'Emily F.', rating: 5, date: '2023-12-05', text: 'Typing on this is so satisfying! The pastel colors are adorable.', images: ['/images/keyboard.png'] }
      ],
      p11: [
        { id: 'r13', author: 'Elizabeth S.', rating: 4, date: '2023-06-25', text: 'Very chic, but they slide down my nose a little bit.', images: ['/images/sunglasses.png'] }
      ],
      p12: [
        { id: 'r14', author: 'Sofia T.', rating: 5, date: '2023-11-20', text: 'Sound quality is amazing for its size. And it looks great on my shelf!', images: ['/images/speaker.png'] }
      ],
      p13: [
        { id: 'r15', author: 'Avery W.', rating: 5, date: '2023-01-15', text: 'Protects my desk and my mouse glides smoothly. Love the color!', images: ['/images/desk_mat.png'] }
      ]
    };

    const initialProductsWithReviews = products.map(p => ({
      ...p,
      reviewsList: customReviews[p.id] || []
    }));

    // Use Server-Sent Events for real-time product updates
    const eventSource = new EventSource('http://localhost:3001/api/products/stream');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data && data.length > 0) {
        setAllProducts(data);
      } else {
        // Seed the backend with initialProductsWithReviews
        fetch('http://localhost:3001/api/products/seed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(initialProductsWithReviews)
        });
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    // Removed local storage sync for products, only sync categories
  }, [allProducts]);

  useEffect(() => {
    if (allCategories.length > 0) {
      localStorage.setItem('pb_categories', JSON.stringify(allCategories));
    }
  }, [allCategories]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'pb_products' && e.newValue) {
        setAllProducts(JSON.parse(e.newValue));
      }
      if (e.key === 'pb_categories' && e.newValue) {
        setAllCategories(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const getProductById = (id) => allProducts.find(p => p.id === id);
  const getProductsByCategory = (catId) => allProducts.filter(p => p.categoryId === catId);
  const searchProducts = (query) => allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  const validateCoupon = (code) => mockCoupons.find(c => c.code === code);
  const addProduct = (newProduct) => {
    // Update local state instantly
    setAllProducts(prev => {
      const updated = [newProduct, ...prev];
      return updated;
    });

    // Update backend
    fetch('http://localhost:3001/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    }).catch(err => console.error("Failed to save product:", err));

    if (!allCategories.some(c => c.id === newProduct.categoryId)) {
      setAllCategories(prev => {
        const newCat = { id: newProduct.categoryId, name: newProduct.categoryId.charAt(0).toUpperCase() + newProduct.categoryId.slice(1) };
        const updatedCats = [...prev, newCat];
        localStorage.setItem('pb_categories', JSON.stringify(updatedCats));
        return updatedCats;
      });
    }
  };

  const updateProduct = (id, updatedFields) => {
    setAllProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    fetch(`http://localhost:3001/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields)
    }).catch(err => console.error("Failed to update product:", err));
  };

  const deleteProduct = (id) => {
    setAllProducts(prev => prev.filter(p => p.id !== id));
    fetch(`http://localhost:3001/api/products/${id}`, {
      method: 'DELETE'
    }).catch(err => console.error("Failed to delete product:", err));
  };

  return (
    <ShopContext.Provider value={{
      products: allProducts,
      categories: allCategories,
      getProductById,
      getProductsByCategory,
      searchProducts,
      validateCoupon,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </ShopContext.Provider>
  );
};
