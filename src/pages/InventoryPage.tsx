import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { addItem, deleteItem, addBill, addTransaction, addCategory, deleteCategory } from '@/store/inventorySlice';
import { InventoryItem, InventoryBill } from '@/store/dummyData';
import { toast } from 'sonner';
import { Plus, Trash2, AlertTriangle, Package, X, FileText, ArrowUpDown, Search } from 'lucide-react';
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

  const [itemForm, setItemForm] = useState({ name: '', category: '', quantity: '', unit: '', costPrice: '', supplier: '', minStock: '' });
  const [billForm, setBillForm] = useState({ supplierName: '', supplierPhone: '', supplierAddress: '', gstNumber: '', products: [{ productId: '', quantity: '', unitPrice: '' }] as any[] });

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return 'out';
    if (item.quantity <= item.minStock) return 'low';
    return 'normal';
  };

  const filteredItems = items.filter(i => {
    if (filterCat !== 'all' && i.category !== filterCat) return false;
    const stock = getStockStatus(i);
    if (filterStock === 'low' && stock !== 'low') return false;
    if (filterStock === 'out' && stock !== 'out') return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAddItem = () => {
    if (!itemForm.name || !itemForm.category) { toast.error('Fill required fields'); return; }
    dispatch(addItem({
      id: `inv-${Date.now()}`, name: itemForm.name, category: itemForm.category,
      quantity: parseInt(itemForm.quantity) || 0, unit: itemForm.unit, costPrice: parseFloat(itemForm.costPrice) || 0,
      supplier: itemForm.supplier, lastUpdated: new Date().toISOString(), minStock: parseInt(itemForm.minStock) || 10,
    }));
    toast.success('Item added');
    setItemForm({ name: '', category: '', quantity: '', unit: '', costPrice: '', supplier: '', minStock: '' });
    setShowAddItem(false);
  };

  const handleGenerateBill = () => {
    if (!billForm.supplierName) { toast.error('Enter supplier name'); return; }
    const products = billForm.products.filter(p => p.productId && p.quantity).map(p => {
      const item = items.find(i => i.id === p.productId);
      return { productId: p.productId, productName: item?.name || '', quantity: parseInt(p.quantity), unitPrice: parseFloat(p.unitPrice) || item?.costPrice || 0, total: parseInt(p.quantity) * (parseFloat(p.unitPrice) || item?.costPrice || 0) };
    });
    if (products.length === 0) { toast.error('Add at least one product'); return; }
    const subtotal = products.reduce((s, p) => s + p.total, 0);
    const gst = Math.round(subtotal * 0.18);
    const bill: InventoryBill = { id: `ib-${Date.now()}`, supplierName: billForm.supplierName, supplierPhone: billForm.supplierPhone, supplierAddress: billForm.supplierAddress, products, subtotal, gst, total: subtotal + gst, date: new Date().toISOString() };
    dispatch(addBill(bill));
    products.forEach(p => {
      dispatch(addTransaction({ id: `it-${Date.now()}-${p.productId}`, productId: p.productId, productName: p.productName, type: 'stock_in', quantity: p.quantity, reason: `Purchase from ${billForm.supplierName}`, date: new Date().toISOString() }));
    });
    toast.success('Bill generated & stock updated');
    setBillForm({ supplierName: '', supplierPhone: '', supplierAddress: '', gstNumber: '', products: [{ productId: '', quantity: '', unitPrice: '' }] });
    setShowBillForm(false);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'products', label: 'All Products' },
    { key: 'bills', label: 'Purchase Bills' },
    { key: 'history', label: 'Transactions' },
    { key: 'categories', label: 'Categories' },
  ];

  const lowStockItems = items.filter(i => getStockStatus(i) !== 'normal');

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

      {lowStockItems.length > 0 && (
        <div className="glass-card rounded-2xl border border-status-cleaning/30 p-4 mb-6 flex items-start gap-3 animate-scale-in">
          <AlertTriangle className="w-5 h-5 text-status-cleaning shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Stock Alerts</p>
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

      <div className="flex gap-1 mb-6 bg-muted/60 rounded-xl p-1 w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200', tab === t.key ? 'gradient-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
            {t.label}
          </button>
        ))}
      </div>

      {showAddItem && (
        <div className="glass-card rounded-2xl border border-border/50 p-5 mb-6 animate-scale-in">
          <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Add New Item</h3><button onClick={() => setShowAddItem(false)} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div><label className="block text-xs font-semibold mb-1.5">Name *</label><input value={itemForm.name} onChange={e => setItemForm({...itemForm, name: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
            <div><label className="block text-xs font-semibold mb-1.5">Category *</label><select value={itemForm.category} onChange={e => setItemForm({...itemForm, category: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all"><option value="">Select</option>{categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
            <div><label className="block text-xs font-semibold mb-1.5">Quantity</label><input type="number" value={itemForm.quantity} onChange={e => setItemForm({...itemForm, quantity: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
            <div><label className="block text-xs font-semibold mb-1.5">Unit</label><input value={itemForm.unit} onChange={e => setItemForm({...itemForm, unit: e.target.value})} placeholder="pcs, kg, bottles" className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
            <div><label className="block text-xs font-semibold mb-1.5">Cost Price (₹)</label><input type="number" value={itemForm.costPrice} onChange={e => setItemForm({...itemForm, costPrice: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
            <div><label className="block text-xs font-semibold mb-1.5">Supplier</label><input value={itemForm.supplier} onChange={e => setItemForm({...itemForm, supplier: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
            <div><label className="block text-xs font-semibold mb-1.5">Min Stock</label><input type="number" value={itemForm.minStock} onChange={e => setItemForm({...itemForm, minStock: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
          </div>
          <button onClick={handleAddItem} className="mt-4 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-sm shadow-primary/20">Add Item</button>
        </div>
      )}

      {showBillForm && (
        <div className="glass-card rounded-2xl border border-border/50 p-5 mb-6 animate-scale-in">
          <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Create Inventory Bill</h3><button onClick={() => setShowBillForm(false)} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div><label className="block text-xs font-semibold mb-1.5">Supplier Name *</label><input value={billForm.supplierName} onChange={e => setBillForm({...billForm, supplierName: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
            <div><label className="block text-xs font-semibold mb-1.5">GST Number</label><input value={billForm.gstNumber} onChange={e => setBillForm({...billForm, gstNumber: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
            <div><label className="block text-xs font-semibold mb-1.5">Phone</label><input value={billForm.supplierPhone} onChange={e => setBillForm({...billForm, supplierPhone: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
            <div><label className="block text-xs font-semibold mb-1.5">Address</label><input value={billForm.supplierAddress} onChange={e => setBillForm({...billForm, supplierAddress: e.target.value})} className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary/50 transition-all" /></div>
          </div>
          <h4 className="text-sm font-semibold mb-2">Products</h4>
          {billForm.products.map((p, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
              <select value={p.productId} onChange={e => { const prods = [...billForm.products]; prods[idx].productId = e.target.value; setBillForm({...billForm, products: prods}); }} className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:border-primary/50 transition-all"><option value="">Product</option>{items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</select>
              <input type="number" placeholder="Qty" value={p.quantity} onChange={e => { const prods = [...billForm.products]; prods[idx].quantity = e.target.value; setBillForm({...billForm, products: prods}); }} className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:border-primary/50 transition-all" />
              <input type="number" placeholder="Unit Price" value={p.unitPrice} onChange={e => { const prods = [...billForm.products]; prods[idx].unitPrice = e.target.value; setBillForm({...billForm, products: prods}); }} className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:border-primary/50 transition-all" />
              <button onClick={() => setBillForm({...billForm, products: billForm.products.filter((_, i) => i !== idx)})} className="text-destructive hover:opacity-70 flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button onClick={() => setBillForm({...billForm, products: [...billForm.products, { productId: '', quantity: '', unitPrice: '' }]})} className="text-sm text-primary font-semibold hover:underline mb-3 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Product</button>
          <button onClick={handleGenerateBill} className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-sm shadow-primary/20">Generate Bill</button>
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
            </select>
          </div>
          <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-left">
                  {['Name', 'Category', 'Quantity', 'Unit', 'Cost', 'Supplier', 'Status', ''].map(h => (
                    <th key={h} className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => {
                  const status = getStockStatus(item);
                  return (
                    <tr key={item.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5 font-semibold">{item.name}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{item.category}</td>
                      <td className="px-5 py-3.5 font-medium">{item.quantity}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{item.unit}</td>
                      <td className="px-5 py-3.5">₹{item.costPrice}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{item.supplier}</td>
                      <td className="px-5 py-3.5"><span className={cn('px-2.5 py-1 rounded-lg text-xs font-medium', status === 'normal' ? 'bg-status-available/10 text-status-available' : status === 'low' ? 'bg-status-cleaning/10 text-status-cleaning' : 'bg-status-occupied/10 text-status-occupied')}>{status === 'out' ? 'Out of Stock' : status === 'low' ? 'Low Stock' : 'In Stock'}</span></td>
                      <td className="px-5 py-3.5"><button onClick={() => dispatch(deleteItem(item.id))} className="text-destructive hover:opacity-70 p-1"><Trash2 className="w-4 h-4" /></button></td>
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
                {['Bill ID', 'Supplier', 'Date', 'Products', 'Total'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bills.map(b => (
                <tr key={b.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-semibold">{b.id}</td>
                  <td className="px-5 py-3.5">{b.supplierName}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{format(new Date(b.date), 'dd MMM yyyy')}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{b.products.map(p => `${p.productName} (${p.quantity})`).join(', ')}</td>
                  <td className="px-5 py-3.5 font-bold">₹{b.total.toLocaleString()}</td>
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
