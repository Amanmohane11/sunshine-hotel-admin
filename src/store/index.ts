import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import roomsReducer from './roomsSlice';
import servicesReducer from './servicesSlice';
import staffReducer from './staffSlice';
import notificationsReducer from './notificationsSlice';
import inventoryReducer from './inventorySlice';
import billingReducer from './billingSlice';
import crmReducer from './crmSlice';
import hotelsReducer from './hotelsSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomsReducer,
    services: servicesReducer,
    staff: staffReducer,
    notifications: notificationsReducer,
    inventory: inventoryReducer,
    billing: billingReducer,
    crm: crmReducer,
    hotels: hotelsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
