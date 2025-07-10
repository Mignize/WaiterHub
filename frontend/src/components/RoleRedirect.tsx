import { Navigate } from 'react-router-dom';
import type { RootState } from '@/redux/store';
import { useAppSelector } from '@/redux/hooks';

export default function RoleRedirect() {
  const user = useAppSelector((state: RootState) => state.user.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin" />;
  }

  if (user.role === 'user') {
    return <Navigate to="/waiter" />;
  }

  return <Navigate to="/login" />;
}
