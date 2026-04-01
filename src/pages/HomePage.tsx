import { useAppSelector } from '@/store';
import { BedDouble, CheckCircle, XCircle, Sparkles, CalendarClock } from 'lucide-react';
import { format } from 'date-fns';

const HomePage = () => {
  const rooms = useAppSelector(state => state.rooms.rooms);
  const total = rooms.length;
  const available = rooms.filter(r => r.status === 'available').length;
  const occupied = rooms.filter(r => r.status === 'occupied').length;
  const cleaning = rooms.filter(r => r.status === 'cleaning').length;
  const reserved = rooms.filter(r => r.status === 'reserved').length;

  const recentBookings = rooms
    .filter(r => r.currentBooking)
    .map(r => ({ room: r.number, ...r.currentBooking! }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const stats = [
    { label: 'Total Rooms', value: total, icon: BedDouble, color: 'bg-status-blue', textColor: 'text-status-blue' },
    { label: 'Available', value: available, icon: CheckCircle, color: 'bg-status-available', textColor: 'text-status-available' },
    { label: 'Occupied', value: occupied, icon: XCircle, color: 'bg-status-occupied', textColor: 'text-status-occupied' },
    { label: 'Cleaning', value: cleaning, icon: Sparkles, color: 'bg-status-cleaning', textColor: 'text-status-cleaning' },
    { label: 'Reserved', value: reserved, icon: CalendarClock, color: 'bg-status-blue', textColor: 'text-status-blue' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome back, Admin 👋</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, textColor }) => (
          <div key={label} className="bg-card rounded-xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground font-medium">{label}</span>
              <div className={`w-10 h-10 rounded-lg ${color}/15 flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${textColor}`} />
              </div>
            </div>
            <span className="text-3xl font-bold">{value}</span>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-semibold">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-muted-foreground font-medium">Room</th>
                <th className="px-5 py-3 text-muted-foreground font-medium">Guest</th>
                <th className="px-5 py-3 text-muted-foreground font-medium">Check-in</th>
                <th className="px-5 py-3 text-muted-foreground font-medium">Check-out</th>
                <th className="px-5 py-3 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(b => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3 font-medium">Room {b.roomId.replace('room-', '')}</td>
                  <td className="px-5 py-3">{b.guests[0]?.name || '—'}</td>
                  <td className="px-5 py-3">{format(new Date(b.checkIn), 'dd MMM, h:mm a')}</td>
                  <td className="px-5 py-3">{format(new Date(b.checkOut), 'dd MMM, h:mm a')}</td>
                  <td className="px-5 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-status-available/15 text-status-available">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">No recent bookings</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
