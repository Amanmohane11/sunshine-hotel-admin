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

export interface BookingService {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'food' | 'laundry' | 'spa' | 'room_service' | 'mini_bar' | 'other';
}

export interface Booking {
  id: string;
  roomId: string;
  guests: Guest[];
  checkIn: string;
  checkOut: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  services: BookingService[];
  roomCharges: number;
  serviceCharges: number;
  tax: number;
  totalAmount: number;
  amountPaid: number;
  paymentMethod?: 'cash' | 'upi' | 'card';
  paymentStatus: 'pending' | 'partial' | 'paid';
}

export type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'reserved';
export type RoomType = 'couple' | 'multiple';

export interface DynamicPricing {
  weekendMultiplier: number;
  holidayMultiplier: number;
}

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  status: RoomStatus;
  price: number;
  floor: number;
  image: string;
  currentBooking?: Booking;
  dynamicPricing: DynamicPricing;
}

export interface ServiceOrder {
  id: string;
  roomId: string;
  roomNumber: string;
  type: 'room_service' | 'food' | 'laundry' | 'spa' | 'mini_bar' | 'other';
  description: string;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
}

export type Shift = 'morning' | 'afternoon' | 'night';
export type WorkType = 'full-time' | 'part-time';

// All possible feature access pages
export type FeaturePage = 'home' | 'dashboard' | 'staff' | 'rooms' | 'services' | 'inventory' | 'customers' | 'reports' | 'history' | 'hr_payroll';

export const ALL_FEATURE_PAGES: { key: FeaturePage; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'staff', label: 'Staff' },
  { key: 'rooms', label: 'Rooms' },
  { key: 'services', label: 'Services' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'customers', label: 'Customers' },
  { key: 'reports', label: 'Reports' },
  { key: 'history', label: 'History' },
  { key: 'hr_payroll', label: 'HR & Payroll' },
];

export interface TaskAssignment {
  id: string;
  roomId: string;
  roomNumber: string;
  type: 'cleaning' | 'maintenance' | 'service';
  status: 'assigned' | 'in_progress' | 'completed';
  assignedAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  isManager: boolean;
  phone: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  shift: Shift;
  workType: WorkType;
  image: string;
  salary: number;
  attendance: { date: string; status: 'present' | 'half_day' | 'absent' }[];
  leaves: number;
  halfDays: number;
  salaryPaid: boolean;
  tasks: TaskAssignment[];
  featureAccess: FeaturePage[];
}

export interface Notification {
  id: string;
  type: 'checkout' | 'booking' | 'cleaning' | 'payment' | 'low_stock' | 'general';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  roomId?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  costPrice: number;
  mrp: number;
  margin: number;
  supplier: string;
  lastUpdated: string;
  minStock: number;
  expiryDate?: string;
}

export interface InventoryBill {
  id: string;
  billNumber: string;
  supplierName: string;
  supplierPhone: string;
  supplierAddress: string;
  products: { productId: string; productName: string; quantity: number; unitPrice: number; mrp: number; margin: number; expiryDate: string; total: number }[];
  subtotal: number;
  gst: number;
  total: number;
  date: string;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  type: 'stock_in' | 'stock_out';
  quantity: number;
  reason: string;
  date: string;
}

export interface InventoryCategory {
  id: string;
  name: string;
}

export interface GuestRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalVisits: number;
  totalSpend: number;
  preferences: string[];
  lastVisit: string;
  bookings: string[];
}

export interface BookingHistory {
  id: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  services: BookingService[];
  totalBill: number;
  paymentStatus: 'paid' | 'pending' | 'partial';
  paymentMethod?: 'cash' | 'upi' | 'card';
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  owner: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  rooms: number;
  roomLimit: number;
  subscription: string; // plan id
  subscriptionStart: string;
  subscriptionEnd: string;
  revenue: number;
  createdAt: string;
  image: string;
  adminId: string;
  adminPassword: string;
  featureAccess: FeaturePage[];
  subscriptionActive: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billing: 'monthly' | 'yearly';
  features: string[];
  featureAccess: FeaturePage[];
  maxRooms: number;
}

export interface HotelQuery {
  id: string;
  hotelId: string;
  hotelName: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  createdAt: string;
  response?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: 'inventory' | 'billing' | 'staff' | 'rooms' | 'system';
  details: string;
  user: string;
  timestamp: string;
}

// ---------- Dummy Data ----------

const roomImages = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1590490360182-c33d955a75e4?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop',
];

export const dummyRooms: Room[] = Array.from({ length: 24 }, (_, i) => {
  const statuses: RoomStatus[] = ['available', 'occupied', 'cleaning', 'reserved'];
  const status = statuses[i % 4];
  const room: Room = {
    id: `room-${i + 1}`,
    number: `${Math.floor(i / 6) + 1}${String((i % 6) + 1).padStart(2, '0')}`,
    type: i % 3 === 0 ? 'couple' : 'multiple',
    status,
    price: 2000 + Math.floor(Math.random() * 5000),
    floor: Math.floor(i / 6) + 1,
    image: roomImages[i % roomImages.length],
    dynamicPricing: { weekendMultiplier: 1.3, holidayMultiplier: 1.5 },
  };
  if (status === 'occupied') {
    room.currentBooking = {
      id: `bk-${i}`, roomId: room.id,
      guests: [{ id: `g-${i}-1`, name: `Guest ${i + 1}`, phone: '9876543210', address: '123 Street', email: `guest${i}@email.com`, age: 30, gender: 'Male' }],
      checkIn: new Date(Date.now() - 3600000 * 2).toISOString(),
      checkOut: new Date(Date.now() + 3600000 * 22).toISOString(),
      status: 'active', createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      services: [{ id: `bs-${i}-1`, name: 'Room Service', price: 500, quantity: 1, type: 'room_service' }],
      roomCharges: 3500, serviceCharges: 500, tax: 720, totalAmount: 4720, amountPaid: 3500, paymentMethod: 'upi', paymentStatus: 'partial',
    };
  }
  if (status === 'reserved') {
    room.currentBooking = {
      id: `bk-res-${i}`, roomId: room.id,
      guests: [{ id: `g-res-${i}`, name: `Future Guest ${i + 1}`, phone: '9876543299', address: '456 Avenue', email: `future${i}@email.com`, age: 28, gender: 'Female' }],
      checkIn: new Date(Date.now() + 3600000 * 24).toISOString(),
      checkOut: new Date(Date.now() + 3600000 * 48).toISOString(),
      status: 'active', createdAt: new Date().toISOString(), services: [],
      roomCharges: 4000, serviceCharges: 0, tax: 720, totalAmount: 4720, amountPaid: 0, paymentStatus: 'pending',
    };
  }
  return room;
});

export const dummyBookings: Booking[] = dummyRooms.filter(r => r.currentBooking).map(r => r.currentBooking!);

export const dummyServices: ServiceOrder[] = [
  { id: 's1', roomId: 'room-2', roomNumber: '102', type: 'food', description: 'Dinner for 2', amount: 1200, status: 'completed', createdAt: new Date().toISOString() },
  { id: 's2', roomId: 'room-5', roomNumber: '203', type: 'laundry', description: '5 items', amount: 500, status: 'in_progress', createdAt: new Date().toISOString() },
  { id: 's3', roomId: 'room-8', roomNumber: '302', type: 'spa', description: 'Full body massage', amount: 3000, status: 'pending', createdAt: new Date().toISOString() },
  { id: 's4', roomId: 'room-2', roomNumber: '102', type: 'room_service', description: 'Extra pillows & towels', amount: 0, status: 'completed', createdAt: new Date().toISOString() },
  { id: 's5', roomId: 'room-11', roomNumber: '401', type: 'food', description: 'Breakfast buffet', amount: 800, status: 'completed', createdAt: new Date().toISOString() },
  { id: 's6', roomId: 'room-14', roomNumber: '404', type: 'mini_bar', description: 'Beverages & snacks', amount: 1500, status: 'completed', createdAt: new Date().toISOString() },
  { id: 's7', roomId: 'room-2', roomNumber: '102', type: 'other', description: 'Airport transfer', amount: 2500, status: 'pending', createdAt: new Date().toISOString() },
];

const staffImages = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
];

const allFeatures: FeaturePage[] = ['home', 'dashboard', 'staff', 'rooms', 'services', 'inventory', 'customers', 'reports', 'history', 'hr_payroll'];

export const dummyStaff: StaffMember[] = [
  { id: 'st1', name: 'Rajesh Kumar', role: 'General Manager', isManager: true, phone: '9876543210', email: 'rajesh@hotel.com', age: 42, gender: 'Male', shift: 'morning', workType: 'full-time', image: staffImages[0], salary: 80000, attendance: [], leaves: 1, halfDays: 0, salaryPaid: false, tasks: [], featureAccess: allFeatures },
  { id: 'st2', name: 'Priya Sharma', role: 'Front Desk Manager', isManager: true, phone: '9876543211', email: 'priya@hotel.com', age: 35, gender: 'Female', shift: 'morning', workType: 'full-time', image: staffImages[1], salary: 55000, attendance: [], leaves: 0, halfDays: 1, salaryPaid: false, tasks: [], featureAccess: ['home', 'dashboard', 'rooms', 'customers', 'reports', 'history', 'services'] },
  { id: 'st3', name: 'Amit Patel', role: 'Housekeeping Manager', isManager: true, phone: '9876543212', email: 'amit@hotel.com', age: 38, gender: 'Male', shift: 'afternoon', workType: 'full-time', image: staffImages[2], salary: 50000, attendance: [], leaves: 2, halfDays: 0, salaryPaid: true, tasks: [], featureAccess: ['home', 'rooms', 'inventory'] },
  { id: 'st4', name: 'Sneha Reddy', role: 'Receptionist', isManager: false, phone: '9876543213', email: 'sneha@hotel.com', age: 26, gender: 'Female', shift: 'morning', workType: 'full-time', image: staffImages[3], salary: 25000, attendance: [], leaves: 3, halfDays: 2, salaryPaid: false, tasks: [{ id: 'task-1', roomId: 'room-3', roomNumber: '103', type: 'cleaning', status: 'assigned', assignedAt: new Date().toISOString() }], featureAccess: ['home', 'rooms'] },
  { id: 'st5', name: 'Vikram Singh', role: 'Housekeeping Staff', isManager: false, phone: '9876543214', email: 'vikram@hotel.com', age: 30, gender: 'Male', shift: 'afternoon', workType: 'full-time', image: staffImages[4], salary: 20000, attendance: [], leaves: 1, halfDays: 1, salaryPaid: false, tasks: [{ id: 'task-2', roomId: 'room-9', roomNumber: '303', type: 'cleaning', status: 'in_progress', assignedAt: new Date().toISOString() }], featureAccess: ['rooms'] },
  { id: 'st6', name: 'Meera Nair', role: 'Room Service', isManager: false, phone: '9876543215', email: 'meera@hotel.com', age: 28, gender: 'Female', shift: 'night', workType: 'part-time', image: staffImages[5], salary: 22000, attendance: [], leaves: 0, halfDays: 0, salaryPaid: true, tasks: [], featureAccess: ['home', 'rooms', 'services'] },
  { id: 'st7', name: 'Arjun Das', role: 'Security', isManager: false, phone: '9876543216', email: 'arjun@hotel.com', age: 33, gender: 'Male', shift: 'night', workType: 'full-time', image: staffImages[0], salary: 18000, attendance: [], leaves: 2, halfDays: 1, salaryPaid: false, tasks: [], featureAccess: ['home'] },
  { id: 'st8', name: 'Kavitha Iyer', role: 'Chef', isManager: false, phone: '9876543217', email: 'kavitha@hotel.com', age: 31, gender: 'Female', shift: 'morning', workType: 'full-time', image: staffImages[1], salary: 35000, attendance: [], leaves: 0, halfDays: 0, salaryPaid: false, tasks: [], featureAccess: ['home', 'services', 'inventory'] },
];

export const dummyNotifications: Notification[] = [
  { id: 'n1', type: 'checkout', title: 'Checkout Overdue', message: 'Room 102 checkout time is over. Contact guest immediately.', read: false, createdAt: new Date().toISOString(), roomId: 'room-2' },
  { id: 'n2', type: 'booking', title: 'New Booking', message: 'Room 205 booked for tomorrow by Guest 6.', read: false, createdAt: new Date(Date.now() - 3600000).toISOString(), roomId: 'room-5' },
  { id: 'n3', type: 'cleaning', title: 'Cleaning Required', message: 'Room 303 needs cleaning after checkout.', read: true, createdAt: new Date(Date.now() - 7200000).toISOString(), roomId: 'room-9' },
  { id: 'n4', type: 'payment', title: 'Payment Pending', message: 'Room 401 has pending payment of ₹1,220.', read: false, createdAt: new Date(Date.now() - 1800000).toISOString(), roomId: 'room-11' },
  { id: 'n5', type: 'low_stock', title: 'Low Stock Alert', message: 'Towels stock is running low (5 remaining).', read: false, createdAt: new Date(Date.now() - 900000).toISOString() },
];

export const dummyInventory: InventoryItem[] = [
  { id: 'inv-1', name: 'Bath Towels', category: 'Linens', quantity: 5, unit: 'pcs', costPrice: 250, mrp: 400, margin: 37.5, supplier: 'Linen World', lastUpdated: new Date().toISOString(), minStock: 20, expiryDate: '' },
  { id: 'inv-2', name: 'Bed Sheets', category: 'Linens', quantity: 45, unit: 'pcs', costPrice: 400, mrp: 650, margin: 38.5, supplier: 'Linen World', lastUpdated: new Date().toISOString(), minStock: 15, expiryDate: '' },
  { id: 'inv-3', name: 'Shampoo', category: 'Toiletries', quantity: 120, unit: 'bottles', costPrice: 50, mrp: 90, margin: 44.4, supplier: 'CleanCo', lastUpdated: new Date().toISOString(), minStock: 30, expiryDate: new Date(Date.now() + 86400000 * 90).toISOString() },
  { id: 'inv-4', name: 'Soap Bars', category: 'Toiletries', quantity: 0, unit: 'pcs', costPrice: 20, mrp: 35, margin: 42.9, supplier: 'CleanCo', lastUpdated: new Date().toISOString(), minStock: 50, expiryDate: new Date(Date.now() + 86400000 * 180).toISOString() },
  { id: 'inv-5', name: 'Toilet Paper', category: 'Toiletries', quantity: 200, unit: 'rolls', costPrice: 15, mrp: 25, margin: 40, supplier: 'CleanCo', lastUpdated: new Date().toISOString(), minStock: 40, expiryDate: '' },
  { id: 'inv-6', name: 'Mineral Water', category: 'Mini Bar', quantity: 80, unit: 'bottles', costPrice: 20, mrp: 40, margin: 50, supplier: 'AquaPure', lastUpdated: new Date().toISOString(), minStock: 50, expiryDate: new Date(Date.now() + 86400000 * 30).toISOString() },
  { id: 'inv-7', name: 'Chips', category: 'Mini Bar', quantity: 35, unit: 'packets', costPrice: 30, mrp: 50, margin: 40, supplier: 'SnackHub', lastUpdated: new Date().toISOString(), minStock: 20, expiryDate: new Date(Date.now() + 86400000 * 10).toISOString() },
  { id: 'inv-8', name: 'Cleaning Spray', category: 'Housekeeping', quantity: 12, unit: 'bottles', costPrice: 180, mrp: 280, margin: 35.7, supplier: 'CleanCo', lastUpdated: new Date().toISOString(), minStock: 10, expiryDate: new Date(Date.now() + 86400000 * 365).toISOString() },
  { id: 'inv-9', name: 'Pillow Covers', category: 'Linens', quantity: 30, unit: 'pcs', costPrice: 150, mrp: 250, margin: 40, supplier: 'Linen World', lastUpdated: new Date().toISOString(), minStock: 10, expiryDate: '' },
  { id: 'inv-10', name: 'Air Freshener', category: 'Housekeeping', quantity: 8, unit: 'cans', costPrice: 120, mrp: 200, margin: 40, supplier: 'CleanCo', lastUpdated: new Date().toISOString(), minStock: 5, expiryDate: new Date(Date.now() + 86400000 * 60).toISOString() },
];

export const dummyInventoryBills: InventoryBill[] = [
  { id: 'ib-1', billNumber: 'INV-2025-001', supplierName: 'Linen World', supplierPhone: '9876500001', supplierAddress: '12 Textile Lane', products: [{ productId: 'inv-1', productName: 'Bath Towels', quantity: 50, unitPrice: 250, mrp: 400, margin: 37.5, expiryDate: '', total: 12500 }, { productId: 'inv-2', productName: 'Bed Sheets', quantity: 30, unitPrice: 400, mrp: 650, margin: 38.5, expiryDate: '', total: 12000 }], subtotal: 24500, gst: 4410, total: 28910, date: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'ib-2', billNumber: 'INV-2025-002', supplierName: 'CleanCo', supplierPhone: '9876500002', supplierAddress: '45 Industrial Park', products: [{ productId: 'inv-3', productName: 'Shampoo', quantity: 100, unitPrice: 50, mrp: 90, margin: 44.4, expiryDate: new Date(Date.now() + 86400000 * 90).toISOString(), total: 5000 }, { productId: 'inv-4', productName: 'Soap Bars', quantity: 200, unitPrice: 20, mrp: 35, margin: 42.9, expiryDate: new Date(Date.now() + 86400000 * 180).toISOString(), total: 4000 }], subtotal: 9000, gst: 1620, total: 10620, date: new Date(Date.now() - 86400000 * 2).toISOString() },
];

export const dummyInventoryTransactions: InventoryTransaction[] = [
  { id: 'it-1', productId: 'inv-1', productName: 'Bath Towels', type: 'stock_in', quantity: 50, reason: 'Purchase from Linen World', date: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'it-2', productId: 'inv-1', productName: 'Bath Towels', type: 'stock_out', quantity: 45, reason: 'Housekeeping usage', date: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: 'it-3', productId: 'inv-3', productName: 'Shampoo', type: 'stock_in', quantity: 100, reason: 'Purchase from CleanCo', date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'it-4', productId: 'inv-6', productName: 'Mineral Water', type: 'stock_out', quantity: 20, reason: 'Mini bar restocking', date: new Date().toISOString() },
];

export const dummyCategories: InventoryCategory[] = [
  { id: 'cat-1', name: 'Linens' },
  { id: 'cat-2', name: 'Toiletries' },
  { id: 'cat-3', name: 'Mini Bar' },
  { id: 'cat-4', name: 'Housekeeping' },
];

export const dummyGuestRecords: GuestRecord[] = [
  { id: 'gr-1', name: 'Rahul Mehta', email: 'rahul@email.com', phone: '9876543001', totalVisits: 5, totalSpend: 85000, preferences: ['Sea View', 'King Bed', 'Late Checkout'], lastVisit: new Date(Date.now() - 86400000 * 15).toISOString(), bookings: ['bk-1', 'bk-3'] },
  { id: 'gr-2', name: 'Ananya Singh', email: 'ananya@email.com', phone: '9876543002', totalVisits: 3, totalSpend: 52000, preferences: ['Non-smoking', 'Extra pillows'], lastVisit: new Date(Date.now() - 86400000 * 7).toISOString(), bookings: ['bk-5'] },
  { id: 'gr-3', name: 'Karan Joshi', email: 'karan@email.com', phone: '9876543003', totalVisits: 8, totalSpend: 145000, preferences: ['Suite', 'Spa', 'Airport pickup'], lastVisit: new Date(Date.now() - 86400000 * 2).toISOString(), bookings: ['bk-2', 'bk-7'] },
  { id: 'gr-4', name: 'Divya Patel', email: 'divya@email.com', phone: '9876543004', totalVisits: 2, totalSpend: 28000, preferences: ['Quiet room'], lastVisit: new Date(Date.now() - 86400000 * 30).toISOString(), bookings: ['bk-4'] },
];

export const dummyBookingHistory: BookingHistory[] = [
  { id: 'bh-1', guestName: 'Rahul Mehta', roomNumber: '102', checkIn: new Date(Date.now() - 86400000 * 15).toISOString(), checkOut: new Date(Date.now() - 86400000 * 13).toISOString(), services: [{ id: 'bhs-1', name: 'Food', price: 1200, quantity: 2, type: 'food' }], totalBill: 9400, paymentStatus: 'paid', paymentMethod: 'card' },
  { id: 'bh-2', guestName: 'Karan Joshi', roomNumber: '301', checkIn: new Date(Date.now() - 86400000 * 7).toISOString(), checkOut: new Date(Date.now() - 86400000 * 5).toISOString(), services: [{ id: 'bhs-2', name: 'Spa', price: 3000, quantity: 1, type: 'spa' }, { id: 'bhs-3', name: 'Laundry', price: 500, quantity: 1, type: 'laundry' }], totalBill: 14500, paymentStatus: 'paid', paymentMethod: 'upi' },
  { id: 'bh-3', guestName: 'Ananya Singh', roomNumber: '205', checkIn: new Date(Date.now() - 86400000 * 3).toISOString(), checkOut: new Date(Date.now() - 86400000 * 1).toISOString(), services: [], totalBill: 7000, paymentStatus: 'paid', paymentMethod: 'cash' },
  { id: 'bh-4', guestName: 'Divya Patel', roomNumber: '404', checkIn: new Date(Date.now() - 86400000 * 30).toISOString(), checkOut: new Date(Date.now() - 86400000 * 28).toISOString(), services: [{ id: 'bhs-4', name: 'Room Service', price: 800, quantity: 1, type: 'room_service' }], totalBill: 8800, paymentStatus: 'pending' },
];

const hotelImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop',
];

export const dummyHotels: Hotel[] = [
  { id: 'h-1', name: 'Grand Palace Hotel', location: 'Mumbai', owner: 'Sanjay Kapoor', email: 'sanjay@grandpalace.com', phone: '9876500001', status: 'active', rooms: 50, roomLimit: 60, subscription: 'plan-3', subscriptionStart: new Date(Date.now() - 86400000 * 300).toISOString(), subscriptionEnd: new Date(Date.now() + 86400000 * 65).toISOString(), revenue: 5200000, createdAt: new Date(Date.now() - 86400000 * 365).toISOString(), image: hotelImages[0], adminId: 'grandpalace_admin', adminPassword: 'hotel123', featureAccess: allFeatures, subscriptionActive: true },
  { id: 'h-2', name: 'Sea View Resort', location: 'Goa', owner: 'Maria Fernandes', email: 'maria@seaview.com', phone: '9876500002', status: 'active', rooms: 30, roomLimit: 40, subscription: 'plan-2', subscriptionStart: new Date(Date.now() - 86400000 * 20).toISOString(), subscriptionEnd: new Date(Date.now() + 86400000 * 10).toISOString(), revenue: 2800000, createdAt: new Date(Date.now() - 86400000 * 180).toISOString(), image: hotelImages[1], adminId: 'seaview_admin', adminPassword: 'hotel123', featureAccess: ['home', 'dashboard', 'rooms', 'staff', 'hr_payroll'], subscriptionActive: true },
  { id: 'h-3', name: 'Mountain Lodge', location: 'Shimla', owner: 'Ravi Thakur', email: 'ravi@mountainlodge.com', phone: '9876500003', status: 'inactive', rooms: 20, roomLimit: 25, subscription: 'plan-1', subscriptionStart: new Date(Date.now() - 86400000 * 60).toISOString(), subscriptionEnd: new Date(Date.now() - 86400000 * 30).toISOString(), revenue: 900000, createdAt: new Date(Date.now() - 86400000 * 90).toISOString(), image: hotelImages[2], adminId: 'mountain_admin', adminPassword: 'hotel123', featureAccess: ['home', 'dashboard', 'rooms'], subscriptionActive: false },
  { id: 'h-4', name: 'City Business Hotel', location: 'Delhi', owner: 'Neha Agarwal', email: 'neha@citybusiness.com', phone: '9876500004', status: 'pending', rooms: 40, roomLimit: 50, subscription: 'plan-2', subscriptionStart: '', subscriptionEnd: '', revenue: 0, createdAt: new Date().toISOString(), image: hotelImages[3], adminId: 'citybusiness_admin', adminPassword: 'hotel123', featureAccess: [], subscriptionActive: false },
];

export const dummyHotelQueries: HotelQuery[] = [
  { id: 'q-1', hotelId: 'h-1', hotelName: 'Grand Palace Hotel', subject: 'Payment gateway issue', message: 'We are facing issues with UPI payments not reflecting in our dashboard.', status: 'open', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'q-2', hotelId: 'h-2', hotelName: 'Sea View Resort', subject: 'Feature request - Spa module', message: 'Can you add a dedicated spa booking module to our system?', status: 'open', createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: 'q-3', hotelId: 'h-1', hotelName: 'Grand Palace Hotel', subject: 'Report export not working', message: 'Excel export in the reports section is showing blank files.', status: 'resolved', createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), response: 'Fixed in the latest update. Please refresh your browser cache.' },
];

export const dummySubscriptionPlans: SubscriptionPlan[] = [
  { id: 'plan-1', name: 'Basic', price: 4999, billing: 'monthly', features: ['Home', 'Dashboard', 'Rooms'], featureAccess: ['home', 'dashboard', 'rooms'], maxRooms: 20 },
  { id: 'plan-2', name: 'Professional', price: 9999, billing: 'monthly', features: ['Home', 'Dashboard', 'Rooms', 'Staff', 'HR & Payroll'], featureAccess: ['home', 'dashboard', 'rooms', 'staff', 'hr_payroll'], maxRooms: 50 },
  { id: 'plan-3', name: 'Enterprise', price: 24999, billing: 'monthly', features: ['Full Access (All Modules)'], featureAccess: allFeatures, maxRooms: 999 },
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

export const housekeepingData = [
  { name: 'Ready', value: 14, color: 'hsl(142,71%,45%)' },
  { name: 'Dirty', value: 6, color: 'hsl(0,72%,51%)' },
  { name: 'Out-of-Order', value: 4, color: 'hsl(45,100%,51%)' },
];

export const superAdminMonthlyEarnings = [
  { name: 'Jan', earnings: 120000, hotels: 8 }, { name: 'Feb', earnings: 145000, hotels: 10 },
  { name: 'Mar', earnings: 160000, hotels: 12 }, { name: 'Apr', earnings: 135000, hotels: 11 },
  { name: 'May', earnings: 180000, hotels: 14 }, { name: 'Jun', earnings: 200000, hotels: 16 },
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
