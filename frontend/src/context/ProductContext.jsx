import { createContext, useState, useEffect } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        localStorage.setItem('shopsphere_products', JSON.stringify(data));
      })
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  const addProduct = (product) => {
    const newProducts = [...products, { ...product, id: `prod_${Date.now()}` }];
    setProducts(newProducts);
    localStorage.setItem('shopsphere_products', JSON.stringify(newProducts));
  };

  const editProduct = (id, updatedProduct) => {
    const newProducts = products.map(p => p.id === id ? { ...p, ...updatedProduct } : p);
    setProducts(newProducts);
    localStorage.setItem('shopsphere_products', JSON.stringify(newProducts));
  };

  const deleteProduct = (id) => {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    localStorage.setItem('shopsphere_products', JSON.stringify(newProducts));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, editProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
