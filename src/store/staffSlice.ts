import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StaffMember, TaskAssignment, dummyStaff } from './dummyData';

interface StaffState {
  members: StaffMember[];
  selectedStaff: StaffMember | null;
}

const initialState: StaffState = {
  members: dummyStaff,
  selectedStaff: null,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    selectStaff(state, action: PayloadAction<string>) {
      state.selectedStaff = state.members.find(m => m.id === action.payload) || null;
    },
    clearSelectedStaff(state) {
      state.selectedStaff = null;
    },
    markAttendance(state, action: PayloadAction<{ id: string; status: 'present' | 'half_day' }>) {
      const member = state.members.find(m => m.id === action.payload.id);
      if (member) {
        const today = new Date().toISOString().split('T')[0];
        const existing = member.attendance.find(a => a.date === today);
        if (!existing) {
          member.attendance.push({ date: today, status: action.payload.status });
          if (action.payload.status === 'half_day') member.halfDays += 1;
        }
      }
    },
    paySalary(state, action: PayloadAction<string>) {
      const member = state.members.find(m => m.id === action.payload);
      if (member) member.salaryPaid = true;
    },
    assignTask(state, action: PayloadAction<{ staffId: string; task: TaskAssignment }>) {
      const member = state.members.find(m => m.id === action.payload.staffId);
      if (member) member.tasks.push(action.payload.task);
    },
    updateTaskStatus(state, action: PayloadAction<{ staffId: string; taskId: string; status: TaskAssignment['status'] }>) {
      const member = state.members.find(m => m.id === action.payload.staffId);
      if (member) {
        const task = member.tasks.find(t => t.id === action.payload.taskId);
        if (task) task.status = action.payload.status;
      }
    },
  },
});

export const { selectStaff, clearSelectedStaff, markAttendance, paySalary, assignTask, updateTaskStatus } = staffSlice.actions;
export default staffSlice.reducer;
