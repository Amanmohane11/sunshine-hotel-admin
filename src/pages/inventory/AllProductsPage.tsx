import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { addItem, updateItem, deleteItem, addCategory, deleteCategory } from '@/store/inventorySlice';
import { InventoryItem } from '@/store/dummyData';
import { toast } from 'sonner';
import { Plus, Trash2, AlertTriangle, Package, X, Search, Edit2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const AllProductsPage = () => {
  const dispatch = useAppDispatch();
  const { items, categories } = useAppSelector(s => s.inventory);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddCat, setShowAddCat] = useState(false);
  const [catName, setCatName] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [search, setSearch] = useState('');
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [itemForm, setItemForm] = useState({ name: '', category: '', quantity: '', unit: '', costPrice: '', mrp: '', margin: '', supplier: '', minStock: '', expiryDate: '' });

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

  const lowStockItems = items.filter(i => getStockStatus(i) !== 'normal');
  const expiringItems = items.filter(i => isExpiringSoon(i) || isExpired(i));

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

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">All Products</h1>
          <p className="text-muted-foreground text-sm">{items.length} products tracked</p>
        </div>
        <button onClick={() => setShowAddItem(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple shadow-md shadow-primary/20">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

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
    </div>
  );
};

export default AllProductsPage;
