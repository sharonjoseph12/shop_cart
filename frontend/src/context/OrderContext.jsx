import { createContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = collection(db, 'orders');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by creation date descending if available
      ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(ordersData);
      localStorage.setItem('shopsphere_orders', JSON.stringify(ordersData));
    }, (error) => {
      console.error('Failed to fetch orders from Firebase:', error);
    });

    return () => unsubscribe();
  }, []);

  const addOrder = async (order) => {
    try {
      const orderData = {
        ...order,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        deliveryPartnerId: null
      };
      await addDoc(collection(db, 'orders'), orderData);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, { status });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const assignOrder = async (id, deliveryPartnerId) => {
    try {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, { 
        deliveryPartnerId,
        status: 'Processing'
      });
    } catch (error) {
      console.error('Error assigning order:', error);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, assignOrder }}>
      {children}
    </OrderContext.Provider>
  );
};


