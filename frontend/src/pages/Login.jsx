import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiTruck, FiShoppingBag, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const roleConfig = {
  Customer: { icon: <FiShoppingBag size={20} />, desc: 'Browse & buy premium products' },
  Seller: { icon: <FiUser size={20} />, desc: 'List products & track analytics' },
  Delivery: { icon: <FiTruck size={20} />, desc: 'Manage routes & deliveries' }
};

const Login = () => {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState('Customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    try {
      if (isRegistering) {
        await register(email, password, role);
        toast.success(`Registered successfully as ${role}`);
      } else {
        await login(email, password);
        toast.success('Logged in successfully');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0A0A0A]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#C8102E]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-[#C5A455]/6 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-md w-full"
      >
        <div className="glass-card p-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-[#C8102E] to-[#8B0000] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#C8102E]/20">
              <FiUser className="text-[#F5F0EB]" size={24} />
            </div>
            <h2 className="font-serif-display text-2xl text-[#F5F0EB] tracking-tight">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-[#F5F0EB]/30 text-sm font-sans-luxury">
              {isRegistering ? 'Sign up for a ShipCart account' : 'Sign in to your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <AnimatePresence>
              {isRegistering && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block font-sans-luxury text-[10px] text-[#F5F0EB]/30 uppercase tracking-[0.2em] font-medium mb-4">Select Role</label>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {Object.entries(roleConfig).map(([r, config]) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`relative py-4 px-3 rounded-2xl transition-all duration-300 border flex flex-col items-center gap-2 ${
                          role === r
                            ? 'border-[#C8102E] bg-[#C8102E]/10 text-[#C8102E] shadow-lg shadow-[#C8102E]/10 scale-[1.02]'
                            : 'border-white/[0.06] bg-white/[0.02] text-[#F5F0EB]/30 hover:border-[#C5A455]/30 hover:text-[#C5A455]/50'
                        }`}
                      >
                        <span className={`transition-colors ${role === r ? 'text-[#C8102E]' : ''}`}>{config.icon}</span>
                        <span className="text-[9px] font-sans-luxury font-bold tracking-wider">{r}</span>
                        {role === r && (
                          <motion.div layoutId="roleIndicator" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#C8102E] rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label htmlFor="email" className="block font-sans-luxury text-[10px] text-[#F5F0EB]/30 uppercase tracking-[0.2em] font-medium mb-3">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5F0EB]/20" size={16} />
                <input
                  id="email"
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl focus:outline-none focus:border-[#C8102E]/40 focus:ring-1 focus:ring-[#C8102E]/20 text-[#F5F0EB] font-sans-luxury text-sm placeholder-[#F5F0EB]/10 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block font-sans-luxury text-[10px] text-[#F5F0EB]/30 uppercase tracking-[0.2em] font-medium mb-3">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5F0EB]/20" size={16} />
                <input
                  id="password"
                  type="password"
                  required
                  className="block w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl focus:outline-none focus:border-[#C8102E]/40 focus:ring-1 focus:ring-[#C8102E]/20 text-[#F5F0EB] font-sans-luxury text-sm placeholder-[#F5F0EB]/10 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-3 py-3.5 px-4 rounded-2xl font-sans-luxury text-[10px] font-bold tracking-[0.15em] uppercase text-[#F5F0EB] bg-[#C8102E] hover:bg-[#A00D26] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8102E] transition-all duration-300 shadow-xl shadow-[#C8102E]/20 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Sign In')}
              <FiArrowRight size={16} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="font-sans-luxury text-[11px] text-[#C5A455]/60 hover:text-[#C5A455] tracking-wider transition-colors"
            >
              {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Register'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
