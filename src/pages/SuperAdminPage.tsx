import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { approveHotel, rejectHotel, respondToQuery } from '@/store/hotelsSlice';
import { toast } from 'sonner';
import { Building2, TrendingUp, CheckCircle, XCircle, Clock, MessageSquare, CreditCard, BarChart3, Users, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { superAdminMonthlyEarnings } from '@/store/dummyData';

type Tab = 'dashboard' | 'hotels' | 'requests' | 'queries' | 'subscriptions';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

const SuperAdminPage = () => {
  const dispatch = useAppDispatch();
  const { hotels, plans, queries } = useAppSelector(s => s.hotels);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [queryResponse, setQueryResponse] = useState<Record<string, string>>({});

  const activeHotels = hotels.filter(h => h.status === 'active');
  const inactiveHotels = hotels.filter(h => h.status === 'inactive');
  const pendingHotels = hotels.filter(h => h.status === 'pending');
  const totalRevenue = hotels.reduce((s, h) => s + h.revenue, 0);

  const activeSubscriptions = hotels.filter(h => h.status === 'active' && h.subscriptionEnd && new Date(h.subscriptionEnd).getTime() > Date.now());
  const expiredSubscriptions = hotels.filter(h => h.subscriptionEnd && new Date(h.subscriptionEnd).getTime() < Date.now());
  const expiringSoon = hotels.filter(h => {
    if (!h.subscriptionEnd) return false;
    const diff = new Date(h.subscriptionEnd).getTime() - Date.now();
    return diff > 0 && diff < 86400000 * 3;
  });

  const statusData = [
    { name: 'Active', value: activeHotels.length },
    { name: 'Inactive', value: inactiveHotels.length },
    { name: 'Pending', value: pendingHotels.length },
  ];

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { key: 'hotels', label: 'Hotels', icon: Building2 },
    { key: 'requests', label: `Requests (${pendingHotels.length})`, icon: Clock },
    { key: 'queries', label: `Queries (${queries.filter(q => q.status === 'open').length})`, icon: MessageSquare },
    { key: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
  ];

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Super Admin Panel</h1>
        <p className="text-muted-foreground text-sm">Manage hotels, subscriptions, and system-wide settings</p>
      </div>

      <div className="flex gap-1 mb-8 bg-muted/60 rounded-xl p-1 w-fit flex-wrap">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200', tab === t.key ? 'gradient-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* DASHBOARD */}
      {tab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Hotels', value: hotels.length, icon: Building2, color: 'text-status-blue', gradient: 'from-blue-500/10 to-blue-600/5' },
              { label: 'Active', value: activeHotels.length, icon: CheckCircle, color: 'text-status-available', gradient: 'from-emerald-500/10 to-emerald-600/5' },
              { label: 'Pending', value: pendingHotels.length, icon: Clock, color: 'text-status-cleaning', gradient: 'from-amber-500/10 to-amber-600/5' },
              { label: 'Revenue', value: `₹${(totalRevenue / 100000).toFixed(1)}L`, icon: TrendingUp, color: 'text-primary', gradient: 'from-amber-500/10 to-amber-600/5' },
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl border border-border/50 p-5">
              <h3 className="font-semibold mb-4">Monthly Earnings</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={superAdminMonthlyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Earnings']} />
                  <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card rounded-2xl border border-border/50 p-5">
              <h3 className="font-semibold mb-4">Monthly Registrations</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={superAdminMonthlyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Line type="monotone" dataKey="hotels" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ fill: 'hsl(var(--chart-2))' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-border/50 p-5">
            <h3 className="font-semibold mb-4">Hotel Status Distribution</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width={300} height={200}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                    {statusData.map((_, idx) => <Cell key={idx} fill={COLORS[idx]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 ml-4">
                {statusData.map((d, idx) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                    <span>{d.name}: {d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HOTELS */}
      {tab === 'hotels' && (
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
      )}

      {/* REQUESTS */}
      {tab === 'requests' && (
        <div className="space-y-4">
          {pendingHotels.length === 0 && <div className="glass-card rounded-2xl border border-border/50 p-12 text-center"><Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">No pending requests</p></div>}
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
      )}

      {/* QUERIES */}
      {tab === 'queries' && (
        <div className="space-y-4">
          {queries.length === 0 && <div className="glass-card rounded-2xl border border-border/50 p-12 text-center"><MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">No queries at the moment</p></div>}
          {queries.map((q, idx) => (
            <div key={q.id} className="glass-card rounded-2xl border border-border/50 p-5 animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{q.subject}</h3>
                    <span className={cn('px-2 py-0.5 rounded-lg text-xs font-medium', q.status === 'open' ? 'bg-status-cleaning/10 text-status-cleaning' : 'bg-status-available/10 text-status-available')}>{q.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{q.hotelName} · {format(new Date(q.createdAt), 'dd MMM yyyy')}</p>
                  <p className="text-sm text-muted-foreground">{q.message}</p>
                  {q.response && <div className="mt-3 p-3 bg-status-available/5 rounded-xl border border-status-available/20"><p className="text-xs font-semibold text-status-available mb-1">Response:</p><p className="text-sm">{q.response}</p></div>}
                </div>
                {q.status === 'open' && (
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <textarea value={queryResponse[q.id] || ''} onChange={e => setQueryResponse({...queryResponse, [q.id]: e.target.value})} placeholder="Type response..." className="rounded-xl border border-input bg-background px-3 py-2 text-xs resize-none h-16" />
                    <button onClick={() => { if (queryResponse[q.id]) { dispatch(respondToQuery({ queryId: q.id, response: queryResponse[q.id] })); toast.success('Response sent'); setQueryResponse({...queryResponse, [q.id]: ''}); } else { toast.error('Enter a response'); } }} className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all btn-ripple">Respond</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBSCRIPTIONS */}
      {tab === 'subscriptions' && (
        <div className="space-y-8">
          {/* Expiring Soon Alert */}
          {expiringSoon.length > 0 && (
            <div className="glass-card rounded-2xl border border-status-cleaning/30 p-4 flex items-start gap-3 animate-scale-in">
              <AlertTriangle className="w-5 h-5 text-status-cleaning shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Expiring in 3 days</p>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {expiringSoon.map(h => <span key={h.id} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-status-cleaning/10 text-status-cleaning">{h.name} - {h.email}</span>)}
                </div>
              </div>
            </div>
          )}

          {/* Active Subscriptions */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-status-available" /> Active Subscriptions</h2>
            <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 text-left">
                  {['Hotel', 'Plan', 'Start', 'End', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {activeSubscriptions.map(h => (
                    <tr key={h.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5 font-semibold">{h.name}</td>
                      <td className="px-5 py-3.5 capitalize">{h.subscription}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{h.subscriptionStart ? format(new Date(h.subscriptionStart), 'dd MMM yy') : '—'}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{h.subscriptionEnd ? format(new Date(h.subscriptionEnd), 'dd MMM yy') : '—'}</td>
                      <td className="px-5 py-3.5"><span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-status-available/10 text-status-available">Active</span></td>
                    </tr>
                  ))}
                  {activeSubscriptions.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">No active subscriptions</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expired Subscriptions */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><XCircle className="w-5 h-5 text-status-occupied" /> Expired / Not Renewed</h2>
            <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 text-left">
                  {['Hotel', 'Owner', 'Email', 'Expired On', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {expiredSubscriptions.map(h => (
                    <tr key={h.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors bg-status-occupied/5">
                      <td className="px-5 py-3.5 font-semibold">{h.name}</td>
                      <td className="px-5 py-3.5">{h.owner}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{h.email}</td>
                      <td className="px-5 py-3.5 text-status-occupied font-medium">{h.subscriptionEnd ? format(new Date(h.subscriptionEnd), 'dd MMM yy') : '—'}</td>
                      <td className="px-5 py-3.5"><span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-status-occupied/10 text-status-occupied">Expired</span></td>
                    </tr>
                  ))}
                  {expiredSubscriptions.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">No expired subscriptions</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* Plans */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Subscription Plans</h2>
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
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPage;
