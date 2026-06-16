import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { OrderContext } from '../context/OrderContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useContext(CartContext);
  const { addOrder } = useContext(OrderContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const order = {
      customerId: user.id,
      items: cart.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price })),
      totalAmount: total,
      deliveryLocation: 'Node_A' // default mock location
    };
    addOrder(order);
    clearCart();
    alert('Order placed successfully!');
    navigate('/dashboard');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700 transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-grow space-y-6">
          {cart.map((item) => (
            <motion.div 
              layout
              key={item.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6"
            >
              <img src={item.imageUrl} alt={item.title} className="w-24 h-24 object-cover rounded-xl" />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.category}</p>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="p-2 hover:bg-gray-50 text-gray-600 rounded-l-lg"
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="px-4 font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-50 text-gray-600 rounded-r-lg"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-indigo-600">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="w-full lg:w-96">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-md"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
