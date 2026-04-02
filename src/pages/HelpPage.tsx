import { useState } from 'react';
import { HelpCircle, MessageSquare, CheckCircle, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';

const HelpPage = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const faqs = [
    { q: 'How to book a room?', a: 'Go to Rooms → Click on an available room → Fill guest details → Add services → Make payment → Book.' },
    { q: 'How to process checkout?', a: 'Go to Rooms → Click occupied room → Complete full payment → Click Checkout button.' },
    { q: 'How to add inventory?', a: 'Go to Inventory → Click Add Item → Fill product details → Save.' },
    { q: 'How to mark staff attendance?', a: 'Go to Staff → Click "Mark Attendance" on any staff card, or view profile for half-day option.' },
  ];

  return (
    <div className="animate-slide-up max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Help & Support</h1>
        <p className="text-muted-foreground text-sm">Get help with the system</p>
      </div>

      {/* Raise Ticket */}
      <div className="glass-card rounded-2xl border border-border/50 p-5 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary" /> Raise a Ticket</h3>
        <div className="space-y-3">
          <div><label className="block text-xs font-semibold mb-1.5">Subject</label><input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief description of your issue" className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
          <div><label className="block text-xs font-semibold mb-1.5">Message</label><textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Describe your issue in detail..." className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all resize-none" /></div>
          <button onClick={() => { if (!subject || !message) { toast.error('Fill all fields'); return; } toast.success('Ticket submitted successfully'); setSubject(''); setMessage(''); }} className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-sm shadow-primary/20 flex items-center gap-2">
            <Send className="w-4 h-4" /> Submit Ticket
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="glass-card rounded-2xl border border-border/50 p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-primary" /> FAQ</h3>
        <div className="space-y-3">
          {faqs.map((f, idx) => (
            <div key={idx} className="bg-muted/40 rounded-xl p-4">
              <p className="font-semibold text-sm mb-1">{f.q}</p>
              <p className="text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
