import { useAppSelector } from '@/store';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const SASubscriptionsPage = () => {
  const { hotels, plans } = useAppSelector(s => s.hotels);

  const activeSubscriptions = hotels.filter(h => h.status === 'active' && h.subscriptionEnd && new Date(h.subscriptionEnd).getTime() > Date.now());
  const expiredSubscriptions = hotels.filter(h => h.subscriptionEnd && new Date(h.subscriptionEnd).getTime() < Date.now());
  const expiringSoon = hotels.filter(h => {
    if (!h.subscriptionEnd) return false;
    const diff = new Date(h.subscriptionEnd).getTime() - Date.now();
    return diff > 0 && diff < 86400000 * 3;
  });

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Subscriptions</h1>
        <p className="text-muted-foreground text-sm">Manage hotel subscription plans</p>
      </div>

      <div className="space-y-8">
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
    </div>
  );
};

export default SASubscriptionsPage;
