export type User = {
  id: string;
  email: string;
  role: 'admin' | 'user';
  restaurantId: string;
  token?: string | null;
};
