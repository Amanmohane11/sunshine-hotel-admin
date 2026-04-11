export const revenueData = {
  daily: [
    { name: 'Mon', revenue: 45000 },
    { name: 'Tue', revenue: 52000 },
    { name: 'Wed', revenue: 48000 },
    { name: 'Thu', revenue: 61000 },
    { name: 'Fri', revenue: 75000 },
    { name: 'Sat', revenue: 88000 },
    { name: 'Sun', revenue: 82000 },
  ],
  weekly: [
    { name: 'W1', revenue: 320000 },
    { name: 'W2', revenue: 380000 },
    { name: 'W3', revenue: 350000 },
    { name: 'W4', revenue: 410000 },
  ],
  monthly: [
    { name: 'Jan', revenue: 1200000 },
    { name: 'Feb', revenue: 1100000 },
    { name: 'Mar', revenue: 1400000 },
    { name: 'Apr', revenue: 1350000 },
    { name: 'May', revenue: 1600000 },
    { name: 'Jun', revenue: 1800000 },
  ],
  yearly: [
    { name: '2021', revenue: 12000000 },
    { name: '2022', revenue: 15000000 },
    { name: '2023', revenue: 18500000 },
  ],
};

export const bookingData = {
  daily: [
    { name: 'Mon', bookings: 12 },
    { name: 'Tue', bookings: 15 },
    { name: 'Wed', bookings: 14 },
    { name: 'Thu', bookings: 18 },
    { name: 'Fri', bookings: 24 },
    { name: 'Sat', bookings: 28 },
    { name: 'Sun', bookings: 22 },
  ],
  weekly: [
    { name: 'W1', bookings: 95 },
    { name: 'W2', bookings: 110 },
    { name: 'W3', bookings: 105 },
    { name: 'W4', bookings: 125 },
  ],
  monthly: [
    { name: 'Jan', bookings: 450 },
    { name: 'Feb', bookings: 420 },
    { name: 'Mar', bookings: 510 },
    { name: 'Apr', bookings: 480 },
    { name: 'May', bookings: 550 },
    { name: 'Jun', bookings: 600 },
  ],
};

export const revenueSourceData = [
  { name: 'Rooms', value: 65 },
  { name: 'F&B', value: 20 },
  { name: 'Spa', value: 10 },
  { name: 'Other', value: 5 },
];

export const housekeepingData = [
  { name: 'Clean', value: 45, color: 'hsl(145,63%,42%)' },
  { name: 'Dirty', value: 12, color: 'hsl(354,70%,54%)' },
  { name: 'Occupied', value: 38, color: 'hsl(211,100%,50%)' },
];

export const monthlyFinance = [
  { name: 'Jan', spending: 800000, profit: 400000 }, { name: 'Feb', spending: 750000, profit: 350000 },
  { name: 'Mar', spending: 900000, profit: 500000 }, { name: 'Apr', spending: 850000, profit: 450000 },
  { name: 'May', spending: 950000, profit: 550000 }, { name: 'Jun', spending: 1000000, profit: 600000 },
];

// Detailed monthly report data
export interface MonthlyReport {
  month: string;
  spending: {
    total: number;
    inventory: number;
    staffSalaries: number;
    maintenance: number;
    utilities: number;
    other: number;
  };
  profit: {
    total: number;
    roomBookings: number;
    services: number;
    otherIncome: number;
  };
}

export const monthlyReports: MonthlyReport[] = [
  { month: 'Jan', spending: { total: 800000, inventory: 250000, staffSalaries: 320000, maintenance: 80000, utilities: 100000, other: 50000 }, profit: { total: 400000, roomBookings: 280000, services: 80000, otherIncome: 40000 } },
  { month: 'Feb', spending: { total: 750000, inventory: 220000, staffSalaries: 320000, maintenance: 60000, utilities: 95000, other: 55000 }, profit: { total: 350000, roomBookings: 240000, services: 70000, otherIncome: 40000 } },
  { month: 'Mar', spending: { total: 900000, inventory: 300000, staffSalaries: 320000, maintenance: 100000, utilities: 110000, other: 70000 }, profit: { total: 500000, roomBookings: 350000, services: 100000, otherIncome: 50000 } },
  { month: 'Apr', spending: { total: 850000, inventory: 280000, staffSalaries: 320000, maintenance: 90000, utilities: 105000, other: 55000 }, profit: { total: 450000, roomBookings: 310000, services: 90000, otherIncome: 50000 } },
  { month: 'May', spending: { total: 950000, inventory: 320000, staffSalaries: 330000, maintenance: 110000, utilities: 120000, other: 70000 }, profit: { total: 550000, roomBookings: 380000, services: 110000, otherIncome: 60000 } },
  { month: 'Jun', spending: { total: 1000000, inventory: 350000, staffSalaries: 330000, maintenance: 120000, utilities: 125000, other: 75000 }, profit: { total: 600000, roomBookings: 420000, services: 120000, otherIncome: 60000 } },
];
