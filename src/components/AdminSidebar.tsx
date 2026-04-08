import { Home, LayoutDashboard, BedDouble, ConciergeBell, Users, Wallet, Bell, Package, History, UserCircle, Building2, ChevronDown, ChevronRight, HelpCircle, FileText, BarChart3, Receipt, MessageSquare, CreditCard, Inbox } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store';
import { useState } from 'react';

/* ── Hotel Admin links ── */
const hotelMainLinks = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/rooms', icon: BedDouble, label: 'Rooms' },
  { to: '/services', icon: ConciergeBell, label: 'Services' },
  { to: '/staff', icon: Users, label: 'Staff' },
  { to: '/hr', icon: Wallet, label: 'HR & Payroll' },
];

const inventoryLinks = [
  { to: '/inventory', icon: Package, label: 'All Products' },
  { to: '/inventory/create-bill', icon: Receipt, label: 'Create Bill' },
  { to: '/inventory/history', icon: History, label: 'Bill History' },
];

const hotelMoreLinks = [
  { to: '/booking-history', icon: History, label: 'History' },
  { to: '/customers', icon: UserCircle, label: 'Customers' },
  { to: '/billing', icon: FileText, label: 'Billing' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/help', icon: HelpCircle, label: 'Help & Support' },
];

/* ── Super Admin links ── */
const superAdminLinks = [
  { to: '/super-admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/help', icon: HelpCircle, label: 'Help & Support' },
];

const AdminSidebar = () => {
  const unreadCount = useAppSelector(s => s.notifications.items.filter(n => !n.read).length);
  const userRole = useAppSelector(s => s.auth.user?.role);
  const location = useLocation();
  const [inventoryOpen, setInventoryOpen] = useState(location.pathname.startsWith('/inventory'));

  const renderLink = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <NavLink
      key={to}
      to={to}
      end={to === '/' || to === '/super-admin'}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
          isActive
            ? 'gradient-primary text-primary-foreground shadow-md shadow-primary/20'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        )
      }
    >
      <Icon className="w-[18px] h-[18px] transition-transform duration-200 group-hover:scale-110" />
      <span className="flex-1">{label}</span>
    </NavLink>
  );

  /* ── Super Admin Sidebar ── */
  if (userRole === 'superadmin') {
    return (
      <aside className="w-64 min-h-[calc(100vh-4rem)] gradient-dark border-r border-sidebar-border flex flex-col py-5 shrink-0">
        <div className="px-5 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-sidebar-foreground/30">Platform</span>
        </div>
        <nav className="flex flex-col gap-0.5 px-3">
          {superAdminLinks.map(renderLink)}
        </nav>
      </aside>
    );
  }

  /* ── Hotel Admin Sidebar ── */
  const isInventoryActive = location.pathname.startsWith('/inventory');

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] gradient-dark border-r border-sidebar-border flex flex-col py-5 shrink-0">
      <nav className="flex flex-col gap-0.5 px-3">
        {hotelMainLinks.map(renderLink)}
      </nav>

      {/* Inventory Dropdown */}
      <div className="px-3 mt-1">
        <button
          onClick={() => setInventoryOpen(!inventoryOpen)}
          className={cn(
            'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full group',
            isInventoryActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          )}
        >
          <Package className="w-[18px] h-[18px] transition-transform duration-200 group-hover:scale-110" />
          <span className="flex-1 text-left">Inventory</span>
          {inventoryOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        <div className={cn('overflow-hidden transition-all duration-300', inventoryOpen ? 'max-h-40 opacity-100 mt-0.5' : 'max-h-0 opacity-0')}>
          <div className="ml-4 pl-4 border-l border-sidebar-border/50 space-y-0.5">
            {inventoryLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  cn(
                    'block px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200',
                    isActive
                      ? 'text-sidebar-primary bg-sidebar-primary/10'
                      : 'text-sidebar-foreground/60 hover:text-sidebar-foreground/90'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 mt-5 mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-sidebar-foreground/30">More</span>
      </div>
      <nav className="flex flex-col gap-0.5 px-3">
        {hotelMoreLinks.map(renderLink)}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
