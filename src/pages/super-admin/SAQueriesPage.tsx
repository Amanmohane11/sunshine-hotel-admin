import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { respondToQuery, addFAQ, deleteFAQ } from '@/store/hotelsSlice';
import { toast } from 'sonner';
import { MessageSquare, Plus, Trash2, X, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const SAQueriesPage = () => {
  const dispatch = useAppDispatch();
  const { queries, faqs } = useAppSelector(s => s.hotels);
  const [queryResponse, setQueryResponse] = useState<Record<string, string>>({});
  const [showFAQForm, setShowFAQForm] = useState(false);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });

  const handleAddFAQ = () => {
    if (!faqForm.question || !faqForm.answer) { toast.error('Fill both fields'); return; }
    dispatch(addFAQ({ id: `faq-${Date.now()}`, question: faqForm.question, answer: faqForm.answer, createdAt: new Date().toISOString() }));
    toast.success('FAQ added — visible to all hotel admins');
    setFaqForm({ question: '', answer: '' });
    setShowFAQForm(false);
  };

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Queries</h1>
          <p className="text-muted-foreground text-sm">{queries.filter(q => q.status === 'open').length} open queries</p>
        </div>
        <button onClick={() => setShowFAQForm(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-md shadow-primary/20">
          <HelpCircle className="w-4 h-4" /> Generate FAQ
        </button>
      </div>

      {/* FAQ Form Modal */}
      {showFAQForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-scale-in" onClick={() => setShowFAQForm(false)}>
          <div className="glass-card rounded-2xl border border-border/50 p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Create FAQ</h2>
              <button onClick={() => setShowFAQForm(false)} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-xs font-semibold mb-1.5">Question *</label><input value={faqForm.question} onChange={e => setFaqForm({...faqForm, question: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm" placeholder="Enter FAQ question" /></div>
              <div><label className="block text-xs font-semibold mb-1.5">Answer *</label><textarea value={faqForm.answer} onChange={e => setFaqForm({...faqForm, answer: e.target.value})} rows={4} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm resize-none" placeholder="Enter answer" /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowFAQForm(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all">Cancel</button>
              <button onClick={handleAddFAQ} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple">Add FAQ</button>
            </div>
          </div>
        </div>
      )}

      {/* FAQs Section */}
      {faqs.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-primary" /> Published FAQs ({faqs.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {faqs.map(f => (
              <div key={f.id} className="glass-card rounded-2xl border border-border/50 p-4">
                <div className="flex justify-between items-start gap-2">
                  <div><p className="font-semibold text-sm mb-1">{f.question}</p><p className="text-xs text-muted-foreground">{f.answer}</p></div>
                  <button onClick={() => { dispatch(deleteFAQ(f.id)); toast.success('FAQ removed'); }} className="p-1 text-destructive hover:opacity-70 shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queries */}
      <div className="space-y-4">
        {queries.length === 0 && (
          <div className="glass-card rounded-2xl border border-border/50 p-12 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No queries at the moment</p>
          </div>
        )}
        {queries.map((q, idx) => (
          <div key={q.id} className="glass-card rounded-2xl border border-border/50 p-5 animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">{q.subject}</h3>
                  <span className={cn('px-2 py-0.5 rounded-lg text-xs font-medium', q.status === 'open' ? 'bg-status-cleaning/10 text-status-cleaning' : 'bg-status-available/10 text-status-available')}>{q.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{q.hotelName} · {format(new Date(q.createdAt), 'dd MMM yyyy')}</p>
                <p className="text-sm text-muted-foreground">{q.message}</p>
                {q.response && (
                  <div className="mt-3 p-3 bg-status-available/5 rounded-xl border border-status-available/20">
                    <p className="text-xs font-semibold text-status-available mb-1">Response:</p>
                    <p className="text-sm">{q.response}</p>
                  </div>
                )}
              </div>
              {q.status === 'open' && (
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <textarea value={queryResponse[q.id] || ''} onChange={e => setQueryResponse({...queryResponse, [q.id]: e.target.value})} placeholder="Type response..." className="rounded-xl border border-input bg-background px-3 py-2 text-xs resize-none h-16" />
                  <button onClick={() => { if (queryResponse[q.id]) { dispatch(respondToQuery({ queryId: q.id, response: queryResponse[q.id] })); toast.success('Response sent'); setQueryResponse({...queryResponse, [q.id]: ''}); } else { toast.error('Enter a response'); } }} className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all btn-ripple">Respond</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SAQueriesPage;
