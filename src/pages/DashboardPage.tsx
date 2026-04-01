import { useState } from 'react';
import { revenueData, bookingData, monthlyFinance, revenueSourceData, housekeepingData } from '@/store/dummyData';
import { useAppSelector } from '@/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown, BedDouble, DollarSign, BarChart3, Activity } from 'lucide-react';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

const COLORS = ['hsl(45,100%,51%)', 'hsl(142,71%,45%)', 'hsl(0,72%,51%)', 'hsl(217,91%,60%)'];

const DashboardPage = () => {
  const [revPeriod, setRevPeriod] = useState<Period>('daily');
  const [bookPeriod, setBookPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const rooms = useAppSelector(s => s.rooms.rooms);

  const total = rooms.length;
  const occupied = rooms.filter(r => r.status === 'occupied').length;
  const occupancyRate = Math.round((occupied / total) * 100);
  const lastWeekOccupancy = 62;
  const occupancyTrend = occupancyRate - lastWeekOccupancy;

  const totalRevenue = rooms.filter(r => r.currentBooking).reduce((s, r) => s + (r.currentBooking?.totalAmount || 0), 0);
  const adr = occupied > 0 ? Math.round(totalRevenue / occupied) : 0;
  const revPAR = total > 0 ? Math.round(totalRevenue / total) : 0;

  const kpis = [
    { label: 'Occupancy Rate', value: `${occupancyRate}%`, sub: `${occupancyTrend >= 0 ? '+' : ''}${occupancyTrend}% vs last week`, trend: occupancyTrend >= 0, icon: BedDouble, color: 'text-status-blue' },
    { label: 'ADR', value: `₹${adr.toLocaleString()}`, sub: 'Average Daily Rate', trend: true, icon: DollarSign, color: 'text-status-available' },
    { label: 'RevPAR', value: `₹${revPAR.toLocaleString()}`, sub: 'Revenue Per Available Room', trend: true, icon: BarChart3, color: 'text-primary' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, sub: 'Active bookings', trend: true, icon: Activity, color: 'text-status-cleaning' },
  ];

  const PeriodTabs = ({ value, onChange, options }: { value: string; onChange: (v: any) => void; options: string[] }) => (
    <div className="flex gap-1 bg-muted rounded-lg p-1">
      {options.map(o => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${value === o ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          {o}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(({ label, value, sub, trend, icon: Icon, color }) => (
          <div key={label} className="bg-card rounded-xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground font-medium">{label}</span>
              <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
            <span className="text-2xl font-bold block">{value}</span>
            <div className="flex items-center gap-1 mt-1">
              {trend ? <TrendingUp className="w-3.5 h-3.5 text-status-available" /> : <TrendingDown className="w-3.5 h-3.5 text-destructive" />}
              <span className="text-xs text-muted-foreground">{sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Revenue</h3>
            <PeriodTabs value={revPeriod} onChange={setRevPeriod} options={['daily', 'weekly', 'monthly', 'yearly']} />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData[revPeriod]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40,20%,88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="hsl(45,100%,51%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings Chart */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Bookings</h3>
            <PeriodTabs value={bookPeriod} onChange={setBookPeriod} options={['daily', 'weekly', 'monthly']} />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={bookingData[bookPeriod]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40,20%,88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="bookings" stroke="hsl(217,91%,60%)" strokeWidth={2} dot={{ fill: 'hsl(217,91%,60%)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Finance */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-5">
          <h3 className="font-semibold mb-4">Monthly Spending & Profit</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyFinance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40,20%,88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="spending" fill="hsl(0,72%,51%)" radius={[6, 6, 0, 0]} name="Spending" />
              <Bar dataKey="profit" fill="hsl(142,71%,45%)" radius={[6, 6, 0, 0]} name="Profit" />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Source */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-5">
          <h3 className="font-semibold mb-4">Revenue Sources</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={revenueSourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {revenueSourceData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Housekeeping Donut */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Housekeeping Status</h3>
          <div className="flex items-center justify-center gap-12">
            <ResponsiveContainer width={250} height={250}>
              <PieChart>
                <Pie data={housekeepingData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="value" paddingAngle={4}>
                  {housekeepingData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3">
              {housekeepingData.map(d => (
                <div key={d.name} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-sm font-medium">{d.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">{d.value} rooms</span>
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
