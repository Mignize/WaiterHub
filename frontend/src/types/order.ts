export type OrderItem = {
  name: string;
  quantity: number;
  productId: string;
  product: {
    id: string;
    price: number;
  };
  price: number;
};

export type Order = {
  id: string;
  status: string;
  createdAt: string;
  userId: string;
  user?: { email?: string; name?: string };
  items: OrderItem[];
  board?: number;
  table?: number;
};
