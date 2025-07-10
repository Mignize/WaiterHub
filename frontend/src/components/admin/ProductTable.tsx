import type { Product } from '@/types/product';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left bg-zinc-900 rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-zinc-800">
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Description</th>
            <th className="py-2 px-4">Price</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t border-zinc-800">
              <td className="py-2 px-4">{product.name}</td>
              <td className="py-2 px-4 max-w-xs">
                <span className="block truncate" title={product.description || ''}>
                  {product.description && product.description.length > 60
                    ? product.description.slice(0, 60) + '...'
                    : product.description || '-'}
                </span>
              </td>
              <td className="py-2 px-4">${product.price?.toFixed(2) ?? '-'}</td>
              <td className="py-2 px-4 flex gap-2">
                <button className="text-blue-400 hover:underline" onClick={() => onEdit(product)}>
                  Edit
                </button>
                <button className="text-red-400 hover:underline" onClick={() => onDelete(product)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
