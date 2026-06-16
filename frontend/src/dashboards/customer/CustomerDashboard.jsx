import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { OrderContext } from '../../context/OrderContext';
import { ProductContext } from '../../context/ProductContext';
import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const statusConfig = {
  Delivered: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: <FiCheckCircle /> },
  Shipped: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: <FiTruck /> },
  Processing: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: <FiClock /> },
  Pending: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', icon: <FiClock /> }
};

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const { orders } = useContext(OrderContext);
  const { products } = useContext(ProductContext);

  const myOrders = orders.filter(o => o.customerId === user?.id);
  const totalSpent = myOrders.reduce((a, b) => a + b.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">My Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{user?.email}</span></p>
        </div>
        <Link to="/products" className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-5 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-all duration-300 w-fit">
          Continue Shopping <FiArrowRight />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <FiShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Orders</p>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{myOrders.length}</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl">
            <FiCheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Delivered</p>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{myOrders.filter(o => o.status === 'Delivered').length}</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl">
            <FiPackage size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Spent</p>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">${totalSpent.toFixed(2)}</p>
          </div>
        </motion.div>
      </div>

      {/* Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order History</h2>

        {myOrders.length === 0 ? (
          <div className="text-center py-20">
            <FiPackage size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No orders yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Start shopping to see your orders here!</p>
            <Link to="/products" className="inline-flex items-center gap-2 mt-6 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-colors">
              Browse Products <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {myOrders.map((order, idx) => {
              const status = statusConfig[order.status] || statusConfig['Pending'];
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg hover:shadow-gray-900/5 transition-shadow bg-gray-50 dark:bg-gray-900/50"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-5 pb-5 border-b border-gray-100 dark:border-gray-700 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Order ID</p>
                      <p className="font-mono font-bold text-gray-900 dark:text-white">{order.id}</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-extrabold text-gray-900 dark:text-white">${order.totalAmount.toFixed(2)}</span>
                      <span className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold ${status.bg} ${status.text}`}>
                        {status.icon} {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item, i) => {
                      const product = products.find(p => p.id === item.productId);
                      return (
                        <div key={i} className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            {product && (
                              <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center p-1.5 overflow-hidden">
                                <img src={product.imageUrl} alt={product.title} className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                              </div>
                            )}
                            <div>
                              <span className="font-semibold text-gray-900 dark:text-white text-sm">{product ? product.title : 'Product Removed'}</span>
                              <span className="text-gray-400 dark:text-gray-500 text-sm ml-2">×{item.quantity}</span>
                            </div>
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
