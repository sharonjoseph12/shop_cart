import { useContext, useState, useMemo, useEffect } from 'react';
import { ProductContext } from '../context/ProductContext';
import { CartContext } from '../context/CartContext';
import { motion } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiStar, FiFilter } from 'react-icons/fi';
import Fuse from 'fuse.js';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Products = () => {
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fake loading delay for UX polish
  useEffect(() => {
    if (products.length > 0) {
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [products]);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const getDeliveryDate = () => {
    const days = ['Tomorrow', 'Thursday', 'Friday', 'Monday'];
    // eslint-disable-next-line react-hooks/purity
    return days[Math.floor(Math.random() * days.length)];
  };

  const fuse = useMemo(() => new Fuse(products, {
    keys: ['title', 'category', 'description'],
    threshold: 0.3,
    includeScore: true
  }), [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    if (search.trim() !== '') {
      result = fuse.search(search).map(r => r.item);
    }

    result = result.filter(p => (category === 'All' || p.category === category));

    if (priceRange !== 'All') {
      const [min, max] = priceRange.split('-').map(Number);
      result = result.filter(p => {
        if (priceRange === '100+') return p.price >= 100;
        return p.price >= min && p.price <= max;
      });
    }

    switch (sortBy) {
      case 'Price: Low to High':
        return result.sort((a, b) => a.price - b.price);
      case 'Price: High to Low':
        return result.sort((a, b) => b.price - a.price);
      case 'Newest Arrivals':
        return result.reverse(); 
      default:
        return result;
    }
  }, [products, search, category, priceRange, sortBy, fuse]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <div className="md:hidden bg-white dark:bg-gray-800 p-4 shadow-sm flex items-center gap-2 sticky top-16 z-40">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FiFilter size={20} />
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        <aside className={`md:w-64 flex-shrink-0 ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Filters</h2>
            
            <div className="mb-8">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Category</h3>
              <div className="space-y-2">
                {categories.map(c => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400">
                    <input 
                      type="radio" 
                      name="category"
                      checked={category === c}
                      onChange={() => setCategory(c)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className={`text-sm ${category === c ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'}`}>{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Price</h3>
              <div className="space-y-2">
                {['All', '0-25', '25-50', '50-100', '100+'].map(range => (
                  <label key={range} className="flex items-center gap-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400">
                    <input 
                      type="radio" 
                      name="price"
                      checked={priceRange === range}
                      onChange={() => setPriceRange(range)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className={`text-sm ${priceRange === range ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {range === 'All' ? 'Any Price' : range === '100+' ? '$100 & Above' : `$${range.split('-')[0]} to $${range.split('-')[1]}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-grow">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Showing <span className="font-bold text-gray-900 dark:text-white">{loading ? '...' : filteredAndSortedProducts.length}</span> results
            </p>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="hidden md:flex relative flex-grow sm:w-64">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border-none rounded-lg w-full focus:ring-2 focus:ring-indigo-500 text-sm dark:text-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="bg-gray-50 dark:bg-gray-700 border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-gray-700 dark:text-gray-200 w-full sm:w-auto cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              Array(8).fill(0).map((_, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col p-4">
                  <Skeleton height={180} className="mb-4 rounded-xl dark:opacity-20" />
                  <Skeleton count={2} className="mb-2 dark:opacity-20" />
                  <Skeleton width={100} className="mb-4 dark:opacity-20" />
                  <Skeleton height={40} className="rounded-full mt-auto dark:opacity-20" />
                </div>
              ))
            ) : (
              filteredAndSortedProducts.map((product, idx) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 30, rotateX: 8 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: (idx % 8) * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-indigo-500/10 transition-shadow duration-500 group"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="h-56 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 relative p-4 flex items-center justify-center overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title} 
                      className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-700 ease-out" 
                    />
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-gray-700 dark:text-gray-200 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase border border-gray-200 dark:border-gray-600">
                      {product.category}
                    </div>
                    {idx % 5 === 0 && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-0.5 rounded-full text-[10px] font-bold shadow-lg">
                        🔥 Hot
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 flex-grow flex flex-col justify-between border-t border-gray-100 dark:border-gray-700">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer mb-2">
                        {product.title}
                      </h3>
                      
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex text-yellow-400">
                          <FiStar className="fill-current" size={12} />
                          <FiStar className="fill-current" size={12} />
                          <FiStar className="fill-current" size={12} />
                          <FiStar className="fill-current" size={12} />
                          <FiStar className="text-gray-300 dark:text-gray-600 fill-current" size={12} />
                        </div>
                        {/* eslint-disable-next-line react-hooks/purity */}
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1">({Math.floor(Math.random() * 500) + 50})</span>
                      </div>

                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xl font-extrabold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 line-through">${(product.price * 1.2).toFixed(2)}</span>
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                        <span className="text-green-500 font-bold">FREE</span> Delivery by <span className="font-bold text-gray-700 dark:text-gray-300">{getDeliveryDate()}</span>
                      </p>
                    </div>
                    
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full mt-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold rounded-2xl hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-all duration-300 active:scale-[0.97] shadow-sm flex items-center justify-center gap-2"
                    >
                      <FiShoppingCart size={16} />
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {!loading && filteredAndSortedProducts.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
              <div className="text-gray-400 mb-4 flex justify-center">
                <FiSearch size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No exact matches found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try changing or removing your filters.</p>
              <button 
                onClick={() => { setSearch(''); setCategory('All'); setPriceRange('All'); }}
                className="mt-6 px-6 py-2 bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 rounded-full font-medium hover:bg-indigo-100 dark:hover:bg-gray-600"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
