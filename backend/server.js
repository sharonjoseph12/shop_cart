import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const dbFile = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to database');
    }
});

app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/sellers', (req, res) => {
    db.all('SELECT * FROM sellers', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/orders', (req, res) => {
    db.all('SELECT * FROM orders', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // We also need to fetch order items for each order
        // For simplicity, fetching all items and grouping
        db.all('SELECT * FROM order_items', [], (err, itemRows) => {
            if (err) return res.status(500).json({ error: err.message });
            
            const orders = rows.map(order => {
                return {
                    ...order,
                    items: itemRows.filter(item => item.orderId === order.id).map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                };
            });
            res.json(orders);
        });
    });
});

// Update order status
app.patch('/api/orders/:id/status', (req, res) => {
    const { status } = req.body;
    db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ updated: this.changes });
    });
});

app.post('/api/products', (req, res) => {
    const { id, title, description, category, imageUrl, price, stock, warehouseLocation, sellerId } = req.body;
    db.run(
        'INSERT INTO products (id, title, description, category, imageUrl, price, stock, warehouseLocation, sellerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, title, description, category, imageUrl, price, stock, warehouseLocation, sellerId],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id });
        }
    );
});

app.post('/api/orders', (req, res) => {
    const { id, customerId, totalAmount, status, deliveryPartnerId, createdAt, deliveryLocation, items } = req.body;
    
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        db.run(
            'INSERT INTO orders (id, customerId, totalAmount, status, deliveryPartnerId, createdAt, deliveryLocation) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, customerId, totalAmount, status, deliveryPartnerId || null, createdAt, deliveryLocation],
            function(err) {
                if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: err.message });
                }
            }
        );

        if (items && items.length > 0) {
            const stmt = db.prepare('INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)');
            for (const item of items) {
                stmt.run([id, item.productId, item.quantity, item.price], function(err) {
                    if (err) {
                        db.run('ROLLBACK');
                        return res.status(500).json({ error: err.message });
                    }
                });
            }
            stmt.finalize();
        }

        db.run('COMMIT', function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id });
        });
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
