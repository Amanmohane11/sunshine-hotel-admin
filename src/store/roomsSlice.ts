import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room, Booking, Guest, dummyRooms } from './dummyData';

// API layer - uncomment and replace dummy data with real API calls
// import { api } from '@/services/api';
// export const fetchRooms = createAsyncThunk('rooms/fetch', async () => {
//   const response = await api.get('/rooms');
//   return response.data;
// });

interface RoomsState {
  rooms: Room[];
  selectedRoom: Room | null;
  bookingGuests: Guest[];
}

const initialState: RoomsState = {
  rooms: dummyRooms,
  selectedRoom: null,
  bookingGuests: [],
};

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    selectRoom(state, action: PayloadAction<string>) {
      state.selectedRoom = state.rooms.find(r => r.id === action.payload) || null;
    },
    clearSelectedRoom(state) {
      state.selectedRoom = null;
      state.bookingGuests = [];
    },
    addBookingGuest(state, action: PayloadAction<Guest>) {
      state.bookingGuests.push(action.payload);
    },
    removeBookingGuest(state, action: PayloadAction<string>) {
      state.bookingGuests = state.bookingGuests.filter(g => g.id !== action.payload);
    },
    bookRoom(state, action: PayloadAction<{ roomId: string; checkIn: string; checkOut: string }>) {
      const room = state.rooms.find(r => r.id === action.payload.roomId);
      if (room) {
        const checkInDate = new Date(action.payload.checkIn);
        const now = new Date();
        const hoursBefore = (checkInDate.getTime() - now.getTime()) / 3600000;

        const booking: Booking = {
          id: `bk-${Date.now()}`,
          roomId: room.id,
          guests: [...state.bookingGuests],
          checkIn: action.payload.checkIn,
          checkOut: action.payload.checkOut,
          status: 'active',
          createdAt: new Date().toISOString(),
        };

        room.currentBooking = booking;
        // If check-in is more than 1 hour away, room stays available
        // otherwise mark occupied
        if (hoursBefore <= 1) {
          room.status = 'occupied';
        }
        // The scheduled logic would run via a timer/cron in production
        state.bookingGuests = [];
      }
    },
    markClean(state, action: PayloadAction<string>) {
      const room = state.rooms.find(r => r.id === action.payload);
      if (room) {
        room.status = 'available';
      }
    },
    cancelBooking(state, action: PayloadAction<string>) {
      const room = state.rooms.find(r => r.id === action.payload);
      if (room) {
        room.status = 'available';
        room.currentBooking = undefined;
      }
    },
    extendBooking(state, action: PayloadAction<{ roomId: string; newCheckOut: string }>) {
      const room = state.rooms.find(r => r.id === action.payload.roomId);
      if (room?.currentBooking) {
        room.currentBooking.checkOut = action.payload.newCheckOut;
      }
    },
    // Simulate scheduled check: mark rooms as occupied 1hr before check-in
    processScheduledBookings(state) {
      const now = new Date();
      state.rooms.forEach(room => {
        if (room.status === 'available' && room.currentBooking) {
          const checkIn = new Date(room.currentBooking.checkIn);
          const hoursBefore = (checkIn.getTime() - now.getTime()) / 3600000;
          if (hoursBefore <= 1) {
            room.status = 'occupied';
          }
        }
      });
    },
  },
});

export const { selectRoom, clearSelectedRoom, addBookingGuest, removeBookingGuest, bookRoom, markClean, cancelBooking, extendBooking, processScheduledBookings } = roomsSlice.actions;
export default roomsSlice.reducer;
