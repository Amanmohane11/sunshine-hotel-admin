import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { markAttendance, selectStaff, clearSelectedStaff, assignTask, updateTaskStatus, addStaffMember, updateStaffFeatureAccess } from '@/store/staffSlice';
import { StaffMember, Shift, WorkType, FeaturePage, ALL_FEATURE_PAGES } from '@/store/dummyData';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, Plus, ClipboardList, X, Search, UserPlus, Shield, MessageCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

const shiftColors: Record<string, string> = {
  morning: 'bg-status-cleaning/10 text-status-cleaning',
  afternoon: 'bg-status-blue/10 text-status-blue',
  night: 'bg-muted text-muted-foreground',
};

const shiftLabels: Record<Shift, string> = {
  morning: '☀️ Morning Shift',
  afternoon: '🌤️ Afternoon Shift',
  night: '🌙 Night Shift',
};

const emptyForm = { name: '', phone: '', email: '', age: '', gender: 'Male' as const, shift: 'morning' as Shift, role: '', workType: 'full-time' as WorkType, featureAccess: ['home'] as FeaturePage[] };

const StaffPage = () => {
  const dispatch = useAppDispatch();
  const members = useAppSelector(s => s.staff.members);
  const rooms = useAppSelector(s => s.rooms.rooms);
  const selected = useAppSelector(s => s.staff.selectedStaff);
  const [showAssign, setShowAssign] = useState<string | null>(null);
  const [assignRoom, setAssignRoom] = useState('');
  const [assignType, setAssignType] = useState<'cleaning' | 'maintenance' | 'service'>('cleaning');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState('');

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = 'Valid 10-digit phone required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.age || parseInt(form.age) < 18 || parseInt(form.age) > 70) e.age = 'Age must be 18-70';
    if (!form.role.trim()) e.role = 'Role is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAddStaff = () => {
    if (!validateForm()) return;
    const staffImages = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    ];
    dispatch(addStaffMember({
      id: `st-${Date.now()}`, name: form.name, role: form.role, isManager: false,
      phone: form.phone, email: form.email, age: parseInt(form.age), gender: form.gender,
      shift: form.shift, workType: form.workType,
      image: staffImages[Math.floor(Math.random() * staffImages.length)],
      salary: 25000, attendance: [], leaves: 0, halfDays: 0, salaryPaid: false, tasks: [],
      featureAccess: form.featureAccess,
    }));
    toast.success(`${form.name} added to staff`);
    setForm(emptyForm);
    setShowAddModal(false);
    setErrors({});
  };

  const handleAssignTask = (staffId: string) => {
    const room = rooms.find(r => r.id === assignRoom);
    if (!room) { toast.error('Select a room'); return; }
    dispatch(assignTask({ staffId, task: { id: `task-${Date.now()}`, roomId: room.id, roomNumber: room.number, type: assignType, status: 'assigned', assignedAt: new Date().toISOString() } }));
    toast.success('Task assigned');
    setShowAssign(null);
    setAssignRoom('');
  };

  if (selected) return <StaffProfile member={selected} onBack={() => dispatch(clearSelectedStaff())} dispatch={dispatch} />;

  const shifts: Shift[] = ['morning', 'afternoon', 'night'];
  const filteredMembers = members.filter(m =>
    !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase())
  );

  const openWhatsApp = (phone: string, name: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const msg = encodeURIComponent(`Hi ${name}, this is a message from HotelDesk.`);
    window.open(`https://wa.me/91${cleaned}?text=${msg}`, '_blank');
  };

  const handleBroadcast = () => {
    if (!broadcastMsg.trim()) { toast.error('Enter a message'); return; }
    toast.success(`Broadcast message prepared for ${members.length} staff members`);
    setShowBroadcast(false);
    setBroadcastMsg('');
  };

  const StaffCard = ({ member, idx }: { member: StaffMember; idx: number }) => {
    const todayMarked = member.attendance.some(a => a.date === new Date().toISOString().split('T')[0]);
    const activeTasks = member.tasks.filter(t => t.status !== 'completed').length;
    return (
      <div className="glass-card rounded-2xl border border-border/50 p-5 hover-lift animate-slide-up relative" style={{ animationDelay: `${idx * 40}ms` }}>
        {/* WhatsApp Icon */}
        <button onClick={(e) => { e.stopPropagation(); openWhatsApp(member.phone, member.name); }}
          className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-[hsl(145,63%,42%)] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md z-10"
          title={`Chat with ${member.name} on WhatsApp`}>
          <MessageCircle className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3 mb-4 cursor-pointer group" onClick={() => dispatch(selectStaff(member.id))}>
          <img src={member.image} alt={member.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-border/50 group-hover:ring-primary/30 transition-all" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{member.name}</p>
            <p className="text-xs text-muted-foreground">{member.role}</p>
          </div>
          {activeTasks > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-status-blue/10 text-status-blue text-xs font-medium">
              <ClipboardList className="w-3 h-3" />{activeTasks}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${shiftColors[member.shift]}`}>{member.shift}</span>
            <span className="px-2 py-1 rounded-lg text-xs font-medium bg-muted/60 text-muted-foreground capitalize">{member.workType}</span>
          </div>
          <div className="flex items-center gap-2">
            {todayMarked ? (
              <span className="flex items-center gap-1 text-xs text-status-available font-medium"><CheckCircle className="w-3.5 h-3.5" />Present</span>
            ) : (
              <button onClick={(e) => { e.stopPropagation(); dispatch(markAttendance({ id: member.id, status: 'present' })); toast.success(`${member.name} marked present`); }}
                className="px-3 py-1.5 rounded-xl gradient-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all btn-ripple shadow-sm shadow-primary/20">
                Mark Present
              </button>
            )}
            <button onClick={(e) => { e.stopPropagation(); setShowAssign(showAssign === member.id ? null : member.id); }} className="p-1.5 rounded-lg border border-border/50 hover:bg-muted transition-all">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {showAssign === member.id && (
          <div className="mt-3 p-3 bg-muted/40 rounded-xl animate-scale-in">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold">Assign Task</p>
              <button onClick={() => setShowAssign(null)} className="p-0.5"><X className="w-3 h-3" /></button>
            </div>
            <div className="flex gap-2 mb-2">
              <select value={assignRoom} onChange={e => setAssignRoom(e.target.value)} className="flex-1 rounded-lg border border-input bg-background px-2 py-1.5 text-xs focus:border-primary/50 transition-all">
                <option value="">Room</option>{rooms.map(r => <option key={r.id} value={r.id}>Room {r.number}</option>)}
              </select>
              <select value={assignType} onChange={e => setAssignType(e.target.value as any)} className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs focus:border-primary/50 transition-all">
                <option value="cleaning">Cleaning</option><option value="maintenance">Maintenance</option><option value="service">Service</option>
              </select>
            </div>
            <button onClick={() => handleAssignTask(member.id)} className="w-full py-1.5 rounded-lg gradient-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all btn-ripple">Assign</button>
          </div>
        )}
        {member.tasks.filter(t => t.status !== 'completed').length > 0 && (
          <div className="mt-3 space-y-1.5">
            {member.tasks.filter(t => t.status !== 'completed').map(task => (
              <div key={task.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-xs">
                <span>Room {task.roomNumber} - {task.type}</span>
                {task.status === 'assigned' && (
                  <button onClick={(e) => { e.stopPropagation(); dispatch(updateTaskStatus({ staffId: member.id, taskId: task.id, status: 'completed' })); toast.success('Task completed'); }} className="text-status-available font-semibold hover:underline">Done</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const toggleFeature = (key: FeaturePage) => {
    setForm(f => ({ ...f, featureAccess: f.featureAccess.includes(key) ? f.featureAccess.filter(k => k !== key) : [...f.featureAccess, key] }));
  };

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Staff</h1>
          <p className="text-muted-foreground text-sm">Manage shifts, attendance, and task assignments</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-muted/60 rounded-xl px-3 py-2.5 border border-border/50 focus-within:border-primary/40 transition-all">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input type="text" placeholder="Search staff..." className="bg-transparent outline-none text-sm w-40" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={() => setShowBroadcast(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/50 bg-[hsl(145,63%,42%)]/10 text-sm font-medium hover:bg-[hsl(145,63%,42%)]/20 transition-all">
            <Send className="w-4 h-4 text-[hsl(145,63%,42%)]" /> Broadcast
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-md shadow-primary/20">
            <UserPlus className="w-4 h-4" /> Add Staff
          </button>
        </div>
      </div>

      {shifts.map(shift => {
        const shiftMembers = filteredMembers.filter(m => m.shift === shift);
        if (shiftMembers.length === 0) return null;
        return (
          <div key={shift} className="mb-8">
            <h2 className="text-lg font-semibold mb-4">{shiftLabels[shift]}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shiftMembers.map((m, idx) => <StaffCard key={m.id} member={m} idx={idx} />)}
            </div>
          </div>
        );
      })}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-scale-in" onClick={() => setShowAddModal(false)}>
          <div className="glass-card rounded-2xl border border-border/50 p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Add New Staff Member</h2>
              <button onClick={() => { setShowAddModal(false); setErrors({}); }} className="p-1.5 rounded-lg hover:bg-muted transition-all"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5">Name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full name" className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Phone *</label>
                  <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="10 digit phone" className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
                  {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Email *</label>
                  <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@example.com" className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Age *</label>
                  <input type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} placeholder="Age" className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
                  {errors.age && <p className="text-xs text-destructive mt-1">{errors.age}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Gender *</label>
                  <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value as any})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Role *</label>
                <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="e.g. Receptionist, Chef, Security" className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
                {errors.role && <p className="text-xs text-destructive mt-1">{errors.role}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Shift *</label>
                  <select value={form.shift} onChange={e => setForm({...form, shift: e.target.value as Shift})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all">
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="night">Night</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Work Type *</label>
                  <select value={form.workType} onChange={e => setForm({...form, workType: e.target.value as WorkType})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all">
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                  </select>
                </div>
              </div>

              {/* Feature Access */}
              <div>
                <label className="block text-xs font-semibold mb-2 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-primary" /> Feature Access</label>
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
              <button onClick={() => { setShowAddModal(false); setErrors({}); }} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all">Cancel</button>
              <button onClick={handleAddStaff} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-md shadow-primary/20">Add Staff</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StaffProfile = ({ member, onBack, dispatch }: { member: StaffMember; onBack: () => void; dispatch: any }) => {
  const todayMarked = member.attendance.some(a => a.date === new Date().toISOString().split('T')[0]);
  const [localAccess, setLocalAccess] = useState<FeaturePage[]>([...member.featureAccess]);

  const toggleFeature = (key: FeaturePage) => {
    setLocalAccess(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const saveAccess = () => {
    dispatch(updateStaffFeatureAccess({ id: member.id, featureAccess: localAccess }));
    toast.success('Feature access updated');
  };

  return (
    <div className="max-w-2xl animate-slide-up">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to staff
      </button>
      <div className="glass-card rounded-2xl border border-border/50 p-6">
        <div className="flex items-center gap-4 mb-6">
          <img src={member.image} alt={member.name} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-border/30" />
          <div>
            <h2 className="text-xl font-bold">{member.name}</h2>
            <p className="text-muted-foreground text-sm">{member.role}</p>
            <div className="flex gap-2 mt-1.5">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${shiftColors[member.shift]}`}>{member.shift} shift</span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-muted/60 text-muted-foreground capitalize">{member.workType}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-6">
          <div className="bg-muted/40 rounded-xl p-3"><span className="text-xs text-muted-foreground uppercase tracking-wider">Phone</span><p className="font-semibold mt-0.5">{member.phone}</p></div>
          <div className="bg-muted/40 rounded-xl p-3"><span className="text-xs text-muted-foreground uppercase tracking-wider">Email</span><p className="font-semibold mt-0.5 truncate">{member.email}</p></div>
          <div className="bg-muted/40 rounded-xl p-3"><span className="text-xs text-muted-foreground uppercase tracking-wider">Age / Gender</span><p className="font-semibold mt-0.5">{member.age} / {member.gender}</p></div>
          <div className="bg-muted/40 rounded-xl p-3"><span className="text-xs text-muted-foreground uppercase tracking-wider">Leaves</span><p className="font-semibold mt-0.5">{member.leaves}</p></div>
          <div className="bg-muted/40 rounded-xl p-3"><span className="text-xs text-muted-foreground uppercase tracking-wider">Half Days</span><p className="font-semibold mt-0.5">{member.halfDays}</p></div>
          <div className="bg-muted/40 rounded-xl p-3"><span className="text-xs text-muted-foreground uppercase tracking-wider">Salary</span><p className="font-semibold mt-0.5">₹{member.salary.toLocaleString()}</p></div>
        </div>

        {/* Feature Access Control */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Feature Access Control</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
            {ALL_FEATURE_PAGES.map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer">
                <Checkbox checked={localAccess.includes(key)} onCheckedChange={() => toggleFeature(key)} />
                <span className="text-xs font-medium">{label}</span>
              </label>
            ))}
          </div>
          <button onClick={saveAccess} className="px-5 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-sm shadow-primary/20">Save Access</button>
        </div>

        {member.tasks.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Assigned Tasks</h3>
            {member.tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-xl mb-2 text-sm">
                <div><span className="font-medium">Room {task.roomNumber}</span><span className="text-muted-foreground ml-2 capitalize">({task.type})</span></div>
                <span className={cn('px-2.5 py-1 rounded-lg text-xs font-medium', task.status === 'completed' ? 'bg-status-available/10 text-status-available' : task.status === 'in_progress' ? 'bg-status-blue/10 text-status-blue' : 'bg-status-cleaning/10 text-status-cleaning')}>{task.status}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          {!todayMarked ? (
            <>
              <button onClick={() => { dispatch(markAttendance({ id: member.id, status: 'present' })); toast.success('Marked full day'); }} className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-sm shadow-primary/20">Mark Full Day</button>
              <button onClick={() => { dispatch(markAttendance({ id: member.id, status: 'half_day' })); toast.success('Marked half day'); }} className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all btn-ripple">Mark Half Day</button>
            </>
          ) : (
            <span className="flex items-center gap-2 text-status-available font-medium text-sm"><CheckCircle className="w-4 h-4" /> Today's attendance marked</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
