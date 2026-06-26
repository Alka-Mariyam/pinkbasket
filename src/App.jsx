import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Landing from './pages/Landing/Landing';
import Auth from './pages/Auth/Auth';
import Dashboard from './pages/Dashboard/Dashboard';
import Shop from './pages/Shop/Shop';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import CartPage from './pages/Cart/CartPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import OrderConfirmed from './pages/OrderConfirmed/OrderConfirmed';
import TrackOrder from './pages/TrackOrder/TrackOrder';
import Chatbot from './components/Chatbot/Chatbot';
import { useUser } from './context/UserContext';
import ManagerLayout from './pages/Manager/ManagerLayout';
import Footer from './components/Footer/Footer';

function App() {
  const { user } = useUser();

  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmed/:orderId" element={<OrderConfirmed />} />
          <Route path="/track-order/:orderId" element={<TrackOrder />} />
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/dashboard/*" 
            element={user ? <Dashboard /> : <Navigate to="/auth" />} 
          />
          <Route path="/manager/*" element={<ManagerLayout />} />
        </Routes>
      </main>
      <Chatbot />
      <Footer />
    </Router>
  );
}

export default App;
