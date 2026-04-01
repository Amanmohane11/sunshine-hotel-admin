import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { addServiceOrder, updateServiceStatus } from '@/store/servicesSlice';
import { ServiceOrder } from '@/store/dummyData';
import { toast } from 'sonner';
import { ConciergeBell, UtensilsCrossed, Shirt, Sparkles, Package, Plus, Wine } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeIcons: Record<string, any> = {
  room_service: ConciergeBell,
  food: UtensilsCrossed,
  laundry: Shirt,
  spa: Sparkles,
  mini_bar: Wine,
  other: Package,
};

const typeLabels: Record<string, string> = {
  room_service: 'Room Service',
  food: 'Food Order',
  laundry: 'Laundry',
  spa: 'Spa',
  mini_bar: 'Mini Bar',
  other: 'Other',
};

const statusBadge: Record<string, string> = {
  pending: 'bg-status-cleaning/15 text-status-cleaning',
  in_progress: 'bg-status-blue/15 text-status-blue',
  completed: 'bg-status-available/15 text-status-available',
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
      id: `s-${Date.now()}`,
      roomId: form.roomId,
      roomNumber: room?.number || '',
      type: form.type,
      description: form.description,
      amount: parseInt(form.amount) || 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    dispatch(addServiceOrder(order));
    toast.success('Service order created');
    setForm({ roomId: '', type: 'food', description: '', amount: '' });
    setShowForm(false);
  };

  const revenueByType = Object.keys(typeLabels).map(type => ({
    type,
    label: typeLabels[type],
    revenue: orders.filter(o => o.type === type).reduce((sum, o) => sum + o.amount, 0),
    count: orders.filter(o => o.type === type).length,
  }));

  const filtered = filter === 'all' ? orders : orders.filter(o => o.type === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> New Order
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {revenueByType.map(({ type, label, revenue, count }) => {
          const Icon = typeIcons[type];
          return (
            <div key={type} className="bg-card rounded-xl p-4 border border-border shadow-sm hover:shadow-md transition-shadow">
              <Icon className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-lg font-bold">₹{revenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{count} orders</p>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="bg-card rounded-xl border border-border p-5 mb-6 shadow-sm">
          <h3 className="font-semibold mb-3">Create Service Order</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div><label className="block text-xs font-medium mb-1">Room</label><select value={form.roomId} onChange={e => setForm({...form, roomId: e.target.value})} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"><option value="">Select room</option>{occupiedRooms.map(r => <option key={r.id} value={r.id}>Room {r.number}</option>)}</select></div>
            <div><label className="block text-xs font-medium mb-1">Type</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value as any})} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">{Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            <div><label className="block text-xs font-medium mb-1">Description</label><input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs font-medium mb-1">Amount (₹)</label><input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" /></div>
          </div>
          <button onClick={handleAdd} className="mt-3 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Create</button>
        </div>
      )}

      <div className="flex gap-1 mb-4 bg-muted rounded-lg p-1 w-fit">
        {['all', ...Object.keys(typeLabels)].map(t => (
          <button key={t} onClick={() => setFilter(t)} className={cn('px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all', filter === t ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
            {t === 'all' ? 'All' : typeLabels[t]}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-5 py-3 text-muted-foreground font-medium">Room</th>
              <th className="px-5 py-3 text-muted-foreground font-medium">Type</th>
              <th className="px-5 py-3 text-muted-foreground font-medium">Description</th>
              <th className="px-5 py-3 text-muted-foreground font-medium">Amount</th>
              <th className="px-5 py-3 text-muted-foreground font-medium">Status</th>
              <th className="px-5 py-3 text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-5 py-3 font-medium">Room {o.roomNumber}</td>
                <td className="px-5 py-3">{typeLabels[o.type]}</td>
                <td className="px-5 py-3">{o.description}</td>
                <td className="px-5 py-3">₹{o.amount.toLocaleString()}</td>
                <td className="px-5 py-3"><span className={cn('px-2.5 py-1 rounded-full text-xs font-medium capitalize', statusBadge[o.status])}>{o.status.replace('_', ' ')}</span></td>
                <td className="px-5 py-3">
                  {o.status === 'pending' && <button onClick={() => dispatch(updateServiceStatus({ id: o.id, status: 'in_progress' }))} className="text-xs text-status-blue font-medium hover:underline">Start</button>}
                  {o.status === 'in_progress' && <button onClick={() => dispatch(updateServiceStatus({ id: o.id, status: 'completed' }))} className="text-xs text-status-available font-medium hover:underline">Complete</button>}
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
