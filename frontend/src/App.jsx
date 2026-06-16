import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Products from './pages/Products';
import Cart from './pages/Cart';

// Dashboards
import CustomerDashboard from './dashboards/customer/CustomerDashboard';
import SellerDashboard from './dashboards/seller/SellerDashboard';
import DeliveryDashboard from './dashboards/delivery/DeliveryDashboard';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) {
    if (user.role === 'Seller') return <Navigate to="/seller" />;
    if (user.role === 'Delivery') return <Navigate to="/delivery" />;
    return <Navigate to="/dashboard" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="products" element={<Products />} />
          <Route path="cart" element={<Cart />} />
          
          <Route path="dashboard" element={
            <ProtectedRoute allowedRole="Customer">
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="seller/*" element={
            <ProtectedRoute allowedRole="Seller">
              <SellerDashboard />
            </ProtectedRoute>
          } />

          <Route path="delivery/*" element={
            <ProtectedRoute allowedRole="Delivery">
              <DeliveryDashboard />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
