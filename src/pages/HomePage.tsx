import { useAppSelector } from '@/store';
import { BedDouble, CheckCircle, XCircle, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const rooms = useAppSelector(state => state.rooms.rooms);
  const navigate = useNavigate();
  const total = rooms.length;
  const available = rooms.filter(r => r.status === 'available').length;
  const occupied = rooms.filter(r => r.status === 'occupied').length;
  const cleaning = rooms.filter(r => r.status === 'cleaning').length;

  const recentBookings = rooms
    .filter(r => r.currentBooking)
    .map(r => ({ room: r.number, ...r.currentBooking! }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const stats = [
    { label: 'Total Rooms', value: total, icon: BedDouble, gradient: 'from-blue-500/10 to-blue-600/5', iconColor: 'text-status-blue', borderColor: 'border-status-blue/20' },
    { label: 'Available', value: available, icon: CheckCircle, gradient: 'from-emerald-500/10 to-emerald-600/5', iconColor: 'text-status-available', borderColor: 'border-status-available/20' },
    { label: 'Occupied', value: occupied, icon: XCircle, gradient: 'from-rose-500/10 to-rose-600/5', iconColor: 'text-status-occupied', borderColor: 'border-status-occupied/20' },
    { label: 'Cleaning', value: cleaning, icon: Sparkles, gradient: 'from-amber-500/10 to-amber-600/5', iconColor: 'text-status-cleaning', borderColor: 'border-status-cleaning/20' },
  ];

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Welcome back, Admin 👋</h1>
        <p className="text-muted-foreground text-sm">Here's what's happening at your hotel today.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, gradient, iconColor, borderColor }, idx) => (
          <div key={label} className={`glass-card hover-lift rounded-2xl p-5 border ${borderColor} animate-slide-up`} style={{ animationDelay: `${idx * 60}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
            </div>
            <span className="text-3xl font-bold">{value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Manage Rooms', desc: 'View & book rooms', to: '/rooms', color: 'from-primary/15 to-primary/5' },
          { label: 'View Dashboard', desc: 'Analytics & KPIs', to: '/dashboard', color: 'from-status-blue/15 to-status-blue/5' },
          { label: 'Staff Management', desc: 'Shifts & tasks', to: '/staff', color: 'from-status-available/15 to-status-available/5' },
        ].map((action, idx) => (
          <button key={action.to} onClick={() => navigate(action.to)}
            className="glass-card hover-lift rounded-2xl p-5 text-left group border border-border/50 animate-slide-up"
            style={{ animationDelay: `${(idx + 4) * 60}ms` }}>
            <div className={`w-full h-1.5 rounded-full bg-gradient-to-r ${action.color} mb-4`} />
            <p className="font-semibold text-sm mb-1">{action.label}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{action.desc}</p>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        ))}
      </div>

      <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
        <div className="p-5 border-b border-border/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Recent Bookings</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Latest guest check-ins</p>
          </div>
          <button onClick={() => navigate('/booking-history')} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left">
                <th className="px-5 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Room</th>
                <th className="px-5 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Guest</th>
                <th className="px-5 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Check-in</th>
                <th className="px-5 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Check-out</th>
                <th className="px-5 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(b => (
                <tr key={b.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-semibold">Room {b.roomId.replace('room-', '')}</td>
                  <td className="px-5 py-3.5">{b.guests[0]?.name || '—'}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{format(new Date(b.checkIn), 'dd MMM, h:mm a')}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{format(new Date(b.checkOut), 'dd MMM, h:mm a')}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-status-available/10 text-status-available">{b.status}</span>
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">No recent bookings</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
