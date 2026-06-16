import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbFile = join(__dirname, 'database.sqlite');

if (fs.existsSync(dbFile)) {
    fs.unlinkSync(dbFile);
}

const db = new sqlite3.Database(dbFile);

const createTables = `
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    category TEXT,
    imageUrl TEXT,
    price REAL,
    stock INTEGER,
    warehouseLocation TEXT,
    sellerId TEXT
);

CREATE TABLE sellers (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    rating REAL,
    totalOrders INTEGER,
    joinedAt TEXT
);

CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    customerId TEXT,
    totalAmount REAL,
    status TEXT,
    deliveryPartnerId TEXT,
    createdAt TEXT,
    deliveryLocation TEXT
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId TEXT,
    productId TEXT,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY(orderId) REFERENCES orders(id),
    FOREIGN KEY(productId) REFERENCES products(id)
);
`;

db.serialize(async () => {
    db.exec(createTables, async (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log('Tables created.');
        
        // Use dynamic import to load frontend data
        try {
            const { mockProducts } = await import('../frontend/src/data/products.js');
            const { mockSellers } = await import('../frontend/src/data/sellers.js');
            const { mockOrders } = await import('../frontend/src/data/orders.js');

            const insertProduct = db.prepare('INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
            mockProducts.forEach(p => insertProduct.run(p.id, p.title, p.description, p.category, p.imageUrl, p.price, p.stock, p.warehouseLocation, p.sellerId));
            insertProduct.finalize();

            const insertSeller = db.prepare('INSERT INTO sellers VALUES (?, ?, ?, ?, ?, ?)');
            mockSellers.forEach(s => insertSeller.run(s.id, s.name, s.email, s.rating, s.totalOrders, s.joinedAt));
            insertSeller.finalize();

            const insertOrder = db.prepare('INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?, ?)');
            const insertOrderItem = db.prepare('INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)');
            
            mockOrders.forEach(o => {
                insertOrder.run(o.id, o.customerId, o.totalAmount, o.status, o.deliveryPartnerId, o.createdAt, o.deliveryLocation);
                o.items.forEach(item => {
                    insertOrderItem.run(o.id, item.productId, item.quantity, item.price);
                });
            });
            insertOrder.finalize();
            insertOrderItem.finalize();

            console.log('Database seeded.');
            db.close();
        } catch (e) {
            console.error('Error importing data:', e);
            db.close();
        }
    });
});
