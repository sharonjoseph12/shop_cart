import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ProductContext } from '../../context/ProductContext';
import { OrderContext } from '../../context/OrderContext';
import { FiDollarSign, FiPackage, FiShoppingBag, FiEdit, FiTrash2, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import Reveal from '../../components/Reveal';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const SellerDashboard = () => {
  const { user } = useContext(AuthContext);
  const { products, addProduct, editProduct, deleteProduct } = useContext(ProductContext);
  const { orders } = useContext(OrderContext);

  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const myProducts = products.filter(p => p.sellerId === user?.id);
  const totalProducts = myProducts.length;

  let totalRevenue = 0;
  let totalOrders = 0;

  orders.forEach(order => {
    let hasMyProduct = false;
    order.items.forEach(item => {
      if (myProducts.find(p => p.id === item.productId)) { totalRevenue += item.price * item.quantity; hasMyProduct = true; }
    });
    if (hasMyProduct) totalOrders++;
  });

  const chartData = [
    { name: 'Mon', revenue: 400 }, { name: 'Tue', revenue: 300 }, { name: 'Wed', revenue: 600 },
    { name: 'Thu', revenue: 800 }, { name: 'Fri', revenue: 500 }, { name: 'Sat', revenue: 900 },
    { name: 'Sun', revenue: totalRevenue > 0 ? totalRevenue : 1200 },
  ];

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      title: formData.get('title'), description: formData.get('description'), category: formData.get('category'),
      imageUrl: formData.get('imageUrl'), price: parseFloat(formData.get('price')), stock: parseInt(formData.get('stock')),
      warehouseLocation: formData.get('warehouseLocation'), sellerId: user.id
    };
    if (currentProduct?.id) editProduct(currentProduct.id, productData);
    else addProduct(productData);
    setIsEditing(false); setCurrentProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Reveal variant="fadeUp">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-serif-display text-2xl text-[#F5F0EB] tracking-tight">Seller Dashboard</h1>
            <p className="text-[#F5F0EB]/30 text-sm font-sans-luxury">Manage your store and track analytics</p>
          </div>
          <button onClick={() => { setCurrentProduct(null); setIsEditing(true); }} className="bg-[#C8102E] text-[#F5F0EB] px-4 py-2.5 rounded-full font-sans-luxury text-[10px] font-bold tracking-[0.15em] uppercase flex items-center gap-2 hover:bg-[#A00D26] transition-all shadow-lg shadow-[#C8102E]/20">
            <FiPlus size={14} /> Add Product
          </button>
        </div>
      </Reveal>

      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10" variants={stagger} initial="hidden" animate="show">
        <div className="lg:col-span-1 space-y-5">
          <motion.div variants={fadeUp} className="glass-card p-6 flex items-center gap-4 hover:border-[#C5A455]/30 transition-all">
            <div className="p-3 bg-[#C5A455]/10 text-[#C5A455] rounded-xl"><FiDollarSign size={22} /></div>
            <div>
              <p className="text-[10px] text-[#F5F0EB]/30 font-sans-luxury uppercase tracking-[0.2em]">Revenue</p>
              <p className="font-serif-display text-2xl text-[#F5F0EB] mt-1">${totalRevenue.toFixed(2)}</p>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="glass-card p-6 flex items-center gap-4 hover:border-[#C8102E]/20 transition-all">
            <div className="p-3 bg-[#C8102E]/10 text-[#C8102E] rounded-xl"><FiShoppingBag size={22} /></div>
            <div>
              <p className="text-[10px] text-[#F5F0EB]/30 font-sans-luxury uppercase tracking-[0.2em]">Orders</p>
              <p className="font-serif-display text-2xl text-[#F5F0EB] mt-1">{totalOrders}</p>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="glass-card p-6 flex items-center gap-4 hover:border-white/[0.06] transition-all">
            <div className="p-3 bg-white/[0.04] text-[#F5F0EB]/40 rounded-xl"><FiPackage size={22} /></div>
            <div>
              <p className="text-[10px] text-[#F5F0EB]/30 font-sans-luxury uppercase tracking-[0.2em]">Listed</p>
              <p className="font-serif-display text-2xl text-[#F5F0EB] mt-1">{totalProducts}</p>
            </div>
          </motion.div>
        </div>

        <Reveal variant="fadeUp" delay={0.1} className="lg:col-span-2">
          <div className="glass-card p-6">
            <h2 className="font-serif-display text-lg text-[#F5F0EB] mb-6 tracking-tight">Revenue Trend</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs><linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C8102E" stopOpacity={0.3}/><stop offset="95%" stopColor="#C8102E" stopOpacity={0}/></linearGradient></defs>
                  <XAxis dataKey="name" stroke="#F5F0EB20" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#F5F0EB20" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip contentStyle={{ background: '#0A0A0A', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }} itemStyle={{ color: '#C5A455', fontWeight: 'bold' }} labelStyle={{ color: '#F5F0EB60' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#C8102E" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Reveal>
      </motion.div>

      {isEditing ? (
        <Reveal variant="fadeUp">
          <div className="glass-card p-8 mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif-display text-lg text-[#F5F0EB] tracking-tight">{currentProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsEditing(false)} className="text-[#F5F0EB]/30 hover:text-[#F5F0EB] transition-colors"><FiArrowLeft size={18} /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="block font-sans-luxury text-[10px] text-[#F5F0EB]/30 uppercase tracking-[0.2em] mb-2">Title</label><input required name="title" defaultValue={currentProduct?.title} className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3 text-[#F5F0EB] text-sm font-sans-luxury focus:outline-none focus:border-[#C8102E]/40 focus:ring-1 focus:ring-[#C8102E]/20 transition-all" /></div>
                <div><label className="block font-sans-luxury text-[10px] text-[#F5F0EB]/30 uppercase tracking-[0.2em] mb-2">Category</label><input required name="category" defaultValue={currentProduct?.category} className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3 text-[#F5F0EB] text-sm font-sans-luxury focus:outline-none focus:border-[#C8102E]/40 focus:ring-1 focus:ring-[#C8102E]/20 transition-all" /></div>
                <div><label className="block font-sans-luxury text-[10px] text-[#F5F0EB]/30 uppercase tracking-[0.2em] mb-2">Price ($)</label><input required type="number" step="0.01" name="price" defaultValue={currentProduct?.price} className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3 text-[#F5F0EB] text-sm font-sans-luxury focus:outline-none focus:border-[#C8102E]/40 focus:ring-1 focus:ring-[#C8102E]/20 transition-all" /></div>
                <div><label className="block font-sans-luxury text-[10px] text-[#F5F0EB]/30 uppercase tracking-[0.2em] mb-2">Stock</label><input required type="number" name="stock" defaultValue={currentProduct?.stock} className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3 text-[#F5F0EB] text-sm font-sans-luxury focus:outline-none focus:border-[#C8102E]/40 focus:ring-1 focus:ring-[#C8102E]/20 transition-all" /></div>
                <div className="md:col-span-2"><label className="block font-sans-luxury text-[10px] text-[#F5F0EB]/30 uppercase tracking-[0.2em] mb-2">Image URL</label><input required name="imageUrl" defaultValue={currentProduct?.imageUrl} className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3 text-[#F5F0EB] text-sm font-sans-luxury focus:outline-none focus:border-[#C8102E]/40 focus:ring-1 focus:ring-[#C8102E]/20 transition-all" /></div>
                <div className="md:col-span-2"><label className="block font-sans-luxury text-[10px] text-[#F5F0EB]/30 uppercase tracking-[0.2em] mb-2">Description</label><textarea required name="description" defaultValue={currentProduct?.description} rows="3" className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3 text-[#F5F0EB] text-sm font-sans-luxury focus:outline-none focus:border-[#C8102E]/40 focus:ring-1 focus:ring-[#C8102E]/20 transition-all" /></div>
                <div className="md:col-span-2"><label className="block font-sans-luxury text-[10px] text-[#F5F0EB]/30 uppercase tracking-[0.2em] mb-2">Warehouse Location</label><input required name="warehouseLocation" defaultValue={currentProduct?.warehouseLocation} className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3 text-[#F5F0EB] text-sm font-sans-luxury focus:outline-none focus:border-[#C8102E]/40 focus:ring-1 focus:ring-[#C8102E]/20 transition-all" /></div>
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 border border-white/[0.06] rounded-full text-[#F5F0EB]/40 font-sans-luxury text-[10px] tracking-wider uppercase hover:bg-white/[0.03] transition-all">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-[#C8102E] text-[#F5F0EB] rounded-full font-sans-luxury text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-[#A00D26] transition-all shadow-lg shadow-[#C8102E]/20">Save Product</button>
              </div>
            </form>
          </div>
        </Reveal>
      ) : (
        <Reveal variant="fadeUp" delay={0.15}>
          <div className="glass-card overflow-hidden">
            <table className="min-w-full divide-y divide-white/[0.04]">
              <thead className="bg-white/[0.02]">
                <tr>
                  <th className="px-6 py-4 text-left font-sans-luxury text-[9px] text-[#F5F0EB]/20 uppercase tracking-[0.2em] font-bold">Product</th>
                  <th className="px-6 py-4 text-left font-sans-luxury text-[9px] text-[#F5F0EB]/20 uppercase tracking-[0.2em] font-bold">Price</th>
                  <th className="px-6 py-4 text-left font-sans-luxury text-[9px] text-[#F5F0EB]/20 uppercase tracking-[0.2em] font-bold">Stock</th>
                  <th className="px-6 py-4 text-right font-sans-luxury text-[9px] text-[#F5F0EB]/20 uppercase tracking-[0.2em] font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {myProducts.map(product => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-white/[0.02] rounded-lg border border-white/[0.04] flex items-center justify-center p-1.5 overflow-hidden"><img className="max-h-full max-w-full object-contain opacity-60" src={product.imageUrl} alt="" /></div>
                        <div className="ml-4"><div className="font-sans-luxury text-xs text-[#F5F0EB] font-medium">{product.title}</div><div className="text-[10px] text-[#F5F0EB]/20 font-sans-luxury">{product.category}</div></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-sans-luxury text-xs text-[#C5A455]">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2.5 py-1 rounded-full text-[9px] font-sans-luxury font-bold tracking-wider ${product.stock > 10 ? 'bg-[#C5A455]/10 text-[#C5A455]' : 'bg-[#C8102E]/10 text-[#C8102E]'}`}>{product.stock} units</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-1">
                      <button onClick={() => { setCurrentProduct(product); setIsEditing(true); }} className="text-[#F5F0EB]/30 hover:text-[#C5A455] hover:bg-[#C5A455]/10 p-2 rounded-xl transition-all"><FiEdit size={15} /></button>
                      <button onClick={() => deleteProduct(product.id)} className="text-[#F5F0EB]/30 hover:text-[#C8102E] hover:bg-[#C8102E]/10 p-2 rounded-xl transition-all"><FiTrash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      )}
    </div>
  );
};

export default SellerDashboard;
