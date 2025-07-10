import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { userSlice } from './modules/user/userSlice';
import { restaurantSlice } from './modules/restaurant/restaurantSlice';

const rootReducer = combineSlices(userSlice, restaurantSlice);

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware();
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
