import { FileText, Download, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

const BillingPage = () => (
  <div className="animate-slide-up">
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-1">Billing & Invoicing</h1>
      <p className="text-muted-foreground text-sm">Generate and manage customer invoices</p>
    </div>
    <div className="glass-card rounded-2xl border border-border/50 p-12 text-center">
      <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
      <p className="font-semibold">Invoice Generation</p>
      <p className="text-sm text-muted-foreground mt-1 mb-4">Generate bills from Rooms → Checkout flow. PDF export coming soon.</p>
      <button onClick={() => toast.info('PDF generation will be available soon')} className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-sm shadow-primary/20">
        <span className="flex items-center gap-2"><Download className="w-4 h-4" /> Generate Sample Invoice</span>
      </button>
    </div>
  </div>
);

export default BillingPage;
