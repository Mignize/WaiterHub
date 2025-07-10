import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { useState } from 'react';
import { useAdminData } from '@/hooks/useAdminData';
import UserTable from '@/components/admin/UserTable';
import ProductTable from '@/components/admin/ProductTable';
import OrderTable from '@/components/admin/OrderTable';
import UserFormModal from '@/components/admin/UserFormModal';
import ProductFormModal from '@/components/admin/ProductFormModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import type { User } from '@/types/user';
import type { Product } from '@/types/product';
import OrderDetailsModal from '@/components/admin/OrderDetailsModal';
import LogoutButton from '@/components/LogoutButton';

export default function AdminPage() {
  const user = useSelector((state: RootState) => state.user.user);
  const token = user?.token;
  const {
    users,
    products,
    orders,
    restaurant,
    loading,
    error,
    createOrUpdateUser,
    deleteUser,
    createOrUpdateProduct,
    deleteProduct,
  } = useAdminData(token);

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userDelete, setUserDelete] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(false);

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productDelete, setProductDelete] = useState<Product | null>(null);
  const [productLoading, setProductLoading] = useState(false);

  const [orderDetails, setOrderDetails] = useState<string | null>(null);
  const selectedOrder = orders.find((o) => o.id === orderDetails) || null;
  const selectedUser = selectedOrder
    ? users.find((u) => u.id === selectedOrder.userId) || null
    : null;

  const [filterDate, setFilterDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [filterMonth, setFilterMonth] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 7);
  });
  const [filterType, setFilterType] = useState<'day' | 'month'>('day');

  // Filter orders by day or month
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    if (filterType === 'day') {
      return orderDate.toISOString().slice(0, 10) === filterDate;
    } else {
      return orderDate.toISOString().slice(0, 7) === filterMonth;
    }
  });

  // Aggregate product sales
  const productSales: Record<string, { name: string; quantity: number; total: number }> = {};
  filteredOrders.forEach((order) => {
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod) return;
      if (!productSales[prod.id]) {
        productSales[prod.id] = { name: prod.name, quantity: 0, total: 0 };
      }
      productSales[prod.id].quantity += item.quantity;
      productSales[prod.id].total += item.quantity * (item.price ?? prod.price);
    });
  });
  const grandTotal = Object.values(productSales).reduce((sum, p) => sum + p.total, 0);

  function downloadCSV() {
    const rows = [
      ['Product', 'Quantity Sold', 'Total Earned'],
      ...Object.values(productSales).map((p) => [p.name, p.quantity, p.total.toFixed(2)]),
      ['', 'Grand Total', grandTotal.toFixed(2)],
    ];
    const csvContent = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(';'))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_${filterType === 'day' ? filterDate : filterMonth}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (loading) {
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
          <h1 className="text-3xl font-bold mb-1">Admin Panel</h1>
          {restaurant?.name && (
            <p className="text-lg font-semibold text-zinc-300 mt-1">{restaurant.name}</p>
          )}
          <p className="text-zinc-400">{user?.email}</p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow transition"
            onClick={() => {
              setEditingUser(null);
              setUserModalOpen(true);
            }}
          >
            + User
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition"
            onClick={() => {
              setEditingProduct(null);
              setProductModalOpen(true);
            }}
          >
            + Product
          </button>
          <LogoutButton />
        </div>
      </header>
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
        <UserTable
          users={users}
          onEdit={(u) => {
            setEditingUser(u);
            setUserModalOpen(true);
          }}
          onDelete={setUserDelete}
          userIdActual={user?.id}
        />
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        <ProductTable
          products={products}
          onEdit={(p) => {
            setEditingProduct(p);
            setProductModalOpen(true);
          }}
          onDelete={setProductDelete}
        />
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
        <div className="mb-4 p-4 rounded-xl border border-zinc-700 bg-zinc-900 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col">
              <label className="text-xs font-medium mb-1">Filter by</label>
              <select
                className="rounded bg-zinc-800 border border-zinc-700 px-2 py-1 text-zinc-100"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'day' | 'month')}
              >
                <option value="day">Day</option>
                <option value="month">Month</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium mb-1">
                {filterType === 'day' ? 'Day' : 'Month'}
              </label>
              {filterType === 'day' ? (
                <input
                  type="date"
                  className="rounded bg-zinc-800 border border-zinc-700 px-2 py-1 text-zinc-100"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              ) : (
                <input
                  type="month"
                  className="rounded bg-zinc-800 border border-zinc-700 px-2 py-1 text-zinc-100"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                />
              )}
            </div>
          </div>
          <button
            className="px-4 py-2 rounded bg-green-700 hover:bg-green-800 text-white font-semibold shadow min-w-[140px]"
            onClick={downloadCSV}
            disabled={Object.keys(productSales).length === 0}
          >
            Download CSV
          </button>
        </div>
        <OrderTable
          orders={filteredOrders}
          products={products}
          users={users}
          onViewDetails={(order) => setOrderDetails(order.id)}
        />
      </section>
      <OrderDetailsModal
        open={!!orderDetails}
        onClose={() => setOrderDetails(null)}
        order={selectedOrder}
        user={selectedUser}
        products={products}
      />
      <UserFormModal
        open={userModalOpen}
        onClose={() => {
          setUserModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={async (data) => {
          setUserLoading(true);
          await createOrUpdateUser(data, editingUser?.id);
          setUserLoading(false);
          setUserModalOpen(false);
          setEditingUser(null);
        }}
        initialUser={editingUser}
        loading={userLoading}
        userIdActual={user?.id}
      />
      <DeleteConfirmModal
        open={!!userDelete}
        onClose={() => setUserDelete(null)}
        onConfirm={async () => {
          if (userDelete) {
            setUserLoading(true);
            await deleteUser(userDelete.id);
            setUserLoading(false);
            setUserDelete(null);
          }
        }}
        title="Delete User"
        description={userDelete ? `Are you sure you want to delete user ${userDelete.email}?` : ''}
        loading={userLoading}
      />
      <ProductFormModal
        open={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={async (data) => {
          setProductLoading(true);
          await createOrUpdateProduct(data, editingProduct?.id);
          setProductLoading(false);
          setProductModalOpen(false);
          setEditingProduct(null);
        }}
        initialProduct={editingProduct}
        loading={productLoading}
      />
      <DeleteConfirmModal
        open={!!productDelete}
        onClose={() => setProductDelete(null)}
        onConfirm={async () => {
          if (productDelete) {
            setProductLoading(true);
            await deleteProduct(productDelete.id);
            setProductLoading(false);
            setProductDelete(null);
          }
        }}
        title="Delete Product"
        description={
          productDelete ? `Are you sure you want to delete product ${productDelete.name}?` : ''
        }
        loading={productLoading}
      />
    </div>
  );
}
