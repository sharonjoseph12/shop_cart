const realProducts = [
  { title: "Sony WH-1000XM5 Wireless Headphones", cat: "Electronics", price: 348 },
  { title: "Apple iPad Pro 12.9-inch", cat: "Electronics", price: 1099 },
  { title: "Dyson V15 Detect Cordless Vacuum", cat: "Home", price: 749 },
  { title: "Nike Air Zoom Pegasus 39", cat: "Clothing", price: 120 },
  { title: "Patagonia Nano Puff Jacket", cat: "Clothing", price: 239 },
  { title: "Breville Barista Express Espresso Machine", cat: "Home", price: 699 },
  { title: "Estée Lauder Advanced Night Repair", cat: "Beauty", price: 115 },
  { title: "Samsung 65-Inch Class QLED 4K TV", cat: "Electronics", price: 1298 },
  { title: "YETI Rambler 20 oz Tumbler", cat: "Sports", price: 35 },
  { title: "Bose SoundLink Flex Bluetooth Speaker", cat: "Electronics", price: 149 },
  { title: "Levi's 501 Original Fit Jeans", cat: "Clothing", price: 79 },
  { title: "Vitamix 5200 Blender", cat: "Home", price: 479 },
  { title: "Olaplex No. 4 Bond Maintenance Shampoo", cat: "Beauty", price: 30 },
  { title: "GoPro HERO11 Black", cat: "Electronics", price: 399 },
  { title: "Lululemon Align High-Rise Pant", cat: "Clothing", price: 98 },
  { title: "KitchenAid Artisan Series Stand Mixer", cat: "Home", price: 449 },
  { title: "La Mer Crème de la Mer", cat: "Beauty", price: 380 },
  { title: "Garmin Forerunner 245 Music", cat: "Sports", price: 349 },
  { title: "Nintendo Switch OLED Model", cat: "Electronics", price: 349 },
  { title: "The North Face Recon Backpack", cat: "Sports", price: 109 }
];

export const mockProducts = Array.from({ length: 50 }).map((_, i) => {
  const base = realProducts[i % realProducts.length];
  return {
    id: `prod_${i + 1}`,
    title: i >= realProducts.length ? `${base.title} - Variant ${Math.floor(i / realProducts.length) + 1}` : base.title,
    description: `Experience the best of ${base.cat.toLowerCase()} with this premium product. Crafted for durability and performance, it perfectly suits your lifestyle. Includes a 1-year warranty.`,
    category: base.cat,
    imageUrl: `https://picsum.photos/seed/prod${i + 1}/400/300`,
    price: base.price + (i >= realProducts.length ? (Math.floor(Math.random() * 20) - 10) : 0),
    stock: Math.floor(Math.random() * 100) + 5,
    warehouseLocation: ['Warehouse A', 'Warehouse B', 'Warehouse C'][i % 3],
    sellerId: `seller_${(i % 10) + 1}`
  };
});
