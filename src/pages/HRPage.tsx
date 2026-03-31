import { useAppSelector, useAppDispatch } from '@/store';
import { paySalary } from '@/store/staffSlice';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

const PER_LEAVE_DEDUCTION = 1500;
const PER_HALFDAY_DEDUCTION = 750;

const HRPage = () => {
  const dispatch = useAppDispatch();
  const members = useAppSelector(s => s.staff.members);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">HR & Payroll</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map(member => {
          const leaveDeduction = member.leaves * PER_LEAVE_DEDUCTION;
          const halfDayDeduction = member.halfDays * PER_HALFDAY_DEDUCTION;
          const totalDeduction = leaveDeduction + halfDayDeduction;
          const finalSalary = member.salary - totalDeduction;

          return (
            <div key={member.id} className="bg-card rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-sm">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{member.phone}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shift</span><span className="capitalize">{member.shift}</span></div>
                <div className="border-t border-border my-2" />
                <div className="flex justify-between"><span className="text-muted-foreground">Total Salary</span><span className="font-medium">₹{member.salary.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Leaves ({member.leaves})</span><span className="text-destructive">-₹{leaveDeduction.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Half Days ({member.halfDays})</span><span className="text-destructive">-₹{halfDayDeduction.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Total Deduction</span><span className="text-destructive font-medium">-₹{totalDeduction.toLocaleString()}</span></div>
                <div className="border-t border-border my-2" />
                <div className="flex justify-between text-base"><span className="font-semibold">Final Payable</span><span className="font-bold text-status-available">₹{finalSalary.toLocaleString()}</span></div>
              </div>

              {member.salaryPaid ? (
                <div className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-status-available/10 text-status-available text-sm font-medium">
                  <CheckCircle className="w-4 h-4" /> Paid
                </div>
              ) : (
                <button
                  onClick={() => { dispatch(paySalary(member.id)); toast.success(`Salary paid to ${member.name}`); }}
                  className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Pay Salary
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
