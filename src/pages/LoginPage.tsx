import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { login, UserRole } from '@/store/authSlice';
import { Building2, Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const demoUsers = [
  { id: 'sa1', name: 'Super Admin', email: 'superadmin@hoteldesk.com', role: 'superadmin' as UserRole, password: 'admin123' },
  { id: 'ha1', name: 'Hotel Admin', email: 'hoteladmin@hoteldesk.com', role: 'hoteladmin' as UserRole, password: 'hotel123', hotelId: 'h1' },
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = demoUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      setError('Invalid email or password');
      return;
    }

    dispatch(login({ id: user.id, name: user.name, email: user.email, role: user.role, hotelId: user.hotelId }));
    navigate(user.role === 'superadmin' ? '/super-admin' : '/');
  };

  const quickLogin = (role: UserRole) => {
    const user = demoUsers.find(u => u.role === role)!;
    dispatch(login({ id: user.id, name: user.name, email: user.email, role: user.role, hotelId: user.hotelId }));
    navigate(role === 'superadmin' ? '/super-admin' : '/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-bold text-2xl">H</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome to HotelDesk</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to your admin panel</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-6 rounded-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@hoteldesk.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-muted/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <button type="submit" className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-md shadow-primary/20">
              Sign In
            </button>
          </form>

          {/* Quick Login */}
          <div className="mt-6 pt-5 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center mb-3">Quick Demo Login</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => quickLogin('superadmin')}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/50 bg-muted/30 text-sm font-medium text-foreground hover:bg-muted/60 transition-all"
              >
                <Shield className="w-4 h-4 text-primary" />
                Super Admin
              </button>
              <button
                onClick={() => quickLogin('hoteladmin')}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/50 bg-muted/30 text-sm font-medium text-foreground hover:bg-muted/60 transition-all"
              >
                <Building2 className="w-4 h-4 text-primary" />
                Hotel Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
