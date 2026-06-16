export const mockProducts = Array.from({ length: 50 }).map((_, i) => ({
  id: `prod_${i + 1}`,
  title: `Premium Product ${i + 1}`,
  description: `This is a high-quality product ${i + 1} suitable for all your needs. Crafted with precision and excellence.`,
  category: ['Electronics', 'Clothing', 'Home', 'Beauty', 'Sports'][i % 5],
  imageUrl: `https://picsum.photos/seed/prod${i + 1}/400/300`,
  price: Math.floor(Math.random() * 500) + 10,
  stock: Math.floor(Math.random() * 100) + 5,
  warehouseLocation: ['Warehouse A', 'Warehouse B', 'Warehouse C'][i % 3],
  sellerId: `seller_${(i % 10) + 1}`
}));
