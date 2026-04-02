import { BarChart3, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

const ReportsPage = () => (
  <div className="animate-slide-up">
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-1">Reports</h1>
      <p className="text-muted-foreground text-sm">Export data for analysis and tax filing</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        { title: 'Bookings Report', desc: 'All bookings with guest details', icon: FileText },
        { title: 'Revenue Report', desc: 'Income breakdown by source', icon: BarChart3 },
        { title: 'Inventory Report', desc: 'Stock levels and usage data', icon: FileText },
      ].map((r, idx) => (
        <div key={r.title} className="glass-card hover-lift rounded-2xl border border-border/50 p-5 animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
          <r.icon className="w-8 h-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">{r.title}</h3>
          <p className="text-xs text-muted-foreground mb-4">{r.desc}</p>
          <div className="flex gap-2">
            <button onClick={() => toast.info('Excel export coming soon')} className="px-4 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-all flex items-center gap-1"><Download className="w-3 h-3" /> Excel</button>
            <button onClick={() => toast.info('PDF export coming soon')} className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all btn-ripple flex items-center gap-1"><Download className="w-3 h-3" /> PDF</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ReportsPage;
