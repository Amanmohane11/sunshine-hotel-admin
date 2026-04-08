import { useAppSelector, useAppDispatch } from '@/store';
import { approveHotel, rejectHotel } from '@/store/hotelsSlice';
import { toast } from 'sonner';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

const SARequestsPage = () => {
  const dispatch = useAppDispatch();
  const { hotels } = useAppSelector(s => s.hotels);
  const pendingHotels = hotels.filter(h => h.status === 'pending');

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Requests</h1>
        <p className="text-muted-foreground text-sm">{pendingHotels.length} pending approval{pendingHotels.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="space-y-4">
        {pendingHotels.length === 0 && (
          <div className="glass-card rounded-2xl border border-border/50 p-12 text-center">
            <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No pending requests</p>
          </div>
        )}
        {pendingHotels.map((h, idx) => (
          <div key={h.id} className="glass-card rounded-2xl border border-border/50 p-5 hover-lift animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{h.name}</h3>
                <p className="text-sm text-muted-foreground">{h.location} · {h.owner} · {h.rooms} rooms</p>
                <p className="text-xs text-muted-foreground mt-1">Email: {h.email} · Applied: {format(new Date(h.createdAt), 'dd MMM yyyy')}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { dispatch(approveHotel(h.id)); toast.success('Hotel approved'); }} className="px-5 py-2.5 rounded-xl bg-status-available text-white text-sm font-medium hover:opacity-90 transition-all btn-ripple">Approve</button>
                <button onClick={() => { dispatch(rejectHotel(h.id)); toast.success('Hotel rejected'); }} className="px-5 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple">Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SARequestsPage;
