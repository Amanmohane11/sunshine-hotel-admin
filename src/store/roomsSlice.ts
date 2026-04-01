import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room, Booking, BookingService, Guest, dummyRooms } from './dummyData';

interface RoomsState {
  rooms: Room[];
  selectedRoom: Room | null;
  bookingGuests: Guest[];
  bookingServices: BookingService[];
}

const initialState: RoomsState = {
  rooms: dummyRooms,
  selectedRoom: null,
  bookingGuests: [],
  bookingServices: [],
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
      state.bookingServices = [];
    },
    addBookingGuest(state, action: PayloadAction<Guest>) {
      state.bookingGuests.push(action.payload);
    },
    removeBookingGuest(state, action: PayloadAction<string>) {
      state.bookingGuests = state.bookingGuests.filter(g => g.id !== action.payload);
    },
    addBookingService(state, action: PayloadAction<BookingService>) {
      state.bookingServices.push(action.payload);
    },
    removeBookingService(state, action: PayloadAction<string>) {
      state.bookingServices = state.bookingServices.filter(s => s.id !== action.payload);
    },
    bookRoom(state, action: PayloadAction<{ roomId: string; checkIn: string; checkOut: string; paymentMethod: 'cash' | 'upi' | 'card'; amountPaid: number }>) {
      const room = state.rooms.find(r => r.id === action.payload.roomId);
      if (room) {
        const checkInDate = new Date(action.payload.checkIn);
        const checkOutDate = new Date(action.payload.checkOut);
        const now = new Date();
        const hoursBefore = (checkInDate.getTime() - now.getTime()) / 3600000;
        const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / 86400000));
        const roomCharges = room.price * nights;
        const serviceCharges = state.bookingServices.reduce((sum, s) => sum + s.price * s.quantity, 0);
        const subtotal = roomCharges + serviceCharges;
        const tax = Math.round(subtotal * 0.18);
        const totalAmount = subtotal + tax;

        const booking: Booking = {
          id: `bk-${Date.now()}`,
          roomId: room.id,
          guests: [...state.bookingGuests],
          checkIn: action.payload.checkIn,
          checkOut: action.payload.checkOut,
          status: 'active',
          createdAt: new Date().toISOString(),
          services: [...state.bookingServices],
          roomCharges,
          serviceCharges,
          tax,
          totalAmount,
          amountPaid: action.payload.amountPaid,
          paymentMethod: action.payload.paymentMethod,
          paymentStatus: action.payload.amountPaid >= totalAmount ? 'paid' : action.payload.amountPaid > 0 ? 'partial' : 'pending',
        };

        room.currentBooking = booking;
        if (hoursBefore <= 1) {
          room.status = 'occupied';
        } else {
          room.status = 'reserved';
        }
        state.bookingGuests = [];
        state.bookingServices = [];
      }
    },
    addServiceToRoom(state, action: PayloadAction<{ roomId: string; service: BookingService }>) {
      const room = state.rooms.find(r => r.id === action.payload.roomId);
      if (room?.currentBooking) {
        room.currentBooking.services.push(action.payload.service);
        room.currentBooking.serviceCharges += action.payload.service.price * action.payload.service.quantity;
        const subtotal = room.currentBooking.roomCharges + room.currentBooking.serviceCharges;
        room.currentBooking.tax = Math.round(subtotal * 0.18);
        room.currentBooking.totalAmount = subtotal + room.currentBooking.tax;
        room.currentBooking.paymentStatus = room.currentBooking.amountPaid >= room.currentBooking.totalAmount ? 'paid' : room.currentBooking.amountPaid > 0 ? 'partial' : 'pending';
      }
    },
    makePayment(state, action: PayloadAction<{ roomId: string; amount: number; method: 'cash' | 'upi' | 'card' }>) {
      const room = state.rooms.find(r => r.id === action.payload.roomId);
      if (room?.currentBooking) {
        room.currentBooking.amountPaid += action.payload.amount;
        room.currentBooking.paymentMethod = action.payload.method;
        room.currentBooking.paymentStatus = room.currentBooking.amountPaid >= room.currentBooking.totalAmount ? 'paid' : 'partial';
      }
    },
    checkoutRoom(state, action: PayloadAction<string>) {
      const room = state.rooms.find(r => r.id === action.payload);
      if (room?.currentBooking) {
        if (room.currentBooking.paymentStatus === 'paid') {
          room.currentBooking.status = 'completed';
          room.currentBooking = undefined;
          room.status = 'cleaning';
        }
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
        const checkIn = new Date(room.currentBooking.checkIn);
        const checkOut = new Date(action.payload.newCheckOut);
        const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000));
        room.currentBooking.roomCharges = room.price * nights;
        const subtotal = room.currentBooking.roomCharges + room.currentBooking.serviceCharges;
        room.currentBooking.tax = Math.round(subtotal * 0.18);
        room.currentBooking.totalAmount = subtotal + room.currentBooking.tax;
        room.currentBooking.paymentStatus = room.currentBooking.amountPaid >= room.currentBooking.totalAmount ? 'paid' : room.currentBooking.amountPaid > 0 ? 'partial' : 'pending';
      }
    },
    processScheduledBookings(state) {
      const now = new Date();
      state.rooms.forEach(room => {
        if (room.status === 'reserved' && room.currentBooking) {
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

export const {
  selectRoom, clearSelectedRoom, addBookingGuest, removeBookingGuest,
  addBookingService, removeBookingService, bookRoom, addServiceToRoom,
  makePayment, checkoutRoom, markClean, cancelBooking, extendBooking,
  processScheduledBookings,
} = roomsSlice.actions;
export default roomsSlice.reducer;
