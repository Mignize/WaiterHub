import { useEffect, useState } from 'react';
import type { User } from '@/types/user';
import { setUserData } from '@/redux/modules/user/userSlice';
import { useAppDispatch } from '@/redux/hooks';
import settings from '@/settings';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    if (storedToken) {
      fetch(`${settings.API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((userData) => {
          if (userData) {
            setUser(userData);
            dispatch(setUserData({ ...userData, token: storedToken }));
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch]);

  return { user, token, loading };
}
