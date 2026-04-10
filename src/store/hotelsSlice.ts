import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Hotel, SubscriptionPlan, HotelQuery, FeaturePage, dummyHotels, dummySubscriptionPlans, dummyHotelQueries } from './dummyData';

interface HotelsState {
  hotels: Hotel[];
  plans: SubscriptionPlan[];
  queries: HotelQuery[];
  selectedHotelId: string | null;
}

const initialState: HotelsState = {
  hotels: dummyHotels,
  plans: dummySubscriptionPlans,
  queries: dummyHotelQueries,
  selectedHotelId: null,
};

const hotelsSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    selectHotel(state, action: PayloadAction<string | null>) {
      state.selectedHotelId = action.payload;
    },
    approveHotel(state, action: PayloadAction<string>) {
      const h = state.hotels.find(h => h.id === action.payload);
      if (h) { h.status = 'active'; h.subscriptionActive = true; }
    },
    rejectHotel(state, action: PayloadAction<string>) {
      const h = state.hotels.find(h => h.id === action.payload);
      if (h) h.status = 'inactive';
    },
    addHotel(state, action: PayloadAction<Hotel>) {
      state.hotels.push(action.payload);
    },
    updateHotel(state, action: PayloadAction<Partial<Hotel> & { id: string }>) {
      const idx = state.hotels.findIndex(h => h.id === action.payload.id);
      if (idx !== -1) state.hotels[idx] = { ...state.hotels[idx], ...action.payload };
    },
    updateHotelFeatureAccess(state, action: PayloadAction<{ id: string; featureAccess: FeaturePage[] }>) {
      const h = state.hotels.find(h => h.id === action.payload.id);
      if (h) h.featureAccess = action.payload.featureAccess;
    },
    updateHotelRoomLimit(state, action: PayloadAction<{ id: string; roomLimit: number }>) {
      const h = state.hotels.find(h => h.id === action.payload.id);
      if (h) h.roomLimit = action.payload.roomLimit;
    },
    toggleSubscription(state, action: PayloadAction<string>) {
      const h = state.hotels.find(h => h.id === action.payload);
      if (h) h.subscriptionActive = !h.subscriptionActive;
    },
    resetHotelPassword(state, action: PayloadAction<{ id: string; password: string }>) {
      const h = state.hotels.find(h => h.id === action.payload.id);
      if (h) h.adminPassword = action.payload.password;
    },
    respondToQuery(state, action: PayloadAction<{ queryId: string; response: string }>) {
      const q = state.queries.find(q => q.id === action.payload.queryId);
      if (q) { q.response = action.payload.response; q.status = 'resolved'; }
    },
    // Subscription plan management
    addPlan(state, action: PayloadAction<SubscriptionPlan>) {
      state.plans.push(action.payload);
    },
    updatePlan(state, action: PayloadAction<Partial<SubscriptionPlan> & { id: string }>) {
      const idx = state.plans.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) state.plans[idx] = { ...state.plans[idx], ...action.payload };
    },
    deletePlan(state, action: PayloadAction<string>) {
      state.plans = state.plans.filter(p => p.id !== action.payload);
    },
  },
});

export const {
  selectHotel, approveHotel, rejectHotel, addHotel, updateHotel,
  updateHotelFeatureAccess, updateHotelRoomLimit, toggleSubscription,
  resetHotelPassword, respondToQuery, addPlan, updatePlan, deletePlan,
} = hotelsSlice.actions;
export default hotelsSlice.reducer;
