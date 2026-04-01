import { Home, LayoutDashboard, BedDouble, ConciergeBell, Users, Wallet, Bell, Package, History, UserCircle, Building2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store';

const mainLinks = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/rooms', icon: BedDouble, label: 'Rooms' },
  { to: '/services', icon: ConciergeBell, label: 'Services' },
  { to: '/staff', icon: Users, label: 'Staff' },
  { to: '/hr', icon: Wallet, label: 'HR' },
];

const moreLinks = [
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/inventory', icon: Package, label: 'Inventory' },
  { to: '/booking-history', icon: History, label: 'History' },
  { to: '/guest-crm', icon: UserCircle, label: 'Guest CRM' },
  { to: '/super-admin', icon: Building2, label: 'Super Admin' },
];

const AdminSidebar = () => {
  const unreadCount = useAppSelector(s => s.notifications.items.filter(n => !n.read).length);

  const renderLink = ({ to, icon: Icon, label }: typeof mainLinks[0]) => (
    <NavLink
      key={to}
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        )
      }
    >
      <Icon className="w-5 h-5" />
      <span className="flex-1">{label}</span>
      {label === 'Notifications' && unreadCount > 0 && (
        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{unreadCount}</span>
      )}
    </NavLink>
  );

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border flex flex-col py-4 shrink-0">
      <nav className="flex flex-col gap-0.5 px-3">
        {mainLinks.map(renderLink)}
      </nav>
      <div className="px-5 mt-6 mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">More</span>
      </div>
      <nav className="flex flex-col gap-0.5 px-3">
        {moreLinks.map(renderLink)}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
