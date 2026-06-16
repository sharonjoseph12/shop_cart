import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { OrderContext } from '../../context/OrderContext';
import { ProductContext } from '../../context/ProductContext';
import { motion } from 'framer-motion';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const { orders } = useContext(OrderContext);
  const { products } = useContext(ProductContext);

  const myOrders = orders.filter(o => o.customerId === user?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.email}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Order History</h2>
        
        {myOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-10">You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-6">
            {myOrders.map(order => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-gray-200 rounded-xl p-6"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-4 border-b border-gray-100 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID: <span className="font-mono text-gray-900">{order.id}</span></p>
                    <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg text-gray-900">${order.totalAmount.toFixed(2)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {order.items.map((item, idx) => {
                    const product = products.find(p => p.id === item.productId);
                    return (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          {product && <img src={product.imageUrl} alt={product.title} className="w-10 h-10 rounded object-cover" />}
                          <span className="font-medium text-gray-900">{product ? product.title : 'Product Removed'}</span>
                          <span className="text-gray-500">x{item.quantity}</span>
                        </div>
                        <span className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
