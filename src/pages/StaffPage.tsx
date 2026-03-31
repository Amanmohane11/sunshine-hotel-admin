import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { markAttendance, selectStaff, clearSelectedStaff } from '@/store/staffSlice';
import { StaffMember } from '@/store/dummyData';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';

const shiftColors: Record<string, string> = {
  morning: 'bg-status-cleaning/15 text-status-cleaning',
  afternoon: 'bg-status-blue/15 text-status-blue',
  night: 'bg-muted text-muted-foreground',
};

const StaffPage = () => {
  const dispatch = useAppDispatch();
  const members = useAppSelector(s => s.staff.members);
  const selected = useAppSelector(s => s.staff.selectedStaff);
  const managers = members.filter(m => m.isManager);
  const staff = members.filter(m => !m.isManager);

  if (selected) return <StaffProfile member={selected} onBack={() => dispatch(clearSelectedStaff())} dispatch={dispatch} />;

  const StaffCard = ({ member }: { member: StaffMember }) => {
    const todayMarked = member.attendance.some(a => a.date === new Date().toISOString().split('T')[0]);
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => dispatch(selectStaff(member.id))}>
          <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
          <div>
            <p className="font-semibold text-sm">{member.name}</p>
            <p className="text-xs text-muted-foreground">{member.role}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${shiftColors[member.shift]}`}>
            {member.shift} shift
          </span>
          {todayMarked ? (
            <span className="flex items-center gap-1 text-xs text-status-available font-medium"><CheckCircle className="w-3.5 h-3.5" />Present</span>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); dispatch(markAttendance({ id: member.id, status: 'present' })); toast.success(`${member.name} marked present`); }}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
            >
              Mark Attendance
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Staff</h1>
      <h2 className="text-lg font-semibold mb-3">Managers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {managers.map(m => <StaffCard key={m.id} member={m} />)}
      </div>
      <h2 className="text-lg font-semibold mb-3">Staff</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map(m => <StaffCard key={m.id} member={m} />)}
      </div>
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
          <img src={member.image} alt={member.name} className="w-20 h-20 rounded-full object-cover" />
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
        <div className="flex gap-3">
          {!todayMarked && (
            <>
              <button
                onClick={() => { dispatch(markAttendance({ id: member.id, status: 'present' })); toast.success('Marked full day'); }}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
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
