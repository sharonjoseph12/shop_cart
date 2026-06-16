import { useContext, useState } from 'react';
import { ProductContext } from '../context/ProductContext';
import { CartContext } from '../context/CartContext';
import { motion } from 'framer-motion';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';

const Products = () => {
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) && 
    (category === 'All' || p.category === category)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="text-gray-500 mt-2">Find exactly what you need</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product, idx) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (idx % 10) * 0.05 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden flex flex-col"
          >
            <div className="h-48 overflow-hidden bg-gray-100 relative">
              <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                {product.category}
              </div>
            </div>
            <div className="p-5 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xl font-bold text-indigo-600">${product.price}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  <FiShoppingCart size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-500">
            No products found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
