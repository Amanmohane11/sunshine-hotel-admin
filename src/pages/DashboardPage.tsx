import { useState } from 'react';
import { revenueData, bookingData, monthlyFinance, revenueSourceData } from '@/store/dummyData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

const COLORS = ['hsl(45,100%,51%)', 'hsl(142,71%,45%)', 'hsl(0,72%,51%)', 'hsl(217,91%,60%)'];

const DashboardPage = () => {
  const [revPeriod, setRevPeriod] = useState<Period>('daily');
  const [bookPeriod, setBookPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

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
              <Bar dataKey="revenue" fill="hsl(45,100%,51%)" radius={[4, 4, 0, 0]} />
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
              <Bar dataKey="spending" fill="hsl(0,72%,51%)" radius={[4, 4, 0, 0]} name="Spending" />
              <Bar dataKey="profit" fill="hsl(142,71%,45%)" radius={[4, 4, 0, 0]} name="Profit" />
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
      </div>
    </div>
  );
};

export default DashboardPage;
