export const mockSellers = Array.from({ length: 10 }).map((_, i) => ({
  id: `seller_${i + 1}`,
  name: `Seller ${i + 1} Store`,
  email: `seller${i + 1}@shopsphere.com`,
  rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
  totalOrders: Math.floor(Math.random() * 500),
  joinedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
}));
