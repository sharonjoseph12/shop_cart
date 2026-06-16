// Nodes for Kruskal graph
export const mockDeliveryNodes = [
  { id: 'Warehouse', label: 'Main Warehouse', x: 250, y: 50 },
  { id: 'Node_A', label: 'Customer A', x: 100, y: 150 },
  { id: 'Node_B', label: 'Customer B', x: 400, y: 150 },
  { id: 'Node_C', label: 'Customer C', x: 100, y: 300 },
  { id: 'Node_D', label: 'Customer D', x: 400, y: 300 },
  { id: 'Node_E', label: 'Customer E', x: 250, y: 220 },
  { id: 'Node_F', label: 'Customer F', x: 250, y: 400 },
];

export const mockDeliveryEdges = [
  { source: 'Warehouse', target: 'Node_A', weight: 10 },
  { source: 'Warehouse', target: 'Node_B', weight: 12 },
  { source: 'Node_A', target: 'Node_B', weight: 8 },
  { source: 'Node_A', target: 'Node_C', weight: 15 },
  { source: 'Node_B', target: 'Node_D', weight: 14 },
  { source: 'Node_A', target: 'Node_E', weight: 6 },
  { source: 'Node_B', target: 'Node_E', weight: 7 },
  { source: 'Node_C', target: 'Node_D', weight: 20 },
  { source: 'Node_C', target: 'Node_E', weight: 9 },
  { source: 'Node_D', target: 'Node_E', weight: 11 },
  { source: 'Node_C', target: 'Node_F', weight: 5 },
  { source: 'Node_D', target: 'Node_F', weight: 18 },
  { source: 'Node_E', target: 'Node_F', weight: 13 },
];
