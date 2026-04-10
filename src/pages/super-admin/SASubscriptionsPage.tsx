import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { addPlan, updatePlan, deletePlan } from '@/store/hotelsSlice';
import { CheckCircle, XCircle, AlertTriangle, Plus, Edit2, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { FeaturePage, ALL_FEATURE_PAGES, SubscriptionPlan } from '@/store/dummyData';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const emptyPlan = { name: '', price: '', billing: 'monthly' as 'monthly' | 'yearly', featureAccess: [] as FeaturePage[], maxRooms: 20 };

const SASubscriptionsPage = () => {
  const dispatch = useAppDispatch();
  const { hotels, plans } = useAppSelector(s => s.hotels);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyPlan);

  const activeSubscriptions = hotels.filter(h => h.status === 'active' && h.subscriptionActive);
  const expiredSubscriptions = hotels.filter(h => !h.subscriptionActive || (h.subscriptionEnd && new Date(h.subscriptionEnd).getTime() < Date.now()));
  const expiringSoon = hotels.filter(h => {
    if (!h.subscriptionEnd) return false;
    const diff = new Date(h.subscriptionEnd).getTime() - Date.now();
    return diff > 0 && diff < 86400000 * 3;
  });

  const toggleFeature = (key: FeaturePage) => {
    setForm(f => ({ ...f, featureAccess: f.featureAccess.includes(key) ? f.featureAccess.filter(k => k !== key) : [...f.featureAccess, key] }));
  };

  const handleSave = () => {
    if (!form.name || !form.price || form.featureAccess.length === 0) {
      toast.error('Fill name, price, and select features');
      return;
    }
    const planData = {
      name: form.name,
      price: parseInt(form.price as string),
      billing: form.billing,
      features: form.featureAccess.map(f => ALL_FEATURE_PAGES.find(p => p.key === f)?.label || f),
      featureAccess: form.featureAccess,
      maxRooms: form.maxRooms,
    };
    if (editId) {
      dispatch(updatePlan({ id: editId, ...planData }));
      toast.success('Plan updated');
    } else {
      dispatch(addPlan({ id: `plan-${Date.now()}`, ...planData }));
      toast.success('Plan added');
    }
    setForm(emptyPlan);
    setShowForm(false);
    setEditId(null);
  };

  const openEdit = (plan: SubscriptionPlan) => {
    setForm({ name: plan.name, price: String(plan.price), billing: plan.billing, featureAccess: [...plan.featureAccess], maxRooms: plan.maxRooms });
    setEditId(plan.id);
    setShowForm(true);
  };

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Subscriptions</h1>
          <p className="text-muted-foreground text-sm">Manage hotel subscription plans</p>
        </div>
        <button onClick={() => { setForm(emptyPlan); setEditId(null); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-md shadow-primary/20">
          <Plus className="w-4 h-4" /> Add Plan
        </button>
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

        {/* Plans */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Subscription Plans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {plans.map((plan, idx) => (
              <div key={plan.id} className={cn('glass-card rounded-2xl border-2 p-6 hover-lift animate-slide-up relative', plan.name === 'Professional' ? 'border-primary shadow-lg shadow-primary/10' : 'border-border/50')} style={{ animationDelay: `${idx * 80}ms` }}>
                {plan.name === 'Professional' && <span className="px-3 py-1 rounded-lg gradient-primary text-primary-foreground text-xs font-semibold mb-3 inline-block shadow-sm shadow-primary/20">Most Popular</span>}
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <div className="flex items-baseline gap-1 my-4"><span className="text-3xl font-bold">₹{plan.price.toLocaleString()}</span><span className="text-sm text-muted-foreground">/{plan.billing === 'monthly' ? 'mo' : 'yr'}</span></div>
                <p className="text-sm text-muted-foreground mb-4">Up to {plan.maxRooms} rooms</p>
                <ul className="space-y-2 mb-4">
                  {plan.featureAccess.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-status-available shrink-0" />{ALL_FEATURE_PAGES.find(p => p.key === f)?.label || f}</li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(plan)} className="flex-1 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-all flex items-center justify-center gap-1"><Edit2 className="w-3 h-3" />Edit</button>
                  <button onClick={() => { dispatch(deletePlan(plan.id)); toast.success('Plan deleted'); }} className="py-2 px-3 rounded-xl border border-destructive/30 text-destructive text-xs font-medium hover:bg-destructive/10 transition-all"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active */}
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
                {activeSubscriptions.map(h => {
                  const plan = plans.find(p => p.id === h.subscription);
                  return (
                    <tr key={h.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5 font-semibold">{h.name}</td>
                      <td className="px-5 py-3.5 capitalize">{plan?.name || '—'}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{h.subscriptionStart ? format(new Date(h.subscriptionStart), 'dd MMM yy') : '—'}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{h.subscriptionEnd ? format(new Date(h.subscriptionEnd), 'dd MMM yy') : '—'}</td>
                      <td className="px-5 py-3.5"><span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-status-available/10 text-status-available">Active</span></td>
                    </tr>
                  );
                })}
                {activeSubscriptions.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">No active subscriptions</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expired */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><XCircle className="w-5 h-5 text-status-occupied" /> Expired / Stopped</h2>
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
      </div>

      {/* Add/Edit Plan Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-scale-in" onClick={() => setShowForm(false)}>
          <div className="glass-card rounded-2xl border border-border/50 p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{editId ? 'Edit Plan' : 'Add New Plan'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-muted transition-all"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5">Plan Name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Price (₹) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Max Rooms</label>
                  <input type="number" value={form.maxRooms} onChange={e => setForm({...form, maxRooms: parseInt(e.target.value) || 1})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Billing</label>
                <select value={form.billing} onChange={e => setForm({...form, billing: e.target.value as any})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all">
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2">Feature Access *</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_FEATURE_PAGES.map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer">
                      <Checkbox checked={form.featureAccess.includes(key)} onCheckedChange={() => toggleFeature(key)} />
                      <span className="text-xs font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-md shadow-primary/20">{editId ? 'Update Plan' : 'Add Plan'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SASubscriptionsPage;
