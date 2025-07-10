export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'waiter';
  password?: string;
  token?: string | null;
};
