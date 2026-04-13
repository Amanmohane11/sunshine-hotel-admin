import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, CreditCard, Bell, Shield, Globe } from 'lucide-react';
import { toast } from 'sonner';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [hotelName, setHotelName] = useState('Grand Palace Hotel');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [currency, setCurrency] = useState('INR');
  const [notifications, setNotifications] = useState(true);
  const [autoCheckout, setAutoCheckout] = useState(true);

  return (
    <div className="animate-slide-up max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your hotel preferences</p>
      </div>

      {/* General Settings */}
      <div className="glass-card rounded-2xl border border-border/50 p-5 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-primary" /> General Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5">Hotel Name</label>
            <input value={hotelName} onChange={e => setHotelName(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">Timezone</label>
              <select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all">
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5">Currency</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all">
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
            </div>
          </div>
          <button onClick={() => toast.success('Settings saved')} className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-sm shadow-primary/20">
            Save Changes
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card rounded-2xl border border-border/50 p-5 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> Notifications</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-muted/30 cursor-pointer">
            <span className="text-sm font-medium">Push Notifications</span>
            <button onClick={() => setNotifications(!notifications)} className={`w-11 h-6 rounded-full transition-all duration-200 ${notifications ? 'bg-primary' : 'bg-muted-foreground/30'} relative`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-background shadow transition-all duration-200 ${notifications ? 'left-5.5 translate-x-0' : 'left-0.5'}`} style={{ left: notifications ? '22px' : '2px' }} />
            </button>
          </label>
          <label className="flex items-center justify-between p-3 rounded-xl bg-muted/30 cursor-pointer">
            <span className="text-sm font-medium">Auto-checkout Reminder</span>
            <button onClick={() => setAutoCheckout(!autoCheckout)} className={`w-11 h-6 rounded-full transition-all duration-200 ${autoCheckout ? 'bg-primary' : 'bg-muted-foreground/30'} relative`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-background shadow transition-all duration-200`} style={{ left: autoCheckout ? '22px' : '2px' }} />
            </button>
          </label>
        </div>
      </div>

      {/* Security */}
      <div className="glass-card rounded-2xl border border-border/50 p-5 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> Security</h3>
        <p className="text-sm text-muted-foreground mb-3">Protected pages (Dashboard, HR, Reports) require password <strong>1234</strong> to access.</p>
      </div>

      {/* Subscription */}
      <div className="glass-card rounded-2xl border border-border/50 p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Subscription</h3>
        <p className="text-sm text-muted-foreground mb-4">View and manage your subscription plan.</p>
        <button onClick={() => navigate('/subscription')} className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-sm shadow-primary/20">
          View Plans
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
