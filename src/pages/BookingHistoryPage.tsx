import { useAppSelector } from '@/store';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useState } from 'react';

const BookingHistoryPage = () => {
  const history = useAppSelector(s => s.billing.history);
  const [search, setSearch] = useState('');

  const filtered = history.filter(b => b.guestName.toLowerCase().includes(search.toLowerCase()) || b.roomNumber.includes(search));

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Booking History</h1>
          <p className="text-muted-foreground text-sm">{history.length} total bookings</p>
        </div>
        <div className="flex items-center bg-muted/60 rounded-xl px-4 py-2.5 w-64 border border-border/50 focus-within:border-primary/40 transition-all">
          <Search className="w-4 h-4 text-muted-foreground mr-2" />
          <input type="text" placeholder="Search guest or room..." className="bg-transparent outline-none text-sm w-full" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 text-left">
              <th className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">Guest</th>
              <th className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">Room</th>
              <th className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">Check-in</th>
              <th className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">Check-out</th>
              <th className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">Services</th>
              <th className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">Total</th>
              <th className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">Payment</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3.5 font-semibold">{b.guestName}</td>
                <td className="px-5 py-3.5">Room {b.roomNumber}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{format(new Date(b.checkIn), 'dd MMM yyyy')}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{format(new Date(b.checkOut), 'dd MMM yyyy')}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{b.services.length > 0 ? b.services.map(s => s.name).join(', ') : '—'}</td>
                <td className="px-5 py-3.5 font-bold">₹{b.totalBill.toLocaleString()}</td>
                <td className="px-5 py-3.5">
                  <span className={cn('px-2.5 py-1 rounded-lg text-xs font-medium capitalize', b.paymentStatus === 'paid' ? 'bg-status-available/10 text-status-available' : b.paymentStatus === 'partial' ? 'bg-status-cleaning/10 text-status-cleaning' : 'bg-status-occupied/10 text-status-occupied')}>
                    {b.paymentStatus} {b.paymentMethod ? `(${b.paymentMethod})` : ''}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">No bookings found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingHistoryPage;
