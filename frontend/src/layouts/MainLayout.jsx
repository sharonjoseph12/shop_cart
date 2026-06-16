import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';

const MainLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'Seller') return '/seller';
    if (user.role === 'Delivery') return '/delivery';
    return '/dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">ShopSphere</Link>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Home</Link>
            <Link to="/products" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Products</Link>
          </nav>
          <div className="flex items-center space-x-6">
            {(!user || user.role === 'Customer') && (
              <Link to="/cart" className="relative text-gray-600 hover:text-indigo-600 transition-colors">
                <FiShoppingCart size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </Link>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={getDashboardLink()} className="text-gray-600 hover:text-indigo-600 font-medium flex items-center gap-2">
                  <FiUser size={20} />
                  <span>{user.role} Dashboard</span>
                </Link>
                <button onClick={handleLogout} className="text-gray-600 hover:text-red-500 transition-colors">
                  <FiLogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} ShopSphere Logistics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
