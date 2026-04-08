import { useAppSelector } from '@/store';
import { InventoryBill } from '@/store/dummyData';
import { toast } from 'sonner';
import { Download, FileText, History } from 'lucide-react';
import { format } from 'date-fns';

const BillHistoryPage = () => {
  const { bills } = useAppSelector(s => s.inventory);

  const handleDownloadBill = (bill: InventoryBill) => {
    const content = `
PURCHASE BILL
========================================
Bill Number : ${bill.billNumber}
Supplier    : ${bill.supplierName}
Date        : ${format(new Date(bill.date), 'dd MMM yyyy')}
========================================

PRODUCTS:
${'-'.repeat(60)}
${'#'.padEnd(4)}${'Product'.padEnd(20)}${'Qty'.padEnd(8)}${'Price'.padEnd(12)}${'Total'.padEnd(12)}
${'-'.repeat(60)}
${bill.products.map((p, i) => `${(i + 1).toString().padEnd(4)}${p.productName.padEnd(20)}${p.quantity.toString().padEnd(8)}₹${p.unitPrice.toString().padEnd(11)}₹${p.total.toLocaleString()}`).join('\n')}
${'-'.repeat(60)}

TOTAL AMOUNT: ₹${bill.total.toLocaleString()}
========================================
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bill.billNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Bill downloaded');
  };

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Bill History</h1>
          <p className="text-muted-foreground text-sm">{bills.length} purchase bills recorded</p>
        </div>
      </div>

      {bills.length === 0 ? (
        <div className="glass-card rounded-2xl border border-border/50 p-12 text-center">
          <History className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No bills created yet</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left">
                {['Bill Number', 'Supplier Name', 'Date', 'Products', 'Total Amount', ''].map(h => (
                  <th key={h} className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bills.map(b => (
                <tr key={b.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-semibold flex items-center gap-2"><FileText className="w-4 h-4 text-primary" />{b.billNumber}</td>
                  <td className="px-5 py-3.5">{b.supplierName}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{format(new Date(b.date), 'dd MMM yyyy')}</td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{b.products.length} item{b.products.length !== 1 ? 's' : ''}</td>
                  <td className="px-5 py-3.5 font-bold">₹{b.total.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => handleDownloadBill(b)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-all">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BillHistoryPage;
