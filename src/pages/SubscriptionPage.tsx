import { useAppSelector } from '@/store';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ALL_FEATURE_PAGES } from '@/store/dummyData';

const SubscriptionPage = () => {
  const { plans } = useAppSelector(s => s.hotels);

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Subscription Plans</h1>
        <p className="text-muted-foreground text-sm">Choose a plan that fits your hotel</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, idx) => (
          <div key={plan.id} className={cn('glass-card rounded-2xl border-2 p-6 hover-lift animate-slide-up', plan.name === 'Professional' ? 'border-primary shadow-lg shadow-primary/10' : 'border-border/50')} style={{ animationDelay: `${idx * 80}ms` }}>
            {plan.name === 'Professional' && <span className="px-3 py-1 rounded-lg gradient-primary text-primary-foreground text-xs font-semibold mb-3 inline-block shadow-sm shadow-primary/20">Most Popular</span>}
            <h3 className="text-lg font-bold">{plan.name}</h3>
            <div className="flex items-baseline gap-1 my-4">
              <span className="text-3xl font-bold">₹{plan.price.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">/{plan.billing === 'monthly' ? 'mo' : 'yr'}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Up to {plan.maxRooms} rooms</p>
            <ul className="space-y-2 mb-6">
              {plan.featureAccess.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-status-available shrink-0" />
                  {ALL_FEATURE_PAGES.find(p => p.key === f)?.label || f}
                </li>
              ))}
            </ul>
            <button className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-md shadow-primary/20">
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;
