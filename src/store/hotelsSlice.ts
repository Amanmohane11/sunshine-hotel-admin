import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Hotel, SubscriptionPlan, dummyHotels, dummySubscriptionPlans } from './dummyData';

interface HotelsState {
  hotels: Hotel[];
  plans: SubscriptionPlan[];
}

const initialState: HotelsState = {
  hotels: dummyHotels,
  plans: dummySubscriptionPlans,
};

const hotelsSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    approveHotel(state, action: PayloadAction<string>) {
      const h = state.hotels.find(h => h.id === action.payload);
      if (h) h.status = 'active';
    },
    rejectHotel(state, action: PayloadAction<string>) {
      const h = state.hotels.find(h => h.id === action.payload);
      if (h) h.status = 'inactive';
    },
    addHotel(state, action: PayloadAction<Hotel>) {
      state.hotels.push(action.payload);
    },
    updateHotelStatus(state, action: PayloadAction<{ id: string; status: Hotel['status'] }>) {
      const h = state.hotels.find(h => h.id === action.payload.id);
      if (h) h.status = action.payload.status;
    },
  },
});

export const { approveHotel, rejectHotel, addHotel, updateHotelStatus } = hotelsSlice.actions;
export default hotelsSlice.reducer;
