import { useContext } from 'react';
import { OrderContext } from '../context/OrderContext';
import { motion } from 'framer-motion';

const statusColors = {
  'Pending': 'text-yellow-400',
  'Processing': 'text-blue-400',
  'Shipped': 'text-indigo-400',
  'In Transit': 'text-cyan-400',
  'Delivered': 'text-green-400',
};

const locations = [
  { id: 'wh-1', name: 'NYC Warehouse', x: 10, y: 50 },
  { id: 'hub-1', name: 'Sorting Hub A', x: 30, y: 30 },
  { id: 'hub-2', name: 'Sorting Hub B', x: 30, y: 70 },
  { id: 'hub-3', name: 'Regional Hub', x: 55, y: 50 },
  { id: 'hub-4', name: 'Distribution Ctr', x: 75, y: 35 },
  { id: 'hub-5', name: 'Last-Mile Depot', x: 75, y: 65 },
  { id: 'dest', name: 'Customer Destinations', x: 92, y: 50 },
];

const routes = [
  ['wh-1', 'hub-1'],
  ['wh-1', 'hub-2'],
  ['hub-1', 'hub-3'],
  ['hub-2', 'hub-3'],
  ['hub-3', 'hub-4'],
  ['hub-3', 'hub-5'],
  ['hub-4', 'dest'],
  ['hub-5', 'dest'],
];

export const LiveTrackingMap = () => {
  const { orders } = useContext(OrderContext);
  const activeOrders = orders.filter(o => o.status !== 'Delivered').length;

  return (
    <div className="relative w-full h-[500px] md:h-[600px] bg-gray-950/90 rounded-3xl border border-gray-800 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />

      {/* SVG routes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {routes.map(([from, to], i) => {
          const fromNode = locations.find(l => l.id === from);
          const toNode = locations.find(l => l.id === to);
          const percentX = (pct) => `${pct}%`;
          const percentY = (pct) => `${pct}%`;
          return (
            <motion.line
              key={`route-${i}`}
              x1={percentX(fromNode.x)}
              y1={percentY(fromNode.y)}
              x2={percentX(toNode.x)}
              y2={percentY(toNode.y)}
              stroke="#6366f1"
              strokeWidth="1"
              strokeOpacity="0.3"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
            />
          );
        })}

        {/* Animated delivery paths */}
        {routes.slice(0, 3).map(([from, to], i) => {
          const fromNode = locations.find(l => l.id === from);
          const toNode = locations.find(l => l.id === to);
          return (
            <motion.line
              key={`live-${i}`}
              x1={`${fromNode.x}%`}
              y1={`${fromNode.y}%`}
              x2={`${toNode.x}%`}
              y2={`${toNode.y}%`}
              stroke="#22d3ee"
              strokeWidth="2"
              strokeOpacity="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: i * 1.2, ease: "linear" }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {locations.map((loc, i) => (
        <motion.div
          key={loc.id}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, duration: 0.5 }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
        >
          <div className="flex flex-col items-center gap-1">
            <div className={`
              w-4 h-4 rounded-full border-2 border-indigo-500 shadow-lg shadow-indigo-500/30
              ${loc.id === 'wh-1' ? 'bg-purple-500' : ''}
              ${loc.id === 'hub-3' ? 'bg-indigo-500' : ''}
              ${loc.id === 'dest' ? 'bg-emerald-500' : ''}
              ${loc.id.startsWith('hub') && loc.id !== 'hub-3' ? 'bg-cyan-500' : ''}
            `}>
              {loc.id === 'hub-3' && (
                <span className="absolute inset-0 rounded-full animate-ping bg-indigo-400 opacity-50" />
              )}
            </div>
            <span className="text-[10px] font-semibold text-gray-400 whitespace-nowrap bg-gray-950/80 px-2 py-0.5 rounded-full border border-gray-800">
              {loc.name}
            </span>
          </div>
        </motion.div>
      ))}

      {/* HUD Overlay */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-gray-950/80 backdrop-blur-md rounded-2xl border border-gray-800 p-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Live Network</p>
          <p className="text-2xl font-bold text-white">{activeOrders}</p>
          <p className="text-[10px] text-gray-500">Active Deliveries</p>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <div className="bg-gray-950/80 backdrop-blur-md rounded-2xl border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">Kruskal Route Optimization</span>
          </div>
          <p className="text-[10px] text-gray-600">MST algorithm • Real-time</p>
        </div>
      </div>

      {/* Status Legend */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-gray-950/80 backdrop-blur-md rounded-full border border-gray-800 px-6 py-2 flex items-center gap-4">
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${color.replace('text-', 'bg-')}`} />
              <span className="text-[10px] text-gray-500">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scrolling order list */}
      <div className="absolute bottom-16 right-4 z-20 max-h-[180px] overflow-hidden">
        <motion.div
          animate={{ y: [0, -200] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="space-y-2"
        >
          {orders.slice(0, 10).map((order) => (
            <div
              key={order.id}
              className="bg-gray-950/80 backdrop-blur-md rounded-xl border border-gray-800 px-3 py-2 flex items-center gap-3 w-56"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${(statusColors[order.status] || 'text-gray-500').replace('text-', 'bg-')}`} />
              <span className="text-xs text-gray-300 truncate flex-1">Order #{order.id?.slice(0, 6)}</span>
              <span className={`text-[10px] font-semibold ${statusColors[order.status] || 'text-gray-500'}`}>
                {order.status}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
