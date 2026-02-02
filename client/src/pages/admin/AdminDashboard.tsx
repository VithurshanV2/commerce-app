import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axiosInstance from '../../config/axiosInstance';
import { toast } from 'react-toastify';
import type { Item } from '../../types';
import Navbar from '../../components/Navbar';

const AdminDashboard: React.FC = () => {
  const context = useContext(AppContext);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  if (!context) return null;

  const { userData } = context;

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/api/items');
      setItems(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await axiosInstance.put(`/api/items/${editingItem.id}`, {
          name: formData.name,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
        });
        toast.success('Item updated successfully');
      } else {
        await axiosInstance.post('/api/items', {
          name: formData.name,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
        });
        toast.success('Item created successfully');
      }

      setFormData({ name: '', price: '', quantity: '' });
      setShowForm(false);
      setEditingItem(null);
      fetchItems();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      quantity: item.quantity.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await axiosInstance.delete(`/api/items/${id}`);
      toast.success('Item deleted successfully');
      fetchItems();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete item');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({ name: '', price: '', quantity: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {userData?.name}</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add New Item'}
        </button>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Item Name"
                required
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="Price"
                required
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                placeholder="Quantity"
                required
                className="w-full px-4 py-3 border rounded-lg"
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Price</th>
                  <th className="px-6 py-3 text-left">Quantity</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">${item.price}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
