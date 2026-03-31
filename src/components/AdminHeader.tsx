import { Search, Bell, User } from 'lucide-react';
import { useState } from 'react';

const AdminHeader = () => {
  const [search, setSearch] = useState('');

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">H</span>
        </div>
        <span className="font-bold text-xl tracking-tight">HotelDesk</span>
      </div>

      <div className="hidden md:flex items-center bg-muted rounded-lg px-4 py-2 w-80">
        <Search className="w-4 h-4 text-muted-foreground mr-2" />
        <input
          type="text"
          placeholder="Search rooms, guests, staff..."
          className="bg-transparent outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="hidden md:block text-sm font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
