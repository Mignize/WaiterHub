import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { setUserData } from '@/redux/modules/user/userSlice';
import { useAppDispatch } from '@/redux/hooks';
import settings from '@/settings';

type RegisterForm = {
  email: string;
  password: string;
  confirm: string;
  name: string;
  restaurantName: string;
};

export default function RegisterPage() {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setApiError('');
    try {
      const response = await fetch(`${settings.API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
          restaurantName: data.restaurantName,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setApiError(errorData.message || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }
      const result = await response.json();

      if (result.error) {
        setApiError(result.error);
        setLoading(false);
        return;
      }

      localStorage.setItem('token', result.token);
      dispatch(setUserData(result.user));

      window.location.href = '/';
    } catch {
      setApiError('An unexpected error occurred. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800">
      <div className="w-full max-w-md p-8 bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-800">
        <h2 className="text-3xl font-extrabold text-center text-zinc-100 mb-8 tracking-tight">
          Create your WaiterHub account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-100 mb-1">Name</label>
            <input
              type="text"
              autoComplete="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-2 rounded-xl border border-zinc-700 focus:ring-2 focus:ring-zinc-400 focus:outline-none bg-zinc-800 text-zinc-100 placeholder:text-zinc-400 transition"
              placeholder="Your name"
              disabled={loading}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-100 mb-1">Restaurant Name</label>
            <input
              type="text"
              autoComplete="text"
              {...register('restaurantName', { required: 'Restaurant name is required' })}
              className="w-full px-4 py-2 rounded-xl border border-zinc-700 focus:ring-2 focus:ring-zinc-400 focus:outline-none bg-zinc-800 text-zinc-100 placeholder:text-zinc-400 transition"
              placeholder="The restaurant name"
              disabled={loading}
            />
            {errors.restaurantName && (
              <p className="text-red-500 text-xs mt-1">{errors.restaurantName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-100 mb-1">Email</label>
            <input
              type="email"
              autoComplete="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-4 py-2 rounded-xl border border-zinc-700 focus:ring-2 focus:ring-zinc-400 focus:outline-none bg-zinc-800 text-zinc-100 placeholder:text-zinc-400 transition"
              placeholder="you@email.com"
              disabled={loading}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-100 mb-1">Password</label>
            <input
              type="password"
              autoComplete="new-password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-4 py-2 rounded-xl border border-zinc-700 focus:ring-2 focus:ring-zinc-400 focus:outline-none bg-zinc-800 text-zinc-100 placeholder:text-zinc-400 transition"
              placeholder="••••••••"
              disabled={loading}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-100 mb-1">Confirm password</label>
            <input
              type="password"
              autoComplete="new-password"
              {...register('confirm', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              className="w-full px-4 py-2 rounded-xl border border-zinc-700 focus:ring-2 focus:ring-zinc-400 focus:outline-none bg-zinc-800 text-zinc-100 placeholder:text-zinc-400 transition"
              placeholder="••••••••"
              disabled={loading}
            />
            {errors.confirm && (
              <p className="text-red-500 text-xs mt-1">{errors.confirm.message}</p>
            )}
          </div>
          {apiError && (
            <div className="text-red-600 text-center text-sm font-medium">{apiError}</div>
          )}
          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-lg shadow-md transition flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin mr-2 w-5 h-5 border-2 border-white border-t-blue-400 rounded-full inline-block"></span>
            ) : null}
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm mt-6 text-zinc-300">
          Already have an account?{' '}
          <Link to="/login" className="font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
