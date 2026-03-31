// Dummy data - replace with real API calls when ready

export interface Guest {
  id: string;
  name: string;
  phone: string;
  address: string;
  aadhaarUrl?: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
}

export interface Booking {
  id: string;
  roomId: string;
  guests: Guest[];
  checkIn: string;
  checkOut: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export type RoomStatus = 'available' | 'occupied' | 'cleaning';
export type RoomType = 'couple' | 'multiple';

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  status: RoomStatus;
  price: number;
  floor: number;
  image: string;
  currentBooking?: Booking;
}

export interface ServiceOrder {
  id: string;
  roomId: string;
  roomNumber: string;
  type: 'room_service' | 'food' | 'laundry' | 'spa' | 'other';
  description: string;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
}

export type Shift = 'morning' | 'afternoon' | 'night';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  isManager: boolean;
  phone: string;
  email: string;
  shift: Shift;
  image: string;
  salary: number;
  attendance: { date: string; status: 'present' | 'half_day' | 'absent' }[];
  leaves: number;
  halfDays: number;
  salaryPaid: boolean;
}

const roomImages = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1590490360182-c33d955a75e4?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop',
];

export const dummyRooms: Room[] = Array.from({ length: 24 }, (_, i) => {
  const statuses: RoomStatus[] = ['available', 'occupied', 'cleaning'];
  const status = statuses[i % 3];
  const room: Room = {
    id: `room-${i + 1}`,
    number: `${Math.floor(i / 6) + 1}${String((i % 6) + 1).padStart(2, '0')}`,
    type: i % 3 === 0 ? 'couple' : 'multiple',
    status,
    price: 2000 + Math.floor(Math.random() * 5000),
    floor: Math.floor(i / 6) + 1,
    image: roomImages[i % roomImages.length],
  };
  if (status === 'occupied') {
    room.currentBooking = {
      id: `bk-${i}`,
      roomId: room.id,
      guests: [
        { id: `g-${i}-1`, name: `Guest ${i + 1}`, phone: '9876543210', address: '123 Street', email: `guest${i}@email.com`, age: 30, gender: 'Male' },
      ],
      checkIn: new Date(Date.now() - 3600000 * 2).toISOString(),
      checkOut: new Date(Date.now() + 3600000 * 22).toISOString(),
      status: 'active',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    };
  }
  return room;
});

export const dummyBookings: Booking[] = dummyRooms
  .filter(r => r.currentBooking)
  .map(r => r.currentBooking!);

export const dummyServices: ServiceOrder[] = [
  { id: 's1', roomId: 'room-2', roomNumber: '102', type: 'food', description: 'Dinner for 2', amount: 1200, status: 'completed', createdAt: new Date().toISOString() },
  { id: 's2', roomId: 'room-5', roomNumber: '203', type: 'laundry', description: '5 items', amount: 500, status: 'in_progress', createdAt: new Date().toISOString() },
  { id: 's3', roomId: 'room-8', roomNumber: '302', type: 'spa', description: 'Full body massage', amount: 3000, status: 'pending', createdAt: new Date().toISOString() },
  { id: 's4', roomId: 'room-2', roomNumber: '102', type: 'room_service', description: 'Extra pillows & towels', amount: 0, status: 'completed', createdAt: new Date().toISOString() },
  { id: 's5', roomId: 'room-11', roomNumber: '401', type: 'food', description: 'Breakfast buffet', amount: 800, status: 'completed', createdAt: new Date().toISOString() },
  { id: 's6', roomId: 'room-14', roomNumber: '404', type: 'other', description: 'Airport transfer', amount: 2500, status: 'pending', createdAt: new Date().toISOString() },
];

const staffImages = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
];

export const dummyStaff: StaffMember[] = [
  { id: 'st1', name: 'Rajesh Kumar', role: 'General Manager', isManager: true, phone: '9876543210', email: 'rajesh@hotel.com', shift: 'morning', image: staffImages[0], salary: 80000, attendance: [], leaves: 1, halfDays: 0, salaryPaid: false },
  { id: 'st2', name: 'Priya Sharma', role: 'Front Desk Manager', isManager: true, phone: '9876543211', email: 'priya@hotel.com', shift: 'morning', image: staffImages[1], salary: 55000, attendance: [], leaves: 0, halfDays: 1, salaryPaid: false },
  { id: 'st3', name: 'Amit Patel', role: 'Housekeeping Manager', isManager: true, phone: '9876543212', email: 'amit@hotel.com', shift: 'afternoon', image: staffImages[2], salary: 50000, attendance: [], leaves: 2, halfDays: 0, salaryPaid: true },
  { id: 'st4', name: 'Sneha Reddy', role: 'Receptionist', isManager: false, phone: '9876543213', email: 'sneha@hotel.com', shift: 'morning', image: staffImages[3], salary: 25000, attendance: [], leaves: 3, halfDays: 2, salaryPaid: false },
  { id: 'st5', name: 'Vikram Singh', role: 'Housekeeping Staff', isManager: false, phone: '9876543214', email: 'vikram@hotel.com', shift: 'afternoon', image: staffImages[4], salary: 20000, attendance: [], leaves: 1, halfDays: 1, salaryPaid: false },
  { id: 'st6', name: 'Meera Nair', role: 'Room Service', isManager: false, phone: '9876543215', email: 'meera@hotel.com', shift: 'night', image: staffImages[5], salary: 22000, attendance: [], leaves: 0, halfDays: 0, salaryPaid: true },
  { id: 'st7', name: 'Arjun Das', role: 'Security', isManager: false, phone: '9876543216', email: 'arjun@hotel.com', shift: 'night', image: staffImages[0], salary: 18000, attendance: [], leaves: 2, halfDays: 1, salaryPaid: false },
  { id: 'st8', name: 'Kavitha Iyer', role: 'Chef', isManager: false, phone: '9876543217', email: 'kavitha@hotel.com', shift: 'morning', image: staffImages[1], salary: 35000, attendance: [], leaves: 0, halfDays: 0, salaryPaid: false },
];

export const revenueData = {
  daily: [
    { name: 'Mon', revenue: 45000 }, { name: 'Tue', revenue: 52000 }, { name: 'Wed', revenue: 38000 },
    { name: 'Thu', revenue: 61000 }, { name: 'Fri', revenue: 72000 }, { name: 'Sat', revenue: 89000 }, { name: 'Sun', revenue: 67000 },
  ],
  weekly: [
    { name: 'W1', revenue: 320000 }, { name: 'W2', revenue: 410000 }, { name: 'W3', revenue: 380000 }, { name: 'W4', revenue: 450000 },
  ],
  monthly: [
    { name: 'Jan', revenue: 1200000 }, { name: 'Feb', revenue: 1100000 }, { name: 'Mar', revenue: 1400000 },
    { name: 'Apr', revenue: 1300000 }, { name: 'May', revenue: 1500000 }, { name: 'Jun', revenue: 1600000 },
  ],
  yearly: [
    { name: '2021', revenue: 12000000 }, { name: '2022', revenue: 14500000 }, { name: '2023', revenue: 16000000 },
    { name: '2024', revenue: 18500000 }, { name: '2025', revenue: 15000000 },
  ],
};

export const bookingData = {
  daily: [
    { name: 'Mon', bookings: 8 }, { name: 'Tue', bookings: 12 }, { name: 'Wed', bookings: 6 },
    { name: 'Thu', bookings: 15 }, { name: 'Fri', bookings: 20 }, { name: 'Sat', bookings: 25 }, { name: 'Sun', bookings: 18 },
  ],
  weekly: [
    { name: 'W1', bookings: 65 }, { name: 'W2', bookings: 82 }, { name: 'W3', bookings: 74 }, { name: 'W4', bookings: 90 },
  ],
  monthly: [
    { name: 'Jan', bookings: 280 }, { name: 'Feb', bookings: 310 }, { name: 'Mar', bookings: 350 },
    { name: 'Apr', bookings: 290 }, { name: 'May', bookings: 380 }, { name: 'Jun', bookings: 400 },
  ],
};

export const monthlyFinance = [
  { name: 'Jan', spending: 800000, profit: 400000 }, { name: 'Feb', spending: 750000, profit: 350000 },
  { name: 'Mar', spending: 900000, profit: 500000 }, { name: 'Apr', spending: 850000, profit: 450000 },
  { name: 'May', spending: 950000, profit: 550000 }, { name: 'Jun', spending: 1000000, profit: 600000 },
];

export const revenueSourceData = [
  { name: 'Rooms', value: 60 }, { name: 'Food', value: 22 }, { name: 'Services', value: 12 }, { name: 'Others', value: 6 },
];
