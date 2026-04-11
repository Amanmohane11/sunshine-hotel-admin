import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { revenueData, bookingData, monthlyFinance, revenueSourceData, housekeepingData } from '@/store/dummyData';
import { useAppSelector } from '@/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, BedDouble, DollarSign, BarChart3, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

const COLORS = ['hsl(43,96%,56%)', 'hsl(145,63%,42%)', 'hsl(354,70%,54%)', 'hsl(211,100%,50%)'];

const DashboardPage = () => {
  const [revPeriod, setRevPeriod] = useState<Period>('daily');
  const [bookPeriod, setBookPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const rooms = useAppSelector(s => s.rooms.rooms);
  const navigate = useNavigate();

  const total = rooms.length;
  const occupied = rooms.filter(r => r.status === 'occupied').length;
  const occupancyRate = Math.round((occupied / total) * 100);
  const lastWeekOccupancy = 62;
  const occupancyTrend = occupancyRate - lastWeekOccupancy;

  const totalRevenue = rooms.filter(r => r.currentBooking).reduce((s, r) => s + (r.currentBooking?.totalAmount || 0), 0);
  const adr = occupied > 0 ? Math.round(totalRevenue / occupied) : 0;
  const revPAR = total > 0 ? Math.round(totalRevenue / total) : 0;

  const kpis = [
    { label: 'Occupancy Rate', value: `${occupancyRate}%`, sub: `${occupancyTrend >= 0 ? '+' : ''}${occupancyTrend}% vs last week`, trend: occupancyTrend >= 0, icon: BedDouble, gradient: 'from-blue-500/10 to-blue-600/5', iconColor: 'text-status-blue' },
    { label: 'ADR', value: `₹${adr.toLocaleString()}`, sub: 'Average Daily Rate', trend: true, icon: DollarSign, gradient: 'from-emerald-500/10 to-emerald-600/5', iconColor: 'text-status-available' },
    { label: 'RevPAR', value: `₹${revPAR.toLocaleString()}`, sub: 'Revenue Per Room', trend: true, icon: BarChart3, gradient: 'from-amber-500/10 to-amber-600/5', iconColor: 'text-primary' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, sub: 'Active bookings', trend: true, icon: Activity, gradient: 'from-purple-500/10 to-purple-600/5', iconColor: 'text-chart-5' },
  ];

  const PeriodTabs = ({ value, onChange, options }: { value: string; onChange: (v: any) => void; options: string[] }) => (
    <div className="flex gap-1 bg-muted/60 rounded-xl p-1">
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)}
          className={cn('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200', value === o ? 'gradient-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
        >{o}</button>
      ))}
    </div>
  );

  const handleBarClick = (data: any) => {
    if (data && data.activePayload) {
      const month = data.activePayload[0]?.payload?.name;
      if (month) {
        navigate(`/reports?month=${month}`);
      }
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Real-time hotel performance metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(({ label, value, sub, trend, icon: Icon, gradient, iconColor }, idx) => (
          <div key={label} className="glass-card hover-lift rounded-2xl p-5 border border-border/50 animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
            </div>
            <span className="text-2xl font-bold block">{value}</span>
            <div className="flex items-center gap-1.5 mt-1.5">
              {trend ? <TrendingUp className="w-3.5 h-3.5 text-status-available" /> : <TrendingDown className="w-3.5 h-3.5 text-destructive" />}
              <span className="text-xs text-muted-foreground">{sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="glass-card rounded-2xl border border-border/50 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold">Revenue</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Income over time</p>
            </div>
            <PeriodTabs value={revPeriod} onChange={setRevPeriod} options={['daily', 'weekly', 'monthly', 'yearly']} />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData[revPeriod]}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(43,96%,56%)" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="hsl(43,96%,56%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} contentStyle={{ borderRadius: 12, border: '1px solid hsl(220,13%,91%)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(43,96%,56%)" strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings Chart */}
        <div className="glass-card rounded-2xl border border-border/50 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold">Bookings</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Reservation trends</p>
            </div>
            <PeriodTabs value={bookPeriod} onChange={setBookPeriod} options={['daily', 'weekly', 'monthly']} />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={bookingData[bookPeriod]}>
              <defs>
                <linearGradient id="bookGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(211,100%,50%)" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="hsl(211,100%,50%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(220,13%,91%)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }} />
              <Area type="monotone" dataKey="bookings" stroke="hsl(211,100%,50%)" strokeWidth={2.5} fill="url(#bookGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Finance - Clickable */}
        <div className="glass-card rounded-2xl border border-border/50 p-5">
          <div className="mb-5">
            <h3 className="font-semibold">Monthly Spending & Profit</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Click any month to view detailed report →</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyFinance} barGap={4} onClick={handleBarClick} style={{ cursor: 'pointer' }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} contentStyle={{ borderRadius: 12, border: '1px solid hsl(220,13%,91%)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }} />
              <Bar dataKey="spending" fill="hsl(354,70%,54%)" radius={[8, 8, 0, 0]} name="Spending" className="cursor-pointer" />
              <Bar dataKey="profit" fill="hsl(145,63%,42%)" radius={[8, 8, 0, 0]} name="Profit" className="cursor-pointer" />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Source */}
        <div className="glass-card rounded-2xl border border-border/50 p-5">
          <div className="mb-5">
            <h3 className="font-semibold">Revenue Sources</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Income distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={revenueSourceData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} dataKey="value" paddingAngle={4} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {revenueSourceData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Housekeeping Donut */}
        <div className="glass-card rounded-2xl border border-border/50 p-5 lg:col-span-2">
          <div className="mb-5">
            <h3 className="font-semibold">Housekeeping Status</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Real-time room readiness</p>
          </div>
          <div className="flex items-center justify-center gap-16">
            <ResponsiveContainer width={260} height={260}>
              <PieChart>
                <Pie data={housekeepingData} cx="50%" cy="50%" innerRadius={75} outerRadius={105} dataKey="value" paddingAngle={5} strokeWidth={0}>
                  {housekeepingData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-4">
              {housekeepingData.map(d => (
                <div key={d.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <div>
                    <span className="text-sm font-semibold">{d.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">{d.value} rooms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
