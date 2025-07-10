import Modal from '@/components/Modal';
import type { Product } from '@/types/product';
import type { User } from '@/types/user';
import type { Order } from '@/types/order';

interface OrderDetailsModalProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  user: User | null;
  products: Product[];
}

export default function OrderDetailsModal({
  open,
  onClose,
  order,
  user,
  products,
}: OrderDetailsModalProps) {
  if (!order) return null;
  const orderTotal = order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return (
    <Modal open={open} onClose={onClose} title={`Order Details #${order.id}`}>
      <div className="space-y-4 text-zinc-100">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-zinc-400">Date</span>
          <span className="font-medium">{new Date(order.createdAt).toLocaleString()}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-zinc-400">Status</span>
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
              order.status === 'open' ? 'bg-purple-800 text-white' : 'bg-zinc-700 text-zinc-300'
            }`}
          >
            {order.status === 'open' ? 'Open' : 'Closed'}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-zinc-400">User</span>
          <span className="font-medium">
            {user ? `${user.name} (${user.email})` : order.user?.email || order.user?.name || '-'}
          </span>
        </div>
        <div>
          <span className="text-sm text-zinc-400">Products</span>
          <div className="mt-2 rounded-lg border border-zinc-700 bg-zinc-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-900">
                  <th className="py-2 px-3 text-left">Product</th>
                  <th className="py-2 px-3 text-center">Quantity</th>
                  <th className="py-2 px-3 text-right">Price</th>
                  <th className="py-2 px-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => {
                  const prod = products.find((p) => p.id === item.productId);
                  return (
                    <tr key={idx} className="border-t border-zinc-800">
                      <td className="py-2 px-3">{prod ? prod.name : item.name}</td>
                      <td className="py-2 px-3 text-center">{item.quantity}</td>
                      <td className="py-2 px-3 text-right">${item.product.price.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <span className="text-lg font-bold">Total: ${orderTotal.toFixed(2)}</span>
        </div>
      </div>
    </Modal>
  );
}
