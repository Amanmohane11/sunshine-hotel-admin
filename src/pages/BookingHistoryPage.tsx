import { useAppSelector } from '@/store';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const BookingHistoryPage = () => {
  const history = useAppSelector(s => s.billing.history);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Booking History</h1>
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-5 py-3 text-muted-foreground font-medium">Guest</th>
              <th className="px-5 py-3 text-muted-foreground font-medium">Room</th>
              <th className="px-5 py-3 text-muted-foreground font-medium">Check-in</th>
              <th className="px-5 py-3 text-muted-foreground font-medium">Check-out</th>
              <th className="px-5 py-3 text-muted-foreground font-medium">Services</th>
              <th className="px-5 py-3 text-muted-foreground font-medium">Total Bill</th>
              <th className="px-5 py-3 text-muted-foreground font-medium">Payment</th>
            </tr>
          </thead>
          <tbody>
            {history.map(b => (
              <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-5 py-3 font-medium">{b.guestName}</td>
                <td className="px-5 py-3">Room {b.roomNumber}</td>
                <td className="px-5 py-3">{format(new Date(b.checkIn), 'dd MMM yyyy')}</td>
                <td className="px-5 py-3">{format(new Date(b.checkOut), 'dd MMM yyyy')}</td>
                <td className="px-5 py-3">{b.services.length > 0 ? b.services.map(s => s.name).join(', ') : '—'}</td>
                <td className="px-5 py-3 font-semibold">₹{b.totalBill.toLocaleString()}</td>
                <td className="px-5 py-3">
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', b.paymentStatus === 'paid' ? 'bg-status-available/15 text-status-available' : b.paymentStatus === 'partial' ? 'bg-status-cleaning/15 text-status-cleaning' : 'bg-status-occupied/15 text-status-occupied')}>
                    {b.paymentStatus} {b.paymentMethod ? `(${b.paymentMethod})` : ''}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingHistoryPage;
