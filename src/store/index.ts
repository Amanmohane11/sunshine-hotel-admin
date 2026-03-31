import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import roomsReducer from './roomsSlice';
import servicesReducer from './servicesSlice';
import staffReducer from './staffSlice';

export const store = configureStore({
  reducer: {
    rooms: roomsReducer,
    services: servicesReducer,
    staff: staffReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
