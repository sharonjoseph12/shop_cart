import { useContext, useState, useMemo } from 'react';
import { ProductContext } from '../context/ProductContext';
import { CartContext } from '../context/CartContext';
import { motion } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiStar, FiFilter } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Products = () => {
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Mock function to get random delivery date
  const getDeliveryDate = () => {
    const days = ['Tomorrow', 'Thursday', 'Friday', 'Monday'];
    return days[Math.floor(Math.random() * days.length)];
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) && 
      (category === 'All' || p.category === category)
    );

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
        return result.reverse(); // Mock newest
      default:
        return result;
    }
  }, [products, search, category, priceRange, sortBy]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Header for Mobile */}
      <div className="md:hidden bg-white p-4 shadow-sm flex items-center gap-2 sticky top-16 z-40">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          className="p-2 bg-gray-100 rounded-lg text-gray-600"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FiFilter size={20} />
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className={`md:w-64 flex-shrink-0 ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Filters</h2>
            
            <div className="mb-8">
              <h3 className="font-semibold text-gray-700 mb-3">Category</h3>
              <div className="space-y-2">
                {categories.map(c => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
                    <input 
                      type="radio" 
                      name="category"
                      checked={category === c}
                      onChange={() => setCategory(c)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className={`text-sm ${category === c ? 'font-semibold text-indigo-600' : 'text-gray-600'}`}>{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Price</h3>
              <div className="space-y-2">
                {['All', '0-25', '25-50', '50-100', '100+'].map(range => (
                  <label key={range} className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
                    <input 
                      type="radio" 
                      name="price"
                      checked={priceRange === range}
                      onChange={() => setPriceRange(range)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className={`text-sm ${priceRange === range ? 'font-semibold text-indigo-600' : 'text-gray-600'}`}>
                      {range === 'All' ? 'Any Price' : range === '100+' ? '$100 & Above' : `$${range.split('-')[0]} to $${range.split('-')[1]}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-grow">
          {/* Top Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <p className="text-gray-600 font-medium">
              Showing <span className="font-bold text-gray-900">{filteredAndSortedProducts.length}</span> results
            </p>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="hidden md:flex relative flex-grow sm:w-64">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg w-full focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="bg-gray-50 border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-gray-700 w-full sm:w-auto cursor-pointer"
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

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 10) * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="h-56 bg-gray-50 relative p-4 flex items-center justify-center overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title} 
                    className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-2 left-2 bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
                    {product.category}
                  </div>
                  {/* Mock Bestseller tag */}
                  {idx % 5 === 0 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                      Best Seller
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-indigo-600 cursor-pointer mb-1">
                      {product.title}
                    </h3>
                    
                    {/* Mock Ratings */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex text-yellow-400">
                        <FiStar className="fill-current" size={14} />
                        <FiStar className="fill-current" size={14} />
                        <FiStar className="fill-current" size={14} />
                        <FiStar className="fill-current" size={14} />
                        <FiStar className="text-gray-300 fill-current" size={14} />
                      </div>
                      <span className="text-xs text-indigo-600 hover:underline cursor-pointer ml-1">{Math.floor(Math.random() * 500) + 50}</span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500 line-through">${(product.price * 1.2).toFixed(2)}</span>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                        <span className="text-blue-500">prime</span> 
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        FREE Delivery by <span className="font-bold">{getDeliveryDate()}</span>
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-semibold rounded-full transition-colors active:scale-95 shadow-sm flex items-center justify-center gap-2"
                  >
                    <FiShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredAndSortedProducts.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
              <div className="text-gray-400 mb-4 flex justify-center">
                <FiSearch size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No exact matches found</h3>
              <p className="text-gray-500">Try changing or removing your filters.</p>
              <button 
                onClick={() => { setSearch(''); setCategory('All'); setPriceRange('All'); }}
                className="mt-6 px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full font-medium hover:bg-indigo-100"
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
