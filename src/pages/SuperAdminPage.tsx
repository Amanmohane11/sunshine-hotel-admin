import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { approveHotel, rejectHotel } from '@/store/hotelsSlice';
import { toast } from 'sonner';
import { Building2, TrendingUp, CheckCircle, XCircle, Clock, MessageSquare, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type Tab = 'dashboard' | 'hotels' | 'requests' | 'queries' | 'subscriptions';

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
    { key: 'queries', label: 'Queries' },
    { key: 'subscriptions', label: 'Subscriptions' },
  ];

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Super Admin Panel</h1>
        <p className="text-muted-foreground text-sm">Manage hotels, subscriptions, and system-wide settings</p>
      </div>

      <div className="flex gap-1 mb-8 bg-muted/60 rounded-xl p-1 w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200', tab === t.key ? 'gradient-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Hotels', value: hotels.length, icon: Building2, color: 'text-status-blue', gradient: 'from-blue-500/10 to-blue-600/5' },
            { label: 'Active', value: activeHotels, icon: CheckCircle, color: 'text-status-available', gradient: 'from-emerald-500/10 to-emerald-600/5' },
            { label: 'Inactive', value: inactiveHotels, icon: XCircle, color: 'text-status-occupied', gradient: 'from-rose-500/10 to-rose-600/5' },
            { label: 'Total Revenue', value: `₹${(totalRevenue / 100000).toFixed(1)}L`, icon: TrendingUp, color: 'text-primary', gradient: 'from-amber-500/10 to-amber-600/5' },
          ].map(({ label, value, icon: Icon, color, gradient }, idx) => (
            <div key={label} className="glass-card hover-lift rounded-2xl border border-border/50 p-5 animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
              </div>
              <span className="text-2xl font-bold">{value}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'hotels' && (
        <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border/50 text-left">
              {['Hotel', 'Location', 'Owner', 'Rooms', 'Subscription', 'Revenue', 'Status'].map(h => (
                <th key={h} className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {hotels.map(h => (
                <tr key={h.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-semibold">{h.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{h.location}</td>
                  <td className="px-5 py-3.5">{h.owner}</td>
                  <td className="px-5 py-3.5">{h.rooms}</td>
                  <td className="px-5 py-3.5 capitalize">{h.subscription}</td>
                  <td className="px-5 py-3.5 font-medium">₹{h.revenue.toLocaleString()}</td>
                  <td className="px-5 py-3.5"><span className={cn('px-2.5 py-1 rounded-lg text-xs font-medium capitalize', h.status === 'active' ? 'bg-status-available/10 text-status-available' : h.status === 'pending' ? 'bg-status-cleaning/10 text-status-cleaning' : 'bg-status-occupied/10 text-status-occupied')}>{h.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'requests' && (
        <div className="space-y-4">
          {pendingHotels.length === 0 && <div className="glass-card rounded-2xl border border-border/50 p-12 text-center"><p className="text-muted-foreground">No pending requests</p></div>}
          {pendingHotels.map((h, idx) => (
            <div key={h.id} className="glass-card rounded-2xl border border-border/50 p-5 hover-lift animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{h.name}</h3>
                  <p className="text-sm text-muted-foreground">{h.location} · {h.owner} · {h.rooms} rooms</p>
                  <p className="text-xs text-muted-foreground mt-1">Applied: {format(new Date(h.createdAt), 'dd MMM yyyy')}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { dispatch(approveHotel(h.id)); toast.success('Hotel approved'); }} className="px-5 py-2.5 rounded-xl bg-status-available text-white text-sm font-medium hover:opacity-90 transition-all btn-ripple">Approve</button>
                  <button onClick={() => { dispatch(rejectHotel(h.id)); toast.success('Hotel rejected'); }} className="px-5 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'queries' && (
        <div className="glass-card rounded-2xl border border-border/50 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No queries at the moment</p>
          <p className="text-xs text-muted-foreground mt-1">Hotel queries and issues will appear here</p>
        </div>
      )}

      {tab === 'subscriptions' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {plans.map((plan, idx) => (
            <div key={plan.id} className={cn('glass-card rounded-2xl border-2 p-6 hover-lift animate-slide-up', plan.name === 'Professional' ? 'border-primary shadow-lg shadow-primary/10' : 'border-border/50')} style={{ animationDelay: `${idx * 80}ms` }}>
              {plan.name === 'Professional' && <span className="px-3 py-1 rounded-lg gradient-primary text-primary-foreground text-xs font-semibold mb-3 inline-block shadow-sm shadow-primary/20">Most Popular</span>}
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <div className="flex items-baseline gap-1 my-4"><span className="text-3xl font-bold">₹{plan.price.toLocaleString()}</span><span className="text-sm text-muted-foreground">/{plan.billing === 'monthly' ? 'mo' : 'yr'}</span></div>
              <p className="text-sm text-muted-foreground mb-5">Up to {plan.maxRooms} rooms</p>
              <ul className="space-y-2.5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-status-available shrink-0" />{f}</li>
                ))}
              </ul>
              <button className={cn('w-full mt-6 py-3 rounded-xl text-sm font-semibold transition-all btn-ripple', plan.name === 'Professional' ? 'gradient-primary text-primary-foreground shadow-md shadow-primary/20' : 'border border-border hover:bg-muted')}>
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuperAdminPage;
