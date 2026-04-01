import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BookingHistory, dummyBookingHistory } from './dummyData';

interface BillingState {
  history: BookingHistory[];
}

const initialState: BillingState = {
  history: dummyBookingHistory,
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    addBookingToHistory(state, action: PayloadAction<BookingHistory>) {
      state.history.unshift(action.payload);
    },
    updatePaymentStatus(state, action: PayloadAction<{ id: string; status: BookingHistory['paymentStatus'] }>) {
      const h = state.history.find(b => b.id === action.payload.id);
      if (h) h.paymentStatus = action.payload.status;
    },
  },
});

export const { addBookingToHistory, updatePaymentStatus } = billingSlice.actions;
export default billingSlice.reducer;
