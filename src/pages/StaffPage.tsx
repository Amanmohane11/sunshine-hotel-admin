import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { markAttendance, selectStaff, clearSelectedStaff, assignTask, updateTaskStatus } from '@/store/staffSlice';
import { StaffMember, Shift } from '@/store/dummyData';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, Plus, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

const shiftColors: Record<string, string> = {
  morning: 'bg-status-cleaning/15 text-status-cleaning',
  afternoon: 'bg-status-blue/15 text-status-blue',
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
    dispatch(assignTask({
      staffId,
      task: { id: `task-${Date.now()}`, roomId: room.id, roomNumber: room.number, type: assignType, status: 'assigned', assignedAt: new Date().toISOString() },
    }));
    toast.success('Task assigned');
    setShowAssign(null);
    setAssignRoom('');
  };

  if (selected) return <StaffProfile member={selected} onBack={() => dispatch(clearSelectedStaff())} dispatch={dispatch} />;

  const shifts: Shift[] = ['morning', 'afternoon', 'night'];

  const StaffCard = ({ member }: { member: StaffMember }) => {
    const todayMarked = member.attendance.some(a => a.date === new Date().toISOString().split('T')[0]);
    const activeTasks = member.tasks.filter(t => t.status !== 'completed').length;
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => dispatch(selectStaff(member.id))}>
          <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-border" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{member.name}</p>
            <p className="text-xs text-muted-foreground">{member.role}</p>
          </div>
          {activeTasks > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-status-blue/15 text-status-blue text-xs font-medium">
              <ClipboardList className="w-3 h-3" />{activeTasks}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${shiftColors[member.shift]}`}>
            {member.shift}
          </span>
          <div className="flex items-center gap-2">
            {todayMarked ? (
              <span className="flex items-center gap-1 text-xs text-status-available font-medium"><CheckCircle className="w-3.5 h-3.5" />Present</span>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); dispatch(markAttendance({ id: member.id, status: 'present' })); toast.success(`${member.name} marked present`); }}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                Mark Attendance
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setShowAssign(showAssign === member.id ? null : member.id); }}
              className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {showAssign === member.id && (
          <div className="mt-3 p-3 bg-muted rounded-lg">
            <p className="text-xs font-medium mb-2">Assign Task</p>
            <div className="flex gap-2 mb-2">
              <select value={assignRoom} onChange={e => setAssignRoom(e.target.value)} className="flex-1 rounded-lg border border-input bg-background px-2 py-1.5 text-xs">
                <option value="">Room</option>
                {rooms.map(r => <option key={r.id} value={r.id}>Room {r.number}</option>)}
              </select>
              <select value={assignType} onChange={e => setAssignType(e.target.value as any)} className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs">
                <option value="cleaning">Cleaning</option><option value="maintenance">Maintenance</option><option value="service">Service</option>
              </select>
            </div>
            <button onClick={() => handleAssignTask(member.id)} className="w-full py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">Assign</button>
          </div>
        )}
        {/* Tasks */}
        {member.tasks.filter(t => t.status !== 'completed').length > 0 && (
          <div className="mt-3 space-y-1.5">
            {member.tasks.filter(t => t.status !== 'completed').map(task => (
              <div key={task.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-xs">
                <span>Room {task.roomNumber} - {task.type}</span>
                {task.status === 'assigned' && (
                  <button onClick={(e) => { e.stopPropagation(); dispatch(updateTaskStatus({ staffId: member.id, taskId: task.id, status: 'completed' })); toast.success('Task completed'); }} className="text-status-available font-medium hover:underline">Done</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Staff</h1>
      {shifts.map(shift => {
        const shiftMembers = members.filter(m => m.shift === shift);
        if (shiftMembers.length === 0) return null;
        return (
          <div key={shift} className="mb-8">
            <h2 className="text-lg font-semibold mb-3">{shiftLabels[shift]}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shiftMembers.map(m => <StaffCard key={m.id} member={m} />)}
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
    <div className="max-w-2xl">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to staff
      </button>
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <img src={member.image} alt={member.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-border" />
          <div>
            <h2 className="text-xl font-bold">{member.name}</h2>
            <p className="text-muted-foreground">{member.role}</p>
            <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${shiftColors[member.shift]}`}>
              {member.shift} shift
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div><span className="text-muted-foreground">Phone:</span><p className="font-medium">{member.phone}</p></div>
          <div><span className="text-muted-foreground">Email:</span><p className="font-medium">{member.email}</p></div>
          <div><span className="text-muted-foreground">Leaves:</span><p className="font-medium">{member.leaves}</p></div>
          <div><span className="text-muted-foreground">Half Days:</span><p className="font-medium">{member.halfDays}</p></div>
        </div>

        {/* Tasks */}
        {member.tasks.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Assigned Tasks</h3>
            {member.tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded-lg mb-2 text-sm">
                <div>
                  <span className="font-medium">Room {task.roomNumber}</span>
                  <span className="text-muted-foreground ml-2 capitalize">({task.type})</span>
                </div>
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', task.status === 'completed' ? 'bg-status-available/15 text-status-available' : task.status === 'in_progress' ? 'bg-status-blue/15 text-status-blue' : 'bg-status-cleaning/15 text-status-cleaning')}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          {!todayMarked && (
            <>
              <button
                onClick={() => { dispatch(markAttendance({ id: member.id, status: 'present' })); toast.success('Marked full day'); }}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Mark Full Day
              </button>
              <button
                onClick={() => { dispatch(markAttendance({ id: member.id, status: 'half_day' })); toast.success('Marked half day'); }}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                Mark Half Day
              </button>
            </>
          )}
          {todayMarked && (
            <span className="flex items-center gap-2 text-status-available font-medium text-sm">
              <CheckCircle className="w-4 h-4" /> Today's attendance marked
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
