import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { respondToQuery } from '@/store/hotelsSlice';
import { toast } from 'sonner';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const SAQueriesPage = () => {
  const dispatch = useAppDispatch();
  const { queries } = useAppSelector(s => s.hotels);
  const [queryResponse, setQueryResponse] = useState<Record<string, string>>({});

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Queries</h1>
        <p className="text-muted-foreground text-sm">{queries.filter(q => q.status === 'open').length} open queries</p>
      </div>

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
