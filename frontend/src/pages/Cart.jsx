import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { OrderContext } from '../context/OrderContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Reveal from '../components/Reveal';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};

const itemAnim = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useContext(CartContext);
  const { addOrder } = useContext(OrderContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) { navigate('/login'); return; }
    const order = {
      customerId: user.id,
      items: cart.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price })),
      totalAmount: total,
      deliveryLocation: 'Node_A'
    };
    addOrder(order);
    clearCart();
    navigate('/dashboard');
  };

  if (cart.length === 0) {
    return (
      <Reveal variant="fadeIn" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-6 border border-white/[0.06]">
          <FiShoppingBag size={32} className="text-[#F5F0EB]/20" />
        </div>
        <h2 className="font-serif-display text-2xl text-[#F5F0EB] mb-3">Your cart is empty</h2>
        <p className="text-[#F5F0EB]/30 text-sm font-sans-luxury mb-8">Add some luxury items to begin your journey.</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-[#C8102E] text-[#F5F0EB] px-6 py-3 rounded-full font-sans-luxury text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-[#A00D26] transition-colors shadow-lg shadow-[#C8102E]/20">
          Explore Products <FiArrowRight size={14} />
        </Link>
      </Reveal>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Reveal variant="fadeUp">
        <h1 className="font-serif-display text-2xl text-[#F5F0EB] mb-10 tracking-tight">
          Shopping Cart <span className="text-[#F5F0EB]/20 text-lg font-sans-luxury">· {cart.length} items</span>
        </h1>
      </Reveal>

      <div className="flex flex-col lg:flex-row gap-10">
        <motion.div className="flex-grow space-y-4" variants={container} initial="hidden" animate="show">
          {cart.map((item) => (
            <motion.div key={item.id} layout variants={itemAnim} className="glass-card p-5 flex items-center gap-5 group hover:border-[#C8102E]/20 transition-all duration-300">
              <div className="w-20 h-20 bg-white/[0.02] rounded-xl flex items-center justify-center p-2 overflow-hidden border border-white/[0.04]">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.title} className="max-h-full max-w-full object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-serif-display text-sm text-[#F5F0EB]">{item.title}</h3>
                <p className="text-[10px] text-[#F5F0EB]/20 font-sans-luxury tracking-wider uppercase mt-0.5">{item.category}</p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center border border-white/[0.06] rounded-full bg-white/[0.02]">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-2 hover:text-[#C8102E] text-[#F5F0EB]/30 transition-colors rounded-l-full px-3"><FiMinus size={12} /></button>
                    <span className="px-3 font-sans-luxury text-xs text-[#F5F0EB]">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:text-[#C8102E] text-[#F5F0EB]/30 transition-colors rounded-r-full px-3"><FiPlus size={12} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-[#F5F0EB]/20 hover:text-[#C8102E] transition-colors p-1"><FiTrash2 size={14} /></button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-serif-display text-lg text-[#C5A455]">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <Reveal variant="slideRight" delay={0.2} className="w-full lg:w-96">
          <div className="glass-card p-6 sticky top-24">
            <h3 className="font-serif-display text-lg text-[#F5F0EB] mb-6 tracking-tight">Order Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-[#F5F0EB]/40 text-sm font-sans-luxury">
                <span>Subtotal</span>
                <span className="text-[#F5F0EB]">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#F5F0EB]/40 text-sm font-sans-luxury">
                <span>Shipping</span>
                <span className="text-[#C5A455]">Free</span>
              </div>
              <div className="cartier-divider my-2" />
              <div className="flex justify-between font-serif-display text-lg text-[#F5F0EB]">
                <span>Total</span>
                <span className="text-[#C5A455]">${total.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={handleCheckout} className="w-full bg-[#C8102E] text-[#F5F0EB] py-3.5 rounded-full font-sans-luxury text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-[#A00D26] transition-all duration-300 shadow-lg shadow-[#C8102E]/20 active:scale-[0.97]">
              Proceed to Checkout <FiArrowRight className="inline ml-1" size={13} />
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Cart;
