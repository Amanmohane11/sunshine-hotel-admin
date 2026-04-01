import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GuestRecord, dummyGuestRecords } from './dummyData';

interface CRMState {
  guests: GuestRecord[];
}

const initialState: CRMState = {
  guests: dummyGuestRecords,
};

const crmSlice = createSlice({
  name: 'crm',
  initialState,
  reducers: {
    addGuestRecord(state, action: PayloadAction<GuestRecord>) {
      state.guests.push(action.payload);
    },
    updateGuestRecord(state, action: PayloadAction<GuestRecord>) {
      const idx = state.guests.findIndex(g => g.id === action.payload.id);
      if (idx !== -1) state.guests[idx] = action.payload;
    },
  },
});

export const { addGuestRecord, updateGuestRecord } = crmSlice.actions;
export default crmSlice.reducer;
