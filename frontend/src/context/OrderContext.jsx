import { createContext, useState, useEffect } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        localStorage.setItem('shopsphere_orders', JSON.stringify(data));
      })
      .catch(err => console.error('Failed to fetch orders:', err));
  }, []);

  const addOrder = async (order) => {
    const newOrder = { ...order, id: `order_${Date.now()}`, status: 'Pending', createdAt: new Date().toISOString() };
    
    try {
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder)
      });
      
      if (response.ok) {
        const newOrders = [newOrder, ...orders];
        setOrders(newOrders);
        localStorage.setItem('shopsphere_orders', JSON.stringify(newOrders));
      } else {
        console.error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        const newOrders = orders.map(o => o.id === id ? { ...o, status } : o);
        setOrders(newOrders);
        localStorage.setItem('shopsphere_orders', JSON.stringify(newOrders));
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};
