import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axiosInstance from '../../config/axiosInstance';
import { toast } from 'react-toastify';
import type { Item } from '../../types';
import Navbar from '../../components/Navbar';

const UserItems: React.FC = () => {
  const context = useContext(AppContext);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h1 className="text-2xl font-bold">Welcome, {userData?.name}!</h1>
          <p className="text-gray-600">Browse available items</p>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No items available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-2">Price: ${item.price}</p>
                <p className="text-gray-600">
                  Available: {item.quantity} units
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserItems;
