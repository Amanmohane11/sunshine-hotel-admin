import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { addHotel, updateHotel, updateHotelFeatureAccess, updateHotelRoomLimit, toggleSubscription, resetHotelPassword, approveHotel } from '@/store/hotelsSlice';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Plus, X, ArrowLeft, Edit2, Eye, MapPin, Calendar, Shield, Key, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Hotel, FeaturePage, ALL_FEATURE_PAGES } from '@/store/dummyData';
import { Checkbox } from '@/components/ui/checkbox';

type View = 'list' | 'detail' | 'add' | 'edit';

const emptyHotel = {
  name: '', location: '', owner: '', phone: '', email: '',
  adminId: '', adminPassword: '',
  featureAccess: [] as FeaturePage[],
  roomLimit: 20,
  subscription: 'plan-1',
};

const SAHotelsPage = () => {
  const dispatch = useAppDispatch();
  const { hotels, plans } = useAppSelector(s => s.hotels);
  const [view, setView] = useState<View>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyHotel);
  const [search, setSearch] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const selected = hotels.find(h => h.id === selectedId);
  const filtered = hotels.filter(h =>
    !search || h.name.toLowerCase().includes(search.toLowerCase()) || h.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name || !form.location || !form.owner || !form.email || !form.adminId || !form.adminPassword) {
      toast.error('Please fill all required fields');
      return;
    }
    const plan = plans.find(p => p.id === form.subscription);
    const hotel: Hotel = {
      id: `h-${Date.now()}`,
      name: form.name, location: form.location, owner: form.owner,
      email: form.email, phone: form.phone,
      status: 'active',
      rooms: 0, roomLimit: form.roomLimit,
      subscription: form.subscription,
      subscriptionStart: new Date().toISOString(),
      subscriptionEnd: new Date(Date.now() + 86400000 * 30).toISOString(),
      revenue: 0, createdAt: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      adminId: form.adminId, adminPassword: form.adminPassword,
      featureAccess: form.featureAccess.length > 0 ? form.featureAccess : (plan?.featureAccess || []),
      subscriptionActive: true,
    };
    dispatch(addHotel(hotel));
    toast.success('Hotel added successfully');
    setForm(emptyHotel);
    setView('list');
  };

  const handleUpdate = () => {
    if (!selected) return;
    dispatch(updateHotel({
      id: selected.id, name: form.name, location: form.location,
      owner: form.owner, email: form.email, phone: form.phone,
      subscription: form.subscription, roomLimit: form.roomLimit,
    }));
    dispatch(updateHotelFeatureAccess({ id: selected.id, featureAccess: form.featureAccess }));
    toast.success('Hotel updated');
    setView('detail');
  };

  const openDetail = (id: string) => { setSelectedId(id); setView('detail'); };
  const openEdit = () => {
    if (!selected) return;
    setForm({
      name: selected.name, location: selected.location, owner: selected.owner,
      phone: selected.phone, email: selected.email, adminId: selected.adminId,
      adminPassword: selected.adminPassword, featureAccess: [...selected.featureAccess],
      roomLimit: selected.roomLimit, subscription: selected.subscription,
    });
    setView('edit');
  };

  const toggleFeature = (key: FeaturePage) => {
    setForm(f => ({
      ...f,
      featureAccess: f.featureAccess.includes(key)
        ? f.featureAccess.filter(k => k !== key)
        : [...f.featureAccess, key],
    }));
  };

  // ── Card List View ──
  if (view === 'list') {
    return (
      <div className="animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Hotels</h1>
            <p className="text-muted-foreground text-sm">{hotels.length} hotels registered</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-muted/60 rounded-xl px-3 py-2.5 border border-border/50 focus-within:border-primary/40 transition-all">
              <Search className="w-4 h-4 text-muted-foreground mr-2" />
              <input type="text" placeholder="Search hotels..." className="bg-transparent outline-none text-sm w-40" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button onClick={() => { setForm(emptyHotel); setView('add'); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-md shadow-primary/20">
              <Plus className="w-4 h-4" /> Add Hotel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((h, idx) => (
            <div key={h.id} onClick={() => openDetail(h.id)} className="glass-card rounded-2xl border border-border/50 overflow-hidden hover-lift cursor-pointer animate-slide-up group" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="relative h-40 overflow-hidden">
                <img src={h.image} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className={cn('absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-medium capitalize backdrop-blur-sm', h.status === 'active' ? 'bg-status-available/20 text-status-available' : h.status === 'pending' ? 'bg-status-cleaning/20 text-status-cleaning' : 'bg-status-occupied/20 text-status-occupied')}>{h.status}</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-base mb-1">{h.name}</h3>
                <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2"><MapPin className="w-3 h-3" />{h.location}</div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(h.createdAt), 'dd MMM yyyy')}</span>
                  <span>{h.rooms} rooms</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Detail View ──
  if (view === 'detail' && selected) {
    const plan = plans.find(p => p.id === selected.subscription);
    return (
      <div className="animate-slide-up max-w-3xl">
        <button onClick={() => setView('list')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to hotels
        </button>

        <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="relative h-52">
            <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-4 left-5">
              <h2 className="text-2xl font-bold text-foreground">{selected.name}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{selected.location}</p>
            </div>
            <span className={cn('absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-medium capitalize', selected.status === 'active' ? 'bg-status-available/20 text-status-available' : selected.status === 'pending' ? 'bg-status-cleaning/20 text-status-cleaning' : 'bg-status-occupied/20 text-status-occupied')}>{selected.status}</span>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-muted/40 rounded-xl p-3"><span className="text-xs text-muted-foreground uppercase tracking-wider">Owner</span><p className="font-semibold mt-0.5">{selected.owner}</p></div>
              <div className="bg-muted/40 rounded-xl p-3"><span className="text-xs text-muted-foreground uppercase tracking-wider">Email</span><p className="font-semibold mt-0.5 truncate">{selected.email}</p></div>
              <div className="bg-muted/40 rounded-xl p-3"><span className="text-xs text-muted-foreground uppercase tracking-wider">Phone</span><p className="font-semibold mt-0.5">{selected.phone}</p></div>
              <div className="bg-muted/40 rounded-xl p-3"><span className="text-xs text-muted-foreground uppercase tracking-wider">Rooms</span><p className="font-semibold mt-0.5">{selected.rooms} / {selected.roomLimit}</p></div>
              <div className="bg-muted/40 rounded-xl p-3"><span className="text-xs text-muted-foreground uppercase tracking-wider">Plan</span><p className="font-semibold mt-0.5 capitalize">{plan?.name || '—'}</p></div>
              <div className="bg-muted/40 rounded-xl p-3"><span className="text-xs text-muted-foreground uppercase tracking-wider">Revenue</span><p className="font-semibold mt-0.5">₹{selected.revenue.toLocaleString()}</p></div>
              <div className="bg-muted/40 rounded-xl p-3"><span className="text-xs text-muted-foreground uppercase tracking-wider">Sub. Start</span><p className="font-semibold mt-0.5">{selected.subscriptionStart ? format(new Date(selected.subscriptionStart), 'dd MMM yy') : '—'}</p></div>
              <div className="bg-muted/40 rounded-xl p-3"><span className="text-xs text-muted-foreground uppercase tracking-wider">Sub. End</span><p className="font-semibold mt-0.5">{selected.subscriptionEnd ? format(new Date(selected.subscriptionEnd), 'dd MMM yy') : '—'}</p></div>
              <div className="bg-muted/40 rounded-xl p-3"><span className="text-xs text-muted-foreground uppercase tracking-wider">Admin ID</span><p className="font-semibold mt-0.5">{selected.adminId}</p></div>
            </div>

            {/* Feature Access */}
            <div>
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Enabled Features</h3>
              <div className="flex flex-wrap gap-2">
                {selected.featureAccess.length > 0 ? selected.featureAccess.map(f => (
                  <span key={f} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium capitalize">{ALL_FEATURE_PAGES.find(p => p.key === f)?.label || f}</span>
                )) : <span className="text-muted-foreground text-xs">No features enabled</span>}
              </div>
            </div>

            {/* Subscription Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div>
                <p className="font-semibold text-sm">Subscription Status</p>
                <p className="text-xs text-muted-foreground">{selected.subscriptionActive ? 'Active' : 'Stopped'}</p>
              </div>
              <button onClick={() => { dispatch(toggleSubscription(selected.id)); toast.success('Subscription toggled'); }} className="p-2 rounded-lg hover:bg-muted transition-all">
                {selected.subscriptionActive ? <ToggleRight className="w-8 h-8 text-status-available" /> : <ToggleLeft className="w-8 h-8 text-muted-foreground" />}
              </button>
            </div>

            {/* Reset Password */}
            <div className="p-4 bg-muted/30 rounded-xl">
              <p className="font-semibold text-sm mb-2 flex items-center gap-2"><Key className="w-4 h-4" /> Reset Password</p>
              <div className="flex gap-2">
                <input value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" type="password" className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary/50 transition-all" />
                <button onClick={() => { if (newPassword.length < 6) { toast.error('Min 6 chars'); return; } dispatch(resetHotelPassword({ id: selected.id, password: newPassword })); setNewPassword(''); toast.success('Password reset'); }} className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all">Reset</button>
              </div>
            </div>

            {/* Approve if pending */}
            {selected.status === 'pending' && (
              <button onClick={() => { dispatch(approveHotel(selected.id)); toast.success('Hotel approved'); }} className="w-full py-3 rounded-xl bg-status-available/10 text-status-available text-sm font-semibold hover:bg-status-available/20 transition-all">
                Approve Hotel
              </button>
            )}

            <div className="flex gap-3">
              <button onClick={openEdit} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-md shadow-primary/20">
                <Edit2 className="w-4 h-4" /> Edit Hotel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Add / Edit Form ──
  const isEdit = view === 'edit';
  return (
    <div className="animate-slide-up max-w-2xl">
      <button onClick={() => setView(isEdit ? 'detail' : 'list')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <div className="glass-card rounded-2xl border border-border/50 p-6">
        <h2 className="text-lg font-bold mb-6">{isEdit ? 'Edit Hotel' : 'Add New Hotel'}</h2>

        <div className="space-y-5">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Basic Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5">Hotel Name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Location *</label>
                <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5">Owner Name *</label>
                <input value={form.owner} onChange={e => setForm({...form, owner: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Phone</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5">Email *</label>
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
            </div>
          </div>

          {/* Login Credentials */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Login Credentials</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5">Admin ID *</label>
                <input value={form.adminId} onChange={e => setForm({...form, adminId: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Password *</label>
                <input type="password" value={form.adminPassword} onChange={e => setForm({...form, adminPassword: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
              </div>
            </div>
          </div>

          {/* Subscription & Room Limit */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Subscription & Limits</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5">Plan</label>
                <select value={form.subscription} onChange={e => setForm({...form, subscription: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all">
                  {plans.map(p => <option key={p.id} value={p.id}>{p.name} — ₹{p.price}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Room Limit</label>
                <input type="number" min={1} value={form.roomLimit} onChange={e => setForm({...form, roomLimit: parseInt(e.target.value) || 1})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
              </div>
            </div>
          </div>

          {/* Feature Access */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Feature Access (Override)</h3>
            <p className="text-xs text-muted-foreground">Select which pages this hotel admin can access. Leave empty to use plan defaults.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ALL_FEATURE_PAGES.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer">
                  <Checkbox checked={form.featureAccess.includes(key)} onCheckedChange={() => toggleFeature(key)} />
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setView(isEdit ? 'detail' : 'list')} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all">Cancel</button>
            <button onClick={isEdit ? handleUpdate : handleAdd} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-md shadow-primary/20">
              {isEdit ? 'Save Changes' : 'Add Hotel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SAHotelsPage;
