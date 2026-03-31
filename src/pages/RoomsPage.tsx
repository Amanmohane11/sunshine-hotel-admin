import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { markClean, selectRoom, clearSelectedRoom, cancelBooking, extendBooking, addBookingGuest, removeBookingGuest, bookRoom } from '@/store/roomsSlice';
import { Room, Guest } from '@/store/dummyData';
import { format } from 'date-fns';
import { X, Users, Clock, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  available: 'border-status-available bg-status-available/5',
  occupied: 'border-status-occupied bg-status-occupied/5',
  cleaning: 'border-status-cleaning bg-status-cleaning/5',
};

const statusBadge: Record<string, string> = {
  available: 'bg-status-available/15 text-status-available',
  occupied: 'bg-status-occupied/15 text-status-occupied',
  cleaning: 'bg-status-cleaning/15 text-status-cleaning',
};

type View = 'grid' | 'booking' | 'details';

const RoomsPage = () => {
  const dispatch = useAppDispatch();
  const rooms = useAppSelector(s => s.rooms.rooms);
  const selectedRoom = useAppSelector(s => s.rooms.selectedRoom);
  const bookingGuests = useAppSelector(s => s.rooms.bookingGuests);
  const [view, setView] = useState<View>('grid');
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [extendDate, setExtendDate] = useState('');

  const handleRoomClick = (room: Room) => {
    dispatch(selectRoom(room.id));
    if (room.status === 'available') setView('booking');
    else if (room.status === 'occupied') setView('details');
  };

  const goBack = () => {
    dispatch(clearSelectedRoom());
    setView('grid');
    setShowGuestForm(false);
    setCheckIn('');
    setCheckOut('');
  };

  const handleBookRoom = () => {
    if (!checkIn || !checkOut) { toast.error('Please set check-in and check-out dates'); return; }
    if (bookingGuests.length === 0) { toast.error('Please add at least one guest'); return; }
    dispatch(bookRoom({ roomId: selectedRoom!.id, checkIn, checkOut }));
    toast.success('Room booked successfully!');
    goBack();
  };

  const handleExtend = () => {
    if (!extendDate) return;
    dispatch(extendBooking({ roomId: selectedRoom!.id, newCheckOut: extendDate }));
    toast.success('Booking extended!');
    setExtendDate('');
  };

  if (view === 'booking' && selectedRoom) return <BookingView room={selectedRoom} guests={bookingGuests} showGuestForm={showGuestForm} setShowGuestForm={setShowGuestForm} checkIn={checkIn} setCheckIn={setCheckIn} checkOut={checkOut} setCheckOut={setCheckOut} onBook={handleBookRoom} onBack={goBack} dispatch={dispatch} />;
  if (view === 'details' && selectedRoom) return <DetailsView room={selectedRoom} onBack={goBack} dispatch={dispatch} extendDate={extendDate} setExtendDate={setExtendDate} onExtend={handleExtend} />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Rooms</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rooms.map(room => (
          <div
            key={room.id}
            onClick={() => handleRoomClick(room)}
            className={cn('rounded-xl border-2 overflow-hidden shadow-sm cursor-pointer hover:shadow-lg transition-all', statusColors[room.status])}
          >
            <img src={room.image} alt={`Room ${room.number}`} className="w-full h-36 object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg">Room {room.number}</span>
                <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium capitalize', statusBadge[room.status])}>
                  {room.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {room.type === 'couple' ? 'Couple Room' : 'Multiple Bed'}
                </span>
                <span className="font-semibold text-foreground">₹{room.price.toLocaleString()}/night</span>
              </div>
              {room.status === 'occupied' && room.currentBooking && (
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(room.currentBooking.checkIn), 'dd MMM h:mm a')} — {format(new Date(room.currentBooking.checkOut), 'dd MMM h:mm a')}
                </div>
              )}
              {room.status === 'cleaning' && (
                <button
                  onClick={(e) => { e.stopPropagation(); dispatch(markClean(room.id)); toast.success(`Room ${room.number} marked clean`); }}
                  className="mt-2 w-full py-2 rounded-lg bg-status-available text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Mark Clean
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Booking View
const BookingView = ({ room, guests, showGuestForm, setShowGuestForm, checkIn, setCheckIn, checkOut, setCheckOut, onBook, onBack, dispatch }: any) => {
  const [form, setForm] = useState({ name: '', phone: '', address: '', email: '', age: '', gender: 'Male' as Guest['gender'] });

  const handleAddGuest = () => {
    if (!form.name || !form.phone || !form.email) { toast.error('Please fill required fields'); return; }
    const guest: Guest = { id: `g-${Date.now()}`, ...form, age: parseInt(form.age) || 25 };
    dispatch(addBookingGuest(guest));
    setForm({ name: '', phone: '', address: '', email: '', age: '', gender: 'Male' });
    setShowGuestForm(false);
    toast.success('Guest added');
  };

  return (
    <div className="max-w-3xl">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to rooms
      </button>
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <img src={room.image} alt="" className="w-full h-48 object-cover" />
        <div className="p-6">
          <h2 className="text-xl font-bold mb-1">Room {room.number}</h2>
          <p className="text-sm text-muted-foreground mb-4">{room.type === 'couple' ? 'Couple Room' : 'Multiple Bed'} · ₹{room.price.toLocaleString()}/night</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Check-in</label>
              <input type="datetime-local" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Check-out</label>
              <input type="datetime-local" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Guests ({guests.length})</h3>
              <button onClick={() => setShowGuestForm(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" /> Add Guest
              </button>
            </div>
            {guests.map((g: Guest) => (
              <div key={g.id} className="flex items-center justify-between p-3 bg-muted rounded-lg mb-2">
                <div>
                  <p className="font-medium text-sm">{g.name}</p>
                  <p className="text-xs text-muted-foreground">Age: {g.age} · {g.gender}</p>
                </div>
                <button onClick={() => dispatch(removeBookingGuest(g.id))} className="text-destructive hover:opacity-70">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {showGuestForm && (
            <div className="border border-border rounded-lg p-4 mb-4 bg-muted/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm">New Guest</h4>
                <button onClick={() => setShowGuestForm(false)}><X className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Phone *</label>
                  <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Email *</label>
                  <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Age</label>
                  <input type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Address</label>
                  <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Gender</label>
                  <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value as Guest['gender']})} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1">Aadhaar Upload</label>
                  <input type="file" className="w-full text-sm" />
                </div>
              </div>
              <button onClick={handleAddGuest} className="mt-3 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                Add Guest
              </button>
            </div>
          )}

          <button onClick={onBook} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-md">
            Book Room
          </button>
        </div>
      </div>
    </div>
  );
};

// Details View (Occupied Room)
const DetailsView = ({ room, onBack, dispatch, extendDate, setExtendDate, onExtend }: any) => {
  const booking = room.currentBooking;
  return (
    <div className="max-w-3xl">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to rooms
      </button>
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <img src={room.image} alt="" className="w-full h-48 object-cover" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Room {room.number}</h2>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-status-occupied/15 text-status-occupied">Occupied</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{room.type === 'couple' ? 'Couple Room' : 'Multiple Bed'} · ₹{room.price.toLocaleString()}/night</p>

          {booking && (
            <>
              <div className="bg-muted rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Check-in:</span><p className="font-medium">{format(new Date(booking.checkIn), 'dd MMM yyyy, h:mm a')}</p></div>
                  <div><span className="text-muted-foreground">Check-out:</span><p className="font-medium">{format(new Date(booking.checkOut), 'dd MMM yyyy, h:mm a')}</p></div>
                </div>
              </div>

              <h3 className="font-semibold mb-3">Guests ({booking.guests.length})</h3>
              {booking.guests.map((g: Guest) => (
                <div key={g.id} className="p-3 bg-muted rounded-lg mb-2">
                  <p className="font-medium text-sm">{g.name}</p>
                  <p className="text-xs text-muted-foreground">{g.email} · {g.phone} · Age: {g.age} · {g.gender}</p>
                </div>
              ))}

              <div className="flex gap-3 mt-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Extend check-out</label>
                  <div className="flex gap-2">
                    <input type="datetime-local" value={extendDate} onChange={e => setExtendDate(e.target.value)} className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                    <button onClick={onExtend} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                      Extend
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { dispatch(cancelBooking(room.id)); toast.success('Booking cancelled'); onBack(); }}
                className="mt-4 w-full py-2.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Cancel Booking
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;
