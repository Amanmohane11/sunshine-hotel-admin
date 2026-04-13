import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { monthlyReports, MonthlyReport } from '@/store/dummyData';
import { BarChart3, Download, FileText, ArrowLeft, TrendingDown, TrendingUp, PieChart as PieIcon, ShoppingCart, Users, Wrench, Zap, MoreHorizontal, BedDouble, UtensilsCrossed, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SPENDING_COLORS = ['hsl(211,100%,50%)', 'hsl(43,96%,56%)', 'hsl(354,70%,54%)', 'hsl(280,65%,60%)', 'hsl(145,63%,42%)'];
const PROFIT_COLORS = ['hsl(145,63%,42%)', 'hsl(43,96%,56%)', 'hsl(211,100%,50%)'];

const ReportsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const monthParam = searchParams.get('month');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(monthParam);

  useEffect(() => {
    if (monthParam) setSelectedMonth(monthParam);
  }, [monthParam]);

  const report = selectedMonth ? monthlyReports.find(r => r.month === selectedMonth) : null;

  if (report && selectedMonth) {
    const spendingData = [
      { name: 'Inventory', value: report.spending.inventory, icon: ShoppingCart },
      { name: 'Staff Salaries', value: report.spending.staffSalaries, icon: Users },
      { name: 'Maintenance', value: report.spending.maintenance, icon: Wrench },
      { name: 'Utilities', value: report.spending.utilities, icon: Zap },
      { name: 'Other', value: report.spending.other, icon: MoreHorizontal },
    ];
    const profitData = [
      { name: 'Room Bookings', value: report.profit.roomBookings, icon: BedDouble },
      { name: 'Services', value: report.profit.services, icon: UtensilsCrossed },
      { name: 'Other Income', value: report.profit.otherIncome, icon: Sparkles },
    ];

    return (
      <div className="animate-slide-up">
        <button onClick={() => { setSelectedMonth(null); navigate('/reports'); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Reports
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">{selectedMonth} Monthly Report</h1>
          <p className="text-muted-foreground text-sm">Detailed spending & profit breakdown</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-2xl border border-border/50 p-5 animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-destructive" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Spending</span>
            </div>
            <p className="text-2xl font-bold text-destructive">₹{report.spending.total.toLocaleString()}</p>
          </div>
          <div className="glass-card rounded-2xl border border-border/50 p-5 animate-slide-up stagger-1">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-status-available" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Profit</span>
            </div>
            <p className="text-2xl font-bold text-status-available">₹{report.profit.total.toLocaleString()}</p>
          </div>
          <div className="glass-card rounded-2xl border border-border/50 p-5 animate-slide-up stagger-2">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Net Income</span>
            </div>
            <p className="text-2xl font-bold text-primary">₹{(report.profit.total - report.spending.total + report.profit.total).toLocaleString()}</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending Column */}
          <div className="glass-card rounded-2xl border border-border/50 p-6 animate-slide-up">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold">Spending Breakdown</h3>
                <p className="text-xs text-muted-foreground">₹{report.spending.total.toLocaleString()} total</p>
              </div>
            </div>

            {/* Pie Chart */}
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={spendingData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {spendingData.map((_, i) => <Cell key={i} fill={SPENDING_COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} contentStyle={{ borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>

            {/* Breakdown List */}
            <div className="space-y-3 mt-4">
              {spendingData.map((item, i) => {
                const percent = Math.round((item.value / report.spending.total) * 100);
                return (
                  <div key={item.name} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${SPENDING_COLORS[i]}20` }}>
                      <item.icon className="w-4 h-4" style={{ color: SPENDING_COLORS[i] }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm font-bold">₹{item.value.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 mt-1.5">
                        <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${percent}%`, backgroundColor: SPENDING_COLORS[i] }} />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium w-10 text-right">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Profit Column */}
          <div className="glass-card rounded-2xl border border-border/50 p-6 animate-slide-up stagger-1">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-status-available/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-status-available" />
              </div>
              <div>
                <h3 className="font-semibold">Profit Breakdown</h3>
                <p className="text-xs text-muted-foreground">₹{report.profit.total.toLocaleString()} total</p>
              </div>
            </div>

            {/* Pie Chart */}
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={profitData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {profitData.map((_, i) => <Cell key={i} fill={PROFIT_COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} contentStyle={{ borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>

            {/* Breakdown List */}
            <div className="space-y-3 mt-4">
              {profitData.map((item, i) => {
                const percent = Math.round((item.value / report.profit.total) * 100);
                return (
                  <div key={item.name} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${PROFIT_COLORS[i]}20` }}>
                      <item.icon className="w-4 h-4" style={{ color: PROFIT_COLORS[i] }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm font-bold">₹{item.value.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 mt-1.5">
                        <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${percent}%`, backgroundColor: PROFIT_COLORS[i] }} />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium w-10 text-right">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-3 mt-6">
          <button onClick={() => {
            const rows = [['Date','Type','Category','Amount','Description']];
            report.transactions?.forEach(t => rows.push([t.date, t.type, t.category, String(t.amount), t.description]));
            if (!report.transactions?.length) {
              spendingData.forEach(s => rows.push([selectedMonth, 'spending', s.name, String(s.value), `${s.name} expenses`]));
              profitData.forEach(p => rows.push([selectedMonth, 'profit', p.name, String(p.value), `${p.name} income`]));
            }
            const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `report_${selectedMonth}.csv`; a.click();
            URL.revokeObjectURL(url);
            toast.success('Excel/CSV exported');
          }} className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all flex items-center gap-2"><Download className="w-4 h-4" /> Export Excel</button>
          <button onClick={() => {
            const w = window.open('', '_blank');
            if (!w) { toast.error('Allow popups'); return; }
            const spendRows = spendingData.map(s => `<tr><td>${s.name}</td><td style="text-align:right;color:#d32f2f">₹${s.value.toLocaleString()}</td></tr>`).join('');
            const profitRows = profitData.map(p => `<tr><td>${p.name}</td><td style="text-align:right;color:#2e7d32">₹${p.value.toLocaleString()}</td></tr>`).join('');
            w.document.write(`<!DOCTYPE html><html><head><title>Report ${selectedMonth}</title><style>
              body{font-family:Arial,sans-serif;max-width:700px;margin:40px auto;padding:20px;color:#1a1a1a}
              h1{font-size:22px}h2{font-size:16px;margin-top:24px}
              table{width:100%;border-collapse:collapse;margin:12px 0}
              td,th{padding:10px 12px;border-bottom:1px solid #eee;font-size:13px}
              th{text-align:left;color:#888;font-size:11px;text-transform:uppercase}
              .summary{display:flex;gap:20px;margin:20px 0}
              .summary div{flex:1;background:#f5f5f5;border-radius:8px;padding:16px}
              @media print{body{margin:0;padding:20px}}
            </style></head><body>
              <h1>${selectedMonth} Monthly Report</h1>
              <div class="summary">
                <div><small>Total Spending</small><h2 style="color:#d32f2f;margin:4px 0">₹${report.spending.total.toLocaleString()}</h2></div>
                <div><small>Total Profit</small><h2 style="color:#2e7d32;margin:4px 0">₹${report.profit.total.toLocaleString()}</h2></div>
                <div><small>Net</small><h2 style="color:#1565c0;margin:4px 0">₹${(report.profit.total - report.spending.total).toLocaleString()}</h2></div>
              </div>
              <h2>💸 Spending Breakdown</h2>
              <table><thead><tr><th>Category</th><th style="text-align:right">Amount</th></tr></thead><tbody>${spendRows}
              <tr style="font-weight:bold;border-top:2px solid #333"><td>Total</td><td style="text-align:right">₹${report.spending.total.toLocaleString()}</td></tr></tbody></table>
              <h2>📈 Profit Breakdown</h2>
              <table><thead><tr><th>Category</th><th style="text-align:right">Amount</th></tr></thead><tbody>${profitRows}
              <tr style="font-weight:bold;border-top:2px solid #333"><td>Total</td><td style="text-align:right">₹${report.profit.total.toLocaleString()}</td></tr></tbody></table>
            </body></html>`);
            w.document.close();
            setTimeout(() => w.print(), 500);
            toast.success('Print dialog opened — save as PDF');
          }} className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all btn-ripple flex items-center gap-2"><Download className="w-4 h-4" /> Export PDF</button>
        </div>
      </div>
    );
  }

  // Default reports list with month selector
  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Reports</h1>
        <p className="text-muted-foreground text-sm">Export data for analysis and tax filing</p>
      </div>

      {/* Monthly Reports Grid */}
      <div className="mb-8">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><PieIcon className="w-5 h-5 text-primary" /> Monthly Reports</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {monthlyReports.map((r, idx) => (
            <button key={r.month} onClick={() => { setSelectedMonth(r.month); navigate(`/reports?month=${r.month}`); }}
              className="glass-card hover-lift rounded-2xl border border-border/50 p-4 text-left animate-slide-up transition-all"
              style={{ animationDelay: `${idx * 40}ms` }}>
              <p className="font-bold text-lg">{r.month}</p>
              <p className="text-xs text-status-available font-medium mt-1">₹{(r.profit.total / 1000).toFixed(0)}k profit</p>
              <p className="text-xs text-destructive font-medium">₹{(r.spending.total / 1000).toFixed(0)}k spent</p>
            </button>
          ))}
        </div>
      </div>

      {/* General Reports */}
      <h2 className="font-semibold mb-4">General Reports</h2>
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
              <button onClick={() => toast.info('Select a month report for detailed export')} className="px-4 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-all flex items-center gap-1"><Download className="w-3 h-3" /> Excel</button>
              <button onClick={() => toast.info('Select a month report for detailed export')} className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all btn-ripple flex items-center gap-1"><Download className="w-3 h-3" /> PDF</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
