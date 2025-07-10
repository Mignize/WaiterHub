import type { User } from '@/types/user';
import Modal from '@/components/Modal';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (user: User) => void;
  initialUser?: User | null;
  loading?: boolean;
  userIdActual?: string;
}

export default function UserFormModal({
  open,
  onClose,
  onSubmit,
  initialUser,
  loading,
  userIdActual,
}: UserFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({
    defaultValues: initialUser || { name: '', email: '', role: 'waiter', password: '' },
  });

  useEffect(() => {
    if (open) {
      reset(initialUser || { name: '', email: '', role: 'waiter', password: '' });
    }
  }, [initialUser, open, reset]);

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset(initialUser || { name: '', email: '', role: 'waiter', password: '' });
      }}
      title={initialUser ? 'Edit User' : 'New User'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-zinc-100"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-zinc-100"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Invalid email' },
            })}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-zinc-100"
            {...register('password', { required: !initialUser ? 'Password is required' : false })}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Role</label>
          <select
            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-zinc-100"
            {...register('role', { required: 'Role is required' })}
            disabled={!!(initialUser && userIdActual && initialUser.id === userIdActual)}
          >
            <option value="admin">Admin</option>
            <option value="waiter">Waiter</option>
          </select>
          {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            className="px-4 py-2 rounded bg-zinc-700 text-zinc-100"
            onClick={() => {
              onClose();
              reset(initialUser || { name: '', email: '', role: 'waiter', password: '' });
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-purple-700 text-white font-bold"
            disabled={loading}
          >
            {initialUser ? 'Save' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
