import { useAppSelector, useAppDispatch } from '@/store';
import { markRead, markAllRead } from '@/store/notificationsSlice';
import { Bell, CheckCheck, BedDouble, Calendar, Sparkles, CreditCard, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const typeIcons: Record<string, any> = {
  checkout: BedDouble,
  booking: Calendar,
  cleaning: Sparkles,
  payment: CreditCard,
  low_stock: AlertTriangle,
  general: Info,
};

const typeColors: Record<string, string> = {
  checkout: 'bg-status-occupied/15 text-status-occupied',
  booking: 'bg-status-blue/15 text-status-blue',
  cleaning: 'bg-status-cleaning/15 text-status-cleaning',
  payment: 'bg-status-available/15 text-status-available',
  low_stock: 'bg-status-cleaning/15 text-status-cleaning',
  general: 'bg-muted text-muted-foreground',
};

const NotificationsPage = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(s => s.notifications.items);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unread > 0 && <span className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">{unread}</span>}
        </div>
        {unread > 0 && (
          <button onClick={() => dispatch(markAllRead())} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>
      <div className="space-y-2">
        {notifications.map(n => {
          const Icon = typeIcons[n.type] || Bell;
          return (
            <div
              key={n.id}
              onClick={() => !n.read && dispatch(markRead(n.id))}
              className={cn('bg-card rounded-xl border border-border p-4 flex items-start gap-4 cursor-pointer hover:shadow-md transition-all', !n.read && 'border-primary/30 bg-primary/5')}
            >
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', typeColors[n.type])}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{n.title}</p>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPage;
