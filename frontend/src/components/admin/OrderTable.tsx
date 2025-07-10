import type { Order } from '@/types/order';
import type { Product } from '@/types/product';
import type { User } from '@/types/user';

interface OrderTableProps {
  orders: Order[];
  products: Product[];
  users: User[];
  onViewDetails: (order: Order) => void;
}

export default function OrderTable({ orders, products, users, onViewDetails }: OrderTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left bg-zinc-900 rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-zinc-800">
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4">Waiter</th>
            <th className="py-2 px-4">Total</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const total = order.items.reduce((sum, item) => {
              const price = item.price ?? products.find((p) => p.id === item.productId)?.price ?? 0;
              return sum + price * item.quantity;
            }, 0);
            const waiter =
              order.user?.name ||
              order.user?.email ||
              users.find((u) => u.id === order.userId)?.name ||
              users.find((u) => u.id === order.userId)?.email ||
              '-';
            return (
              <tr key={order.id} className="border-t border-zinc-800">
                <td className="py-2 px-4">{order.id}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'open'
                        ? 'bg-purple-800 text-white'
                        : 'bg-zinc-700 text-zinc-300'
                    }`}
                  >
                    {order.status === 'open' ? 'Open' : 'Closed'}
                  </span>
                </td>
                <td className="py-2 px-4">{order.createdAt}</td>
                <td className="py-2 px-4">{waiter}</td>
                <td className="py-2 px-4">${total.toFixed(2)}</td>
                <td className="py-2 px-4">
                  <button
                    className="px-3 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition"
                    onClick={() => onViewDetails(order)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
