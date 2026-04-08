import { useAppSelector } from '@/store';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const SAHotelsPage = () => {
  const { hotels } = useAppSelector(s => s.hotels);

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Hotels</h1>
        <p className="text-muted-foreground text-sm">{hotels.length} hotels registered</p>
      </div>

      <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border/50 text-left">
            {['Hotel', 'Location', 'Owner', 'Rooms', 'Subscription', 'Expires', 'Revenue', 'Status'].map(h => (
              <th key={h} className="px-4 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {hotels.map(h => (
              <tr key={h.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3.5 font-semibold">{h.name}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{h.location}</td>
                <td className="px-4 py-3.5">{h.owner}</td>
                <td className="px-4 py-3.5">{h.rooms}</td>
                <td className="px-4 py-3.5 capitalize">{h.subscription}</td>
                <td className="px-4 py-3.5 text-xs">{h.subscriptionEnd ? format(new Date(h.subscriptionEnd), 'dd MMM yy') : '—'}</td>
                <td className="px-4 py-3.5 font-medium">₹{h.revenue.toLocaleString()}</td>
                <td className="px-4 py-3.5"><span className={cn('px-2.5 py-1 rounded-lg text-xs font-medium capitalize', h.status === 'active' ? 'bg-status-available/10 text-status-available' : h.status === 'pending' ? 'bg-status-cleaning/10 text-status-cleaning' : 'bg-status-occupied/10 text-status-occupied')}>{h.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SAHotelsPage;
