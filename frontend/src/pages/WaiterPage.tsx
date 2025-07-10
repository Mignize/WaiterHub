import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWaiterData } from '@/hooks/useWaiterData';
import OrderTable from '@/components/waiter/OrderTable';
import CreateOrderModal from '@/components/waiter/CreateOrderModal';
import LogoutButton from '@/components/LogoutButton';

export default function WaiterPage() {
  const { user, token, loading: authLoading } = useAuth();
  const { orders, products, loading, error, createOrder, completeOrder } = useWaiterData(token);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  if (authLoading || loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-500 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-zinc-100 p-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Hello, {user?.name || ''}!</h1>
          <p className="text-zinc-400">Waiter | {user?.email || ''}</p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow transition"
            onClick={() => setOrderModalOpen(true)}
          >
            New Order
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-100 font-semibold shadow transition"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
          <LogoutButton />
        </div>
      </header>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Open Orders</h2>
        <OrderTable orders={orders} products={products} onComplete={completeOrder} />
      </section>
      <CreateOrderModal
        products={products}
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        loading={creating}
        onSubmit={async (data) => {
          setCreating(true);
          await createOrder({
            board: data.board,
            items: data.items,
          });
          setCreating(false);
          setOrderModalOpen(false);
        }}
      />
    </div>
  );
}
