import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { addBill, addTransaction } from '@/store/inventorySlice';
import { InventoryBill } from '@/store/dummyData';
import { toast } from 'sonner';
import { Plus, Trash2, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';

const CreateBillPage = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(s => s.inventory);
  const [lastBill, setLastBill] = useState<InventoryBill | null>(null);

  const [billForm, setBillForm] = useState({
    supplierName: '',
    billNumber: `BILL-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    products: [{ productName: '', quantity: '', purchaseValue: '', mrp: '', margin: '', expiryDate: '' }] as any[],
  });

  const getProductTotal = (p: any) => {
    const qty = parseInt(p.quantity) || 0;
    const price = parseFloat(p.purchaseValue) || 0;
    return qty * price;
  };

  const finalTotal = billForm.products.reduce((s, p) => s + getProductTotal(p), 0);

  const addProductRow = () => {
    setBillForm({
      ...billForm,
      products: [...billForm.products, { productName: '', quantity: '', purchaseValue: '', mrp: '', margin: '', expiryDate: '' }],
    });
  };

  const updateProduct = (idx: number, field: string, value: string) => {
    const prods = [...billForm.products];
    prods[idx] = { ...prods[idx], [field]: value };

    if (field === 'purchaseValue' || field === 'mrp') {
      const pv = parseFloat(field === 'purchaseValue' ? value : prods[idx].purchaseValue) || 0;
      const mrp = parseFloat(field === 'mrp' ? value : prods[idx].mrp) || 0;
      if (mrp > 0) {
        prods[idx].margin = (((mrp - pv) / mrp) * 100).toFixed(1);
      }
    }
    setBillForm({ ...billForm, products: prods });
  };

  const removeProduct = (idx: number) => {
    if (billForm.products.length <= 1) return;
    setBillForm({ ...billForm, products: billForm.products.filter((_, i) => i !== idx) });
  };

  const handleGenerateBill = () => {
    if (!billForm.supplierName) { toast.error('Enter supplier name'); return; }
    const validProducts = billForm.products.filter(p => p.productName && p.quantity && p.purchaseValue);
    if (validProducts.length === 0) { toast.error('Add at least one product with name, quantity, and purchase value'); return; }

    const products = validProducts.map(p => {
      const qty = parseInt(p.quantity) || 0;
      const unitPrice = parseFloat(p.purchaseValue) || 0;
      const mrp = parseFloat(p.mrp) || unitPrice * 1.4;
      const margin = mrp > 0 ? Math.round(((mrp - unitPrice) / mrp) * 1000) / 10 : 0;
      const existingItem = items.find(i => i.name.toLowerCase() === p.productName.toLowerCase());
      return {
        productId: existingItem?.id || `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        productName: p.productName,
        quantity: qty,
        unitPrice,
        mrp,
        margin,
        expiryDate: p.expiryDate || '',
        total: qty * unitPrice,
      };
    });

    const subtotal = products.reduce((s, p) => s + p.total, 0);
    const bill: InventoryBill = {
      id: `ib-${Date.now()}`,
      billNumber: billForm.billNumber,
      supplierName: billForm.supplierName,
      supplierPhone: '',
      supplierAddress: '',
      products,
      subtotal,
      gst: 0,
      total: subtotal,
      date: billForm.date ? new Date(billForm.date).toISOString() : new Date().toISOString(),
    };

    dispatch(addBill(bill));
    products.forEach(p => {
      dispatch(addTransaction({
        id: `it-${Date.now()}-${p.productId}`,
        productId: p.productId,
        productName: p.productName,
        type: 'stock_in',
        quantity: p.quantity,
        reason: `Purchase Bill ${billForm.billNumber} - ${billForm.supplierName}`,
        date: new Date().toISOString(),
      }));
    });

    toast.success('Bill generated & inventory updated!');
    setLastBill(bill);
    setBillForm({
      supplierName: '',
      billNumber: `BILL-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      products: [{ productName: '', quantity: '', purchaseValue: '', mrp: '', margin: '', expiryDate: '' }],
    });
  };

  const handleDownloadPDF = (bill: InventoryBill) => {
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
          <h1 className="text-2xl font-bold mb-1">Create Bill</h1>
          <p className="text-muted-foreground text-sm">Generate a new purchase bill from supplier</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-border/50 p-6 mb-6">
        {/* Top Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">Supplier Name *</label>
            <input value={billForm.supplierName} onChange={e => setBillForm({ ...billForm, supplierName: e.target.value })} placeholder="Enter supplier name" className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">Bill Number</label>
            <input value={billForm.billNumber} onChange={e => setBillForm({ ...billForm, billNumber: e.target.value })} className="w-full rounded-xl border border-input bg-muted/50 px-3.5 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">Date</label>
            <input type="date" value={billForm.date} onChange={e => setBillForm({ ...billForm, date: e.target.value })} className="w-full rounded-xl border border-input bg-muted/50 px-3.5 py-2.5 text-sm" />
          </div>
        </div>

        {/* Product Table */}
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Product Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm mb-3">
            <thead>
              <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-border/50">
                <th className="pb-2.5 pr-2">#</th>
                <th className="pb-2.5 pr-2">Product Name</th>
                <th className="pb-2.5 pr-2">Qty</th>
                <th className="pb-2.5 pr-2">Purchase Value (₹)</th>
                <th className="pb-2.5 pr-2">MRP (₹)</th>
                <th className="pb-2.5 pr-2">Margin (%)</th>
                <th className="pb-2.5 pr-2">Total Value (₹)</th>
                <th className="pb-2.5 pr-2">Expiry</th>
                <th className="pb-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {billForm.products.map((p, idx) => (
                <tr key={idx} className="border-t border-border/30">
                  <td className="py-2.5 pr-2 text-muted-foreground font-medium">{idx + 1}</td>
                  <td className="py-2.5 pr-2">
                    <input value={p.productName} onChange={e => updateProduct(idx, 'productName', e.target.value)} placeholder="Product name" className="w-full min-w-[150px] rounded-lg border border-input bg-background px-2.5 py-2 text-xs focus:border-primary/50 transition-all" />
                  </td>
                  <td className="py-2.5 pr-2">
                    <input type="number" value={p.quantity} onChange={e => updateProduct(idx, 'quantity', e.target.value)} placeholder="0" className="w-20 rounded-lg border border-input bg-background px-2.5 py-2 text-xs focus:border-primary/50 transition-all" />
                  </td>
                  <td className="py-2.5 pr-2">
                    <input type="number" value={p.purchaseValue} onChange={e => updateProduct(idx, 'purchaseValue', e.target.value)} placeholder="0" className="w-24 rounded-lg border border-input bg-background px-2.5 py-2 text-xs focus:border-primary/50 transition-all" />
                  </td>
                  <td className="py-2.5 pr-2">
                    <input type="number" value={p.mrp} onChange={e => updateProduct(idx, 'mrp', e.target.value)} placeholder="0" className="w-24 rounded-lg border border-input bg-background px-2.5 py-2 text-xs focus:border-primary/50 transition-all" />
                  </td>
                  <td className="py-2.5 pr-2">
                    <span className="text-xs text-muted-foreground font-medium">{p.margin || '—'}%</span>
                  </td>
                  <td className="py-2.5 pr-2">
                    <span className="text-xs font-bold">₹{getProductTotal(p).toLocaleString()}</span>
                  </td>
                  <td className="py-2.5 pr-2">
                    <input type="date" value={p.expiryDate} onChange={e => updateProduct(idx, 'expiryDate', e.target.value)} className="rounded-lg border border-input bg-background px-2 py-2 text-xs" />
                  </td>
                  <td className="py-2.5">
                    <button onClick={() => removeProduct(idx)} disabled={billForm.products.length <= 1} className="text-destructive hover:opacity-70 disabled:opacity-30"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={addProductRow} className="text-sm text-primary font-semibold hover:underline mb-6 flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add Another Product
        </button>

        {/* Total */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/60 border border-border/50">
          <div>
            <span className="text-sm text-muted-foreground">Total Bill Amount</span>
            <p className="text-2xl font-bold">₹{finalTotal.toLocaleString()}</p>
          </div>
          <button onClick={handleGenerateBill} className="px-6 py-3 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all btn-ripple shadow-md shadow-primary/20">
            Generate Bill
          </button>
        </div>
      </div>

      {/* Last Generated Bill - Download */}
      {lastBill && (
        <div className="glass-card rounded-2xl border border-status-available/30 p-5 animate-scale-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-status-available flex items-center gap-2"><FileText className="w-4 h-4" /> Bill Generated Successfully</h3>
              <p className="text-sm text-muted-foreground mt-1">{lastBill.billNumber} · {lastBill.supplierName} · ₹{lastBill.total.toLocaleString()}</p>
            </div>
            <button onClick={() => handleDownloadPDF(lastBill)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary/10 transition-all">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBillPage;
