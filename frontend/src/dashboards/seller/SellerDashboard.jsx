import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ProductContext } from '../../context/ProductContext';
import { OrderContext } from '../../context/OrderContext';
import { FiDollarSign, FiPackage, FiShoppingBag, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const SellerDashboard = () => {
  const { user } = useContext(AuthContext);
  const { products, addProduct, editProduct, deleteProduct } = useContext(ProductContext);
  const { orders } = useContext(OrderContext);

  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const myProducts = products.filter(p => p.sellerId === user?.id);
  const totalProducts = myProducts.length;
  
  // Calculate revenue from orders containing seller's products
  let totalRevenue = 0;
  let totalOrders = 0;

  orders.forEach(order => {
    let hasMyProduct = false;
    order.items.forEach(item => {
      if (myProducts.find(p => p.id === item.productId)) {
        totalRevenue += item.price * item.quantity;
        hasMyProduct = true;
      }
    });
    if (hasMyProduct) totalOrders++;
  });

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      imageUrl: formData.get('imageUrl'),
      price: parseFloat(formData.get('price')),
      stock: parseInt(formData.get('stock')),
      warehouseLocation: formData.get('warehouseLocation'),
      sellerId: user.id
    };

    if (currentProduct?.id) {
      editProduct(currentProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setIsEditing(false);
    setCurrentProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500">Manage your store</p>
        </div>
        <button 
          onClick={() => { setCurrentProduct(null); setIsEditing(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <FiPlus /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-xl"><FiDollarSign size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-xl"><FiShoppingBag size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Orders</p>
            <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-xl"><FiPackage size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Products Listed</p>
            <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10">
          <h2 className="text-xl font-bold mb-6">{currentProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSaveProduct} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input required name="title" defaultValue={currentProduct?.title} className="mt-1 block w-full border border-gray-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input required name="category" defaultValue={currentProduct?.category} className="mt-1 block w-full border border-gray-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                <input required type="number" step="0.01" name="price" defaultValue={currentProduct?.price} className="mt-1 block w-full border border-gray-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input required type="number" name="stock" defaultValue={currentProduct?.stock} className="mt-1 block w-full border border-gray-300 rounded-lg p-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input required name="imageUrl" defaultValue={currentProduct?.imageUrl} className="mt-1 block w-full border border-gray-300 rounded-lg p-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea required name="description" defaultValue={currentProduct?.description} rows="3" className="mt-1 block w-full border border-gray-300 rounded-lg p-2"></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Warehouse Location</label>
                <input required name="warehouseLocation" defaultValue={currentProduct?.warehouseLocation} className="mt-1 block w-full border border-gray-300 rounded-lg p-2" />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Product</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myProducts.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-full object-cover" src={product.imageUrl} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.title}</div>
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => { setCurrentProduct(product); setIsEditing(true); }} className="text-indigo-600 hover:text-indigo-900 mr-4"><FiEdit size={18} /></button>
                    <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:text-red-900"><FiTrash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
