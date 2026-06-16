import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { OrderContext } from '../../context/OrderContext';
import { ProductContext } from '../../context/ProductContext';
import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const statusConfig = {
  Delivered: { bg: 'bg-[#C5A455]/10', text: 'text-[#C5A455]', icon: <FiCheckCircle /> },
  Shipped: { bg: 'bg-[#C8102E]/10', text: 'text-[#C8102E]', icon: <FiTruck /> },
  Processing: { bg: 'bg-[#C5A455]/10', text: 'text-[#C5A455]', icon: <FiClock /> },
  Pending: { bg: 'bg-white/[0.04]', text: 'text-[#F5F0EB]/40', icon: <FiClock /> }
};

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const { orders } = useContext(OrderContext);
  const { products } = useContext(ProductContext);

  const myOrders = orders.filter(o => o.customerId === user?.id);
  const totalSpent = myOrders.reduce((a, b) => a + b.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif-display text-2xl text-[#F5F0EB] tracking-tight">My Dashboard</h1>
          <p className="text-[#F5F0EB]/30 text-sm font-sans-luxury mt-1">
            Welcome back, <span className="text-[#C8102E]">{user?.email}</span>
          </p>
        </div>
        <Link to="/products" className="group flex items-center gap-2 bg-white/[0.04] text-[#F5F0EB]/60 px-5 py-2.5 rounded-full font-sans-luxury text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-[#C8102E]/20 hover:text-[#F5F0EB] transition-all duration-300 border border-white/[0.06] w-fit">
          Continue Shopping <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 flex items-center gap-4 group hover:border-[#C8102E]/20 transition-all">
          <div className="p-3 bg-[#C8102E]/10 text-[#C8102E] rounded-xl">
            <FiShoppingBag size={20} />
          </div>
          <div>
            <p className="text-[10px] text-[#F5F0EB]/30 font-sans-luxury uppercase tracking-[0.2em]">Total Orders</p>
            <p className="font-serif-display text-2xl text-[#F5F0EB] mt-1">{myOrders.length}</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 flex items-center gap-4 group hover:border-[#C5A455]/30 transition-all">
          <div className="p-3 bg-[#C5A455]/10 text-[#C5A455] rounded-xl">
            <FiCheckCircle size={20} />
          </div>
          <div>
            <p className="text-[10px] text-[#F5F0EB]/30 font-sans-luxury uppercase tracking-[0.2em]">Delivered</p>
            <p className="font-serif-display text-2xl text-[#F5F0EB] mt-1">{myOrders.filter(o => o.status === 'Delivered').length}</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 flex items-center gap-4 group hover:border-[#C8102E]/20 transition-all">
          <div className="p-3 bg-white/[0.04] text-[#F5F0EB]/40 rounded-xl">
            <FiPackage size={20} />
          </div>
          <div>
            <p className="text-[10px] text-[#F5F0EB]/30 font-sans-luxury uppercase tracking-[0.2em]">Total Spent</p>
            <p className="font-serif-display text-2xl text-[#F5F0EB] mt-1">${totalSpent.toFixed(2)}</p>
          </div>
        </motion.div>
      </div>

      <div className="glass-card p-8">
        <h2 className="font-serif-display text-lg text-[#F5F0EB] mb-6 tracking-tight">Order History</h2>

        {myOrders.length === 0 ? (
          <div className="text-center py-20">
            <FiPackage size={40} className="mx-auto text-[#F5F0EB]/10 mb-4" />
            <p className="text-[#F5F0EB]/40 font-sans-luxury text-sm font-medium">No orders yet</p>
            <p className="text-[#F5F0EB]/20 text-xs font-sans-luxury mt-1">Start shopping to see your orders here.</p>
            <Link to="/products" className="inline-flex items-center gap-2 mt-6 bg-[#C8102E] text-[#F5F0EB] px-6 py-2.5 rounded-full font-sans-luxury text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-[#A00D26] transition-colors shadow-lg shadow-[#C8102E]/20">
              Browse Products <FiArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myOrders.map((order, idx) => {
              const status = statusConfig[order.status] || statusConfig['Pending'];
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border border-white/[0.04] rounded-2xl p-6 hover:bg-white/[0.02] transition-all bg-white/[0.01]"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-5 pb-5 border-b border-white/[0.04] gap-4">
                    <div>
                      <p className="text-[9px] text-[#F5F0EB]/20 font-sans-luxury uppercase tracking-[0.2em] font-bold">Order ID</p>
                      <p className="font-mono text-sm text-[#F5F0EB] font-medium">{order.id.substring(0, 12)}...</p>
                      <p className="text-xs text-[#F5F0EB]/20 font-sans-luxury mt-1">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-serif-display text-xl text-[#C5A455]">${order.totalAmount.toFixed(2)}</span>
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-sans-luxury font-bold tracking-wider ${status.bg} ${status.text}`}>
                        {status.icon} {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item, i) => {
                      const product = products.find(p => p.id === item.productId);
                      return (
                        <div key={i} className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            {product && (
                              <div className="w-10 h-10 bg-white/[0.02] rounded-lg border border-white/[0.04] flex items-center justify-center p-1.5 overflow-hidden">
                                <img src={product.imageUrl} alt={product.title} className="max-h-full max-w-full object-contain opacity-60" />
                              </div>
                            )}
                            <div>
                              <span className="font-sans-luxury text-xs text-[#F5F0EB]/60">{product ? product.title : 'Product Removed'}</span>
                              <span className="text-[#F5F0EB]/20 text-xs ml-2">×{item.quantity}</span>
                            </div>
                          </div>
                          <span className="font-sans-luxury text-xs text-[#F5F0EB]">${(item.price * item.quantity).toFixed(2)}</span>
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
