import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification, dummyNotifications } from './dummyData';

interface NotificationsState {
  items: Notification[];
}

const initialState: NotificationsState = {
  items: dummyNotifications,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.items.unshift(action.payload);
    },
    markRead(state, action: PayloadAction<string>) {
      const n = state.items.find(i => i.id === action.payload);
      if (n) n.read = true;
    },
    markAllRead(state) {
      state.items.forEach(n => (n.read = true));
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.items = state.items.filter(n => n.id !== action.payload);
    },
  },
});

export const { addNotification, markRead, markAllRead, removeNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
