import { useContext, useState, useMemo, useEffect } from 'react';
import { ProductContext } from '../context/ProductContext';
import { CartContext } from '../context/CartContext';
import { motion } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiStar, FiFilter, FiArrowRight } from 'react-icons/fi';
import Fuse from 'fuse.js';
import Reveal from '../components/Reveal';

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } }
};

const cardAnim = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const Products = () => {
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products.length > 0) {
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [products]);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const fuse = useMemo(() => new Fuse(products, {
    keys: ['title', 'category', 'description'],
    threshold: 0.3,
    includeScore: true
  }), [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products;
    if (search.trim() !== '') result = fuse.search(search).map(r => r.item);
    result = result.filter(p => (category === 'All' || p.category === category));
    if (priceRange !== 'All') {
      const [min, max] = priceRange.split('-').map(Number);
      result = result.filter(p => priceRange === '100+' ? p.price >= 100 : p.price >= min && p.price <= max);
    }
    switch (sortBy) {
      case 'Price: Low to High': return result.sort((a, b) => a.price - b.price);
      case 'Price: High to Low': return result.sort((a, b) => b.price - a.price);
      case 'Newest Arrivals': return result.reverse();
      default: return result;
    }
  }, [products, search, category, priceRange, sortBy, fuse]);

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <div className="md:hidden bg-[#0A0A0A]/80 backdrop-blur-xl p-4 flex items-center gap-2 sticky top-16 z-40 border-b border-white/[0.04]">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F5F0EB]/30" size={14} />
          <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-full text-[#F5F0EB] text-sm placeholder-[#F5F0EB]/20 focus:outline-none focus:border-[#C8102E]/40 focus:ring-1 focus:ring-[#C8102E]/20 font-sans-luxury" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="p-2.5 bg-white/[0.04] border border-white/[0.06] rounded-full text-[#F5F0EB]/40 hover:text-[#C8102E] transition-colors" onClick={() => setIsSidebarOpen(!isSidebarOpen)}><FiFilter size={16} /></button>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">

        <Reveal variant="slideLeft" className="md:w-64 flex-shrink-0 hidden md:block">
          <aside className={`${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
            <div className="glass-card p-6 sticky top-24">
              <h2 className="font-serif-display text-lg text-[#F5F0EB] mb-6 tracking-tight">Filters</h2>
              <div className="mb-8">
                <h3 className="font-sans-luxury text-[10px] text-[#F5F0EB]/30 uppercase tracking-[0.2em] font-medium mb-4">Category</h3>
                <div className="space-y-3">
                  {categories.map(c => (
                    <label key={c} className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="category" checked={category === c} onChange={() => setCategory(c)} className="appearance-none w-4 h-4 border border-white/[0.15] rounded-full checked:border-[#C8102E] checked:bg-[#C8102E] checked:shadow-[0_0_8px_rgba(200,16,46,0.4)] transition-all duration-200 cursor-pointer" />
                      <span className={`text-xs font-sans-luxury tracking-wider ${category === c ? 'text-[#F5F0EB] font-medium' : 'text-[#F5F0EB]/30 group-hover:text-[#F5F0EB]/50'} transition-colors`}>{c}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-sans-luxury text-[10px] text-[#F5F0EB]/30 uppercase tracking-[0.2em] font-medium mb-4">Price</h3>
                <div className="space-y-3">
                  {['All', '0-25', '25-50', '50-100', '100+'].map(range => (
                    <label key={range} className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="price" checked={priceRange === range} onChange={() => setPriceRange(range)} className="appearance-none w-4 h-4 border border-white/[0.15] rounded-full checked:border-[#C8102E] checked:bg-[#C8102E] checked:shadow-[0_0_8px_rgba(200,16,46,0.4)] transition-all duration-200 cursor-pointer" />
                      <span className={`text-xs font-sans-luxury tracking-wider ${priceRange === range ? 'text-[#F5F0EB] font-medium' : 'text-[#F5F0EB]/30 group-hover:text-[#F5F0EB]/50'} transition-colors`}>{range === 'All' ? 'Any Price' : range === '100+' ? '$100 & Above' : `$${range.split('-')[0]} to $${range.split('-')[1]}`}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </Reveal>

        <div className="flex-grow">
          <Reveal variant="fadeUp">
            <div className="glass-card p-4 flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <p className="font-sans-luxury text-[11px] text-[#F5F0EB]/40 tracking-wider">Showing <span className="text-[#F5F0EB] font-medium">{loading ? '...' : filteredAndSortedProducts.length}</span> results</p>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="hidden md:flex relative flex-grow sm:w-64">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F5F0EB]/30" size={14} />
                  <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-full text-[#F5F0EB] text-sm placeholder-[#F5F0EB]/20 focus:outline-none focus:border-[#C8102E]/40 focus:ring-1 focus:ring-[#C8102E]/20 font-sans-luxury" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <select className="bg-white/[0.04] border border-white/[0.06] rounded-full px-4 py-2 text-[#F5F0EB]/60 font-sans-luxury text-[11px] tracking-wider focus:outline-none focus:border-[#C8102E]/40 cursor-pointer appearance-none" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option className="bg-[#0A0A0A]">Featured</option>
                  <option className="bg-[#0A0A0A]">Price: Low to High</option>
                  <option className="bg-[#0A0A0A]">Price: High to Low</option>
                  <option className="bg-[#0A0A0A]">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </Reveal>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array(8).fill(0).map((_, idx) => (
                <div key={idx} className="glass-card overflow-hidden flex flex-col">
                  <div className="h-48 bg-white/[0.02] animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-white/[0.04] rounded-full animate-pulse" />
                    <div className="h-3 w-2/3 bg-white/[0.04] rounded-full animate-pulse" />
                    <div className="h-4 w-1/3 bg-white/[0.04] rounded-full animate-pulse" />
                    <div className="h-9 bg-white/[0.04] rounded-full animate-pulse mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" variants={staggerContainer} initial="hidden" animate="show">
              {filteredAndSortedProducts.map((product) => (
                <motion.div key={product.id} variants={cardAnim} whileHover={{ y: -8, transition: { duration: 0.3 } }} className="group glass-card overflow-hidden flex flex-col hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:border-[#C8102E]/20 transition-all duration-500">
                  <div className="h-48 bg-gradient-to-b from-white/[0.02] to-white/[0.01] relative p-4 flex items-center justify-center overflow-hidden">
                    {product.imageUrl && <img src={product.imageUrl} alt={product.title} className="max-h-full max-w-full object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" />}
                    <div className="absolute top-3 left-3 bg-[#0A0A0A]/80 backdrop-blur-md text-[#F5F0EB]/50 px-3 py-0.5 rounded-full text-[9px] font-sans-luxury tracking-[0.15em] uppercase border border-white/[0.06]">{product.category}</div>
                    {product.stock <= 5 && <div className="absolute top-3 right-3 bg-[#C8102E] text-white px-2.5 py-0.5 rounded-full text-[9px] font-sans-luxury tracking-wider font-bold shadow-lg">Low Stock</div>}
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between border-t border-white/[0.04]">
                    <div>
                      <h3 className="font-serif-display text-sm text-[#F5F0EB] leading-snug group-hover:text-[#C8102E] transition-colors cursor-pointer mb-3">{product.title}</h3>
                      <div className="flex items-center gap-1 mb-3">
                        {[0, 1, 2, 3, 4].map((star) => <FiStar key={star} className={star < 4 ? 'text-[#C5A455] fill-current' : 'text-white/[0.08]'} size={10} />)}
                        <span className="text-[9px] text-[#F5F0EB]/20 font-sans-luxury ml-1">({product.stock || 0})</span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-serif-display text-xl text-[#F5F0EB] tracking-tight">${product.price.toFixed(2)}</span>
                        <span className="text-[10px] text-[#F5F0EB]/20 line-through font-sans-luxury">${(product.price * 1.25).toFixed(2)}</span>
                      </div>
                      <p className="text-[10px] text-[#F5F0EB]/20 font-sans-luxury mt-2 flex items-center gap-1"><span className="text-[#C5A455] font-medium">FREE</span> Delivery</p>
                    </div>
                    <button onClick={() => addToCart(product)} className="w-full mt-4 py-2.5 bg-[#C8102E] text-[#F5F0EB] text-[10px] font-sans-luxury font-bold tracking-[0.15em] uppercase rounded-full hover:bg-[#A00D26] transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-2 shadow-lg shadow-[#C8102E]/20 group-hover:shadow-[#C8102E]/40"><FiShoppingCart size={12} /> Add to Cart</button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && filteredAndSortedProducts.length === 0 && (
            <Reveal variant="fadeIn">
              <div className="glass-card p-16 text-center">
                <FiSearch size={40} className="mx-auto text-[#F5F0EB]/10 mb-4" />
                <h3 className="font-serif-display text-lg text-[#F5F0EB] mb-2">No matches found</h3>
                <p className="text-[#F5F0EB]/30 text-sm font-sans-luxury">Try adjusting your filters or search terms.</p>
                <button onClick={() => { setSearch(''); setCategory('All'); setPriceRange('All'); }} className="mt-6 px-6 py-2.5 bg-white/[0.06] text-[#F5F0EB]/60 rounded-full font-sans-luxury text-[10px] tracking-wider uppercase hover:bg-[#C8102E]/30 hover:text-[#F5F0EB] transition-all border border-white/[0.06]">Clear Filters <FiArrowRight className="inline ml-1" size={12} /></button>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
