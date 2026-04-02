import { useState } from 'react';
import { useAppSelector } from '@/store';
import { format } from 'date-fns';
import { Users, Heart, DollarSign, CalendarDays, ArrowLeft, History, FileText, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

const GuestCRMPage = () => {
  const guests = useAppSelector(s => s.crm.guests);
  const history = useAppSelector(s => s.billing.history);
  const [selected, setSelected] = useState<string | null>(null);

  const selectedGuest = guests.find(g => g.id === selected);

  if (selectedGuest) {
    const guestBookings = history.filter(h => h.guestName === selectedGuest.name);
    return (
      <div className="animate-slide-up max-w-3xl">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to customers
        </button>
        <div className="glass-card rounded-2xl border border-border/50 p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{selectedGuest.name}</h2>
              <p className="text-sm text-muted-foreground">{selectedGuest.email} · {selectedGuest.phone}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-muted/40 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{selectedGuest.totalVisits}</p>
              <p className="text-xs text-muted-foreground">Visits</p>
            </div>
            <div className="bg-muted/40 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">₹{selectedGuest.totalSpend.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Spend</p>
            </div>
            <div className="bg-muted/40 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{format(new Date(selectedGuest.lastVisit), 'dd MMM')}</p>
              <p className="text-xs text-muted-foreground">Last Visit</p>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><Heart className="w-4 h-4 text-primary" /> Preferences</h3>
            <div className="flex flex-wrap gap-2">{selectedGuest.preferences.map(p => <span key={p} className="px-3 py-1 rounded-lg bg-primary/8 text-primary text-xs font-medium">{p}</span>)}</div>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="p-5 border-b border-border/50">
            <h3 className="font-semibold flex items-center gap-2"><History className="w-4 h-4" /> Booking History</h3>
          </div>
          {guestBookings.length > 0 ? guestBookings.map(b => (
            <div key={b.id} className="p-4 border-b border-border/30 last:border-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">Room {b.roomNumber}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(b.checkIn), 'dd MMM')} - {format(new Date(b.checkOut), 'dd MMM yyyy')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{b.totalBill.toLocaleString()}</p>
                  <span className={cn('text-xs font-medium', b.paymentStatus === 'paid' ? 'text-status-available' : 'text-status-occupied')}>{b.paymentStatus}</span>
                </div>
              </div>
            </div>
          )) : <p className="p-5 text-center text-muted-foreground text-sm">No booking history</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Customers</h1>
        <p className="text-muted-foreground text-sm">Guest profiles, history, and preferences</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {guests.map((guest, idx) => (
          <div key={guest.id} onClick={() => setSelected(guest.id)} className="glass-card hover-lift rounded-2xl border border-border/50 p-5 cursor-pointer animate-slide-up" style={{ animationDelay: `${idx * 40}ms` }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{guest.name}</p>
                <p className="text-xs text-muted-foreground">{guest.email}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-muted-foreground" /><span>{guest.totalVisits} visits · Last: {format(new Date(guest.lastVisit), 'dd MMM yyyy')}</span></div>
              <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-muted-foreground" /><span className="font-bold">₹{guest.totalSpend.toLocaleString()}</span> total spend</div>
              <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-muted-foreground" /><div className="flex flex-wrap gap-1">{guest.preferences.slice(0, 2).map(p => <span key={p} className="px-2 py-0.5 rounded-lg bg-primary/8 text-primary text-xs font-medium">{p}</span>)}{guest.preferences.length > 2 && <span className="text-xs text-muted-foreground">+{guest.preferences.length - 2}</span>}</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestCRMPage;
