export const mockOrders = Array.from({ length: 20 }).map((_, i) => ({
  id: `order_${i + 1}`,
  customerId: `cust_${(i % 5) + 1}`,
  items: [
    {
      productId: `prod_${(i % 50) + 1}`,
      quantity: Math.floor(Math.random() * 3) + 1,
      price: Math.floor(Math.random() * 500) + 10,
    }
  ],
  totalAmount: Math.floor(Math.random() * 1500) + 50,
  status: ['Pending', 'Processing', 'Shipped', 'Delivered'][i % 4],
  deliveryPartnerId: i % 2 === 0 ? `partner_${(i % 3) + 1}` : null,
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  deliveryLocation: `Node_${String.fromCharCode(65 + (i % 10))}` // Node_A, Node_B, etc.
}));
