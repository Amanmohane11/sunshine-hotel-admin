import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Hotel, SubscriptionPlan, HotelQuery, dummyHotels, dummySubscriptionPlans, dummyHotelQueries } from './dummyData';

interface HotelsState {
  hotels: Hotel[];
  plans: SubscriptionPlan[];
  queries: HotelQuery[];
}

const initialState: HotelsState = {
  hotels: dummyHotels,
  plans: dummySubscriptionPlans,
  queries: dummyHotelQueries,
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
    respondToQuery(state, action: PayloadAction<{ queryId: string; response: string }>) {
      const q = state.queries.find(q => q.id === action.payload.queryId);
      if (q) { q.response = action.payload.response; q.status = 'resolved'; }
    },
  },
});

export const { approveHotel, rejectHotel, addHotel, updateHotelStatus, respondToQuery } = hotelsSlice.actions;
export default hotelsSlice.reducer;
