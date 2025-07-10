import { useState, useEffect, useCallback } from 'react';
import type { Order } from '@/types/order';
import type { Product } from '@/types/product';
import settings from '@/settings';

export function useWaiterData(token?: string | null) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAll = useCallback(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([
      fetch(`${settings.API_URL}/order/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => (res.ok ? res.json() : Promise.reject(res))),
      fetch(`${settings.API_URL}/product/products`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => (res.ok ? res.json() : Promise.reject(res))),
    ])
      .then(([ordersData, productsData]) => {
        setOrders(ordersData);
        setProducts(productsData);
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const createOrder = async (orderData: {
    board: number;
    items: { productId: string; quantity: number }[];
  }) => {
    if (!token) return false;
    const res = await fetch(`${settings.API_URL}/order/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    if (res.ok) {
      const newOrder = await res.json();
      setOrders((prev) => [...prev, newOrder]);
      return true;
    }
    return false;
  };

  const completeOrder = async (orderId: string) => {
    if (!token) return false;
    const res = await fetch(`${settings.API_URL}/order/orders/${orderId}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      return true;
    }
    return false;
  };

  return {
    orders,
    products,
    loading,
    error,
    fetchAll,
    createOrder,
    completeOrder,
  };
}
