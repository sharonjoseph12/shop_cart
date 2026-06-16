import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiTruck, FiShoppingBag, FiMail, FiArrowRight } from 'react-icons/fi';

const roleConfig = {
  Customer: { icon: <FiShoppingBag size={24} />, color: 'from-indigo-500 to-blue-600', desc: 'Browse & buy premium products' },
  Seller: { icon: <FiUser size={24} />, color: 'from-purple-500 to-pink-600', desc: 'List products & track analytics' },
  Delivery: { icon: <FiTruck size={24} />, color: 'from-green-500 to-emerald-600', desc: 'Manage routes & deliveries' }
};

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [role, setRole] = useState('Customer');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    await login(role, email);
    
    // Auto-redirect to the appropriate dashboard
    if (role === 'Seller') navigate('/seller');
    else if (role === 'Delivery') navigate('/delivery');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0F0F11]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#C8102E]/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-md w-full"
      >
        <div className="bg-[#1C1C1F]/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-[#C8102E] to-red-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#C8102E]/20">
              <FiUser className="text-white" size={28} />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">ShipCart Demo</h2>
            <p className="mt-2 text-[#F5F0EB]/50">Select a role to enter the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-white/80 mb-3 uppercase tracking-wider">Select Role</label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(roleConfig).map(([r, config]) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`relative py-4 px-3 rounded-2xl font-medium transition-all duration-300 border flex flex-col items-center gap-2 ${
                      role === r 
                        ? 'border-[#C8102E] bg-[#C8102E]/10 text-[#C8102E] shadow-lg shadow-[#C8102E]/20 scale-[1.02]' 
                        : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                    }`}
                  >
                    <span className={`transition-colors ${role === r ? 'text-[#C8102E]' : ''}`}>{config.icon}</span>
                    <span className="text-xs font-bold">{r}</span>
                    {role === r && (
                      <motion.div layoutId="roleIndicator" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#C8102E] rounded-full" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#F5F0EB]/40 mt-3 text-center">{roleConfig[role].desc}</p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-white/80 uppercase tracking-wider mb-2">Demo Email (Optional)</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  id="email"
                  type="email"
                  className="block w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-[#C8102E] text-white font-medium transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={`${role.toLowerCase()}@demo.com`}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-3 py-4 px-4 rounded-2xl text-base font-bold text-white bg-[#C8102E] hover:bg-red-700 focus:outline-none transition-all duration-300 shadow-xl hover:shadow-[#C8102E]/30 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Sign In Instantly
              <FiArrowRight size={18} />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
