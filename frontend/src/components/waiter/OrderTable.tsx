import type { Order } from '@/types/order';
import type { Product } from '@/types/product';

interface OrderTableProps {
  orders: Order[];
  products: Product[];
  onComplete: (orderId: string) => void;
}

export default function OrderTable({ orders, products, onComplete }: OrderTableProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {orders
        .filter((order) => order.status === 'open')
        .map((order) => {
          const total = order.items.reduce((sum, item) => {
            const price = item.price ?? products.find((p) => p.id === item.productId)?.price ?? 0;
            return sum + price * item.quantity;
          }, 0);
          return (
            <div
              key={order.id}
              className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">Table {order.board ?? order.table}</span>
                <span className="text-xs text-zinc-400">{order.createdAt}</span>
              </div>
              <ul className="mb-2">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-zinc-300">
                    <span>
                      {item.name ??
                        products.find((p) => p.id === item.productId)?.name ??
                        'Product'}
                    </span>
                    <span>x{item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center mt-4 gap-6">
                <span className="inline-block px-3 py-1 rounded-full bg-purple-800 text-white text-xs font-semibold">
                  {order.status === 'open' ? 'Open' : order.status}
                </span>
                <span className="text-sm font-bold text-zinc-200 ml-4">
                  Total: ${total.toFixed(2)}
                </span>
                <button
                  className="ml-auto px-3 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition"
                  onClick={() => onComplete(order.id)}
                >
                  Mark as completed
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
}
