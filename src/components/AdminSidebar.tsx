import { Home, LayoutDashboard, BedDouble, ConciergeBell, Users, Wallet } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const links = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/rooms', icon: BedDouble, label: 'Rooms' },
  { to: '/services', icon: ConciergeBell, label: 'Services' },
  { to: '/staff', icon: Users, label: 'Staff' },
  { to: '/hr', icon: Wallet, label: 'HR' },
];

const AdminSidebar = () => {
  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border flex flex-col py-6 shrink-0">
      <nav className="flex flex-col gap-1 px-3">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
