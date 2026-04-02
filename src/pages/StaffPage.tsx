import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { markAttendance, selectStaff, clearSelectedStaff, assignTask, updateTaskStatus } from '@/store/staffSlice';
import { StaffMember, Shift } from '@/store/dummyData';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, Plus, ClipboardList, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const StaffPage = () => {
  const dispatch = useAppDispatch();
  const members = useAppSelector(s => s.staff.members);
  const rooms = useAppSelector(s => s.rooms.rooms);
  const selected = useAppSelector(s => s.staff.selectedStaff);
  const [showAssign, setShowAssign] = useState<string | null>(null);
  const [assignRoom, setAssignRoom] = useState('');
  const [assignType, setAssignType] = useState<'cleaning' | 'maintenance' | 'service'>('cleaning');

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

  const StaffCard = ({ member, idx }: { member: StaffMember; idx: number }) => {
    const todayMarked = member.attendance.some(a => a.date === new Date().toISOString().split('T')[0]);
    const activeTasks = member.tasks.filter(t => t.status !== 'completed').length;
    return (
      <div className="glass-card rounded-2xl border border-border/50 p-5 hover-lift animate-slide-up" style={{ animationDelay: `${idx * 40}ms` }}>
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
          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${shiftColors[member.shift]}`}>{member.shift}</span>
          <div className="flex items-center gap-2">
            {todayMarked ? (
              <span className="flex items-center gap-1 text-xs text-status-available font-medium"><CheckCircle className="w-3.5 h-3.5" />Present</span>
            ) : (
              <button onClick={(e) => { e.stopPropagation(); dispatch(markAttendance({ id: member.id, status: 'present' })); toast.success(`${member.name} marked present`); }}
                className="px-3 py-1.5 rounded-xl gradient-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all btn-ripple shadow-sm shadow-primary/20">
                Mark Attendance
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

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Staff</h1>
        <p className="text-muted-foreground text-sm">Manage shifts, attendance, and task assignments</p>
      </div>
      {shifts.map(shift => {
        const shiftMembers = members.filter(m => m.shift === shift);
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
    </div>
  );
};

const StaffProfile = ({ member, onBack, dispatch }: { member: StaffMember; onBack: () => void; dispatch: any }) => {
  const todayMarked = member.attendance.some(a => a.date === new Date().toISOString().split('T')[0]);

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
            <span className={`inline-block mt-1.5 px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${shiftColors[member.shift]}`}>{member.shift} shift</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div className="bg-muted/40 rounded-xl p-3"><span className="text-xs text-muted-foreground uppercase tracking-wider">Phone</span><p className="font-semibold mt-0.5">{member.phone}</p></div>
          <div className="bg-muted/40 rounded-xl p-3"><span className="text-xs text-muted-foreground uppercase tracking-wider">Email</span><p className="font-semibold mt-0.5">{member.email}</p></div>
          <div className="bg-muted/40 rounded-xl p-3"><span className="text-xs text-muted-foreground uppercase tracking-wider">Leaves</span><p className="font-semibold mt-0.5">{member.leaves}</p></div>
          <div className="bg-muted/40 rounded-xl p-3"><span className="text-xs text-muted-foreground uppercase tracking-wider">Half Days</span><p className="font-semibold mt-0.5">{member.halfDays}</p></div>
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
