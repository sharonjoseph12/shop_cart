import { useContext, useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { OrderContext } from '../context/OrderContext';
import { FiShoppingCart, FiUser, FiLogOut, FiMoon, FiSun, FiX, FiMessageSquare, FiSend, FiShoppingBag, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your ShipCart AI Assistant. Ask me anything about products, shipping, or deals!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:3001/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', text: m.text }))
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: "Couldn't reach the server. Is the backend running?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-[340px] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col"
            style={{ height: '420px' }}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center flex-shrink-0">
              <div className="font-bold flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                ShipCart AI
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors"><FiX size={16} /></button>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-sm' 
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm shadow-sm border border-gray-100 dark:border-gray-700'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex gap-2 flex-shrink-0">
              <input 
                type="text" 
                placeholder="Ask me anything..." 
                className="flex-grow bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button 
                onClick={sendMessage} 
                disabled={isTyping || !input.trim()}
                className="bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend size={16}/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/30 hover:scale-105 transition-all duration-300 relative"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white dark:border-gray-900"></span>
        </span>
        <FiMessageSquare size={24} />
      </button>
    </div>
  );
};

const MainLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useContext(CartContext);
  const { addOrder } = useContext(OrderContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

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

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsCheckingOut(true);
    
    // Create actual order
    const orderData = {
      customerId: user.id,
      totalAmount: total,
      deliveryLocation: 'New York, NY', // Could be dynamic
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    };
    
    await addOrder(orderData);

    setTimeout(() => {
      // Fire confetti
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#4f46e5', '#818cf8', '#ffffff']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#4f46e5', '#818cf8', '#ffffff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());

      setIsCheckingOut(false);
      clearCart();
      setTimeout(() => setIsCartOpen(false), 2000);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0A0A0A] text-[#F5F0EB] transition-colors duration-200">

      {/* Glassmorphic Header */}
      <header className="bg-[#0A0A0A]/70 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-serif-display text-[#F5F0EB] tracking-tight flex items-center gap-3">
            ShipCart <span className="text-[#C8102E] text-lg">●</span>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-[11px] font-sans-luxury text-[#F5F0EB]/40 hover:text-[#F5F0EB] tracking-[0.15em] uppercase font-medium transition-colors">Home</Link>
            <Link to="/products" className="text-[11px] font-sans-luxury text-[#F5F0EB]/40 hover:text-[#F5F0EB] tracking-[0.15em] uppercase font-medium transition-colors">Products</Link>
          </nav>
          <div className="flex items-center space-x-6">
            <button onClick={toggleDarkMode} className="text-[#F5F0EB]/30 hover:text-[#C5A455] transition-colors bg-white/[0.04] p-2 rounded-full">
              {isDarkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>

            {(!user || user.role === 'Customer') && location.pathname !== '/cart' && (
              <button onClick={() => setIsCartOpen(true)} className="relative text-[#F5F0EB]/30 hover:text-[#C5A455] transition-colors">
                <FiShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#C8102E] text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-[#0A0A0A]">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </button>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={getDashboardLink()} className="bg-white/[0.06] text-[#F5F0EB]/60 px-4 py-2 rounded-full hover:bg-[#C8102E]/30 font-sans-luxury font-medium text-[10px] tracking-wider uppercase flex items-center gap-2 transition-colors border border-white/[0.06]">
                  <FiUser size={14} />
                  <span className="hidden sm:inline">{user.role}</span>
                </Link>
                <button onClick={handleLogout} className="text-[#F5F0EB]/30 hover:text-[#C8102E] transition-colors">
                  <FiLogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-[#C8102E] text-[#F5F0EB] px-5 py-2 rounded-full font-sans-luxury font-bold text-[10px] tracking-wider uppercase hover:bg-[#A00D26] transition-colors shadow-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Slide-out Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                  <FiShoppingCart /> Your Cart
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                  <FiX size={20} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 space-y-4">
                    <FiShoppingCart size={64} className="opacity-20" />
                    <p className="text-lg">Your cart is empty.</p>
                    <button onClick={() => setIsCartOpen(false)} className="text-indigo-600 dark:text-indigo-400 font-semibold mt-4">Continue Shopping</button>
                  </div>
                ) : (
                  <AnimatePresence>
                    {cart.map(item => (
                      <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, height: 0 }}
                        className="flex gap-4 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl bg-white dark:bg-gray-800/50 shadow-sm"
                      >
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                          <img src={item.imageUrl} alt={item.title} className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                        </div>
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">{item.title}</h3>
                            <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-1">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 rounded-full px-2 py-1 border border-gray-100 dark:border-gray-700">
                              <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-800 shadow-sm text-gray-600 dark:text-gray-300 font-bold">-</button>
                              <span className="text-xs font-semibold w-4 text-center dark:text-white">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-800 shadow-sm text-gray-600 dark:text-gray-300 font-bold">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full transition-colors">
                              <FiX size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                    <span className="text-2xl font-extrabold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold text-lg hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-xl flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isCheckingOut ? (
                      <span className="animate-pulse flex items-center gap-2">Processing Secure Checkout...</span>
                    ) : cart.length === 0 ? (
                      <span className="flex items-center gap-2"><FiCheckCircle /> Success!</span>
                    ) : (
                      <span className="flex items-center gap-2">Checkout Securely <FiArrowRight /></span>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-900 dark:bg-black border-t border-gray-800 py-16 mt-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
                <FiShoppingBag /> ShipCart
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                Next-generation e-commerce platform with intelligent routing, real-time tracking, and a curated marketplace of premium products.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Platform</h4>
              <div className="space-y-3">
                <Link to="/products" className="block text-gray-400 text-sm hover:text-white transition-colors">Products</Link>
                <Link to="/login" className="block text-gray-400 text-sm hover:text-white transition-colors">Seller Portal</Link>
                <Link to="/login" className="block text-gray-400 text-sm hover:text-white transition-colors">Delivery Agent</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Tech Stack</h4>
              <div className="space-y-3">
                <p className="text-gray-400 text-sm">React + Vite</p>
                <p className="text-gray-400 text-sm">Node.js + SQLite</p>
                <p className="text-gray-400 text-sm">Kruskal MST Algorithm</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} ShipCart Logistics. All rights reserved.</p>
            <p className="text-gray-600 text-xs">Built with ❤️ for premium commerce</p>
          </div>
        </div>
      </footer>

      {/* Floating AI Assistant */}
      <AIAssistantWidget />
    </div>
  );
};

export default MainLayout;
