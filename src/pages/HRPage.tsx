import { useAppSelector, useAppDispatch } from '@/store';
import { paySalary } from '@/store/staffSlice';
import { toast } from 'sonner';
import { CheckCircle, DollarSign } from 'lucide-react';

const PER_LEAVE_DEDUCTION = 1500;
const PER_HALFDAY_DEDUCTION = 750;

const HRPage = () => {
  const dispatch = useAppDispatch();
  const members = useAppSelector(s => s.staff.members);

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">HR & Payroll</h1>
        <p className="text-muted-foreground text-sm">Manage salaries, deductions, and payments</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-2xl border border-border/50 p-5">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Staff</p>
          <p className="text-2xl font-bold mt-1">{members.length}</p>
        </div>
        <div className="glass-card rounded-2xl border border-border/50 p-5">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pending Payments</p>
          <p className="text-2xl font-bold mt-1 text-status-cleaning">{members.filter(m => !m.salaryPaid).length}</p>
        </div>
        <div className="glass-card rounded-2xl border border-border/50 p-5">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Payroll</p>
          <p className="text-2xl font-bold mt-1">₹{members.reduce((s, m) => s + m.salary, 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member, idx) => {
          const leaveDeduction = member.leaves * PER_LEAVE_DEDUCTION;
          const halfDayDeduction = member.halfDays * PER_HALFDAY_DEDUCTION;
          const totalDeduction = leaveDeduction + halfDayDeduction;
          const finalSalary = member.salary - totalDeduction;

          return (
            <div key={member.id} className="glass-card rounded-2xl border border-border/50 p-5 hover-lift animate-slide-up" style={{ animationDelay: `${idx * 40}ms` }}>
              <div className="flex items-center gap-3 mb-4">
                <img src={member.image} alt={member.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <p className="font-semibold text-sm">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-medium">{member.phone}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shift</span><span className="capitalize font-medium">{member.shift}</span></div>
                <div className="border-t border-border/50 my-2" />
                <div className="flex justify-between"><span className="text-muted-foreground">Total Salary</span><span className="font-semibold">₹{member.salary.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Leaves ({member.leaves})</span><span className="text-destructive font-medium">-₹{leaveDeduction.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Half Days ({member.halfDays})</span><span className="text-destructive font-medium">-₹{halfDayDeduction.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Total Deduction</span><span className="text-destructive font-semibold">-₹{totalDeduction.toLocaleString()}</span></div>
                <div className="border-t-2 border-primary/20 my-2" />
                <div className="flex justify-between text-base"><span className="font-semibold">Final Payable</span><span className="font-bold text-status-available">₹{finalSalary.toLocaleString()}</span></div>
              </div>

              {member.salaryPaid ? (
                <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-status-available/8 text-status-available text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" /> Paid
                </div>
              ) : (
                <button onClick={() => { dispatch(paySalary(member.id)); toast.success(`Salary paid to ${member.name}`); }}
                  className="w-full py-3 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all btn-ripple shadow-md shadow-primary/20">
                  <span className="flex items-center justify-center gap-2"><DollarSign className="w-4 h-4" /> Pay Salary</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HRPage;
