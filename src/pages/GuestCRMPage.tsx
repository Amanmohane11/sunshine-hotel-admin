import { useAppSelector } from '@/store';
import { format } from 'date-fns';
import { Users, Heart, DollarSign, CalendarDays } from 'lucide-react';

const GuestCRMPage = () => {
  const guests = useAppSelector(s => s.crm.guests);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Guest CRM</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {guests.map(guest => (
          <div key={guest.id} className="bg-card rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{guest.name}</p>
                <p className="text-xs text-muted-foreground">{guest.email}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-muted-foreground" /><span>{guest.totalVisits} visits · Last: {format(new Date(guest.lastVisit), 'dd MMM yyyy')}</span></div>
              <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-muted-foreground" /><span className="font-semibold">₹{guest.totalSpend.toLocaleString()}</span> total spend</div>
              <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-muted-foreground" /><div className="flex flex-wrap gap-1">{guest.preferences.map(p => <span key={p} className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs">{p}</span>)}</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestCRMPage;
