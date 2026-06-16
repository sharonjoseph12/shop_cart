import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import MainLayout from './layouts/MainLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Products from './pages/Products';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';

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

import { LenisProvider } from './components/LenisProvider';

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1a1a1a', color: '#F5F0EB', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '13px', fontFamily: 'Montserrat, sans-serif' },
          success: { iconTheme: { primary: '#C5A455', secondary: '#1a1a1a' } },
          error: { iconTheme: { primary: '#C8102E', secondary: '#1a1a1a' } }
        }}
      />
      <LenisProvider>
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

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </LenisProvider>
    </Router>
  );
}

export default App;
