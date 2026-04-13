import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { addQuery } from '@/store/hotelsSlice';
import { HelpCircle, MessageSquare, CheckCircle, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const HelpPage = () => {
  const dispatch = useAppDispatch();
  const { faqs, queries } = useAppSelector(s => s.hotels);
  const user = useAppSelector(s => s.auth.user);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const myQueries = queries.filter(q => q.hotelId === (user?.hotelId || 'hotel-1'));

  const handleSubmit = () => {
    if (!subject || !message) { toast.error('Fill all fields'); return; }
    dispatch(addQuery({
      id: `q-${Date.now()}`,
      hotelId: user?.hotelId || 'hotel-1',
      hotelName: user?.name || 'Hotel Admin',
      subject,
      message,
      status: 'open',
      createdAt: new Date().toISOString(),
    }));
    toast.success('Query submitted successfully');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="animate-slide-up max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Help & Support</h1>
        <p className="text-muted-foreground text-sm">Get help and view FAQs</p>
      </div>

      {/* Raise Query */}
      <div className="glass-card rounded-2xl border border-border/50 p-5 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary" /> Raise a Query</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold mb-1.5">Subject</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief description of your issue" className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5">Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Describe your issue in detail..." className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all resize-none" />
          </div>
          <button onClick={handleSubmit} className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-sm shadow-primary/20 flex items-center gap-2">
            <Send className="w-4 h-4" /> Submit Query
          </button>
        </div>
      </div>

      {/* My Queries */}
      {myQueries.length > 0 && (
        <div className="glass-card rounded-2xl border border-border/50 p-5 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> My Queries ({myQueries.length})</h3>
          <div className="space-y-3">
            {myQueries.map(q => (
              <div key={q.id} className="bg-muted/40 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm">{q.subject}</p>
                  <span className={cn('px-2 py-0.5 rounded-lg text-xs font-medium', q.status === 'open' ? 'bg-status-cleaning/10 text-status-cleaning' : 'bg-status-available/10 text-status-available')}>{q.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{q.message}</p>
                {q.response && (
                  <div className="mt-2 p-3 bg-status-available/5 rounded-lg border border-status-available/20">
                    <p className="text-xs font-semibold text-status-available mb-1">Response:</p>
                    <p className="text-sm">{q.response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="glass-card rounded-2xl border border-border/50 p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-primary" /> FAQ</h3>
        <div className="space-y-3">
          {faqs.length === 0 && <p className="text-sm text-muted-foreground">No FAQs available yet.</p>}
          {faqs.map((f) => (
            <div key={f.id} className="bg-muted/40 rounded-xl p-4">
              <p className="font-semibold text-sm mb-1">{f.question}</p>
              <p className="text-sm text-muted-foreground">{f.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
