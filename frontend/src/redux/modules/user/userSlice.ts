import { createAppSlice } from '@/redux/createAppSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types/user';

export interface UserSliceState {
  user?: User;
}

const token = localStorage.getItem('token');

const initialState: UserSliceState = {};

export const userSlice = createAppSlice({
  name: 'user',
  initialState,
  reducers: (create) => ({
    setUserData: create.reducer((state, action: PayloadAction<User>) => {
      state.user = {
        ...action.payload,
        token: action.payload.token ?? token,
      };
    }),
    logout: create.reducer((state) => {
      state.user = undefined;
      localStorage.removeItem('token');
    }),
  }),
  selectors: {
    selectUser: (user) => user.user,
  },
});

export const { setUserData, logout } = userSlice.actions;
export const { selectUser } = userSlice.selectors;
