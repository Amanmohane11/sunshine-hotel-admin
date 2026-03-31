import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServiceOrder, dummyServices } from './dummyData';

interface ServicesState {
  orders: ServiceOrder[];
}

const initialState: ServicesState = {
  orders: dummyServices,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    addServiceOrder(state, action: PayloadAction<ServiceOrder>) {
      state.orders.push(action.payload);
    },
    updateServiceStatus(state, action: PayloadAction<{ id: string; status: ServiceOrder['status'] }>) {
      const order = state.orders.find(o => o.id === action.payload.id);
      if (order) order.status = action.payload.status;
    },
  },
});

export const { addServiceOrder, updateServiceStatus } = servicesSlice.actions;
export default servicesSlice.reducer;
