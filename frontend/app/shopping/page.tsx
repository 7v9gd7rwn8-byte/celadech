'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';

interface ShoppingItem {
  id: number;
  item_name: string;
  quantity: number;
  unit: string;
  is_purchased: boolean;
}

export default function ShoppingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('pièce');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchItems();
  }, [isAuthenticated]);

  const fetchItems = async () => {
    try {
      const response = await apiClient.get('/shopping-list');
      setItems(response.data.items);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/shopping-list', {
        item_name: itemName,
        quantity: parseFloat(quantity),
        unit,
      });
      setItemName('');
      setQuantity('1');
      fetchItems();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleToggleItem = async (id: number, isPurchased: boolean) => {
    try {
      await apiClient.put(`/shopping-list/${id}`, {
        is_purchased: !isPurchased,
      });
      fetchItems();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await apiClient.delete(`/shopping-list/${id}`);
      fetchItems();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">📝 Liste d'Achats</h1>

      <form onSubmit={handleAddItem} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Nom de l'article"
            className="px-4 py-2 border rounded focus:outline-none focus:border-orange-500"
            required
          />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantité"
            className="px-4 py-2 border rounded focus:outline-none focus:border-orange-500"
            step="0.5"
            required
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="px-4 py-2 border rounded focus:outline-none focus:border-orange-500"
          >
            <option>pièce</option>
            <option>kg</option>
            <option>g</option>
            <option>L</option>
            <option>ml</option>
            <option>cuillère</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Ajouter
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Aucun article pour le moment</div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded shadow"
            >
              <input
                type="checkbox"
                checked={item.is_purchased}
                onChange={() => handleToggleItem(item.id, item.is_purchased)}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <span className={item.is_purchased ? 'line-through text-gray-400' : ''}>
                  {item.quantity} {item.unit} - {item.item_name}
                </span>
              </div>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
