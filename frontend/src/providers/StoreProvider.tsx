import { store } from '@/redux/storeInstance';
import { setupListeners } from '@reduxjs/toolkit/query';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { setUserData } from '@/redux/modules/user/userSlice';
import settings from '@/settings';

interface Props {
  readonly children: ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = setupListeners(store.dispatch);

    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${settings.API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((user) => {
          if (user) store.dispatch(setUserData({ ...user, token }));
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white text-xl">
        Cargando...
      </div>
    );
  }

  return <Provider store={store}>{children}</Provider>;
};
