import React, { createContext, useState, useEffect } from 'react';
import { mockOrders } from '../data/orders';

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

  const addOrder = (order) => {
    const newOrders = [{ ...order, id: `order_${Date.now()}`, status: 'Pending', createdAt: new Date().toISOString() }, ...orders];
    setOrders(newOrders);
    localStorage.setItem('shopsphere_orders', JSON.stringify(newOrders));
  };

  const updateOrderStatus = (id, status) => {
    const newOrders = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(newOrders);
    localStorage.setItem('shopsphere_orders', JSON.stringify(newOrders));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};
