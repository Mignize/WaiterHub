import Modal from '@/components/Modal';
import { useForm, useFieldArray } from 'react-hook-form';
import type { Product } from '@/types/product';
import { useEffect } from 'react';

interface CreateOrderModalProps {
  products: Product[];
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    board: number;
    items: { productId: string; quantity: number }[];
    additionalNotes?: string;
  }) => void;
  loading?: boolean;
}

interface FormValues {
  board: number;
  items: { productId: string; quantity: number }[];
  additionalNotes?: string;
}

const EMPTY_ORDER: FormValues = {
  board: 1,
  items: [{ productId: '', quantity: 1 }],
  additionalNotes: '',
};

export default function CreateOrderModal({
  products,
  open,
  onClose,
  onSubmit,
  loading,
}: CreateOrderModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: EMPTY_ORDER,
  });

  useEffect(() => {
    if (open) {
      reset(EMPTY_ORDER);
    }
  }, [open, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset(EMPTY_ORDER);
      }}
      title="New Order"
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm mb-1">Table</label>
          <input
            type="number"
            min="1"
            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-zinc-100"
            placeholder="e.g. 5"
            {...register('board', {
              required: 'Table is required',
              min: { value: 1, message: 'Must be greater than 0' },
            })}
          />
          {errors.board && <p className="text-red-500 text-xs mt-1">{errors.board.message}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">Products</label>
          <div className="space-y-2">
            {fields.map((field, idx) => (
              <div key={field.id} className="flex gap-2 items-center">
                <select
                  className="rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-zinc-100 flex-1"
                  {...register(`items.${idx}.productId`, { required: 'Product is required' })}
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  className="w-20 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-zinc-100"
                  placeholder="Qty"
                  {...register(`items.${idx}.quantity`, {
                    required: 'Quantity is required',
                    min: { value: 1, message: 'Must be greater than 0' },
                  })}
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-600 text-xl px-2"
                    onClick={() => remove(idx)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {errors.items && typeof errors.items === 'object' && (
              <p className="text-red-500 text-xs mt-1">Check product and quantity fields.</p>
            )}
            <button
              type="button"
              className="mt-2 px-3 py-1 rounded bg-green-700 text-white text-sm font-semibold"
              onClick={() => append({ productId: '', quantity: 1 })}
            >
              + Add Product
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Additional Notes</label>
          <textarea
            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-zinc-100 min-h-[60px]"
            maxLength={500}
            {...register('additionalNotes', {
              maxLength: { value: 500, message: 'Max 500 characters' },
            })}
          />
          {errors.additionalNotes && (
            <p className="text-red-500 text-xs mt-1">{errors.additionalNotes.message}</p>
          )}
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            className="px-4 py-2 rounded bg-zinc-700 text-zinc-100"
            onClick={() => {
              onClose();
              reset(EMPTY_ORDER);
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-purple-700 text-white font-bold"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
