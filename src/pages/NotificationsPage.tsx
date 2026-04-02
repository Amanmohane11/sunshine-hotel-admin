import { useAppSelector, useAppDispatch } from '@/store';
import { markRead, markAllRead } from '@/store/notificationsSlice';
import { Bell, CheckCheck, BedDouble, Calendar, Sparkles, CreditCard, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const typeIcons: Record<string, any> = {
  checkout: BedDouble, booking: Calendar, cleaning: Sparkles, payment: CreditCard, low_stock: AlertTriangle, general: Info,
};

const typeColors: Record<string, string> = {
  checkout: 'bg-status-occupied/10 text-status-occupied',
  booking: 'bg-status-blue/10 text-status-blue',
  cleaning: 'bg-status-cleaning/10 text-status-cleaning',
  payment: 'bg-status-available/10 text-status-available',
  low_stock: 'bg-status-cleaning/10 text-status-cleaning',
  general: 'bg-muted text-muted-foreground',
};

const NotificationsPage = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(s => s.notifications.items);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="animate-slide-up max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Notifications</h1>
          <p className="text-muted-foreground text-sm">{unread > 0 ? `${unread} unread notifications` : 'All caught up!'}</p>
        </div>
        {unread > 0 && (
          <button onClick={() => dispatch(markAllRead())} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>
      <div className="space-y-2">
        {notifications.map((n, idx) => {
          const Icon = typeIcons[n.type] || Bell;
          return (
            <div key={n.id}
              onClick={() => !n.read && dispatch(markRead(n.id))}
              className={cn('glass-card rounded-2xl border p-4 flex items-start gap-4 cursor-pointer hover-lift animate-slide-up', !n.read ? 'border-primary/30 bg-primary/3' : 'border-border/50')}
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', typeColors[n.type])}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{n.title}</p>
                  {!n.read && <div className="w-2 h-2 rounded-full gradient-primary shadow-sm shadow-primary/30" />}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1.5">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPage;
