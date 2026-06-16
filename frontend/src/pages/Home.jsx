import { useContext, useRef, useState, useEffect, useCallback } from 'react';
import { ProductContext } from '../context/ProductContext';
import { CartContext } from '../context/CartContext';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingCart, FiGlobe, FiCpu } from 'react-icons/fi';
import { EnhancedScene3D } from '../components/3d/EnhancedScene3D';
import { ScrollProgress } from '../components/ScrollProgress';
import { MagneticButton } from '../components/MagneticButton';
import { TiltCard3D } from '../components/3d/TiltCard3D';
import { CursorFollower } from '../components/CursorFollower';
import { LiveTrackingMap } from '../components/LiveTrackingMap';
import { useLenisProgress } from '../components/LenisProvider';
import { Preloader } from '../components/Preloader';

const useMousePosition = () => {
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouse = (e) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);
  return mouse;
};

const AnimatedCounter = ({ end, duration = 2, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const num = parseInt(end.replace(/[^0-9]/g, ''));
    let start = 0;
    const increment = num / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <motion.span ref={ref} initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="tabular-nums font-serif-display">
      {isInView ? `${count.toLocaleString()}+${suffix}` : `0${suffix}`}
    </motion.span>
  );
};

const CartierBadge = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] backdrop-blur-md border border-white/[0.06] text-[#C8102E] text-[10px] font-sans-luxury font-semibold tracking-[0.2em] uppercase"
  >
    <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] animate-pulse" />
    {children}
  </motion.div>
);

const SectionTitle = ({ subtitle, title, description, align = 'left' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className={`mb-14 ${align === 'center' ? 'text-center' : ''}`}
  >
    <p className="font-sans-luxury text-[10px] tracking-[0.25em] uppercase text-[#F5F0EB]/30 mb-4">{subtitle}</p>
    <h2 className="font-serif-display text-4xl md:text-5xl lg:text-6xl text-[#F5F0EB] mb-5 leading-[1.05]">{title}</h2>
    {description && (
      <p className="font-sans-luxury font-light text-[13px] text-[#F5F0EB]/30 max-w-xl leading-relaxed">{description}</p>
    )}
  </motion.div>
);

const GlassProductCard = ({ product, idx, addToCart }) => (
  <TiltCard3D>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: idx * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card rounded-xl overflow-hidden group cursor-pointer h-full"
    >
      <div className="h-48 overflow-hidden relative p-4 flex items-center justify-center bg-gradient-to-b from-white/[0.02] to-transparent">
        <img src={product.imageUrl} alt={product.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-luminosity opacity-70 group-hover:opacity-90" />
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full text-[8px] font-sans-luxury font-bold text-[#F5F0EB]/60 uppercase tracking-widest border border-white/[0.06]">
          {product.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-sans-luxury font-medium text-xs text-[#F5F0EB]/80 mb-2 line-clamp-1">{product.title}</h3>
        <div className="flex items-center justify-between">
          <span className="font-serif-display font-bold text-base text-[#C5A455]">${product.price.toFixed(2)}</span>
          <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center hover:bg-[#C8102E]/40 text-[#F5F0EB]/40 hover:text-[#F5F0EB] transition-all duration-300">
            <FiShoppingCart size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  </TiltCard3D>
);

const Home = () => {
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const featured = products.slice(0, 8);
  const mouse = useMousePosition();
  const { progress: scrollProgress } = useLenisProgress();
  const [loaded, setLoaded] = useState(false);
  const mainRef = useRef(null);

  const handlePreloaderComplete = useCallback(() => setLoaded(true), []);

  const { scrollYProgress } = useScroll({
    container: mainRef,
    offset: ["start start", "end end"],
  });

  const horizontalScrollX = useTransform(
    useSpring(scrollYProgress, { stiffness: 80, damping: 30 }),
    [0.3, 0.6],
    ['0%', '-35%']
  );

  return (
    <>
      <Preloader onComplete={handlePreloaderComplete} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#0A0A0A] text-[#F5F0EB] overflow-hidden relative"
      >
        <ScrollProgress />
        <CursorFollower />

        {/* ===== FIXED 3D BACKGROUND ===== */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <EnhancedScene3D scrollProgress={scrollProgress} mouse={mouse} />
        </div>

        {/* ===== GLASS HEADER ===== */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={loaded ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/70 backdrop-blur-xl border-b border-white/[0.04]"
        >
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <span className="font-serif-display text-xl text-[#F5F0EB] tracking-tight">ShipCart</span>
              <span className="text-[#C8102E] text-[18px] leading-none">●</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/products" className="text-[10px] font-sans-luxury font-medium text-[#F5F0EB]/40 hover:text-[#F5F0EB] tracking-[0.2em] uppercase transition-colors">Collection</Link>
              <Link to="/" className="text-[10px] font-sans-luxury font-medium text-[#F5F0EB]/40 hover:text-[#F5F0EB] tracking-[0.2em] uppercase transition-colors">Network</Link>
              <Link to="/login" className="text-[10px] font-sans-luxury font-bold text-[#F5F0EB] tracking-[0.2em] uppercase bg-white/[0.06] px-5 py-2 rounded-full hover:bg-[#C8102E]/30 transition-all border border-white/[0.06]">Sign In</Link>
            </nav>
          </div>
        </motion.header>

        {/* ===== SECTION 1: HERO ===== */}
        <section className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full pt-28 pb-20">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <CartierBadge>
                  <FiCpu size={10} /> ShipCart V2.0 — Autonomous Logistics
                </CartierBadge>

                <h1 className="font-serif-display text-6xl md:text-7xl lg:text-8xl text-[#F5F0EB] mt-10 mb-8 leading-[0.95]">
                  Logistics<br/>
                  <span className="text-[#C8102E] text-glow">Meets Commerce</span>
                </h1>

                <p className="font-sans-luxury font-light text-sm md:text-base text-[#F5F0EB]/30 max-w-xl mb-12 leading-relaxed">
                  Next-generation autonomous logistics network. AI-powered routing, real-time global tracking, and a curated marketplace of premium products.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <MagneticButton>
                    <Link to="/products" className="group flex items-center justify-center gap-3 bg-[#C8102E] text-[#F5F0EB] px-10 py-4 rounded-full font-sans-luxury font-bold text-[11px] tracking-widest uppercase hover:bg-[#A00D26] transition-all duration-300 shadow-2xl shadow-[#C8102E]/20">
                      Explore Collection
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
                    </Link>
                  </MagneticButton>
                  <MagneticButton>
                    <Link to="/login" className="flex items-center justify-center gap-2 text-[#F5F0EB]/40 px-8 py-4 rounded-full font-sans-luxury font-medium text-[11px] tracking-widest uppercase border border-white/[0.08] hover:border-white/20 hover:text-[#F5F0EB] transition-all duration-300">
                      <FiGlobe size={14} /> View Network
                    </Link>
                  </MagneticButton>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ delay: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
          >
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="flex flex-col items-center gap-2">
              <span className="text-[8px] font-sans-luxury text-[#F5F0EB]/15 tracking-[0.3em] uppercase">Scroll</span>
              <div className="w-[1px] h-6 bg-gradient-to-b from-[#F5F0EB]/20 to-transparent" />
            </motion.div>
          </motion.div>
        </section>

        {/* ===== SECTION 2: THE LOGISTICS HUB ===== */}
        <section className="relative z-10 min-h-screen flex items-center py-28">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <CartierBadge>AI Routing Engine</CartierBadge>
                <h2 className="font-serif-display text-4xl md:text-5xl text-[#F5F0EB] mt-8 mb-6 leading-[1.05]">
                  Intelligent<br/>
                  <span className="text-[#C8102E]">Logistics Hub</span>
                </h2>
                <div className="cartier-divider w-16 my-6" />
                <p className="font-sans-luxury font-light text-[13px] text-[#F5F0EB]/30 max-w-md mb-10 leading-relaxed">
                  Our proprietary AI pathing engine processes millions of delivery routes in real-time. Kruskal's MST algorithm ensures every package takes the optimal path — cutting delivery times by an average of 40%.
                </p>
                <div className="space-y-4">
                  {[
                    { label: 'Real-time AI Pathfinding', value: '< 2ms' },
                    { label: 'Global Network Coverage', value: '196 Countries' },
                    { label: 'Average Delivery Time', value: '4.2 Hours' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center justify-between border-b border-white/[0.04] pb-3"
                    >
                      <span className="text-[11px] font-sans-luxury text-[#F5F0EB]/30 tracking-wide">{stat.label}</span>
                      <span className="text-sm font-sans-luxury font-semibold text-[#C5A455]">{stat.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <div className="hidden lg:block" />
            </div>
          </div>
        </section>

        {/* ===== STAT STRIP ===== */}
        <section className="relative z-10 py-16 border-y border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {[
                { label: 'Active Users', value: '12K+', icon: '👥' },
                { label: 'Products Listed', value: '5K+', icon: '📦' },
                { label: 'Orders Delivered', value: '28K+', icon: '🚚' },
                { label: 'Network Nodes', value: '850+', icon: '🌐' }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="text-xl mb-3 opacity-40">{stat.icon}</div>
                  <p className="font-serif-display font-black text-3xl md:text-4xl text-[#F5F0EB] mb-1">
                    <AnimatedCounter end={stat.value} />
                  </p>
                  <p className="text-[9px] font-sans-luxury text-[#F5F0EB]/20 uppercase tracking-[0.2em]">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 3: GLOBAL NETWORK ===== */}
        <section className="relative z-10 py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-14">
            <SectionTitle
              subtitle="Global Infrastructure"
              title="Worldwide Delivery Network"
              description="Distributed logistics network spanning 196 countries with real-time route optimization powered by Kruskal's MST algorithm."
            />
          </div>

          <motion.div style={{ x: horizontalScrollX }} className="flex gap-6 pl-6 w-[200%] horizontal-scroll-container">
            <div className="w-[40%] shrink-0">
              <div className="glass-card rounded-3xl h-[450px] md:h-[500px] flex items-center justify-center relative overflow-hidden cartier-red-glow">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E]/5 via-transparent to-[#C5A455]/5" />
                <div className="text-center relative z-10 px-8">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="w-28 h-28 mx-auto mb-6 rounded-full border border-[#C8102E]/20 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-[#C5A455]/20 flex items-center justify-center">
                      <FiGlobe className="text-[#C8102E]/40" size={30} />
                    </div>
                  </motion.div>
                  <h3 className="font-serif-display text-2xl text-[#F5F0EB] mb-3">360° Network View</h3>
                  <p className="font-sans-luxury text-xs text-[#F5F0EB]/25 max-w-xs mx-auto">
                    Explore our global delivery network
                  </p>
                </div>
              </div>
            </div>

            <div className="w-[22%] shrink-0">
              <div className="glass-card rounded-3xl h-[450px] md:h-[500px] p-8 flex flex-col justify-center">
                <p className="text-[9px] font-sans-luxury text-[#C8102E]/50 uppercase tracking-[0.25em] mb-6">Network Statistics</p>
                <div className="space-y-6">
                  {[
                    { label: 'Active Routes', value: '12,847' },
                    { label: 'Avg. Latency', value: '< 50ms' },
                    { label: 'Uptime', value: '99.97%' },
                    { label: 'Data Processed', value: '2.4 TB/day' },
                  ].map((stat, i) => (
                    <div key={i}>
                      <p className="text-[10px] font-sans-luxury text-[#F5F0EB]/25 mb-1">{stat.label}</p>
                      <p className="text-xl font-serif-display font-bold text-[#C5A455]">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-[55%] shrink-0">
              <div className="glass-card rounded-3xl h-[450px] md:h-[500px] overflow-hidden p-3">
                <LiveTrackingMap />
              </div>
            </div>
          </motion.div>
        </section>

        {/* ===== FEATURED PRODUCTS ===== */}
        <section className="relative z-10 py-28 border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-6">
            <SectionTitle
              subtitle="Curated Selection"
              title="Featured Products"
              description="Premium products from verified sellers, delivered through our intelligent logistics network."
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {featured.slice(0, 8).map((product, idx) => (
                <GlassProductCard key={product.id} product={product} idx={idx} addToCart={addToCart} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <Link to="/products" className="inline-flex items-center gap-2 font-sans-luxury font-bold text-[10px] tracking-[0.2em] uppercase text-[#F5F0EB] bg-white/[0.06] px-8 py-3.5 rounded-full hover:bg-[#C8102E]/30 transition-all duration-300 border border-white/[0.06]">
                View Complete Collection <FiArrowRight size={13} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="relative z-10 py-28 border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-6">
            <SectionTitle subtitle="Client Stories" title="Trusted Worldwide" align="center" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { name: 'Sarah Chen', role: 'E-commerce Director', content: 'ShipCart revolutionized our logistics. AI routing cut delivery times by 40%, and real-time tracking is a game-changer for customer satisfaction.', avatar: 'SC' },
                { name: 'Marcus Johnson', role: 'Operations Lead', content: 'The network visibility is unmatched. We can track every package across 196 countries with millisecond latency updates.', avatar: 'MJ' },
                { name: 'Elena Rodriguez', role: 'Supply Chain VP', content: 'Kruskal-optimized routing saves us millions annually. The digital twin gives us unprecedented operational intelligence.', avatar: 'ER' },
              ].map((t, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card rounded-2xl p-8"
                >
                  <p className="text-[9px] font-sans-luxury text-[#C8102E]/40 uppercase tracking-[0.25em] mb-5">Client 0{idx + 1}</p>
                  <p className="font-sans-luxury font-light text-xs text-[#F5F0EB]/40 mb-6 leading-relaxed">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C8102E] to-[#8B0000] flex items-center justify-center text-[#F5F0EB] font-serif-display font-bold text-xs">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-sans-luxury font-medium text-xs text-[#F5F0EB]/80">{t.name}</p>
                      <p className="text-[9px] font-sans-luxury text-[#F5F0EB]/25">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 4: CTA ===== */}
        <section className="relative z-10 py-36 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C8102E]/5 to-[#0A0A0A]" />

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#C8102E]/10 via-[#C5A455]/5 to-transparent rounded-full blur-[100px]"
          />

          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <CartierBadge>Join the Network</CartierBadge>

              <h2 className="font-serif-display text-4xl md:text-6xl text-[#F5F0EB] mt-10 mb-8 leading-[1.05]">
                Ready to Transform<br/>
                <span className="text-[#C8102E] text-glow">Your Logistics?</span>
              </h2>

              <p className="font-sans-luxury font-light text-sm text-[#F5F0EB]/30 max-w-lg mx-auto mb-12 leading-relaxed">
                Join thousands of businesses already using ShipCart's intelligent logistics network. From local deliveries to global supply chains.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MagneticButton>
                  <Link to="/products" className="group flex items-center justify-center gap-3 bg-[#C8102E] text-[#F5F0EB] px-10 py-4 rounded-full font-sans-luxury font-bold text-[11px] tracking-widest uppercase hover:bg-[#A00D26] transition-all duration-300 shadow-2xl shadow-[#C8102E]/20">
                    Begin Your Journey
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link to="/login" className="flex items-center justify-center gap-2 border border-white/[0.08] text-[#F5F0EB]/40 px-8 py-4 rounded-full font-sans-luxury font-medium text-[11px] tracking-widest uppercase hover:border-white/20 hover:text-[#F5F0EB] transition-all duration-300">
                    <FiCpu size={14} /> Partner Network
                  </Link>
                </MagneticButton>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="relative z-10 border-t border-white/[0.04] py-14">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-14">
              <div className="col-span-2 md:col-span-1">
                <span className="font-serif-display text-base text-[#F5F0EB]">ShipCart</span>
                <span className="text-[#C8102E] text-sm ml-1">●</span>
                <p className="text-[10px] font-sans-luxury text-[#F5F0EB]/15 leading-relaxed mt-3 max-w-xs">
                  Next-generation logistics network powering the future of global commerce.
                </p>
              </div>
              {[
                { title: 'Network', links: ['Coverage Map', 'Node Status', 'API'] },
                { title: 'Company', links: ['About', 'Careers', 'Press'] },
                { title: 'Support', links: ['Documentation', 'Contact', 'Legal'] },
              ].map((col, i) => (
                <div key={i}>
                  <p className="text-[9px] font-sans-luxury text-[#F5F0EB]/20 uppercase tracking-[0.2em] mb-4">{col.title}</p>
                  <div className="space-y-2.5">
                    {col.links.map((link, j) => (
                      <p key={j} className="text-[11px] font-sans-luxury text-[#F5F0EB]/15 hover:text-[#C8102E] cursor-pointer transition-colors">{link}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="cartier-divider my-6" />
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4">
              <p className="text-[9px] font-sans-luxury text-[#F5F0EB]/10 tracking-wide">&copy; {new Date().getFullYear()} ShipCart Logistics</p>
              <p className="text-[9px] font-sans-luxury text-[#F5F0EB]/10 tracking-wide">Powered by Kruskal MST · Real-time · Global</p>
            </div>
          </div>
        </footer>
      </motion.div>
    </>
  );
};

export default Home;
