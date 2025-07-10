import Modal from '@/components/Modal';
import { useForm } from 'react-hook-form';
import type { Product } from '@/types/product';
import { useEffect } from 'react';

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: Product) => void;
  initialProduct?: Product | null;
  loading?: boolean;
}

const EMPTY_PRODUCT: Product = { id: '', name: '', price: 0, description: '' };

export default function ProductFormModal({
  open,
  onClose,
  onSubmit,
  initialProduct,
  loading,
}: ProductFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Product>({ defaultValues: initialProduct || EMPTY_PRODUCT });

  useEffect(() => {
    if (open) {
      reset(initialProduct || EMPTY_PRODUCT);
    }
  }, [initialProduct, open, reset]);

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset(initialProduct || EMPTY_PRODUCT);
      }}
      title={initialProduct ? 'Edit Product' : 'New Product'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-zinc-100"
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Minimum 2 characters' },
            })}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">Price</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-zinc-100"
            {...register('price', {
              required: 'Price is required',
              min: { value: 0.01, message: 'Must be greater than 0' },
            })}
          />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-zinc-100 min-h-[60px]"
            maxLength={500}
            {...register('description', {
              maxLength: { value: 500, message: 'Max 500 characters' },
            })}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
          )}
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            className="px-4 py-2 rounded bg-zinc-700 text-zinc-100"
            onClick={() => {
              onClose();
              reset(initialProduct || EMPTY_PRODUCT);
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-purple-700 text-white font-bold"
            disabled={loading}
          >
            {initialProduct ? 'Save' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
