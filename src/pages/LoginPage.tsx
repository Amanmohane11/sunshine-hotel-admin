import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { login, UserRole } from '@/store/authSlice';
import { Building2, Shield, Phone, Lock, Eye, EyeOff, ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';

const demoUsers = [
  { id: 'sa1', name: 'Super Admin', email: 'superadmin@hoteldesk.com', phone: '9876543000', role: 'superadmin' as UserRole, password: 'admin123' },
  { id: 'ha1', name: 'Hotel Admin', email: 'hoteladmin@hoteldesk.com', phone: '9876543001', role: 'hoteladmin' as UserRole, password: 'hotel123', hotelId: 'h1' },
];

type View = 'login' | 'forgot' | 'otp';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState<View>('login');
  const [forgotInput, setForgotInput] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isPhone = (val: string) => /^\d{10}$/.test(val);
  const isEmail = (val: string) => /\S+@\S+\.\S+/.test(val);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = demoUsers.find(u =>
      (u.email === identifier || u.phone === identifier) && u.password === password
    );
    if (!user) { setError('Invalid email/phone or password'); return; }
    dispatch(login({ id: user.id, name: user.name, email: user.email, role: user.role, hotelId: user.hotelId }));
    navigate(user.role === 'superadmin' ? '/super-admin' : '/');
  };

  const quickLogin = (role: UserRole) => {
    const user = demoUsers.find(u => u.role === role)!;
    dispatch(login({ id: user.id, name: user.name, email: user.email, role: user.role, hotelId: user.hotelId }));
    navigate(role === 'superadmin' ? '/super-admin' : '/');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmail(forgotInput)) {
      toast.success('Password reset link sent to your email');
      setView('login');
    } else if (isPhone(forgotInput)) {
      const code = String(Math.floor(1000 + Math.random() * 9000));
      setGeneratedOtp(code);
      toast.success(`OTP sent via WhatsApp: ${code}`, { duration: 10000 });
      setView('otp');
    } else {
      toast.error('Enter a valid email or 10-digit phone number');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      setOtpVerified(true);
      toast.success('OTP verified successfully!');
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    toast.success('Password reset successfully! Please login.');
    setView('login');
    setOtp(''); setGeneratedOtp(''); setNewPassword(''); setOtpVerified(false); setForgotInput('');
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
          <p className="text-muted-foreground text-sm mt-1">
            {view === 'login' ? 'Sign in to your admin panel' : view === 'forgot' ? 'Reset your password' : 'Verify OTP'}
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          {view === 'login' && (
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email or Phone</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="admin@hoteldesk.com or 9876543000"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-foreground">Password</label>
                    <button type="button" onClick={() => setView('forgot')} className="text-xs text-primary hover:underline font-medium">Forgot Password?</button>
                  </div>
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
                <button type="submit" className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-md shadow-primary/20 btn-ripple">Sign In</button>
              </form>
              <div className="mt-6 pt-5 border-t border-border/50">
                <p className="text-xs text-muted-foreground text-center mb-3">Quick Demo Login</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => quickLogin('superadmin')} className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/50 bg-muted/30 text-sm font-medium text-foreground hover:bg-muted/60 transition-all">
                    <Shield className="w-4 h-4 text-primary" /> Super Admin
                  </button>
                  <button onClick={() => quickLogin('hoteladmin')} className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/50 bg-muted/30 text-sm font-medium text-foreground hover:bg-muted/60 transition-all">
                    <Building2 className="w-4 h-4 text-primary" /> Hotel Admin
                  </button>
                </div>
              </div>
            </>
          )}

          {view === 'forgot' && (
            <>
              <button onClick={() => setView('login')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to login
              </button>
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email or Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={forgotInput}
                      onChange={e => setForgotInput(e.target.value)}
                      placeholder="Enter email or phone number"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">📧 Email → Reset link &nbsp;|&nbsp; 📱 Phone → WhatsApp OTP</p>
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-md shadow-primary/20 btn-ripple">Send Reset</button>
              </form>
            </>
          )}

          {view === 'otp' && (
            <>
              <button onClick={() => setView('forgot')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
              </button>
              {!otpVerified ? (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      maxLength={4}
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/60 border border-border/50 text-sm text-foreground text-center tracking-[0.5em] font-bold text-lg placeholder:text-muted-foreground placeholder:tracking-normal placeholder:font-normal placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-2">OTP sent to {forgotInput} via WhatsApp</p>
                  </div>
                  <button type="submit" className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-md shadow-primary/20 btn-ripple">Verify OTP</button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 6 chars)"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-md shadow-primary/20 btn-ripple">Reset Password</button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
