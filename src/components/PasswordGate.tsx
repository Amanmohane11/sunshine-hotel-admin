import { useState, useEffect } from 'react';
import { Lock, X, ShieldCheck } from 'lucide-react';

const SECURITY_PASSWORD = '1234';
const UNLOCKED_KEY = 'hoteldesk_unlocked_pages';

interface PasswordGateProps {
  pageName: string;
  children: React.ReactNode;
}

const PasswordGate = ({ pageName, children }: PasswordGateProps) => {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem(UNLOCKED_KEY);
    if (stored) {
      const pages: string[] = JSON.parse(stored);
      if (pages.includes(pageName)) setUnlocked(true);
    }
  }, [pageName]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECURITY_PASSWORD) {
      setUnlocked(true);
      const stored = sessionStorage.getItem(UNLOCKED_KEY);
      const pages: string[] = stored ? JSON.parse(stored) : [];
      if (!pages.includes(pageName)) pages.push(pageName);
      sessionStorage.setItem(UNLOCKED_KEY, JSON.stringify(pages));
    } else {
      setError('Incorrect password. Access denied.');
      setPassword('');
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-scale-in">
      <div className="glass-card rounded-2xl border border-border/50 p-8 w-full max-w-sm mx-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-lg font-bold mb-1">Secured Page</h2>
        <p className="text-sm text-muted-foreground mb-6">Enter security password to access <strong>{pageName}</strong></p>
        <form onSubmit={handleUnlock} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter password"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              autoFocus
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <button type="submit" className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-md shadow-primary/20 btn-ripple">
            Unlock Access
          </button>
        </form>
        <p className="text-xs text-muted-foreground mt-4">Demo password: <code className="bg-muted px-1.5 py-0.5 rounded">1234</code></p>
      </div>
    </div>
  );
};

export default PasswordGate;
