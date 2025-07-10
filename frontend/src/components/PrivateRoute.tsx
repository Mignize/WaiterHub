import { selectUser } from '@/redux/modules/user/userSlice';
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAppSelector } from '@/redux/hooks';

interface PrivateRouteProps {
  children: ReactNode;
  role?: 'admin' | 'waiter';
}

export default function PrivateRoute({ children, role }: PrivateRouteProps) {
  const user = useAppSelector(selectUser);
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/waiter'} replace />;
  }
  return <>{children}</>;
}
