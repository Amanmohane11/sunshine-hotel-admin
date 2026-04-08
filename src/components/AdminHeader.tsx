import { Search, Bell, User, ChevronDown, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { logout } from '@/store/authSlice';

const AdminHeader = () => {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const unreadCount = useAppSelector(s => s.notifications.items.filter(n => !n.read).length);
  const user = useAppSelector(s => s.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-border/50 bg-card/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-primary-foreground font-bold text-lg">H</span>
        </div>
        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">HotelDesk</span>
      </div>

      <div className="hidden md:flex items-center bg-muted/60 rounded-xl px-4 py-2.5 w-80 border border-border/50 focus-within:border-primary/40 focus-within:bg-card transition-all duration-200">
        <Search className="w-4 h-4 text-muted-foreground mr-2" />
        <input
          type="text"
          placeholder="Search rooms, guests, staff..."
          className="bg-transparent outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2.5 rounded-xl hover:bg-muted transition-all duration-200 group"
        >
          <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center gradient-primary rounded-full text-[10px] font-bold text-primary-foreground shadow-lg shadow-primary/30 animate-scale-in">
              {unreadCount}
            </span>
          )}
        </button>
        <div className="relative flex items-center gap-2 pl-3 border-l border-border/50">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <User className="w-4.5 h-4.5 text-primary" />
          </div>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="hidden md:flex items-center gap-1 cursor-pointer"
          >
            <div className="text-left">
              <span className="text-sm font-medium block">{user?.name || 'Admin'}</span>
              <span className="text-[10px] text-muted-foreground capitalize">{user?.role || 'admin'}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-12 bg-card border border-border rounded-xl shadow-lg py-1 min-w-[160px] z-50 animate-scale-in">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-muted/60 w-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
