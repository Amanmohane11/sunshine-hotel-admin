import { useAppSelector } from '@/store';
import { Building2, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { superAdminMonthlyEarnings } from '@/store/dummyData';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

const SADashboardPage = () => {
  const { hotels } = useAppSelector(s => s.hotels);
  const activeHotels = hotels.filter(h => h.status === 'active');
  const trialHotels = hotels.filter(h => h.status === 'trial');
  const inactiveHotels = hotels.filter(h => h.status === 'inactive');
  const totalRevenue = hotels.reduce((s, h) => s + h.revenue, 0);

  const statusData = [
    { name: 'Active', value: activeHotels.length },
    { name: 'Inactive', value: inactiveHotels.length },
    { name: 'Trial', value: trialHotels.length },
  ];

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Super Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm">Platform overview and analytics</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Hotels', value: hotels.length, icon: Building2, color: 'text-status-blue', gradient: 'from-blue-500/10 to-blue-600/5' },
            { label: 'Active', value: activeHotels.length, icon: CheckCircle, color: 'text-status-available', gradient: 'from-emerald-500/10 to-emerald-600/5' },
            { label: 'Trial', value: trialHotels.length, icon: Clock, color: 'text-status-cleaning', gradient: 'from-amber-500/10 to-amber-600/5' },
            { label: 'Revenue', value: `₹${(totalRevenue / 100000).toFixed(1)}L`, icon: TrendingUp, color: 'text-primary', gradient: 'from-amber-500/10 to-amber-600/5' },
          ].map(({ label, value, icon: Icon, color, gradient }, idx) => (
            <div key={label} className="glass-card hover-lift rounded-2xl border border-border/50 p-5 animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
              </div>
              <span className="text-2xl font-bold">{value}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl border border-border/50 p-5">
            <h3 className="font-semibold mb-4">Monthly Earnings</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={superAdminMonthlyEarnings}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Earnings']} />
                <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card rounded-2xl border border-border/50 p-5">
            <h3 className="font-semibold mb-4">Monthly Registrations</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={superAdminMonthlyEarnings}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="hotels" fill="hsl(var(--chart-2))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-border/50 p-5">
          <h3 className="font-semibold mb-4">Hotel Status Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width={300} height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {statusData.map((_, idx) => <Cell key={idx} fill={COLORS[idx]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 ml-4">
              {statusData.map((d, idx) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span>{d.name}: {d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SADashboardPage;
