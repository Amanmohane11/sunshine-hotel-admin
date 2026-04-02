import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { addServiceOrder, updateServiceStatus } from '@/store/servicesSlice';
import { ServiceOrder } from '@/store/dummyData';
import { toast } from 'sonner';
import { ConciergeBell, UtensilsCrossed, Shirt, Sparkles, Package, Plus, Wine, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeIcons: Record<string, any> = {
  room_service: ConciergeBell, food: UtensilsCrossed, laundry: Shirt, spa: Sparkles, mini_bar: Wine, other: Package,
};

const typeLabels: Record<string, string> = {
  room_service: 'Room Service', food: 'Food Order', laundry: 'Laundry', spa: 'Spa', mini_bar: 'Mini Bar', other: 'Other',
};

const statusBadge: Record<string, string> = {
  pending: 'bg-status-cleaning/10 text-status-cleaning',
  in_progress: 'bg-status-blue/10 text-status-blue',
  completed: 'bg-status-available/10 text-status-available',
};

const ServicesPage = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(s => s.services.orders);
  const rooms = useAppSelector(s => s.rooms.rooms);
  const occupiedRooms = rooms.filter(r => r.status === 'occupied');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ roomId: '', type: 'food' as ServiceOrder['type'], description: '', amount: '' });
  const [filter, setFilter] = useState<string>('all');

  const handleAdd = () => {
    if (!form.roomId || !form.description) { toast.error('Fill all fields'); return; }
    const room = rooms.find(r => r.id === form.roomId);
    const order: ServiceOrder = {
      id: `s-${Date.now()}`, roomId: form.roomId, roomNumber: room?.number || '', type: form.type,
      description: form.description, amount: parseInt(form.amount) || 0, status: 'pending', createdAt: new Date().toISOString(),
    };
    dispatch(addServiceOrder(order));
    toast.success('Service order created');
    setForm({ roomId: '', type: 'food', description: '', amount: '' });
    setShowForm(false);
  };

  const revenueByType = Object.keys(typeLabels).map(type => ({
    type, label: typeLabels[type],
    revenue: orders.filter(o => o.type === type).reduce((sum, o) => sum + o.amount, 0),
    count: orders.filter(o => o.type === type).length,
  }));

  const filtered = filter === 'all' ? orders : orders.filter(o => o.type === filter);

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Services</h1>
          <p className="text-muted-foreground text-sm">Track and manage hotel service orders</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-md shadow-primary/20">
          <Plus className="w-4 h-4" /> New Order
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {revenueByType.map(({ type, label, revenue, count }, idx) => {
          const Icon = typeIcons[type];
          return (
            <div key={type} className="glass-card hover-lift rounded-2xl p-4 border border-border/50 animate-slide-up" style={{ animationDelay: `${idx * 40}ms` }}>
              <Icon className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs text-muted-foreground font-medium">{label}</p>
              <p className="text-lg font-bold mt-0.5">₹{revenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{count} orders</p>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="glass-card rounded-2xl border border-border/50 p-5 mb-6 animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Create Service Order</h3>
            <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div><label className="block text-xs font-semibold mb-1.5">Room</label><select value={form.roomId} onChange={e => setForm({...form, roomId: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all"><option value="">Select room</option>{occupiedRooms.map(r => <option key={r.id} value={r.id}>Room {r.number}</option>)}</select></div>
            <div><label className="block text-xs font-semibold mb-1.5">Type</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value as any})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all">{Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            <div><label className="block text-xs font-semibold mb-1.5">Description</label><input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Order details" className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
            <div><label className="block text-xs font-semibold mb-1.5">Amount (₹)</label><input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0" className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
          </div>
          <button onClick={handleAdd} className="mt-4 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-sm shadow-primary/20">Create Order</button>
        </div>
      )}

      <div className="flex gap-1 mb-5 bg-muted/60 rounded-xl p-1 w-fit">
        {['all', ...Object.keys(typeLabels)].map(t => (
          <button key={t} onClick={() => setFilter(t)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200', filter === t ? 'gradient-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
            {t === 'all' ? 'All' : typeLabels[t]}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 text-left">
              <th className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">Room</th>
              <th className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">Type</th>
              <th className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">Description</th>
              <th className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">Amount</th>
              <th className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3.5 font-semibold">Room {o.roomNumber}</td>
                <td className="px-5 py-3.5">{typeLabels[o.type]}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{o.description}</td>
                <td className="px-5 py-3.5 font-medium">₹{o.amount.toLocaleString()}</td>
                <td className="px-5 py-3.5"><span className={cn('px-2.5 py-1 rounded-lg text-xs font-medium capitalize', statusBadge[o.status])}>{o.status.replace('_', ' ')}</span></td>
                <td className="px-5 py-3.5">
                  {o.status === 'pending' && <button onClick={() => dispatch(updateServiceStatus({ id: o.id, status: 'in_progress' }))} className="text-xs text-status-blue font-semibold hover:underline">Start</button>}
                  {o.status === 'in_progress' && <button onClick={() => dispatch(updateServiceStatus({ id: o.id, status: 'completed' }))} className="text-xs text-status-available font-semibold hover:underline">Complete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicesPage;
