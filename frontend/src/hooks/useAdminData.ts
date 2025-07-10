import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/types/user';
import type { Product } from '@/types/product';
import type { Order } from '@/types/order';
import settings from '@/settings';

export function useAdminData(token?: string | null) {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurant, setRestaurant] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAll = useCallback(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([
      fetch(`${settings.API_URL}/user/users`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => (res.ok ? res.json() : Promise.reject(res))),
      fetch(`${settings.API_URL}/product/products`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => (res.ok ? res.json() : Promise.reject(res))),
      fetch(`${settings.API_URL}/order/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => (res.ok ? res.json() : Promise.reject(res))),
      fetch(`${settings.API_URL}/restaurant/restaurant`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => (res.ok ? res.json() : Promise.reject(res))),
    ])
      .then(([usersData, productsData, ordersData, restaurantData]) => {
        setUsers(usersData);
        setProducts(productsData);
        setOrders(ordersData);
        setRestaurant(restaurantData);
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const createOrUpdateUser = async (user: User, editingId?: string) => {
    if (!token) return;
    const url = editingId
      ? `${settings.API_URL}/user/user/${editingId}`
      : `${settings.API_URL}/user/user`;
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(user),
    });
    if (res.ok) {
      const saved = await res.json();
      setUsers((prev) => {
        if (editingId) return prev.map((u) => (u.id === saved.id ? saved : u));
        return [...prev, saved];
      });
      return true;
    }
    return false;
  };

  const deleteUser = async (id: string) => {
    if (!token) return;
    const res = await fetch(`${settings.API_URL}/user/user/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      return true;
    }
    return false;
  };

  const createOrUpdateProduct = async (product: Product, editingId?: string) => {
    if (!token) return;
    const url = editingId
      ? `${settings.API_URL}/product/products/${editingId}`
      : `${settings.API_URL}/product/products`;
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(product),
    });
    if (res.ok) {
      const saved = await res.json();
      setProducts((prev) => {
        if (editingId) return prev.map((p) => (p.id === saved.id ? saved : p));
        return [...prev, saved];
      });
      return true;
    }
    return false;
  };

  const deleteProduct = async (id: string) => {
    if (!token) return;
    const res = await fetch(`${settings.API_URL}/product/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return true;
    }
    return false;
  };

  return {
    users,
    products,
    orders,
    restaurant,
    loading,
    error,
    fetchAll,
    createOrUpdateUser,
    deleteUser,
    createOrUpdateProduct,
    deleteProduct,
  };
}
