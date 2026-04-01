import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { approveHotel, rejectHotel } from '@/store/hotelsSlice';
import { toast } from 'sonner';
import { Building2, TrendingUp, CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type Tab = 'dashboard' | 'hotels' | 'requests' | 'subscriptions';

const SuperAdminPage = () => {
  const dispatch = useAppDispatch();
  const { hotels, plans } = useAppSelector(s => s.hotels);
  const [tab, setTab] = useState<Tab>('dashboard');

  const activeHotels = hotels.filter(h => h.status === 'active').length;
  const inactiveHotels = hotels.filter(h => h.status === 'inactive').length;
  const pendingHotels = hotels.filter(h => h.status === 'pending');
  const totalRevenue = hotels.reduce((s, h) => s + h.revenue, 0);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'hotels', label: 'Hotels' },
    { key: 'requests', label: `Requests (${pendingHotels.length})` },
    { key: 'subscriptions', label: 'Subscriptions' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Super Admin Panel</h1>

      <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1 w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={cn('px-4 py-2 rounded-md text-sm font-medium transition-all', tab === t.key ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-xl p-5 border border-border shadow-sm"><div className="flex items-center gap-3 mb-2"><Building2 className="w-5 h-5 text-status-blue" /><span className="text-sm text-muted-foreground">Total Hotels</span></div><span className="text-2xl font-bold">{hotels.length}</span></div>
            <div className="bg-card rounded-xl p-5 border border-border shadow-sm"><div className="flex items-center gap-3 mb-2"><CheckCircle className="w-5 h-5 text-status-available" /><span className="text-sm text-muted-foreground">Active</span></div><span className="text-2xl font-bold">{activeHotels}</span></div>
            <div className="bg-card rounded-xl p-5 border border-border shadow-sm"><div className="flex items-center gap-3 mb-2"><XCircle className="w-5 h-5 text-status-occupied" /><span className="text-sm text-muted-foreground">Inactive</span></div><span className="text-2xl font-bold">{inactiveHotels}</span></div>
            <div className="bg-card rounded-xl p-5 border border-border shadow-sm"><div className="flex items-center gap-3 mb-2"><TrendingUp className="w-5 h-5 text-primary" /><span className="text-sm text-muted-foreground">Total Revenue</span></div><span className="text-2xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</span></div>
          </div>
        </>
      )}

      {tab === 'hotels' && (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left"><th className="px-5 py-3 text-muted-foreground font-medium">Hotel</th><th className="px-5 py-3 text-muted-foreground font-medium">Location</th><th className="px-5 py-3 text-muted-foreground font-medium">Owner</th><th className="px-5 py-3 text-muted-foreground font-medium">Rooms</th><th className="px-5 py-3 text-muted-foreground font-medium">Subscription</th><th className="px-5 py-3 text-muted-foreground font-medium">Revenue</th><th className="px-5 py-3 text-muted-foreground font-medium">Status</th></tr></thead>
            <tbody>
              {hotels.map(h => (
                <tr key={h.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3 font-medium">{h.name}</td>
                  <td className="px-5 py-3">{h.location}</td>
                  <td className="px-5 py-3">{h.owner}</td>
                  <td className="px-5 py-3">{h.rooms}</td>
                  <td className="px-5 py-3 capitalize">{h.subscription}</td>
                  <td className="px-5 py-3">₹{h.revenue.toLocaleString()}</td>
                  <td className="px-5 py-3"><span className={cn('px-2.5 py-1 rounded-full text-xs font-medium capitalize', h.status === 'active' ? 'bg-status-available/15 text-status-available' : h.status === 'pending' ? 'bg-status-cleaning/15 text-status-cleaning' : 'bg-status-occupied/15 text-status-occupied')}>{h.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'requests' && (
        <div className="space-y-4">
          {pendingHotels.length === 0 && <p className="text-center text-muted-foreground py-8">No pending requests</p>}
          {pendingHotels.map(h => (
            <div key={h.id} className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{h.name}</h3>
                  <p className="text-sm text-muted-foreground">{h.location} · {h.owner} · {h.rooms} rooms</p>
                  <p className="text-xs text-muted-foreground mt-1">Applied: {format(new Date(h.createdAt), 'dd MMM yyyy')}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { dispatch(approveHotel(h.id)); toast.success('Hotel approved'); }} className="px-4 py-2 rounded-lg bg-status-available text-white text-sm font-medium hover:opacity-90 transition-opacity">Approve</button>
                  <button onClick={() => { dispatch(rejectHotel(h.id)); toast.success('Hotel rejected'); }} className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-opacity">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'subscriptions' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className={cn('bg-card rounded-xl border-2 p-6 shadow-sm hover:shadow-md transition-shadow', plan.name === 'Professional' ? 'border-primary' : 'border-border')}>
              {plan.name === 'Professional' && <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium mb-3 inline-block">Popular</span>}
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <div className="flex items-baseline gap-1 my-3"><span className="text-3xl font-bold">₹{plan.price.toLocaleString()}</span><span className="text-sm text-muted-foreground">/{plan.billing === 'monthly' ? 'mo' : 'yr'}</span></div>
              <p className="text-sm text-muted-foreground mb-4">Up to {plan.maxRooms} rooms</p>
              <ul className="space-y-2">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-status-available" />{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuperAdminPage;
