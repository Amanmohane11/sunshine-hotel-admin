import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { markClean, selectRoom, clearSelectedRoom, cancelBooking, extendBooking, addBookingGuest, removeBookingGuest, addBookingService, removeBookingService, bookRoom, addServiceToRoom, makePayment, checkoutRoom, addRoom, addCategory } from '@/store/roomsSlice';
import { Room, Guest, BookingService, RoomStatus, RoomCategory } from '@/store/dummyData';
import { format } from 'date-fns';
import { X, Users, Clock, ArrowLeft, Plus, Trash2, CreditCard, Banknote, Smartphone, ShoppingBag, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  available: 'border-status-available/30 bg-gradient-to-br from-status-available/5 to-transparent',
  occupied: 'border-status-occupied/30 bg-gradient-to-br from-status-occupied/5 to-transparent',
  cleaning: 'border-status-cleaning/30 bg-gradient-to-br from-status-cleaning/5 to-transparent',
};

const statusBadge: Record<string, string> = {
  available: 'bg-status-available/10 text-status-available',
  occupied: 'bg-status-occupied/10 text-status-occupied',
  cleaning: 'bg-status-cleaning/10 text-status-cleaning',
};

const statusDotColors: Record<string, string> = {
  available: 'bg-status-available',
  occupied: 'bg-status-occupied',
  cleaning: 'bg-status-cleaning',
};

const serviceOptions = [
  { type: 'food' as const, name: 'Food Order', defaultPrice: 500 },
  { type: 'laundry' as const, name: 'Laundry', defaultPrice: 300 },
  { type: 'spa' as const, name: 'Spa', defaultPrice: 2000 },
  { type: 'room_service' as const, name: 'Room Service', defaultPrice: 400 },
  { type: 'mini_bar' as const, name: 'Mini Bar', defaultPrice: 200 },
  { type: 'other' as const, name: 'Other', defaultPrice: 500 },
];

type View = 'grid' | 'booking' | 'details';

const RoomsPage = () => {
  const dispatch = useAppDispatch();
  const rooms = useAppSelector(s => s.rooms.rooms);
  const categories = useAppSelector(s => s.rooms.categories);
  const selectedRoom = useAppSelector(s => s.rooms.selectedRoom);
  const bookingGuests = useAppSelector(s => s.rooms.bookingGuests);
  const bookingServices = useAppSelector(s => s.rooms.bookingServices);
  const [view, setView] = useState<View>('grid');
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [extendDate, setExtendDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'card'>('upi');
  const [payAmount, setPayAmount] = useState('');
  const [statusFilter, setStatusFilter] = useState<RoomStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newRoom, setNewRoom] = useState({ number: '', category: '', price: '', capacity: '2' });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

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
    setPayAmount('');
  };

  const handleBookRoom = () => {
    if (!checkIn || !checkOut) { toast.error('Please set check-in and check-out dates'); return; }
    if (bookingGuests.length === 0) { toast.error('Please add at least one guest'); return; }
    dispatch(bookRoom({ roomId: selectedRoom!.id, checkIn, checkOut, paymentMethod, amountPaid: parseFloat(payAmount) || 0, gstPercent: parseFloat((document.getElementById('gst-input') as HTMLInputElement)?.value || '18'), pricePerPerson: parseFloat((document.getElementById('price-input') as HTMLInputElement)?.value || String(selectedRoom!.price)) }));
    toast.success('Room booked successfully!');
    goBack();
  };

  const handleExtend = () => {
    if (!extendDate) return;
    dispatch(extendBooking({ roomId: selectedRoom!.id, newCheckOut: extendDate }));
    toast.success('Booking extended!');
    setExtendDate('');
  };

  const handleAddRoom = () => {
    if (!newRoom.number || !newRoom.category || !newRoom.price) { toast.error('Fill all fields'); return; }
    const roomImages = [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
    ];
    dispatch(addRoom({
      id: `room-${Date.now()}`, number: newRoom.number, type: 'multiple', status: 'available',
      price: parseFloat(newRoom.price), floor: 1,
      image: roomImages[Math.floor(Math.random() * roomImages.length)],
      category: newRoom.category, capacity: parseInt(newRoom.capacity) || 2,
      dynamicPricing: { weekendMultiplier: 1.3, holidayMultiplier: 1.5 },
    }));
    toast.success('Room added');
    setNewRoom({ number: '', category: '', price: '', capacity: '2' });
    setShowAddRoom(false);
  };

  const handleAddCategory = () => {
    if (!newCategory.name) { toast.error('Enter category name'); return; }
    dispatch(addCategory({ id: `rcat-${Date.now()}`, name: newCategory.name, description: newCategory.description }));
    toast.success('Category added');
    setNewCategory({ name: '', description: '' });
    setShowAddCategory(false);
  };

  if (view === 'booking' && selectedRoom) return <BookingView room={selectedRoom} guests={bookingGuests} services={bookingServices} showGuestForm={showGuestForm} setShowGuestForm={setShowGuestForm} checkIn={checkIn} setCheckIn={setCheckIn} checkOut={checkOut} setCheckOut={setCheckOut} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} payAmount={payAmount} setPayAmount={setPayAmount} onBook={handleBookRoom} onBack={goBack} dispatch={dispatch} />;
  if (view === 'details' && selectedRoom) return <DetailsView room={selectedRoom} onBack={goBack} dispatch={dispatch} extendDate={extendDate} setExtendDate={setExtendDate} onExtend={handleExtend} />;

  const statuses: RoomStatus[] = ['available', 'occupied', 'cleaning'];
  
  // Filter rooms
  let filteredRooms = statusFilter === 'all' ? rooms : rooms.filter(r => r.status === statusFilter);
  
  // Sort by category filter (selected category first)
  if (categoryFilter !== 'all') {
    const matched = filteredRooms.filter(r => r.category === categoryFilter);
    const rest = filteredRooms.filter(r => r.category !== categoryFilter);
    filteredRooms = [...matched, ...rest];
  }

  // Group by category
  const categoryNames = [...new Set(filteredRooms.map(r => r.category))];

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Rooms</h1>
          <p className="text-muted-foreground text-sm">Manage room status, bookings, and assignments</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddCategory(true)} className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all">+ Add Category</button>
          <button onClick={() => setShowAddRoom(true)} className="px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-md shadow-primary/20">+ Add Room</button>
        </div>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setStatusFilter('all')} className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all', statusFilter === 'all' ? 'gradient-primary text-primary-foreground shadow-sm' : 'bg-card border border-border/50 text-muted-foreground hover:text-foreground')}>
          All ({rooms.length})
        </button>
        {statuses.map(status => {
          const count = rooms.filter(r => r.status === status).length;
          return (
            <button key={status} onClick={() => setStatusFilter(status)} className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize', statusFilter === status ? 'gradient-primary text-primary-foreground shadow-sm' : 'bg-card border border-border/50 text-muted-foreground hover:text-foreground')}>
              <div className={cn('w-2 h-2 rounded-full', statusDotColors[status])} />
              {status} ({count})
            </button>
          );
        })}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary/50 transition-all">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      {/* Rooms grouped by category */}
      {categoryNames.map(cat => {
        const catRooms = filteredRooms.filter(r => r.category === cat);
        if (catRooms.length === 0) return null;
        return (
          <div key={cat} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold">{cat}</h2>
              <span className="px-2 py-0.5 rounded-lg bg-muted text-xs font-medium text-muted-foreground">{catRooms.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {catRooms.map((room, idx) => (
                <div key={room.id} onClick={() => handleRoomClick(room)}
                  className={cn('rounded-2xl border overflow-hidden shadow-sm cursor-pointer hover-lift group animate-slide-up', statusColors[room.status])}
                  style={{ animationDelay: `${idx * 40}ms` }}>
                  <div className="relative overflow-hidden">
                    <img src={room.image} alt={`Room ${room.number}`} className="w-full h-36 object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className={cn('absolute top-3 left-3 h-1.5 w-12 rounded-full', statusDotColors[room.status])} />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-lg">Room {room.number}</span>
                      <span className={cn('px-2.5 py-1 rounded-lg text-xs font-medium capitalize', statusBadge[room.status])}>{room.status}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{room.capacity} guests</span>
                      <span className="font-semibold text-foreground">₹{room.price.toLocaleString()}<span className="text-xs text-muted-foreground">/night</span></span>
                    </div>
                    {room.status === 'occupied' && room.currentBooking && (
                      <div className="text-xs bg-muted/50 px-2 py-1.5 rounded-lg mt-1 space-y-0.5">
                        <p className="font-medium text-foreground">{room.currentBooking.guests[0]?.name}</p>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {format(new Date(room.currentBooking.checkIn), 'dd MMM h:mm a')} — {format(new Date(room.currentBooking.checkOut), 'dd MMM h:mm a')}
                        </div>
                      </div>
                    )}
                    {room.status === 'available' && room.currentBooking && (
                      <div className="text-xs bg-status-blue/5 px-2 py-1.5 rounded-lg mt-1 space-y-0.5 text-status-blue">
                        <p className="font-medium">{room.currentBooking.guests[0]?.name} (upcoming)</p>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(room.currentBooking.checkIn), 'dd MMM h:mm a')}
                        </div>
                      </div>
                    )}
                    {room.status === 'cleaning' && (
                      <button onClick={(e) => { e.stopPropagation(); dispatch(markClean(room.id)); toast.success(`Room ${room.number} marked clean`); }}
                        className="mt-2 w-full py-2 rounded-xl bg-status-available text-white text-sm font-medium hover:opacity-90 transition-all btn-ripple">
                        Mark Clean
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Add Room Modal */}
      {showAddRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-scale-in" onClick={() => setShowAddRoom(false)}>
          <div className="glass-card rounded-2xl border border-border/50 p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">Add Room</h2>
              <button onClick={() => setShowAddRoom(false)} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-xs font-semibold mb-1.5">Room Number *</label><input value={newRoom.number} onChange={e => setNewRoom({...newRoom, number: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm" placeholder="e.g. 501" /></div>
              <div><label className="block text-xs font-semibold mb-1.5">Category *</label>
                <select value={newRoom.category} onChange={e => setNewRoom({...newRoom, category: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold mb-1.5">Price (₹) *</label><input type="number" value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm" /></div>
                <div><label className="block text-xs font-semibold mb-1.5">Capacity</label><input type="number" value={newRoom.capacity} onChange={e => setNewRoom({...newRoom, capacity: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm" /></div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddRoom(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all">Cancel</button>
              <button onClick={handleAddRoom} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-md shadow-primary/20">Add Room</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-scale-in" onClick={() => setShowAddCategory(false)}>
          <div className="glass-card rounded-2xl border border-border/50 p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">Add Category</h2>
              <button onClick={() => setShowAddCategory(false)} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-xs font-semibold mb-1.5">Category Name *</label><input value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm" placeholder="e.g. Premium" /></div>
              <div><label className="block text-xs font-semibold mb-1.5">Description</label><input value={newCategory.description} onChange={e => setNewCategory({...newCategory, description: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm" placeholder="Optional description" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddCategory(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all">Cancel</button>
              <button onClick={handleAddCategory} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-md shadow-primary/20">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Live Bill Preview
const BillPreview = ({ room, guests, services, checkIn, checkOut, gstPercent, pricePerPerson }: { room: Room; guests: Guest[]; services: BookingService[]; checkIn: string; checkOut: string; gstPercent: number; pricePerPerson: number }) => {
  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)) : 1;
  const roomCharges = pricePerPerson * guests.length * nights;
  const serviceCharges = services.reduce((s, sv) => s + sv.price * sv.quantity, 0);
  const subtotal = roomCharges + serviceCharges;
  const tax = Math.round(subtotal * (gstPercent / 100));
  const total = subtotal + tax;

  return (
    <div className="glass-card rounded-2xl border border-primary/20 p-5 sticky top-20">
      <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
          <ShoppingBag className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        Live Bill Preview
      </h4>
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">₹{pricePerPerson} × {guests.length} guest{guests.length !== 1 ? 's' : ''} × {nights} night{nights > 1 ? 's' : ''}</span><span className="font-medium">₹{roomCharges.toLocaleString()}</span></div>
        {services.map(s => (
          <div key={s.id} className="flex justify-between"><span className="text-muted-foreground">{s.name} × {s.quantity}</span><span className="font-medium">₹{(s.price * s.quantity).toLocaleString()}</span></div>
        ))}
        <div className="border-t border-border pt-2 flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">₹{subtotal.toLocaleString()}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">GST ({gstPercent}%)</span><span className="font-medium">₹{tax.toLocaleString()}</span></div>
        <div className="border-t-2 border-primary/20 pt-3 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">₹{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

const FormInput = ({ label, required, ...props }: any) => (
  <div>
    <label className="block text-xs font-semibold mb-1.5 text-foreground/80">{label} {required && <span className="text-destructive">*</span>}</label>
    <input {...props} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all duration-200" />
  </div>
);

const FormSelect = ({ label, children, ...props }: any) => (
  <div>
    <label className="block text-xs font-semibold mb-1.5 text-foreground/80">{label}</label>
    <select {...props} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all duration-200">{children}</select>
  </div>
);

// Booking View
const BookingView = ({ room, guests, services, showGuestForm, setShowGuestForm, checkIn, setCheckIn, checkOut, setCheckOut, paymentMethod, setPaymentMethod, payAmount, setPayAmount, onBook, onBack, dispatch }: any) => {
  const [form, setForm] = useState({ name: '', phone: '', address: '', email: '', age: '', gender: 'Male' as Guest['gender'], aadhaarNumber: '' });
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({ type: 'food' as BookingService['type'], name: '', price: '', quantity: '1' });
  const [gstPercent, setGstPercent] = useState('18');
  const [pricePerPerson, setPricePerPerson] = useState(String(room.price));

  const handleAddGuest = () => {
    if (!form.name || !form.phone || !form.email) { toast.error('Please fill required fields'); return; }
    const guest: Guest = { id: `g-${Date.now()}`, ...form, age: parseInt(form.age) || 25 };
    dispatch(addBookingGuest(guest));
    setForm({ name: '', phone: '', address: '', email: '', age: '', gender: 'Male', aadhaarNumber: '' });
    setShowGuestForm(false);
    toast.success('Guest added');
  };

  const handleAddService = () => {
    const opt = serviceOptions.find(s => s.type === serviceForm.type);
    const svc: BookingService = {
      id: `bs-${Date.now()}`, name: serviceForm.name || opt?.name || '',
      price: parseFloat(serviceForm.price) || opt?.defaultPrice || 0,
      quantity: parseInt(serviceForm.quantity) || 1, type: serviceForm.type,
    };
    dispatch(addBookingService(svc));
    setServiceForm({ type: 'food', name: '', price: '', quantity: '1' });
    setShowServiceForm(false);
    toast.success('Service added');
  };

  return (
    <div className="max-w-4xl animate-slide-up">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to rooms
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
            <img src={room.image} alt="" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h2 className="text-xl font-bold mb-1">Room {room.number}</h2>
              <p className="text-sm text-muted-foreground mb-5">{room.category} · {room.capacity} guests max</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormInput label="Check-in" type="datetime-local" value={checkIn} onChange={(e: any) => setCheckIn(e.target.value)} required />
                <FormInput label="Check-out" type="datetime-local" value={checkOut} onChange={(e: any) => setCheckOut(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Price per Person (₹)</label>
                  <input id="price-input" type="number" value={pricePerPerson} onChange={e => setPricePerPerson(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">GST (%)</label>
                  <input id="gst-input" type="number" value={gstPercent} onChange={e => setGstPercent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
                </div>
              </div>

              {/* Guests */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Guests ({guests.length})</h3>
                  <button onClick={() => setShowGuestForm(true)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-sm shadow-primary/20">
                    <Plus className="w-4 h-4" /> Add Guest
                  </button>
                </div>
                {guests.map((g: Guest) => (
                  <div key={g.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl mb-2 hover:bg-muted transition-colors">
                    <div><p className="font-medium text-sm">{g.name}</p><p className="text-xs text-muted-foreground">Age: {g.age} · {g.gender}{g.aadhaarNumber ? ` · Aadhaar: ${g.aadhaarNumber}` : ''}</p></div>
                    <button onClick={() => dispatch(removeBookingGuest(g.id))} className="text-destructive hover:opacity-70 p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>

              {showGuestForm && (
                <div className="border border-border/50 rounded-2xl p-5 mb-6 bg-muted/30 animate-scale-in">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-sm">New Guest</h4>
                    <button onClick={() => setShowGuestForm(false)} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <FormInput label="Name" required value={form.name} onChange={(e: any) => setForm({...form, name: e.target.value})} placeholder="Full name" />
                    <FormInput label="Phone" required value={form.phone} onChange={(e: any) => setForm({...form, phone: e.target.value})} placeholder="+91..." />
                    <FormInput label="Email" required value={form.email} onChange={(e: any) => setForm({...form, email: e.target.value})} placeholder="email@example.com" />
                    <FormInput label="Age" type="number" value={form.age} onChange={(e: any) => setForm({...form, age: e.target.value})} placeholder="25" />
                    <FormInput label="Address" value={form.address} onChange={(e: any) => setForm({...form, address: e.target.value})} placeholder="Street address" />
                    <FormSelect label="Gender" value={form.gender} onChange={(e: any) => setForm({...form, gender: e.target.value as Guest['gender']})}><option>Male</option><option>Female</option><option>Other</option></FormSelect>
                    <div className="col-span-2">
                      <FormInput label="Aadhaar Number" value={form.aadhaarNumber} onChange={(e: any) => setForm({...form, aadhaarNumber: e.target.value})} placeholder="XXXX-XXXX-XXXX" />
                    </div>
                  </div>
                  <button onClick={handleAddGuest} className="mt-4 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-sm shadow-primary/20">Add Guest</button>
                </div>
              )}

              {/* Services */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Services ({services.length})</h3>
                  <button onClick={() => setShowServiceForm(true)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all">
                    <Plus className="w-4 h-4" /> Add Service
                  </button>
                </div>
                {services.map((s: BookingService) => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl mb-2 hover:bg-muted transition-colors">
                    <div><p className="font-medium text-sm">{s.name}</p><p className="text-xs text-muted-foreground">₹{s.price} × {s.quantity}</p></div>
                    <button onClick={() => dispatch(removeBookingService(s.id))} className="text-destructive hover:opacity-70 p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>

              {showServiceForm && (
                <div className="border border-border/50 rounded-2xl p-5 mb-6 bg-muted/30 animate-scale-in">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-sm">Add Service</h4>
                    <button onClick={() => setShowServiceForm(false)} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <FormSelect label="Type" value={serviceForm.type} onChange={(e: any) => { const t = e.target.value as BookingService['type']; const opt = serviceOptions.find(s => s.type === t); setServiceForm({...serviceForm, type: t, name: opt?.name || '', price: String(opt?.defaultPrice || '') }); }}>
                      {serviceOptions.map(s => <option key={s.type} value={s.type}>{s.name}</option>)}
                    </FormSelect>
                    <FormInput label="Name" value={serviceForm.name} onChange={(e: any) => setServiceForm({...serviceForm, name: e.target.value})} />
                    <FormInput label="Price (₹)" type="number" value={serviceForm.price} onChange={(e: any) => setServiceForm({...serviceForm, price: e.target.value})} />
                    <FormInput label="Quantity" type="number" value={serviceForm.quantity} onChange={(e: any) => setServiceForm({...serviceForm, quantity: e.target.value})} />
                  </div>
                  <button onClick={handleAddService} className="mt-4 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-sm shadow-primary/20">Add Service</button>
                </div>
              )}

              {/* Payment */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Payment Method</h3>
                <div className="flex gap-3">
                  {[{ m: 'cash' as const, icon: Banknote, label: 'Cash' }, { m: 'upi' as const, icon: Smartphone, label: 'UPI' }, { m: 'card' as const, icon: CreditCard, label: 'Card' }].map(({ m, icon: Icon, label }) => (
                    <button key={m} onClick={() => setPaymentMethod(m)} className={cn('flex items-center gap-2 px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200', paymentMethod === m ? 'border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10' : 'border-border hover:border-primary/30')}>
                      <Icon className="w-4 h-4" /> {label}
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <FormInput label="Amount to Pay Now (₹)" type="number" value={payAmount} onChange={(e: any) => setPayAmount(e.target.value)} placeholder="0 for pay later" />
                </div>
              </div>

              <button onClick={onBook} className="w-full py-3.5 rounded-2xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 btn-ripple btn-glow">
                Book Room
              </button>
            </div>
          </div>
        </div>
        <div><BillPreview room={room} guests={guests} services={services} checkIn={checkIn} checkOut={checkOut} gstPercent={parseFloat(gstPercent) || 18} pricePerPerson={parseFloat(pricePerPerson) || room.price} /></div>
      </div>
    </div>
  );
};

// Details View
const DetailsView = ({ room, onBack, dispatch, extendDate, setExtendDate, onExtend }: any) => {
  const booking = room.currentBooking;
  const [showAddService, setShowAddService] = useState(false);
  const [svcForm, setSvcForm] = useState({ type: 'food' as BookingService['type'], name: 'Food Order', price: '500', quantity: '1' });
  const [payAmt, setPayAmt] = useState('');
  const [payMethod, setPayMethod] = useState<'cash' | 'upi' | 'card'>('upi');

  const handleAddServiceToRoom = () => {
    const svc: BookingService = { id: `bs-${Date.now()}`, name: svcForm.name, price: parseFloat(svcForm.price) || 0, quantity: parseInt(svcForm.quantity) || 1, type: svcForm.type };
    dispatch(addServiceToRoom({ roomId: room.id, service: svc }));
    toast.success('Service added to bill');
    setShowAddService(false);
  };

  const handlePayment = () => {
    const amt = parseFloat(payAmt);
    if (!amt || amt <= 0) { toast.error('Enter valid amount'); return; }
    dispatch(makePayment({ roomId: room.id, amount: amt, method: payMethod }));
    toast.success('Payment recorded');
    setPayAmt('');
  };

  const handleCheckout = () => {
    if (booking?.paymentStatus !== 'paid') { toast.error('Payment must be completed before checkout'); return; }
    dispatch(checkoutRoom(room.id));
    toast.success('Checkout complete! Room moved to cleaning.');
    onBack();
  };

  return (
    <div className="max-w-4xl animate-slide-up">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to rooms
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
            <img src={room.image} alt="" className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Room {room.number}</h2>
                <span className={cn('px-3 py-1.5 rounded-xl text-xs font-medium capitalize', statusBadge[room.status])}>{room.status}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-5">{room.category} · {room.capacity} guests · ₹{room.price.toLocaleString()}/night</p>

              {booking && (
                <>
                  <div className="bg-muted/40 rounded-2xl p-4 mb-5">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-xs text-muted-foreground uppercase tracking-wider">Check-in</span><p className="font-semibold mt-0.5">{format(new Date(booking.checkIn), 'dd MMM yyyy, h:mm a')}</p></div>
                      <div><span className="text-xs text-muted-foreground uppercase tracking-wider">Check-out</span><p className="font-semibold mt-0.5">{format(new Date(booking.checkOut), 'dd MMM yyyy, h:mm a')}</p></div>
                    </div>
                  </div>

                  <h3 className="font-semibold mb-3">Guests ({booking.guests.length})</h3>
                  {booking.guests.map((g: Guest) => (
                    <div key={g.id} className="p-3 bg-muted/40 rounded-xl mb-2">
                      <p className="font-medium text-sm">{g.name}</p>
                      <p className="text-xs text-muted-foreground">{g.email} · {g.phone}{g.aadhaarNumber ? ` · Aadhaar: ${g.aadhaarNumber}` : ''}</p>
                    </div>
                  ))}

                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Services</h3>
                      <button onClick={() => setShowAddService(true)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all">
                        <Plus className="w-4 h-4" /> Add Service
                      </button>
                    </div>
                    {booking.services.map((s: BookingService) => (
                      <div key={s.id} className="flex justify-between p-2.5 text-sm bg-muted/30 rounded-lg mb-1"><span>{s.name} × {s.quantity}</span><span className="font-medium">₹{(s.price * s.quantity).toLocaleString()}</span></div>
                    ))}
                  </div>

                  {showAddService && (
                    <div className="border border-border/50 rounded-2xl p-4 mt-3 bg-muted/30 animate-scale-in">
                      <div className="grid grid-cols-2 gap-3">
                        <FormSelect label="Type" value={svcForm.type} onChange={(e: any) => { const t = e.target.value as BookingService['type']; const opt = serviceOptions.find(s => s.type === t); setSvcForm({...svcForm, type: t, name: opt?.name || '', price: String(opt?.defaultPrice || '') }); }}>
                          {serviceOptions.map(s => <option key={s.type} value={s.type}>{s.name}</option>)}
                        </FormSelect>
                        <FormInput label="Price (₹)" type="number" value={svcForm.price} onChange={(e: any) => setSvcForm({...svcForm, price: e.target.value})} />
                      </div>
                      <button onClick={handleAddServiceToRoom} className="mt-3 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple">Add</button>
                    </div>
                  )}

                  {/* Payment Section */}
                  <div className="mt-6 glass-card rounded-2xl border border-primary/20 p-5">
                    <h3 className="font-semibold mb-4">Payment</h3>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between"><span className="text-muted-foreground">Room Charges</span><span>₹{booking.roomCharges.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Services</span><span>₹{booking.serviceCharges.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">GST ({booking.gstPercent}%)</span><span>₹{booking.tax.toLocaleString()}</span></div>
                      <div className="border-t border-border pt-2 flex justify-between font-bold text-base"><span>Total</span><span>₹{booking.totalAmount.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Paid</span><span className="text-status-available font-medium">₹{booking.amountPaid.toLocaleString()}</span></div>
                      <div className="flex justify-between font-bold text-destructive"><span>Balance</span><span>₹{Math.max(0, booking.totalAmount - booking.amountPaid).toLocaleString()}</span></div>
                    </div>
                    {booking.paymentStatus !== 'paid' && (
                      <div className="flex gap-2">
                        <select value={payMethod} onChange={e => setPayMethod(e.target.value as any)} className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm"><option value="cash">Cash</option><option value="upi">UPI</option><option value="card">Card</option></select>
                        <input type="number" value={payAmt} onChange={e => setPayAmt(e.target.value)} placeholder="Amount" className="flex-1 rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
                        <button onClick={handlePayment} className="px-5 py-2.5 rounded-xl bg-status-available text-white text-sm font-medium hover:opacity-90 transition-all btn-ripple">Pay</button>
                      </div>
                    )}
                    <div className="mt-3">
                      <span className={cn('inline-block px-3 py-1.5 rounded-xl text-xs font-medium', booking.paymentStatus === 'paid' ? 'bg-status-available/10 text-status-available' : booking.paymentStatus === 'partial' ? 'bg-status-cleaning/10 text-status-cleaning' : 'bg-status-occupied/10 text-status-occupied')}>
                        {booking.paymentStatus === 'paid' ? '✓ Fully Paid' : booking.paymentStatus === 'partial' ? 'Partially Paid' : 'Payment Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold mb-1.5">Extend check-out</label>
                      <div className="flex gap-2">
                        <input type="datetime-local" value={extendDate} onChange={(e: any) => setExtendDate(e.target.value)} className="flex-1 rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
                        <button onClick={onExtend} className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-sm shadow-primary/20">Extend</button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleCheckout} className={cn('flex-1 py-3 rounded-xl text-sm font-semibold transition-all btn-ripple', booking.paymentStatus === 'paid' ? 'bg-status-available text-white hover:opacity-90 shadow-md shadow-status-available/20' : 'bg-muted text-muted-foreground cursor-not-allowed')}>Checkout</button>
                    <button onClick={() => { dispatch(cancelBooking(room.id)); toast.success('Booking cancelled'); onBack(); }} className="flex-1 py-3 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition-all btn-ripple">Cancel Booking</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {booking && (
          <div>
            <div className="glass-card rounded-2xl border border-primary/20 p-5 sticky top-20">
              <h4 className="font-semibold text-sm mb-4">Bill Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Room Charges</span><span>₹{booking.roomCharges.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Services</span><span>₹{booking.serviceCharges.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">GST ({booking.gstPercent}%)</span><span>₹{booking.tax.toLocaleString()}</span></div>
                <div className="border-t-2 border-primary/20 pt-3 flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary">₹{booking.totalAmount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Paid</span><span className="text-status-available font-medium">₹{booking.amountPaid.toLocaleString()}</span></div>
                <div className="flex justify-between font-semibold"><span>Due</span><span className="text-destructive">₹{Math.max(0, booking.totalAmount - booking.amountPaid).toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsPage;
