import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { addItem, updateItem, deleteItem, addBill, addTransaction, addCategory, deleteCategory } from '@/store/inventorySlice';
import { InventoryItem, InventoryBill } from '@/store/dummyData';
import { toast } from 'sonner';
import { Plus, Trash2, AlertTriangle, Package, X, FileText, ArrowUpDown, Search, Edit2, Download, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type Tab = 'products' | 'bills' | 'history' | 'categories';

const InventoryPage = () => {
  const dispatch = useAppDispatch();
  const { items, bills, transactions, categories } = useAppSelector(s => s.inventory);
  const [tab, setTab] = useState<Tab>('products');
  const [showAddItem, setShowAddItem] = useState(false);
  const [showBillForm, setShowBillForm] = useState(false);
  const [showAddCat, setShowAddCat] = useState(false);
  const [catName, setCatName] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [search, setSearch] = useState('');
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  const [itemForm, setItemForm] = useState({ name: '', category: '', quantity: '', unit: '', costPrice: '', mrp: '', margin: '', supplier: '', minStock: '', expiryDate: '' });
  const [billForm, setBillForm] = useState({
    supplierName: '', supplierPhone: '', supplierAddress: '', gstNumber: '', billNumber: '',
    products: [{ productId: '', quantity: '', unitPrice: '', mrp: '', margin: '', expiryDate: '' }] as any[],
  });

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return 'out';
    if (item.quantity <= item.minStock) return 'low';
    return 'normal';
  };

  const isExpiringSoon = (item: InventoryItem) => {
    if (!item.expiryDate) return false;
    const diff = new Date(item.expiryDate).getTime() - Date.now();
    return diff > 0 && diff < 86400000 * 30;
  };

  const isExpired = (item: InventoryItem) => {
    if (!item.expiryDate) return false;
    return new Date(item.expiryDate).getTime() < Date.now();
  };

  const filteredItems = items.filter(i => {
    if (filterCat !== 'all' && i.category !== filterCat) return false;
    const stock = getStockStatus(i);
    if (filterStock === 'low' && stock !== 'low') return false;
    if (filterStock === 'out' && stock !== 'out') return false;
    if (filterStock === 'expiring' && !isExpiringSoon(i)) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAddItem = () => {
    if (!itemForm.name || !itemForm.category) { toast.error('Fill required fields'); return; }
    const costPrice = parseFloat(itemForm.costPrice) || 0;
    const mrp = parseFloat(itemForm.mrp) || costPrice * 1.4;
    const margin = mrp > 0 ? Math.round(((mrp - costPrice) / mrp) * 1000) / 10 : 0;
    dispatch(addItem({
      id: `inv-${Date.now()}`, name: itemForm.name, category: itemForm.category,
      quantity: parseInt(itemForm.quantity) || 0, unit: itemForm.unit, costPrice, mrp, margin,
      supplier: itemForm.supplier, lastUpdated: new Date().toISOString(),
      minStock: parseInt(itemForm.minStock) || 10, expiryDate: itemForm.expiryDate || '',
    }));
    toast.success('Item added');
    setItemForm({ name: '', category: '', quantity: '', unit: '', costPrice: '', mrp: '', margin: '', supplier: '', minStock: '', expiryDate: '' });
    setShowAddItem(false);
  };

  const handleEditSave = () => {
    if (!editItem) return;
    dispatch(updateItem({ ...editItem, lastUpdated: new Date().toISOString() }));
    toast.success('Item updated');
    setEditItem(null);
  };

  const handleGenerateBill = () => {
    if (!billForm.supplierName) { toast.error('Enter supplier name'); return; }
    if (!billForm.billNumber) { toast.error('Enter bill number'); return; }
    const products = billForm.products.filter(p => p.productId && p.quantity).map(p => {
      const item = items.find(i => i.id === p.productId);
      const unitPrice = parseFloat(p.unitPrice) || item?.costPrice || 0;
      const mrp = parseFloat(p.mrp) || item?.mrp || unitPrice * 1.4;
      const margin = mrp > 0 ? Math.round(((mrp - unitPrice) / mrp) * 1000) / 10 : 0;
      return { productId: p.productId, productName: item?.name || '', quantity: parseInt(p.quantity), unitPrice, mrp, margin, expiryDate: p.expiryDate || '', total: parseInt(p.quantity) * unitPrice };
    });
    if (products.length === 0) { toast.error('Add at least one product'); return; }
    const subtotal = products.reduce((s, p) => s + p.total, 0);
    const gst = Math.round(subtotal * 0.18);
    const bill: InventoryBill = {
      id: `ib-${Date.now()}`, billNumber: billForm.billNumber, supplierName: billForm.supplierName,
      supplierPhone: billForm.supplierPhone, supplierAddress: billForm.supplierAddress,
      products, subtotal, gst, total: subtotal + gst, date: new Date().toISOString(),
    };
    dispatch(addBill(bill));
    products.forEach(p => {
      dispatch(addTransaction({ id: `it-${Date.now()}-${p.productId}`, productId: p.productId, productName: p.productName, type: 'stock_in', quantity: p.quantity, reason: `Purchase Bill ${billForm.billNumber} - ${billForm.supplierName}`, date: new Date().toISOString() }));
    });
    toast.success('Bill generated & stock updated');
    setBillForm({ supplierName: '', supplierPhone: '', supplierAddress: '', gstNumber: '', billNumber: '', products: [{ productId: '', quantity: '', unitPrice: '', mrp: '', margin: '', expiryDate: '' }] });
    setShowBillForm(false);
  };

  const handleDownloadBill = (bill: InventoryBill) => {
    const content = `
PURCHASE BILL - ${bill.billNumber}
================================
Supplier: ${bill.supplierName}
Phone: ${bill.supplierPhone}
Date: ${format(new Date(bill.date), 'dd MMM yyyy')}
================================

Products:
${bill.products.map((p, i) => `${i + 1}. ${p.productName} x${p.quantity} @ ₹${p.unitPrice} = ₹${p.total}`).join('\n')}

--------------------------------
Subtotal: ₹${bill.subtotal.toLocaleString()}
GST (18%): ₹${bill.gst.toLocaleString()}
TOTAL: ₹${bill.total.toLocaleString()}
================================
    `.trim();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${bill.billNumber}.txt`; a.click();
    URL.revokeObjectURL(url);
    toast.success('Bill downloaded');
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'products', label: 'All Products' },
    { key: 'bills', label: 'Purchase Bills' },
    { key: 'history', label: 'Transactions' },
    { key: 'categories', label: 'Categories' },
  ];

  const lowStockItems = items.filter(i => getStockStatus(i) !== 'normal');
  const expiringItems = items.filter(i => isExpiringSoon(i) || isExpired(i));

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Inventory</h1>
          <p className="text-muted-foreground text-sm">{items.length} products tracked</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowBillForm(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all">
            <FileText className="w-4 h-4" /> Create Bill
          </button>
          <button onClick={() => setShowAddItem(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-md shadow-primary/20">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      {/* Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="glass-card rounded-2xl border border-status-cleaning/30 p-4 mb-4 flex items-start gap-3 animate-scale-in">
          <AlertTriangle className="w-5 h-5 text-status-cleaning shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Low Stock Alerts</p>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {lowStockItems.map(i => (
                <span key={i.id} className={cn('px-2.5 py-1 rounded-lg text-xs font-medium', getStockStatus(i) === 'out' ? 'bg-status-occupied/10 text-status-occupied' : 'bg-status-cleaning/10 text-status-cleaning')}>
                  {i.name}: {i.quantity} {i.unit}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expiry Alerts */}
      {expiringItems.length > 0 && (
        <div className="glass-card rounded-2xl border border-status-occupied/30 p-4 mb-6 flex items-start gap-3 animate-scale-in">
          <Calendar className="w-5 h-5 text-status-occupied shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Expiry Alerts</p>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {expiringItems.map(i => (
                <span key={i.id} className={cn('px-2.5 py-1 rounded-lg text-xs font-medium', isExpired(i) ? 'bg-status-occupied/10 text-status-occupied' : 'bg-status-cleaning/10 text-status-cleaning')}>
                  {i.name}: {isExpired(i) ? 'EXPIRED' : `Expires ${format(new Date(i.expiryDate!), 'dd MMM')}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-1 mb-6 bg-muted/60 rounded-xl p-1 w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200', tab === t.key ? 'gradient-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Add Item Form */}
      {showAddItem && (
        <div className="glass-card rounded-2xl border border-border/50 p-5 mb-6 animate-scale-in">
          <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Add New Item</h3><button onClick={() => setShowAddItem(false)} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div><label className="block text-xs font-semibold mb-1.5">Name *</label><input value={itemForm.name} onChange={e => setItemForm({...itemForm, name: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
            <div><label className="block text-xs font-semibold mb-1.5">Category *</label><select value={itemForm.category} onChange={e => setItemForm({...itemForm, category: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all"><option value="">Select</option>{categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
            <div><label className="block text-xs font-semibold mb-1.5">Quantity</label><input type="number" value={itemForm.quantity} onChange={e => setItemForm({...itemForm, quantity: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
            <div><label className="block text-xs font-semibold mb-1.5">Unit</label><input value={itemForm.unit} onChange={e => setItemForm({...itemForm, unit: e.target.value})} placeholder="pcs, kg, bottles" className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
            <div><label className="block text-xs font-semibold mb-1.5">Cost Price (₹)</label><input type="number" value={itemForm.costPrice} onChange={e => setItemForm({...itemForm, costPrice: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
            <div><label className="block text-xs font-semibold mb-1.5">MRP (₹)</label><input type="number" value={itemForm.mrp} onChange={e => setItemForm({...itemForm, mrp: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
            <div><label className="block text-xs font-semibold mb-1.5">Supplier</label><input value={itemForm.supplier} onChange={e => setItemForm({...itemForm, supplier: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
            <div><label className="block text-xs font-semibold mb-1.5">Min Stock</label><input type="number" value={itemForm.minStock} onChange={e => setItemForm({...itemForm, minStock: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
            <div><label className="block text-xs font-semibold mb-1.5">Expiry Date</label><input type="date" value={itemForm.expiryDate} onChange={e => setItemForm({...itemForm, expiryDate: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
          </div>
          <button onClick={handleAddItem} className="mt-4 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-sm shadow-primary/20">Add Item</button>
        </div>
      )}

      {/* Create Bill Form */}
      {showBillForm && (
        <div className="glass-card rounded-2xl border border-border/50 p-5 mb-6 animate-scale-in">
          <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Create Purchase Bill</h3><button onClick={() => setShowBillForm(false)} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div><label className="block text-xs font-semibold mb-1.5">Supplier Name *</label><input value={billForm.supplierName} onChange={e => setBillForm({...billForm, supplierName: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
            <div><label className="block text-xs font-semibold mb-1.5">Bill Number *</label><input value={billForm.billNumber} onChange={e => setBillForm({...billForm, billNumber: e.target.value})} placeholder="INV-2025-003" className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
            <div><label className="block text-xs font-semibold mb-1.5">GST Number</label><input value={billForm.gstNumber} onChange={e => setBillForm({...billForm, gstNumber: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
            <div><label className="block text-xs font-semibold mb-1.5">Phone</label><input value={billForm.supplierPhone} onChange={e => setBillForm({...billForm, supplierPhone: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
          </div>
          <h4 className="text-sm font-semibold mb-2">Products</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm mb-3">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="pb-2">Product</th><th className="pb-2">Qty</th><th className="pb-2">Price</th><th className="pb-2">MRP</th><th className="pb-2">Expiry</th><th className="pb-2">Total</th><th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {billForm.products.map((p, idx) => {
                  const qty = parseInt(p.quantity) || 0;
                  const price = parseFloat(p.unitPrice) || 0;
                  return (
                    <tr key={idx} className="border-t border-border/30">
                      <td className="py-2 pr-2"><select value={p.productId} onChange={e => { const prods = [...billForm.products]; prods[idx].productId = e.target.value; setBillForm({...billForm, products: prods}); }} className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs"><option value="">Select</option>{items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</select></td>
                      <td className="py-2 pr-2"><input type="number" value={p.quantity} onChange={e => { const prods = [...billForm.products]; prods[idx].quantity = e.target.value; setBillForm({...billForm, products: prods}); }} className="w-16 rounded-lg border border-input bg-background px-2 py-1.5 text-xs" /></td>
                      <td className="py-2 pr-2"><input type="number" value={p.unitPrice} onChange={e => { const prods = [...billForm.products]; prods[idx].unitPrice = e.target.value; setBillForm({...billForm, products: prods}); }} className="w-20 rounded-lg border border-input bg-background px-2 py-1.5 text-xs" /></td>
                      <td className="py-2 pr-2"><input type="number" value={p.mrp} onChange={e => { const prods = [...billForm.products]; prods[idx].mrp = e.target.value; setBillForm({...billForm, products: prods}); }} className="w-20 rounded-lg border border-input bg-background px-2 py-1.5 text-xs" /></td>
                      <td className="py-2 pr-2"><input type="date" value={p.expiryDate} onChange={e => { const prods = [...billForm.products]; prods[idx].expiryDate = e.target.value; setBillForm({...billForm, products: prods}); }} className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs" /></td>
                      <td className="py-2 pr-2 font-medium text-xs">₹{(qty * price).toLocaleString()}</td>
                      <td className="py-2"><button onClick={() => setBillForm({...billForm, products: billForm.products.filter((_, i) => i !== idx)})} className="text-destructive hover:opacity-70"><Trash2 className="w-3.5 h-3.5" /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button onClick={() => setBillForm({...billForm, products: [...billForm.products, { productId: '', quantity: '', unitPrice: '', mrp: '', margin: '', expiryDate: '' }]})} className="text-sm text-primary font-semibold hover:underline mb-3 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Product</button>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Subtotal: ₹{billForm.products.reduce((s, p) => s + (parseInt(p.quantity) || 0) * (parseFloat(p.unitPrice) || 0), 0).toLocaleString()} + GST 18%
            </div>
            <button onClick={handleGenerateBill} className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-sm shadow-primary/20">Generate Bill</button>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-scale-in" onClick={() => setEditItem(null)}>
          <div className="glass-card rounded-2xl border border-border/50 p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Edit Item: {editItem.name}</h3><button onClick={() => setEditItem(null)} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold mb-1.5">Name</label><input value={editItem.name} onChange={e => setEditItem({...editItem, name: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm" /></div>
              <div><label className="block text-xs font-semibold mb-1.5">Quantity</label><input type="number" value={editItem.quantity} onChange={e => setEditItem({...editItem, quantity: parseInt(e.target.value) || 0})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm" /></div>
              <div><label className="block text-xs font-semibold mb-1.5">Cost Price (₹)</label><input type="number" value={editItem.costPrice} onChange={e => setEditItem({...editItem, costPrice: parseFloat(e.target.value) || 0})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm" /></div>
              <div><label className="block text-xs font-semibold mb-1.5">MRP (₹)</label><input type="number" value={editItem.mrp} onChange={e => setEditItem({...editItem, mrp: parseFloat(e.target.value) || 0})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm" /></div>
              <div><label className="block text-xs font-semibold mb-1.5">Margin (%)</label><input type="number" value={editItem.margin} onChange={e => setEditItem({...editItem, margin: parseFloat(e.target.value) || 0})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm" /></div>
              <div><label className="block text-xs font-semibold mb-1.5">Expiry Date</label><input type="date" value={editItem.expiryDate ? editItem.expiryDate.split('T')[0] : ''} onChange={e => setEditItem({...editItem, expiryDate: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm" /></div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setEditItem(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all">Cancel</button>
              <button onClick={handleEditSave} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple">Save</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'products' && (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            <div className="flex items-center bg-muted/60 rounded-xl px-3 py-2 border border-border/50 focus-within:border-primary/40 transition-all">
              <Search className="w-4 h-4 text-muted-foreground mr-2" />
              <input type="text" placeholder="Search products..." className="bg-transparent outline-none text-sm w-40" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all">
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <select value={filterStock} onChange={e => setFilterStock(e.target.value)} className="rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all">
              <option value="all">All Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
              <option value="expiring">Expiring Soon</option>
            </select>
          </div>
          <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-left">
                  {['Name', 'Category', 'Qty', 'Cost', 'MRP', 'Margin', 'Expiry', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => {
                  const status = getStockStatus(item);
                  const expiring = isExpiringSoon(item);
                  const expired = isExpired(item);
                  return (
                    <tr key={item.id} className={cn('border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors', expired && 'bg-status-occupied/5')}>
                      <td className="px-4 py-3.5 font-semibold">{item.name}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">{item.category}</td>
                      <td className="px-4 py-3.5 font-medium">{item.quantity} {item.unit}</td>
                      <td className="px-4 py-3.5">₹{item.costPrice}</td>
                      <td className="px-4 py-3.5">₹{item.mrp}</td>
                      <td className="px-4 py-3.5 text-status-available font-medium">{item.margin}%</td>
                      <td className="px-4 py-3.5">
                        {item.expiryDate ? (
                          <span className={cn('text-xs', expired ? 'text-status-occupied font-semibold' : expiring ? 'text-status-cleaning font-medium' : 'text-muted-foreground')}>
                            {format(new Date(item.expiryDate), 'dd MMM yy')}
                          </span>
                        ) : <span className="text-muted-foreground/50">—</span>}
                      </td>
                      <td className="px-4 py-3.5"><span className={cn('px-2.5 py-1 rounded-lg text-xs font-medium', status === 'normal' ? 'bg-status-available/10 text-status-available' : status === 'low' ? 'bg-status-cleaning/10 text-status-cleaning' : 'bg-status-occupied/10 text-status-occupied')}>{status === 'out' ? 'Out' : status === 'low' ? 'Low' : 'OK'}</span></td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setEditItem({...item})} className="p-1.5 rounded-lg hover:bg-muted transition-all text-muted-foreground hover:text-foreground"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => dispatch(deleteItem(item.id))} className="p-1.5 rounded-lg hover:bg-muted transition-all text-destructive hover:opacity-70"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'bills' && (
        <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left">
                {['Bill No.', 'Supplier', 'Date', 'Products', 'Total', ''].map(h => (
                  <th key={h} className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bills.map(b => (
                <tr key={b.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-semibold">{b.billNumber}</td>
                  <td className="px-5 py-3.5">{b.supplierName}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{format(new Date(b.date), 'dd MMM yyyy')}</td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{b.products.map(p => `${p.productName} (${p.quantity})`).join(', ')}</td>
                  <td className="px-5 py-3.5 font-bold">₹{b.total.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => handleDownloadBill(b)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-all">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'history' && (
        <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left">
                {['Product', 'Type', 'Quantity', 'Reason', 'Date'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-semibold">{t.productName}</td>
                  <td className="px-5 py-3.5"><span className={cn('px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 w-fit', t.type === 'stock_in' ? 'bg-status-available/10 text-status-available' : 'bg-status-occupied/10 text-status-occupied')}><ArrowUpDown className="w-3 h-3" />{t.type === 'stock_in' ? 'In' : 'Out'}</span></td>
                  <td className="px-5 py-3.5">{t.quantity}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{t.reason}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{format(new Date(t.date), 'dd MMM yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'categories' && (
        <div>
          <button onClick={() => setShowAddCat(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-sm shadow-primary/20 mb-4">
            <Plus className="w-4 h-4" /> Add Category
          </button>
          {showAddCat && (
            <div className="flex gap-2 mb-4 animate-scale-in">
              <input value={catName} onChange={e => setCatName(e.target.value)} placeholder="Category name" className="rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" />
              <button onClick={() => { if (catName) { dispatch(addCategory({ id: `cat-${Date.now()}`, name: catName })); setCatName(''); setShowAddCat(false); toast.success('Category added'); } }} className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 btn-ripple">Add</button>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map(c => (
              <div key={c.id} className="glass-card rounded-2xl border border-border/50 p-4 flex items-center justify-between hover-lift">
                <div className="flex items-center gap-2"><Package className="w-4 h-4 text-primary" /><span className="font-medium text-sm">{c.name}</span></div>
                <button onClick={() => dispatch(deleteCategory(c.id))} className="text-destructive hover:opacity-70 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
