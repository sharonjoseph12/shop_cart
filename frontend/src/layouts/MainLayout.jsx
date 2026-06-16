import { useContext, useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { OrderContext } from '../context/OrderContext';
import { FiShoppingCart, FiUser, FiLogOut, FiMoon, FiSun, FiX, FiMessageSquare, FiSend, FiArrowRight } from 'react-icons/fi';
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
            className="absolute bottom-16 right-0 w-[340px] bg-[#0A0A0A] rounded-3xl shadow-2xl border border-white/[0.06] overflow-hidden flex flex-col"
            style={{ height: '420px' }}
          >
            <div className="bg-gradient-to-r from-[#C8102E] to-[#8B0000] p-4 text-[#F5F0EB] flex justify-between items-center flex-shrink-0">
              <div className="font-sans-luxury font-bold flex items-center gap-2 text-xs tracking-wider">
                <span className="w-2 h-2 bg-[#C5A455] rounded-full animate-pulse"></span>
                ShipCart AI
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-colors"><FiX size={14} /></button>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-[#0A0A0A]">
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed font-sans-luxury ${
                    msg.role === 'user' 
                      ? 'bg-[#C8102E] text-[#F5F0EB] rounded-br-sm' 
                      : 'bg-white/[0.04] text-[#F5F0EB]/80 rounded-bl-sm border border-white/[0.04]'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.04] p-3 rounded-2xl rounded-bl-sm border border-white/[0.04] flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-[#F5F0EB]/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-[#F5F0EB]/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-[#F5F0EB]/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-3 border-t border-white/[0.04] bg-[#0A0A0A] flex gap-2 flex-shrink-0">
              <input 
                type="text" 
                placeholder="Ask me anything..." 
                className="flex-grow bg-white/[0.04] border border-white/[0.06] rounded-full px-4 py-2.5 text-sm font-sans-luxury focus:outline-none focus:border-[#C8102E]/40 focus:ring-1 focus:ring-[#C8102E]/20 text-[#F5F0EB] placeholder-[#F5F0EB]/20" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button 
                onClick={sendMessage} 
                disabled={isTyping || !input.trim()}
                className="bg-[#C8102E] text-[#F5F0EB] p-2.5 rounded-full hover:bg-[#A00D26] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <FiSend size={14}/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-[#C8102E] text-[#F5F0EB] rounded-full flex items-center justify-center shadow-2xl shadow-[#C8102E]/30 hover:scale-105 transition-all duration-300 relative"
      >
        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A455] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C5A455] border border-[#0A0A0A]"></span>
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
          colors: ['#C8102E', '#C5A455', '#F5F0EB']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#C8102E', '#C5A455', '#F5F0EB']
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
              className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0A0A0A] border-l border-white/[0.04] shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/[0.04]">
                <h2 className="font-serif-display text-xl text-[#F5F0EB] flex items-center gap-2 tracking-tight">
                  <FiShoppingCart size={18} /> Your Cart
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 bg-white/[0.04] rounded-full hover:bg-[#C8102E]/20 text-[#F5F0EB]/30 hover:text-[#C8102E] transition-all">
                  <FiX size={18} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-[#F5F0EB]/20 space-y-4">
                    <FiShoppingCart size={56} className="opacity-20" />
                    <p className="font-sans-luxury text-sm text-[#F5F0EB]/30">Your cart is empty.</p>
                    <button onClick={() => setIsCartOpen(false)} className="text-[#C5A455] font-sans-luxury text-[10px] tracking-wider uppercase hover:text-[#C8102E] transition-colors mt-2">Continue Shopping</button>
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
                        className="flex gap-4 border border-white/[0.04] p-4 rounded-2xl bg-white/[0.01] hover:border-[#C8102E]/20 transition-all"
                      >
                        <div className="w-20 h-20 bg-white/[0.02] rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2 border border-white/[0.04]">
                          <img src={item.imageUrl} alt={item.title} className="max-h-full max-w-full object-contain opacity-60" />
                        </div>
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="font-sans-luxury text-sm text-[#F5F0EB] font-medium line-clamp-1">{item.title}</h3>
                            <p className="text-[#C5A455] font-serif-display text-sm mt-1">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 bg-white/[0.03] rounded-full px-1 py-0.5 border border-white/[0.06]">
                              <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#C8102E]/20 text-[#F5F0EB]/30 hover:text-[#C8102E] transition-all text-xs font-bold">−</button>
                              <span className="text-xs font-sans-luxury w-4 text-center text-[#F5F0EB]">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#C8102E]/20 text-[#F5F0EB]/30 hover:text-[#C8102E] transition-all text-xs font-bold">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-[#F5F0EB]/20 hover:text-[#C8102E] hover:bg-[#C8102E]/10 p-1.5 rounded-full transition-all">
                              <FiX size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-white/[0.04] p-6 bg-white/[0.01]">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-sans-luxury text-xs text-[#F5F0EB]/30 tracking-wider uppercase">Subtotal</span>
                    <span className="font-serif-display text-2xl text-[#C5A455]">${total.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full py-3.5 bg-[#C8102E] text-[#F5F0EB] rounded-full font-sans-luxury text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-[#A00D26] transition-all duration-300 shadow-xl shadow-[#C8102E]/20 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]"
                  >
                    {isCheckingOut ? (
                      <span className="animate-pulse flex items-center gap-2">Processing...</span>
                    ) : (
                      <span className="flex items-center gap-2">Checkout Securely <FiArrowRight size={14} /></span>
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

      <footer className="bg-[#0A0A0A] border-t border-white/[0.04] py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link to="/" className="text-xl font-serif-display text-[#F5F0EB] flex items-center gap-3 mb-4 tracking-tight">
                ShipCart <span className="text-[#C8102E]">●</span>
              </Link>
              <p className="text-[#F5F0EB]/30 text-sm font-sans-luxury leading-relaxed max-w-md">
                Next-generation logistics platform with intelligent routing, real-time tracking, and a curated marketplace of premium products.
              </p>
            </div>
            <div>
              <h4 className="text-[#F5F0EB] font-sans-luxury text-[10px] uppercase tracking-[0.2em] font-bold mb-4">Platform</h4>
              <div className="space-y-3">
                <Link to="/products" className="block text-[#F5F0EB]/30 text-sm font-sans-luxury hover:text-[#C5A455] transition-colors">Products</Link>
                <Link to="/login" className="block text-[#F5F0EB]/30 text-sm font-sans-luxury hover:text-[#C5A455] transition-colors">Seller Portal</Link>
                <Link to="/login" className="block text-[#F5F0EB]/30 text-sm font-sans-luxury hover:text-[#C5A455] transition-colors">Delivery Agent</Link>
              </div>
            </div>
            <div>
              <h4 className="text-[#F5F0EB] font-sans-luxury text-[10px] uppercase tracking-[0.2em] font-bold mb-4">Tech Stack</h4>
              <div className="space-y-3">
                <p className="text-[#F5F0EB]/30 text-sm font-sans-luxury">React + Vite</p>
                <p className="text-[#F5F0EB]/30 text-sm font-sans-luxury">Firebase + Firestore</p>
                <p className="text-[#F5F0EB]/30 text-sm font-sans-luxury">Kruskal MST Algorithm</p>
              </div>
            </div>
          </div>
          <div className="cartier-divider mb-8" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[#F5F0EB]/20 text-xs font-sans-luxury">&copy; {new Date().getFullYear()} ShipCart Logistics. All rights reserved.</p>
            <p className="text-[#F5F0EB]/10 text-[10px] font-sans-luxury">Built for premium commerce</p>
          </div>
        </div>
      </footer>

      {/* Floating AI Assistant */}
      <AIAssistantWidget />
    </div>
  );
};

export default MainLayout;
