import { useContext, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { OrderContext } from '../../context/OrderContext';
import { kruskalMST } from '../../utils/kruskal';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FiMap, FiCheckCircle, FiTruck, FiTrendingDown } from 'react-icons/fi';
import { motion } from 'framer-motion';

const DeliveryDashboard = () => {
  const { user } = useContext(AuthContext);
  const { orders, updateOrderStatus, assignOrder } = useContext(OrderContext);

  const myDeliveries = orders.filter(o => o.deliveryPartnerId === user?.id || !o.deliveryPartnerId);
  const activeDeliveries = myDeliveries.filter(o => o.status === 'Pending' || o.status === 'Processing' || o.status === 'Shipped');
  const completedDeliveries = myDeliveries.filter(o => o.status === 'Delivered');

  const generateCoordinate = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const x = 50 + Math.abs(hash % 400);
    const y = 150 + Math.abs((hash >> 2) % 300);
    return { x, y };
  };

  const { dynamicNodes, mst, totalDistance, optimizedDistance, distanceSaved, dynamicEdges } = useMemo(() => {
    const nodes = [
      { id: 'Warehouse', label: 'Central Hub', x: 250, y: 50 }
    ];
    
    activeDeliveries.forEach(o => {
      // Use deliveryLocation or ID for consistent coordinates
      const { x, y } = generateCoordinate(o.id);
      nodes.push({
        id: o.id,
        label: `Order ${o.id.substring(0, 4)}`,
        x, y
      });
    });

    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const weight = Math.round(Math.sqrt(dx * dx + dy * dy) / 10);
        edges.push({
          source: nodes[i].id,
          target: nodes[j].id,
          weight
        });
      }
    }

    const mstResult = kruskalMST(nodes, edges);
    return { dynamicNodes: nodes, dynamicEdges: edges, ...mstResult };
  }, [activeDeliveries]);

  // React Flow Elements
  const nodes = dynamicNodes.map(node => ({
    id: node.id,
    position: { x: node.x, y: node.y },
    data: { label: node.label },
    style: { 
      background: node.id === 'Warehouse' ? '#4f46e5' : '#ffffff',
      color: node.id === 'Warehouse' ? '#fff' : '#000',
      border: '2px solid #4f46e5',
      borderRadius: '12px',
      padding: '10px',
      fontWeight: 'bold',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
    }
  }));

  const edges = mst.map((edge, idx) => ({
    id: `e${idx}`,
    source: edge.source,
    target: edge.target,
    label: `${edge.weight}km`,
    animated: true,
    style: { stroke: '#4f46e5', strokeWidth: 3 }
  }));

  const originalEdges = dynamicEdges.filter(e => !mst.find(m => m.source === e.source && m.target === e.target)).slice(0, 15).map((edge, idx) => ({
    id: `orig_e${idx}`,
    source: edge.source,
    target: edge.target,
    style: { stroke: '#e5e7eb', strokeWidth: 1, strokeDasharray: '5,5', opacity: 0.3 }
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Delivery Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Route optimization and active assignments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Deliveries</h3>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl"><FiTruck size={20} /></div>
          </div>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{activeDeliveries.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</h3>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl"><FiCheckCircle size={20} /></div>
          </div>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{completedDeliveries.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Distance</h3>
            <div className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl"><FiMap size={20} /></div>
          </div>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{totalDistance} <span className="text-lg">km</span></p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Optimized</h3>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl"><FiTrendingDown size={20} /></div>
          </div>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{optimizedDistance} <span className="text-lg">km</span></p>
          <p className="text-sm text-green-600 dark:text-green-400 font-bold mt-2">Saved {distanceSaved} km!</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-[600px] flex flex-col relative">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 z-10 bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><FiMap className="text-indigo-500" /> Route Network</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Live animated tracking across the Minimum Spanning Tree.</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                Live GPS
              </div>
            </div>
          </div>
          <div className="flex-grow relative">
            <ReactFlow 
              nodes={nodes} 
              edges={[...originalEdges, ...edges]} 
              fitView
              attributionPosition="bottom-right"
              className="dark:bg-gray-900"
            >
              <Background color="#f3f4f6" gap={16} />
              <Controls className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg" />
            </ReactFlow>

            {/* Fake Moving Truck overlay directly on the canvas */}
            <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
              <motion.div
                animate={{
                  x: [0, 100, -50, 80, 0],
                  y: [0, -50, 100, -80, 0]
                }}
                transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
                className="bg-indigo-600 text-white p-3 rounded-full shadow-2xl flex items-center justify-center border-4 border-white dark:border-gray-800"
              >
                <FiTruck size={24} />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-[600px]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Delivery Management</h2>
          <div className="overflow-y-auto flex-grow space-y-4 pr-2">
            
            {/* Unassigned Deliveries */}
            {orders.filter(o => !o.deliveryPartnerId && o.status === 'Pending').map(order => (
              <motion.div 
                key={`avail-${order.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border-2 border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-5 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
                  Available
                </div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-900 dark:text-white">{order.id}</h3>
                  <span className="font-bold text-gray-900 dark:text-white">${order.totalAmount?.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 flex items-center gap-2">
                  <FiMap className="text-gray-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">{order.deliveryLocation}</span>
                </p>
                
                <button 
                  onClick={() => assignOrder(order.id, user.id)}
                  className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
                >
                  Accept Delivery
                </button>
              </motion.div>
            ))}

            <div className="my-6 border-b border-gray-100 dark:border-gray-700"></div>

            {/* My Active Deliveries */}
            {activeDeliveries.filter(o => o.deliveryPartnerId === user?.id).map(order => (
              <motion.div 
                key={`active-${order.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-gray-100 dark:border-gray-700 rounded-2xl p-5 bg-gray-50 dark:bg-gray-900/50 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-900 dark:text-white">{order.id}</h3>
                  <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">{order.status}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 flex items-center gap-2">
                  <FiMap className="text-gray-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">{order.deliveryLocation}</span>
                </p>
                
                <div className="flex gap-3">
                  {order.status !== 'Shipped' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'Shipped')}
                      className="flex-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                      Mark Shipped
                    </button>
                  )}
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'Delivered')}
                    className="flex-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 py-2.5 rounded-xl text-sm font-bold hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                  >
                    Mark Delivered
                  </button>
                </div>
              </motion.div>
            ))}
            
            {orders.filter(o => !o.deliveryPartnerId && o.status === 'Pending').length === 0 && activeDeliveries.filter(o => o.deliveryPartnerId === user?.id).length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 py-10">
                <FiCheckCircle size={48} className="mb-4 opacity-50" />
                <p className="text-center font-medium">No available or active deliveries.</p>
                <p className="text-center text-sm mt-1">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
