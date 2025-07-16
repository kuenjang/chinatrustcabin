import { useState } from 'react';

export type OrderStatus = '新訂單' | '已處理' | '已完成';

export interface OrderItem {
  name: string;
  price: number;
  qty: number;
  note?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  createdAt: string;
  status: OrderStatus;
}

function getLocalOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('orders');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalOrders(orders: Order[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('orders', JSON.stringify(orders));
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(getLocalOrders());

  // 監聽 localStorage 變化（多分頁同步）
  if (typeof window !== 'undefined') {
    window.onstorage = () => {
      setOrders(getLocalOrders());
    };
  }

  const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...order,
      id: Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
      status: '新訂單',
    };
    const next = [...getLocalOrders(), newOrder];
    setLocalOrders(next);
    setOrders(next);
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    const next = getLocalOrders().map(o => o.id === id ? { ...o, status } : o);
    setLocalOrders(next);
    setOrders(next);
  };

  const deleteOrder = (id: string) => {
    const next = getLocalOrders().filter(o => o.id !== id);
    setLocalOrders(next);
    setOrders(next);
  };

  return { orders, addOrder, updateOrderStatus, deleteOrder };
} 