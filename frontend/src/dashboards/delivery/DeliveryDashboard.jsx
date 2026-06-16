import { useContext, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { OrderContext } from '../../context/OrderContext';
import { kruskalMST } from '../../utils/kruskal';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FiMap, FiCheckCircle, FiTruck, FiTrendingDown, FiPackage } from 'react-icons/fi';
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

const DeliveryDashboard = () => {
  const { user } = useContext(AuthContext);
  const { orders, updateOrderStatus, assignOrder } = useContext(OrderContext);

  const myDeliveries = orders.filter(o => o.deliveryPartnerId === user?.id || !o.deliveryPartnerId);
  const activeDeliveries = myDeliveries.filter(o => o.status === 'Pending' || o.status === 'Processing' || o.status === 'Shipped');
  const completedDeliveries = myDeliveries.filter(o => o.status === 'Delivered');

  const generateCoordinate = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) { hash = str.charCodeAt(i) + ((hash << 5) - hash); }
    return { x: 50 + Math.abs(hash % 400), y: 150 + Math.abs((hash >> 2) % 300) };
  };

  const { dynamicNodes, mst, totalDistance, optimizedDistance, distanceSaved, dynamicEdges } = useMemo(() => {
    const nodes = [{ id: 'Warehouse', label: 'Central Hub', x: 250, y: 50 }];
    activeDeliveries.forEach(o => { const { x, y } = generateCoordinate(o.id); nodes.push({ id: o.id, label: `Order ${o.id.substring(0, 4)}`, x, y }); });
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        edges.push({ source: nodes[i].id, target: nodes[j].id, weight: Math.round(Math.sqrt(dx * dx + dy * dy) / 10) });
      }
    }
    return { dynamicNodes: nodes, dynamicEdges: edges, ...kruskalMST(nodes, edges) };
  }, [activeDeliveries]);

  const rfNodes = dynamicNodes.map(node => ({
    id: node.id, position: { x: node.x, y: node.y }, data: { label: node.label },
    style: {
      background: node.id === 'Warehouse' ? '#C8102E' : '#0A0A0A', color: '#F5F0EB',
      border: node.id === 'Warehouse' ? '2px solid #C5A455' : '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px', padding: '10px', fontWeight: '600', fontFamily: 'Montserrat, sans-serif', fontSize: '11px',
      boxShadow: node.id === 'Warehouse' ? '0 4px 20px rgba(200,16,46,0.3)' : '0 4px 6px -1px rgb(0 0 0 / 0.3)'
    }
  }));

  const rfEdges = mst.map((edge, idx) => ({
    id: `e${idx}`, source: edge.source, target: edge.target, label: `${edge.weight}km`, animated: true,
    style: { stroke: '#C5A455', strokeWidth: 2 }
  }));

  const originalEdges = dynamicEdges.filter(e => !mst.find(m => m.source === e.source && m.target === e.target)).slice(0, 15).map((edge, idx) => ({
    id: `orig_e${idx}`, source: edge.source, target: edge.target,
    style: { stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1, strokeDasharray: '5,5' }
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Reveal variant="fadeUp">
        <div className="mb-8">
          <h1 className="font-serif-display text-2xl text-[#F5F0EB] tracking-tight">Delivery Dashboard</h1>
          <p className="text-[#F5F0EB]/30 text-sm font-sans-luxury">Route optimization and active assignments</p>
        </div>
      </Reveal>

      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10" variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans-luxury text-[10px] text-[#F5F0EB]/30 uppercase tracking-[0.2em]">Active</h3>
            <div className="p-2 bg-[#C8102E]/10 text-[#C8102E] rounded-xl"><FiTruck size={18} /></div>
          </div>
          <p className="font-serif-display text-3xl text-[#F5F0EB]">{activeDeliveries.length}</p>
        </motion.div>
        <motion.div variants={fadeUp} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans-luxury text-[10px] text-[#F5F0EB]/30 uppercase tracking-[0.2em]">Completed</h3>
            <div className="p-2 bg-[#C5A455]/10 text-[#C5A455] rounded-xl"><FiCheckCircle size={18} /></div>
          </div>
          <p className="font-serif-display text-3xl text-[#F5F0EB]">{completedDeliveries.length}</p>
        </motion.div>
        <motion.div variants={fadeUp} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans-luxury text-[10px] text-[#F5F0EB]/30 uppercase tracking-[0.2em]">Total Dist</h3>
            <div className="p-2 bg-white/[0.04] text-[#F5F0EB]/40 rounded-xl"><FiMap size={18} /></div>
          </div>
          <p className="font-serif-display text-3xl text-[#F5F0EB]">{totalDistance} <span className="text-sm font-sans-luxury text-[#F5F0EB]/30">km</span></p>
        </motion.div>
        <motion.div variants={fadeUp} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans-luxury text-[10px] text-[#F5F0EB]/30 uppercase tracking-[0.2em]">Optimized</h3>
            <div className="p-2 bg-[#C8102E]/10 text-[#C8102E] rounded-xl"><FiTrendingDown size={18} /></div>
          </div>
          <p className="font-serif-display text-3xl text-[#F5F0EB]">{optimizedDistance} <span className="text-sm font-sans-luxury text-[#F5F0EB]/30">km</span></p>
          <p className="text-[10px] font-sans-luxury text-[#C5A455] font-bold mt-2">Saved {distanceSaved} km</p>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Reveal variant="fadeUp" className="lg:col-span-2">
          <div className="glass-card overflow-hidden h-[600px] flex flex-col relative">
            <div className="p-6 border-b border-white/[0.04] z-10 bg-[#0A0A0A]/80 backdrop-blur-md">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-serif-display text-lg text-[#F5F0EB] flex items-center gap-2 tracking-tight"><FiMap className="text-[#C8102E]" size={18} /> Route Network</h2>
                  <p className="text-[11px] text-[#F5F0EB]/30 font-sans-luxury mt-1">Minimum Spanning Tree — Kruskal optimized</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#C5A455] font-sans-luxury tracking-wider font-medium bg-[#C5A455]/5 px-3 py-1.5 rounded-full border border-[#C5A455]/10">
                  <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-pulse"></span> Live GPS
                </div>
              </div>
            </div>
            <div className="flex-grow relative">
              <ReactFlow nodes={rfNodes} edges={[...originalEdges, ...rfEdges]} fitView attributionPosition="bottom-right" className="!bg-[#0A0A0A]">
                <Background color="rgba(255,255,255,0.03)" gap={16} />
                <Controls className="!bg-[#0A0A0A] !border-white/[0.06] !shadow-lg" />
              </ReactFlow>
              <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
                <motion.div animate={{ x: [0, 100, -50, 80, 0], y: [0, -50, 100, -80, 0] }} transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }} className="bg-[#C8102E] text-[#F5F0EB] p-2.5 rounded-full shadow-2xl shadow-[#C8102E]/40 flex items-center justify-center border-2 border-[#C5A455]">
                  <FiTruck size={20} />
                </motion.div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal variant="slideRight" delay={0.2}>
          <div className="glass-card p-6 flex flex-col h-[600px]">
            <h2 className="font-serif-display text-lg text-[#F5F0EB] mb-6 tracking-tight">Management</h2>
            <div className="overflow-y-auto flex-grow space-y-4 pr-2 custom-scrollbar">

              {orders.filter(o => !o.deliveryPartnerId && o.status === 'Pending').map(order => (
                <motion.div key={`avail-${order.id}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="border border-[#C8102E]/20 rounded-2xl p-5 bg-[#C8102E]/[0.03] hover:bg-[#C8102E]/[0.06] transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#C8102E] text-[#F5F0EB] text-[8px] font-sans-luxury font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">Available</div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-sans-luxury text-xs text-[#F5F0EB] font-medium">{order.id.substring(0, 10)}...</h3>
                    <span className="font-serif-display text-sm text-[#C5A455]">${order.totalAmount?.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-[#F5F0EB]/30 font-sans-luxury mb-4 flex items-center gap-2"><FiMap className="text-[#F5F0EB]/20" size={12} /> <span className="text-[#F5F0EB]/50">{order.deliveryLocation}</span></p>
                  <button onClick={() => assignOrder(order.id, user.id)} className="w-full bg-[#C8102E] text-[#F5F0EB] py-2.5 rounded-xl text-[10px] font-sans-luxury font-bold tracking-wider uppercase hover:bg-[#A00D26] transition-all shadow-md shadow-[#C8102E]/20">Accept Delivery</button>
                </motion.div>
              ))}

              {orders.filter(o => !o.deliveryPartnerId && o.status === 'Pending').length > 0 && activeDeliveries.filter(o => o.deliveryPartnerId === user?.id).length > 0 && (
                <div className="cartier-divider my-4" />
              )}

              {activeDeliveries.filter(o => o.deliveryPartnerId === user?.id).map(order => (
                <motion.div key={`active-${order.id}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="border border-white/[0.04] rounded-2xl p-5 bg-white/[0.01] hover:bg-white/[0.02] transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-sans-luxury text-xs text-[#F5F0EB] font-medium">{order.id.substring(0, 10)}...</h3>
                    <span className="bg-[#C8102E]/10 text-[#C8102E] text-[8px] px-2.5 py-1 rounded-full font-sans-luxury font-bold uppercase tracking-wider">{order.status}</span>
                  </div>
                  <p className="text-[11px] text-[#F5F0EB]/30 font-sans-luxury mb-4 flex items-center gap-2"><FiMap className="text-[#F5F0EB]/20" size={12} /> <span className="text-[#F5F0EB]/50">{order.deliveryLocation}</span></p>
                  <div className="flex gap-3">
                    {order.status !== 'Shipped' && (
                      <button onClick={() => updateOrderStatus(order.id, 'Shipped')} className="flex-1 bg-[#C5A455]/10 text-[#C5A455] py-2 rounded-xl text-[9px] font-sans-luxury font-bold tracking-wider uppercase hover:bg-[#C5A455]/20 transition-all">Mark Shipped</button>
                    )}
                    <button onClick={() => updateOrderStatus(order.id, 'Delivered')} className="flex-1 bg-[#C8102E]/10 text-[#C8102E] py-2 rounded-xl text-[9px] font-sans-luxury font-bold tracking-wider uppercase hover:bg-[#C8102E]/20 transition-all">Mark Delivered</button>
                  </div>
                </motion.div>
              ))}

              {orders.filter(o => !o.deliveryPartnerId && o.status === 'Pending').length === 0 && activeDeliveries.filter(o => o.deliveryPartnerId === user?.id).length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-[#F5F0EB]/20 py-10">
                  <FiPackage size={40} className="mb-4 opacity-30" />
                  <p className="text-center font-sans-luxury text-xs font-medium text-[#F5F0EB]/30">No available or active deliveries.</p>
                  <p className="text-center text-[10px] font-sans-luxury mt-1 text-[#F5F0EB]/20">All caught up!</p>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
