import { createAppSlice } from '@/redux/createAppSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Restaurant } from '@/types/restaurant';

export interface RestaurantSliceState {
  restaurant?: Restaurant;
}

const initialState: RestaurantSliceState = {};

export const restaurantSlice = createAppSlice({
  name: 'restaurant',
  initialState,
  reducers: (create) => ({
    setRestaurantData: create.reducer((state, action: PayloadAction<Restaurant>) => {
      state.restaurant = action.payload;
    }),
  }),
  selectors: {
    selectRestaurant: (restaurant) => restaurant.restaurant,
  },
});

export const { setRestaurantData } = restaurantSlice.actions;
export const { selectRestaurant } = restaurantSlice.selectors;
