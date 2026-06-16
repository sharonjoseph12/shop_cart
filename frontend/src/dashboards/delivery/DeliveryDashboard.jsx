import React, { useContext, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { OrderContext } from '../../context/OrderContext';
import { mockDeliveryNodes, mockDeliveryEdges } from '../../data/deliveryLocations';
import { kruskalMST } from '../../utils/kruskal';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FiMap, FiCheckCircle, FiTruck, FiTrendingDown } from 'react-icons/fi';

const DeliveryDashboard = () => {
  const { user } = useContext(AuthContext);
  const { orders, updateOrderStatus } = useContext(OrderContext);

  const myDeliveries = orders.filter(o => o.deliveryPartnerId === user?.id || !o.deliveryPartnerId);
  const activeDeliveries = myDeliveries.filter(o => o.status === 'Processing' || o.status === 'Shipped');
  const completedDeliveries = myDeliveries.filter(o => o.status === 'Delivered');

  const { mst, totalDistance, optimizedDistance, distanceSaved } = useMemo(() => {
    return kruskalMST(mockDeliveryNodes, mockDeliveryEdges);
  }, []);

  // React Flow Elements
  const nodes = mockDeliveryNodes.map(node => ({
    id: node.id,
    position: { x: node.x, y: node.y },
    data: { label: node.label },
    style: { 
      background: node.id === 'Warehouse' ? '#4f46e5' : '#fff',
      color: node.id === 'Warehouse' ? '#fff' : '#000',
      border: '2px solid #4f46e5',
      borderRadius: '8px',
      padding: '10px',
      fontWeight: 'bold'
    }
  }));

  const edges = mst.map((edge, idx) => ({
    id: `e${idx}`,
    source: edge.source,
    target: edge.target,
    label: `${edge.weight}km`,
    animated: true,
    style: { stroke: '#4f46e5', strokeWidth: 2 }
  }));

  const originalEdges = mockDeliveryEdges.map((edge, idx) => ({
    id: `orig_e${idx}`,
    source: edge.source,
    target: edge.target,
    style: { stroke: '#e5e7eb', strokeWidth: 1, strokeDasharray: '5,5' }
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Delivery Dashboard</h1>
        <p className="text-gray-500">Route optimization and active assignments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Active Deliveries</h3>
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><FiTruck size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{activeDeliveries.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Completed</h3>
            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><FiCheckCircle size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{completedDeliveries.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Distance</h3>
            <div className="p-2 bg-gray-100 text-gray-600 rounded-lg"><FiMap size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalDistance} km</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Optimized</h3>
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><FiTrendingDown size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{optimizedDistance} km</p>
          <p className="text-sm text-green-600 font-medium mt-1">Saved {distanceSaved} km!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[600px] flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Route Optimization Network (Kruskal MST)</h2>
            <p className="text-sm text-gray-500">Dotted lines show original paths. Solid purple lines show the optimized Minimum Spanning Tree.</p>
          </div>
          <div className="flex-grow">
            <ReactFlow 
              nodes={nodes} 
              edges={[...originalEdges, ...edges]} 
              fitView
              attributionPosition="bottom-right"
            >
              <Background color="#f3f4f6" gap={16} />
              <Controls />
            </ReactFlow>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-[600px]">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Assigned Deliveries</h2>
          <div className="overflow-y-auto flex-grow space-y-4 pr-2">
            {activeDeliveries.map(order => (
              <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{order.id}</h3>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">{order.status}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Destination: <span className="font-semibold text-gray-900">{order.deliveryLocation}</span></p>
                
                <div className="flex gap-2">
                  {order.status !== 'Shipped' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'Shipped')}
                      className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition"
                    >
                      Mark Shipped
                    </button>
                  )}
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'Delivered')}
                    className="flex-1 bg-green-50 text-green-700 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition"
                  >
                    Mark Delivered
                  </button>
                </div>
              </div>
            ))}
            {activeDeliveries.length === 0 && (
              <p className="text-center text-gray-500 py-10">No active deliveries at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
